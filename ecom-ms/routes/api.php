<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\{
    CategoryController,
    ProductController,
};



// Categories API
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{id}', [CategoryController::class, 'show']);

// Products API
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);
Route::get('products/combo/{id}', [ProductController::class, 'comboDetails']);

// Featured products
Route::get('products/featured', [ProductController::class, 'featured']);
