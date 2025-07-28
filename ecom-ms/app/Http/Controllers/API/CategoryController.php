<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function featured()
    {
        $categories = Category::where('is_active', true)
            ->with(['products' => function($query) {
                $query->where('is_featured', true)
                    ->where('is_active', true)
                    ->orderBy('created_at', 'desc')
                    ->limit(4);
            }])
            ->has('products')
            ->limit(6)
            ->get();

        return CategoryResource::collection($categories);
    }

    public function show(Category $category)
    {
        return new CategoryResource($category->load('products'));
    }

    public function products(Category $category)
    {
        $products = $category->products()
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return ProductResource::collection($products);
    }
}