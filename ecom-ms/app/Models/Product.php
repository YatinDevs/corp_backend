<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_code',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'images',
        'is_active',
        'is_featured',
        'package_length',
        'package_width',
        'package_height',
        'package_weight',
        'requires_shipping',
        'type',
        'cost_price',
        'stock_quantity',
        'min_stock_threshold',
        'sku',
        'barcode',
        'specifications',
        'discount_price',
        'combo_products'
    ];

    protected $casts = [
        'images' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'requires_shipping' => 'boolean',
        'specifications' => 'array',
        'combo_products' => 'array'
    ];

    protected $appends = ['discounted_price', 'package_volume'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function includedProducts()
    {
        return $this->belongsToMany(Product::class, 'combo_products', 'combo_id', 'product_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function getDiscountedPriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    public function getPackageVolumeAttribute()
    {
        if ($this->package_length && $this->package_width && $this->package_height) {
            return $this->package_length * $this->package_width * $this->package_height;
        }
        return null;
    }

    public function setComboProductsAttribute($value)
    {
        $this->attributes['combo_products'] = is_array($value) ? json_encode($value) : $value;
    }

    public function scopeSingle($query)
    {
        return $query->where('type', 'single');
    }

    public function scopeCombo($query)
    {
        return $query->where('type', 'combo');
    }
}