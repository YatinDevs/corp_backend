<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $products = Product::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return ProductResource::collection($products);
    }

    /**
     * Display featured products.
     */
    public function featured()
    {
        $products = Product::where('is_featured', true)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    /**
     * Display single products only.
     */
    public function singleProducts()
    {
        $products = Product::where('type', 'single')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return ProductResource::collection($products);
    }

    /**
     * Display combo products only.
     */
    public function comboProducts()
    {
        $products = Product::where('type', 'combo')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return ProductResource::collection($products);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        // Load related data if needed
        $product->load('category');
        
        return new ProductResource($product);
    }
}