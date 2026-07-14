<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE invoices MODIFY statut ENUM('en_attente', 'payee', 'partielle', 'impayee') NOT NULL DEFAULT 'impayee'");

        Schema::table('invoices', function (Blueprint $table) {
            $table->enum('mode_paiement', ['carte', 'mobile_money', 'especes_livraison'])->nullable()->after('total');
            $table->string('adresse_livraison')->nullable()->after('mode_paiement');
            $table->string('ville_livraison')->nullable()->after('adresse_livraison');
            $table->string('tel_livraison')->nullable()->after('ville_livraison');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['mode_paiement', 'adresse_livraison', 'ville_livraison', 'tel_livraison']);
        });

        DB::statement("ALTER TABLE invoices MODIFY statut ENUM('payee', 'partielle', 'impayee') NOT NULL DEFAULT 'impayee'");
    }
};
