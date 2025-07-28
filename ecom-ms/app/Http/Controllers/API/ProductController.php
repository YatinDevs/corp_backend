<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return ProductResource::collection($products);
    }

    public function featured()
    {
        $products = Product::where('is_featured', true)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    public function singleProducts()
    {
        $products = Product::where('type', 'single')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return ProductResource::collection($products);
    }

    public function comboProducts()
    {
        $products = Product::where('type', 'combo')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return ProductResource::collection($products);
    }

    public function show(Product $product)
    {
        $product->load('category');
        return new ProductResource($product);
    }
}