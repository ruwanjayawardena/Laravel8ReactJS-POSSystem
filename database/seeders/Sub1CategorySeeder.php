<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class Sub1CategorySeeder extends Seeder
{
    /**
    * Run the database seeds.
    *
    * @return void
    */
    public function run()
    {
        DB::table('sub1categories')->insert([
            ['id'=>1, 'maincategory'=>1, 'subcategory' => 'Sub Category 1'],
            ['id'=>2, 'maincategory'=>2, 'subcategory' => 'Sub Category 2'],
            ['id'=>3, 'maincategory'=>3, 'subcategory' => 'Sub Category 3'],
            ['id'=>4, 'maincategory'=>4, 'subcategory' => 'Sub Category 4'],
            ['id'=>5, 'maincategory'=>5, 'subcategory' => 'Sub Category 5'],          
            ]);
        }
    }
    