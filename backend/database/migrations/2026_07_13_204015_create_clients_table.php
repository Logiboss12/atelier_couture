<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('ville')->nullable();
            $table->string('pays')->nullable();
            $table->string('tel')->nullable();
            $table->string('email')->unique();
            $table->unsignedSmallInteger('client_depuis')->nullable();
            $table->unsignedSmallInteger('poitrine')->nullable();
            $table->unsignedSmallInteger('taille')->nullable();
            $table->unsignedSmallInteger('hanches')->nullable();
            $table->unsignedSmallInteger('epaule')->nullable();
            $table->unsignedSmallInteger('manche')->nullable();
            $table->unsignedSmallInteger('longueur')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
