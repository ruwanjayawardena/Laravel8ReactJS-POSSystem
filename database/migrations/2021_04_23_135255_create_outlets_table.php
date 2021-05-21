<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOutletsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('outlets', function (Blueprint $table) {                   
            $table->id();                    
            $table->string('ol_outlet_name',200)->unique();
            $table->string('ol_location',255)->default('-');
            $table->string('ol_contact_no',12);            
            $table->timestamp('ol_created_at')->useCurrent();  
            $table->timestamp('ol_updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('outlets');
    }
}
