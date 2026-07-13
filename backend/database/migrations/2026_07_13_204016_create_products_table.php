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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('textile_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nom');
            $table->string('categorie')->nullable();
            $table->unsignedTinyInteger('variantes')->default(1);
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedTinyInteger('stock_niveau')->default(0);
            $table->unsignedInteger('prix');
            $table->enum('statut', ['ok', 'warn', 'danger'])->default('ok');
            $table->boolean('publie')->default(true);
            $table->json('tailles')->nullable();
            $table->json('couleurs')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
