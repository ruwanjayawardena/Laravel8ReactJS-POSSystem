<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class SupplierSeeder extends Seeder
{
    /**
    * Run the database seeds.
    *
    * @return void
    */
    public function run()
    {
        DB::table('suppliers')->insert([
            ['id'=>1, 'name'=> 'Sample supplier 1', 'contact_person' => 'Sample contact person 1','contact_no'=>'10000000001','description'=>'Sample description 1'],
            ['id'=>2, 'name'=> 'Sample supplier 2', 'contact_person' => 'Sample contact person 2','contact_no'=>'20000000002','description'=>'Sample description 2'],
            ['id'=>3, 'name'=> 'Sample supplier 3', 'contact_person' => 'Sample contact person 3','contact_no'=>'30000000003','description'=>'Sample description 3'],
            ['id'=>4, 'name'=> 'Sample supplier 4', 'contact_person' => 'Sample contact person 4','contact_no'=>'40000000004','description'=>'Sample description 4'],
            ['id'=>5, 'name'=> 'Sample supplier 5', 'contact_person' => 'Sample contact person 5','contact_no'=>'50000000005','description'=>'Sample description 5'],          
            ]);            
        }
    }
    
    