<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_code')->unique();
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            
            // Common fields
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->json('images')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            
            // Shipping fields
            $table->decimal('package_length', 8, 2)->nullable();
            $table->decimal('package_width', 8, 2)->nullable();
            $table->decimal('package_height', 8, 2)->nullable();
            $table->decimal('package_weight', 8, 2)->nullable();
            $table->boolean('requires_shipping')->default(true);
            
            // Product type
            $table->enum('type', ['single', 'combo'])->default('single');
            
            // Single product fields
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->integer('min_stock_threshold')->default(5);
            $table->string('sku')->unique()->nullable();
            $table->string('barcode')->nullable();
            $table->json('specifications')->nullable();
            
            // Combo product fields
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->json('combo_products')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};