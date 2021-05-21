<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $default_amount = "0.00";          
            $table->id();
            $table->unsignedBigInteger('maincategory');            
            $table->unsignedBigInteger('sub1category');            
            $table->unsignedBigInteger('sub2category');            
            $table->foreign('maincategory')->references('id')->on('maincategories')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('sub1category')->references('id')->on('sub1categories')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('sub2category')->references('id')->on('sub2categories')->onDelete('cascade')->onUpdate('cascade');
            $table->string('product_image',200)->nullable();
            $table->char('product_code', 100)->unique();
            $table->string('product',200);  
            $table->double('qty', 5, 1)->default('0');
            $table->double('price', 8, 2)->default($default_amount);
            $table->double('wholesale_price', 8, 2)->default($default_amount);
            $table->double('last_sold_price', 8, 2)->default($default_amount);
            $table->text('description')->default("-");
            $table->unique(['product_code','product']);
            $table->timestamp('created_at')->useCurrent();  
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
