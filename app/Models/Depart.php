<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Depart extends Model
{
    protected $table = 'depart';

    protected $primaryKey = 'NumeroDepart';

    public $incrementing = true;

    protected $fillable = [
        'DateDepart',
        'DestinataireDepart',
        'numero_correspondance_depart',
        'DateCorrespondanceDepart',
        'ObjetDepart',
        'nombre_pieces_jointes',
        'etat_depart',
        'ObservationsDepart'
    ];

    protected $keyType = 'integer';
}
