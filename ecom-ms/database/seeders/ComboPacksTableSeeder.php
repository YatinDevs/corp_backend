<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ComboPack;

class ComboPacksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $smartphone = Product::where('name', 'Smartphone X')->first();
        $earbuds = Product::where('name', 'Wireless Earbuds')->first();

        $combo = ComboPack::create([
            'combo_code' => 'COMBO-001',
            'name' => 'Mobile Entertainment Pack',
            'price' => 699.99,
            'discount_price' => 649.99,
            'is_active' => true
        ]);

        $combo->products()->attach([
            $smartphone->id => ['quantity' => 1],
            $earbuds->id => ['quantity' => 1]
        ]);
    }
}
