<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

       /**
     * The name of the "created at" column.
     *
     * @var string
     */
    const CREATED_AT = 'py_created_at';

    /**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = 'py_updated_at';

     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'py_bill',        
        'py_customer',
        'py_pay_type',
        'py_paid_total',
        'py_chq_info',
        'py_status'
    ]; 
}
