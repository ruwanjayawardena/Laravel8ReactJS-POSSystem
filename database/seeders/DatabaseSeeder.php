<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            MainCategorySeeder::class,
            Sub1CategorySeeder::class,
            Sub2CategorySeeder::class,
            ProductSeeder::class,
            SupplierSeeder::class
        ]);
    }
}
