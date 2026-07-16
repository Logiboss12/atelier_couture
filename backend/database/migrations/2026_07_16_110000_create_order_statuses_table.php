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
        Schema::create('order_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('label');
            $table->string('color');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_final')->default(false);
            $table->timestamps();
        });

        $defaults = [
            ['slug' => 'recue', 'label' => 'Reçue', 'color' => 'var(--iro-blue)', 'position' => 0, 'is_final' => false],
            ['slug' => 'encours', 'label' => 'En cours', 'color' => 'var(--iro-orange)', 'position' => 1, 'is_final' => false],
            ['slug' => 'finition', 'label' => 'Finition', 'color' => 'var(--iro-violet)', 'position' => 2, 'is_final' => false],
            ['slug' => 'prete', 'label' => 'Prête', 'color' => 'var(--iro-gold)', 'position' => 3, 'is_final' => false],
            ['slug' => 'livree', 'label' => 'Livrée', 'color' => 'var(--iro-green)', 'position' => 4, 'is_final' => true],
        ];

        foreach ($defaults as $status) {
            DB::table('order_statuses')->insert([...$status, 'created_at' => now(), 'updated_at' => now()]);
        }

        // Le statut des commandes n'est plus une liste fixe (enum) mais référence order_statuses.slug,
        // configurable par l'admin (workflow personnalisable).
        DB::statement("ALTER TABLE orders MODIFY statut VARCHAR(255) NOT NULL DEFAULT 'recue'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE orders MODIFY statut ENUM('recue','encours','finition','prete','livree') NOT NULL DEFAULT 'recue'");

        Schema::dropIfExists('order_statuses');
    }
};
