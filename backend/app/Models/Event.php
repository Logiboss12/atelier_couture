<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['nom', 'date', 'lieu', 'statut', 'statut_label', 'remplissage', 'capacite'];

    protected $casts = [
        'date' => 'date',
    ];
}
