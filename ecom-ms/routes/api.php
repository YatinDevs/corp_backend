<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\{
    CategoryController,
    ProductController,
};



// Categories API
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/featured', [CategoryController::class, 'featured']);
    Route::get('/{category}', [CategoryController::class, 'show']);
    Route::get('/{category}/products', [CategoryController::class, 'products']);
});

// Products API
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/featured', [ProductController::class, 'featured']);
    Route::get('/single', [ProductController::class, 'singleProducts']);
    Route::get('/combo', [ProductController::class, 'comboProducts']);
    Route::get('/{product}', [ProductController::class, 'show']);
});