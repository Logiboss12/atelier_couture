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
        Schema::table('quotes', function (Blueprint $table) {
            $table->unsignedInteger('montant_matieres')->nullable()->after('modele');
            $table->unsignedInteger('montant_main_oeuvre')->nullable()->after('montant_matieres');
            $table->date('echeance')->nullable()->after('montant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn(['montant_matieres', 'montant_main_oeuvre', 'echeance']);
        });
    }
};
