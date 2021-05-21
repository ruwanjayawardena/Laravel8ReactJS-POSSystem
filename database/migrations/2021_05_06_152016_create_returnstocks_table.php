<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturnstocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('returnstocks', function (Blueprint $table) {
            $default_amount = "0.00";                     
            $table->id();
            $table->unsignedBigInteger('product');
            $table->unsignedBigInteger('grn');
            $table->foreign('product')->references('product')->on('stocks')->onDelete('cascade')->onUpdate('cascade');           
            $table->foreign('grn')->references('id')->on('grns')->onDelete('cascade')->onUpdate('cascade');           
            $table->double('qty', 5, 1)->default('0.0');            
            $table->text('return_note')->default("-");
            //1 - Full Returned , 2 - Partial Products Returned
            $table->tinyInteger('status')->default(1);  
            $table->unique(['product','grn']);          
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
        Schema::dropIfExists('returnstocks');
    }
}
