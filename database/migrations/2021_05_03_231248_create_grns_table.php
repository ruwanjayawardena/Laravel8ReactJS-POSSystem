<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGrnsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grns', function (Blueprint $table) {
            $default_amount = "0.00";
            $table->id(); 
            $table->unsignedBigInteger('supplier');
            $table->foreign('supplier')->references('id')->on('suppliers')->onDelete('cascade')->onUpdate('cascade');           
            $table->string('reference_no',50); 
            $table->double('total', 8, 2)->default($default_amount);                
            $table->text('description')->default("-");
            //0 -GRN Created, 1 - Full Returned , 2 - Partial Products Returned
            $table->tinyInteger('status')->default(0);  
            $table->unique(['supplier','reference_no']);        
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
        Schema::dropIfExists('grns');
    }
}
