<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

     /**
     * The name of the "created at" column.
     *
     * @var string
     */
    const CREATED_AT = 'bl_created_at';

    /**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = 'bl_updated_at';

      /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'bl_outlet',        
        'bl_net_total',
        'bl_discount_total',
        'bl_paid_total',
        'bl_balance_due',
        'bl_note',
        'bl_status',
        'bl_auth_status'
    ]; 
}
