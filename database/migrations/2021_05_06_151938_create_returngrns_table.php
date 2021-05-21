<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturngrnsTable extends Migration
{
    /**
    * Run the migrations.
    *
    * @return void
    */
    public function up()
    {
        // if(!Schema::hasTable('returngrns')){
            Schema::create('returngrns', function (Blueprint $table) {            
                $table->id(); 
                $table->unsignedBigInteger('grn')->unique();            
                $table->foreign('grn')->references('id')->on('grns')->onDelete('cascade')->onUpdate('cascade');
                $table->text('return_note')->default("-"); 
                //1 - Full Returned , 2 - Partial Products Returned
                $table->tinyInteger('status')->default(1);                    
                $table->timestamp('created_at')->useCurrent();  
                $table->timestamp('updated_at')->useCurrent();
            });
        // }
    }
    
    /**
    * Reverse the migrations.
    *
    * @return void
    */
    public function down()
    {
        Schema::dropIfExists('returngrns');
    }
}
