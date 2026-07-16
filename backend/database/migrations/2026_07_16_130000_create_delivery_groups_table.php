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
        Schema::create('delivery_groups', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('zone');
            $table->date('date');
            $table->time('heure_depart')->nullable();
            $table->enum('statut', ['a_planifier', 'planifiee', 'confirmee', 'en_route', 'livree'])->default('a_planifier');
            $table->timestamps();
        });

        Schema::table('deliveries', function (Blueprint $table) {
            $table->foreignId('delivery_group_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deliveries', function (Blueprint $table) {
            $table->dropConstrainedForeignId('delivery_group_id');
        });

        Schema::dropIfExists('delivery_groups');
    }
};
