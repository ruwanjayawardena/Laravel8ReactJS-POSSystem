<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSub1categoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sub1categories', function (Blueprint $table) {
            $table->id();
            //foreign Key set
            $table->unsignedBigInteger('maincategory');            
            $table->foreign('maincategory')->references('id')->on('maincategories')->onDelete('cascade')->onUpdate('cascade');;
            //by default nullable false if not ->nullable($value = true) should add
            //$table->string('subcategory',200)->unique();
            $table->string('subcategory',200);
            //use current timestamp            
            //$table->timestamps(); 
            //alternative method    
            $table->unique(['subcategory', 'maincategory']);
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
        Schema::dropIfExists('sub1categories');
    }
}
