<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;
class MainCategorySeeder extends Seeder
{
    /**
    * Run the database seeds.
    *
    * @return void
    */
    public function run()
    {
        DB::table('maincategories')->insert([
            ['id'=>1, 'category' => 'Main Category 1','code' => 'AA1'],
            ['id'=>2, 'category' => 'Main Category 2','code' => 'AA2'],
            ['id'=>3, 'category' => 'Main Category 3','code' => 'AA3'],
            ['id'=>4, 'category' => 'Main Category 4','code' => 'AA4'],
            ['id'=>5, 'category' => 'Main Category 5','code' => 'AA5'],
            ]);            
        }
    }
    