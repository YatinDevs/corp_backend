<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->withCount(['products' => function($query) {
                $query->active();
            }])
            ->get();
            
        return response()->json($categories);
    }

    public function show($id)
    {
        $category = Category::with(['products' => function($query) {
            $query->active();
        }])->findOrFail($id);
        
        return response()->json($category);
    }
}