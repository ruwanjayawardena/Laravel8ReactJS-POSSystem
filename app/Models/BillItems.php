<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillItems extends Model
{
    
    use HasFactory;

      /**
     * The name of the "created at" column.
     *
     * @var string
     */
    const CREATED_AT = 'bitm_created_at';

    /**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = 'bitm_updated_at';
    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = [
        'bitm_bill',        
        'bitm_item',
        'bitm_qty',
        'bitm_sold_price',
        'bitm_subtotal'
    ]; 
}
