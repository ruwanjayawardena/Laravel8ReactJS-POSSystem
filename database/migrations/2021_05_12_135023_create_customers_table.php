<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {                    
            $table->id();
            $table->string('cus_name',200);                
            $table->text('cus_address')->nullable();                
            $table->string('cus_contact_no',12)->unique();       
            $table->timestamp('cus_created_at')->useCurrent();  
            $table->timestamp('cus_updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customers');
    }
}
