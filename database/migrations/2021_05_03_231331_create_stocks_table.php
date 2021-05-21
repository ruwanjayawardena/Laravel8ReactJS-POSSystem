<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stocks', function (Blueprint $table) {
            $default_amount = "0.00";                     
            $table->id();
            $table->unsignedBigInteger('product');
            $table->unsignedBigInteger('grn');
            $table->foreign('product')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');           
            $table->foreign('grn')->references('id')->on('grns')->onDelete('cascade')->onUpdate('cascade');           
            $table->double('qty', 5, 1)->default(0);
            $table->double('selling_price', 8, 2)->default($default_amount);
            $table->double('wholesale_price', 8, 2)->default($default_amount);           
            $table->double('stock_price', 8, 2)->default($default_amount);
            $table->text('description')->default("-");
            //0 -Project Just Created, 1 - Full Returned , 2 - Partial Returned
            $table->tinyInteger('status')->default(0);    
            $table->unique(['grn','product']);        
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
        Schema::dropIfExists('stocks');
    }
}
