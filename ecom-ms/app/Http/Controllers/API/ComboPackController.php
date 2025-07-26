<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ComboPack;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ComboPackController extends Controller
{
    // Cache duration in minutes
    const CACHE_DURATION = 30;
    
    // Products chunk size for sync operations
    const CHUNK_SIZE = 50;

    public function index(Request $request)
    {
        $cacheKey = 'combo_packs_' . md5(json_encode($request->all()));

        return Cache::remember($cacheKey, now()->addMinutes(self::CACHE_DURATION), function () use ($request) {
            $query = ComboPack::with([
                    'products' => function($query) {
                        $query->select('products.id', 'name', 'price', 'images')
                              ->withPivot('quantity');
                    },
                    'category' => function($query) {
                        $query->select('id', 'name');
                    }
                ])
                ->when($request->search, function ($q) use ($request) {
                    return $q->search($request->search);
                })
                ->when($request->category_id, function ($q) use ($request) {
                    return $q->where('category_id', $request->category_id);
                })
                ->when($request->has('is_active'), function ($q) use ($request) {
                    return $q->where('is_active', $request->is_active);
                });

            $results = $query->paginate($request->per_page ?? 15);
            
            // Ensure pivot data is visible in the response
            $results->getCollection()->transform(function ($combo) {
                $combo->products->each(function ($product) {
                    $product->makeVisible('pivot');
                });
                return $combo;
            });

            return $results;
        });
    }

    public function store(Request $request)
    {
        $validator = $this->validateComboPackRequest($request);

     if ($validator->fails()) {
    return response()->json([
        'message' => 'Validation failed',
        'errors' => $validator->errors()
    ], 422);
}

        $data = $this->processImages($request, $validator->validated());

        DB::beginTransaction();
        try {
            $comboPack = ComboPack::create($data);
            $this->syncProducts($comboPack, $request->products);
            
            DB::commit();
            
            // Clear cached index
            Cache::forget('combo_packs_*');
            
            return response()->json($comboPack->load([
                'products' => function($query) {
                    $query->select('products.id', 'name', 'price', 'images')
                          ->withPivot('quantity');
                },
                'category'
            ]), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create combo pack: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $cacheKey = 'combo_pack_' . $id;
        
        return Cache::remember($cacheKey, now()->addMinutes(self::CACHE_DURATION), function () use ($id) {
            $comboPack = ComboPack::with([
                    'products' => function($query) {
                        $query->select('products.id', 'name', 'price', 'images')
                              ->withPivot('quantity');
                    },
                    'category' => function($query) {
                        $query->select('id', 'name');
                    }
                ])
                ->findOrFail($id);

            // Ensure pivot data is visible
            $comboPack->products->each(function ($product) {
                $product->makeVisible('pivot');
            });

            return $comboPack;
        });
    }

    public function update(Request $request, $id)
    {
        $comboPack = ComboPack::findOrFail($id);
        
        $validator = $this->validateComboPackRequest($request, $comboPack);

      if ($validator->fails()) {
    return response()->json([
        'message' => 'Validation failed',
        'errors' => $validator->errors()
    ], 422);
}

        $data = $this->processImages($request, $validator->validated(), $comboPack);

        DB::beginTransaction();
        try {
            $comboPack->update($data);
            
            if ($request->has('products')) {
                $this->syncProducts($comboPack, $request->products);
            }
            
            DB::commit();
            
            // Clear relevant caches
            Cache::forget('combo_pack_' . $id);
            Cache::forget('combo_packs_*');
            
            $comboPack->load([
                'products' => function($query) {
                    $query->select('products.id', 'name', 'price', 'images')
                          ->withPivot('quantity');
                },
                'category'
            ]);

            // Ensure pivot data is visible
            $comboPack->products->each(function ($product) {
                $product->makeVisible('pivot');
            });

            return response()->json($comboPack);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update combo pack: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $comboPack = ComboPack::findOrFail($id);
            
            // Delete associated images
            if ($comboPack->images) {
                Storage::disk('public')->delete($comboPack->images);
            }
            
            $comboPack->delete();
            
            DB::commit();
            
            // Clear relevant caches
            Cache::forget('combo_pack_' . $id);
            Cache::forget('combo_packs_*');
            
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete combo pack: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate combo pack request data
     */
    protected function validateComboPackRequest(Request $request, $comboPack = null)
    {
        $rules = [
            'category_id' => ($comboPack ? 'sometimes|' : '') . 'required|exists:categories,id',
            'combo_code' => ($comboPack ? 'sometimes|' : '') . 'required|unique:combo_packs,combo_code' . 
                          ($comboPack ? ',' . $comboPack->id : ''),
            'name' => ($comboPack ? 'sometimes|' : '') . 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => ($comboPack ? 'sometimes|' : '') . 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'products' => ($comboPack ? 'sometimes|' : '') . 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ];

        $validator = Validator::make($request->all(), $rules);

        $validator->after(function ($validator) use ($request, $comboPack) {
            if ($request->has('products')) {
                $productIds = collect($request->products)->pluck('id');
                $products = Product::with('category')
                    ->whereIn('id', $productIds)
                    ->get();

                if ($products->pluck('category_id')->unique()->count() > 1) {
                    $validator->errors()->add('products', 'All products must belong to the same category');
                }

                $categoryId = $request->category_id ?? ($comboPack ? $comboPack->category_id : null);
                if ($categoryId && !$products->every(function ($product) use ($categoryId) {
                    return $product->category_id == $categoryId;
                })) {
                    $validator->errors()->add('category_id', 'Products must belong to the selected category');
                }
            }
        });

        return $validator;
    }

    /**
     * Process and store images
     */
    protected function processImages(Request $request, array $data, $comboPack = null)
    {
        if ($request->hasFile('images')) {
            // Delete old images if updating
            if ($comboPack && $comboPack->images) {
                Storage::disk('public')->delete($comboPack->images);
            }

            $data['images'] = collect($request->file('images'))
                ->map(function ($image) {
                    return $image->store('combo_packs', 'public');
                })
                ->toArray();
        }

        return $data;
    }

    /**
     * Sync products with their quantities
     */
    protected function syncProducts($comboPack, $products)
    {
        $syncData = collect($products)
            ->mapWithKeys(function ($product) {
                return [
                    $product['id'] => ['quantity' => $product['quantity']]
                ];
            })
            ->toArray();

        $comboPack->products()->sync($syncData);
    }
}