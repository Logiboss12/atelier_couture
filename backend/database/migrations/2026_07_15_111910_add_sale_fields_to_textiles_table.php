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
        Schema::table('textiles', function (Blueprint $table) {
            $table->unsignedInteger('prix')->nullable()->after('image');
            $table->boolean('publie')->default(true)->after('prix');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('textiles', function (Blueprint $table) {
            $table->dropColumn(['prix', 'publie']);
        });
    }
};
