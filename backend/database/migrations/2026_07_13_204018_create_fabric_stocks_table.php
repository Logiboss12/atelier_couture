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
        Schema::create('fabric_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('textile_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('quantite_metres');
            $table->unsignedTinyInteger('niveau')->default(0);
            $table->enum('statut', ['ok', 'warn', 'danger'])->default('ok');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fabric_stocks');
    }
};
