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
        Schema::create('measurements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('type_vetement');
            $table->string('label')->nullable();
            $table->json('valeurs');
            $table->date('prise_le');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('measurement_id')->nullable()->after('textile_id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('measurement_id');
        });

        Schema::dropIfExists('measurements');
    }
};
