<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('py_bill');
            $table->unsignedBigInteger('py_customer')->nullable();
            $table->foreign('py_bill')->references('id')->on('bills')->onDelete('cascade')->onUpdate('cascade');           
            $table->foreign('py_customer')->references('id')->on('customers')->onDelete('cascade')->onUpdate('cascade');           
            //1- cash pay, 2- cheque pay
            $table->tinyInteger('py_pay_type')->default(1);
            $table->double('py_paid_total', 8, 2);
            $table->text('py_chq_info')->default('-');
            //0 -cancelled payment, 1 - completed payment
            $table->tinyInteger('py_status')->default(1);       
            $table->timestamp('py_created_at')->useCurrent();  
            $table->timestamp('py_updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
