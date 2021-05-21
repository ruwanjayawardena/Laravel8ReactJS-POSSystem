<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSub2categoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sub2categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sub1category');            
            $table->foreign('sub1category')->references('id')->on('sub1categories')->onDelete('cascade')->onUpdate('cascade');
            $table->string('sub2category',200);  
            $table->unique(['sub1category', 'sub2category']);
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
        Schema::dropIfExists('sub2categories');
    }
}
