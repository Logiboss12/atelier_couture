<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = ['nom', 'debut', 'fin', 'cible', 'reduction', 'statut', 'statut_label', 'ca'];

    protected $casts = [
        'debut' => 'date',
        'fin' => 'date',
    ];
}
