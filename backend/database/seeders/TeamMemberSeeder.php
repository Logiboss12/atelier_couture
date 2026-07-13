<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            ['nom' => 'Khady Sarr', 'role' => "Cheffe d'atelier", 'role_color' => 'var(--iro-magenta)', 'permissions' => ['Commandes', 'Clients', 'Stocks'], 'charge' => 82, 'assignees' => 14],
            ['nom' => 'Omar Diallo', 'role' => 'Tailleur senior', 'role_color' => 'var(--iro-blue)', 'permissions' => ['Commandes', 'Catalogue'], 'charge' => 68, 'assignees' => 9],
            ['nom' => 'Marième Cissé', 'role' => 'Couturière finition', 'role_color' => 'var(--iro-violet)', 'permissions' => ['Commandes'], 'charge' => 55, 'assignees' => 7],
            ['nom' => 'Baba Traoré', 'role' => 'Responsable stocks', 'role_color' => 'var(--iro-orange)', 'permissions' => ['Stocks', 'Livraisons'], 'charge' => 47, 'assignees' => 5],
            ['nom' => 'Sokhna Mbaye', 'role' => 'Conseillère clientèle', 'role_color' => 'var(--iro-gold)', 'permissions' => ['Clients', 'Devis & Factures'], 'charge' => 61, 'assignees' => 11],
            ['nom' => 'Pape Seck', 'role' => 'Livreur', 'role_color' => 'var(--iro-green)', 'permissions' => ['Livraisons'], 'charge' => 39, 'assignees' => 6],
        ];

        foreach ($members as $member) {
            TeamMember::create($member);
        }
    }
}
