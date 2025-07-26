<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {  
          
    
       Category::firstOrCreate(
        ['slug' => 'electronics'],
        [
            'name' => 'Electronics',
            'description' => 'All electronic items',
            'is_active' => true
        ]
        );

        Category::firstOrCreate(
            ['slug' => 'clothing'],
            [
                'name' => 'Clothing',
                'description' => 'Men and women clothing',
                'is_active' => true
            ]
        );

        Category::firstOrCreate(
            ['slug' => 'home-kitchen'],
            [
                'name' => 'Home & Kitchen',
                'description' => 'Home appliances and kitchenware',
                'is_active' => true
            ]
        );
    }
}
