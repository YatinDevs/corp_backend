<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->active();
        
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('description', 'like', '%'.$request->search.'%');
        }
        
        $products = $query->paginate($request->get('per_page', 15));
        
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return response()->json($product);
    }

    public function featured()
    {
        $products = Product::active()->featured()->get();
        return response()->json($products);
    }

    public function comboDetails($id)
    {
        $product = Product::with('category')->findOrFail($id);
        
        if ($product->type !== 'combo') {
            return response()->json(['message' => 'Not a combo product'], 400);
        }
        
        $comboDetails = [
            'main_product' => $product,
            'included_products' => Product::whereIn('id', 
                collect($product->combo_products)->pluck('product_id'))
                ->get()
                ->map(function($item) use ($product) {
                    $comboItem = collect($product->combo_products)
                        ->firstWhere('product_id', $item->id);
                    $item->combo_quantity = $comboItem['quantity'];
                    return $item;
                }),
        ];
        
        return response()->json($comboDetails);
    }
}