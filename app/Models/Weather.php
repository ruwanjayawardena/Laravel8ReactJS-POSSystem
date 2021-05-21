<?php

/**
* Created by Reliese Model.
* Date: Wed, 03 Jul 2019 21:07:39 +0000.
*/

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
* Class Weather
* 
* @property int $id
* @property \Carbon\Carbon $date
* @property array $location
* @property array $temperature
*
* @package App\Models
*/
class Weather extends Model
{

	use HasFactory;
	
	public $timestamps = false;
	
	protected $table = 'weathers';
	
	protected $casts = [
		'location' => 'array',
		'temperature' => 'array'
	];
	
	protected $dates = [
		'date'
	];
	
	protected $fillable = [
		'date',
		'location',
		'temperature'
	];
}
