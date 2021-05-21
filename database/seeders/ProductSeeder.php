<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class ProductSeeder extends Seeder
{
    /**
    * Run the database seeds.
    *
    * @return void
    */
    public function run()
    {
        DB::table('products')->insert([
            ['id'=>1, 'maincategory'=>1, 'sub1category'=>1,'sub2category'=>1,'product_code'=>'AAA111','product'=>'Sample product 1','qty'=>'0.0','price'=>'0.00','wholesale_price'=>'0.00','last_sold_price'=>'0.00','description'=>'Product description 1'],
            ['id'=>2, 'maincategory'=>2, 'sub1category'=>2,'sub2category'=>2,'product_code'=>'AAA222','product'=>'Sample product 2','qty'=>'0.0','price'=>'0.00','wholesale_price'=>'0.00','last_sold_price'=>'0.00','description'=>'Product description 2'],
            ['id'=>3, 'maincategory'=>3, 'sub1category'=>3,'sub2category'=>3,'product_code'=>'AAA333','product'=>'Sample product 3','qty'=>'0.0','price'=>'0.00','wholesale_price'=>'0.00','last_sold_price'=>'0.00','description'=>'Product description 3'],
            ['id'=>4, 'maincategory'=>4, 'sub1category'=>4,'sub2category'=>4,'product_code'=>'AAA444','product'=>'Sample product 4','qty'=>'0.0','price'=>'0.00','wholesale_price'=>'0.00','last_sold_price'=>'0.00','description'=>'Product description 4'],
            ['id'=>5, 'maincategory'=>5, 'sub1category'=>5,'sub2category'=>5,'product_code'=>'AAA555','product'=>'Sample product 5','qty'=>'0.0','price'=>'0.00','wholesale_price'=>'0.00','last_sold_price'=>'0.00','description'=>'Product description 5'],                  
            ]);            
        }
    }
    
    