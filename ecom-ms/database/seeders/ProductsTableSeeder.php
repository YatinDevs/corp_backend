<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $electronics = Category::where('name', 'Electronics')->first();
        $clothing = Category::where('name', 'Clothing')->first();

        Product::create([
            'category_id' => $electronics->id,
            'product_code' => 'PROD-ELEC-001',
            'name' => 'Smartphone X',
            'price' => 599.99,
            'stock_quantity' => 100,
            'is_active' => true
        ]);

        Product::create([
            'category_id' => $electronics->id,
            'product_code' => 'PROD-ELEC-002',
            'name' => 'Wireless Earbuds',
            'price' => 129.99,
            'stock_quantity' => 50,
            'is_active' => true
        ]);

        Product::create([
            'category_id' => $clothing->id,
            'product_code' => 'PROD-CLOTH-001',
            'name' => 'Men\'s T-Shirt',
            'price' => 24.99,
            'stock_quantity' => 200,
            'is_active' => true
        ]);
    }
}
