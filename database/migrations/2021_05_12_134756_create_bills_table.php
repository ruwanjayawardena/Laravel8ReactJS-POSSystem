<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBillsTable extends Migration
{
    /**
    * Run the migrations.
    *
    * @return void
    */
    public function up()
    {
        Schema::create('bills', function (Blueprint $table) {                  
            $table->id();
            $table->unsignedBigInteger('bl_outlet');
            $table->foreign('bl_outlet')->references('id')->on('outlets')->onDelete('cascade')->onUpdate('cascade');          
            $table->double('bl_net_total', 8, 2);
            $table->double('bl_discount_total', 8, 2);
            $table->double('bl_paid_total', 8, 2);           
            $table->double('bl_balance_due', 8, 2);
            $table->text('bl_note')->default("-");            
            //0 -cancelled bill, 1 - completed bill , 2 - Partially completed bill(uncompleted)
            $table->tinyInteger('bl_status')->default(1);       
            $table->tinyInteger('bl_auth_status')->default(0);       
            $table->timestamp('bl_created_at')->useCurrent();  
            $table->timestamp('bl_updated_at')->useCurrent();
        });
    }
    
    /**
    * Reverse the migrations.
    *
    * @return void
    */
    public function down()
    {
        Schema::dropIfExists('bills');
    }
}
