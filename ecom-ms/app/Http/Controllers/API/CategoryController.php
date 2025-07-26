<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        return CategoryResource::collection($categories);
    }

    /**
     * Display featured categories with their featured products.
     */
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

    /**
     * Display the specified category.
     */
    public function show(Category $category)
    {
        return new CategoryResource($category->load('products'));
    }

    /**
     * Display products for a specific category.
     */
    public function products(Category $category)
    {
        $products = $category->products()
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return ProductResource::collection($products);
    }
}