<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBillItemsTable extends Migration
{
    /**
    * Run the migrations.
    *
    * @return void
    */
    public function up()
    {
        Schema::create('bill_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bitm_bill');
            $table->unsignedBigInteger('bitm_item');
            $table->foreign('bitm_bill')->references('id')->on('bills')->onDelete('cascade')->onUpdate('cascade');          
            $table->foreign('bitm_item')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');          
            $table->double('bitm_qty', 8, 2);
            $table->double('bitm_sold_price', 8, 2);
            $table->double('bitm_subtotal', 8, 2);
            $table->timestamp('bitm_created_at')->useCurrent();  
            $table->timestamp('bitm_updated_at')->useCurrent();
        });
    }
    
    /**
    * Reverse the migrations.
    *
    * @return void
    */
    public function down()
    {
        Schema::dropIfExists('bill_items');
    }
}
