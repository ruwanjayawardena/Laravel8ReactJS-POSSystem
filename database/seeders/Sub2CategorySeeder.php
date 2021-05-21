<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class Sub2CategorySeeder extends Seeder
{
    /**
    * Run the database seeds.
    *
    * @return void
    */
    public function run()
    {
        DB::table('sub2categories')->insert([
            ['id'=>1, 'sub1category'=>1, 'sub2category' => 'Second Sub Category 1'],
            ['id'=>2, 'sub1category'=>2, 'sub2category' => 'Second Sub Category 2'],
            ['id'=>3, 'sub1category'=>3, 'sub2category' => 'Second Sub Category 3'],
            ['id'=>4, 'sub1category'=>4, 'sub2category' => 'Second Sub Category 4'],
            ['id'=>5, 'sub1category'=>5, 'sub2category' => 'Second Sub Category 5'],        
            
            ]);            
        }
    }
    
    