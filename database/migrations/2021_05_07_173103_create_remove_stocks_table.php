<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRemoveStocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('remove_stocks', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('product');            
            $table->foreign('product')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
            $table->double('qty', 5, 1)->default(0);                      
            $table->text('remove_note')->default("-");                  
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
        Schema::dropIfExists('remove_stocks');
    }
}
