<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'product_image',
        'maincategory',
        'sub1category',
        'sub2category',
        'product_code',
        'product',
        'qty',
        'price',
        'wholesale_price',
        'last_sold_price',
        'description'
    ]; 
}
