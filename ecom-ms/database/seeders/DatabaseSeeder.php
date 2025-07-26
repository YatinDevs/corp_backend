<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
// Add these imports at the top
use App\Models\Category;
use App\Models\Product;
use App\Models\ComboPack;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        
        $this->call([
            CategoriesTableSeeder::class,
            ProductsTableSeeder::class,
            ComboPacksTableSeeder::class,
        ]);
    }
}
