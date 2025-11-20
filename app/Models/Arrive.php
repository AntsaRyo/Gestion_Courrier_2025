<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Arrive extends Model
{
    use HasFactory;

    /**
     * Nom de la table associée au modèle.
     *
     * @var string
     */
    protected $table = 'arrive';

    /**
     * Clé primaire de la table.
     *
     * @var string
     */
    protected $primaryKey = 'NumeroArrive';

    /**
     * Indique si la clé primaire est auto-incrémentée.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * Type de la clé primaire.
     *
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'DateArrive',
        'Provenance',
        'numero_correspondance_arrive',
        'DateCorrespondanceArrive',
        'TexteCorespondanceArrive',
        'piece_jointe_arrive',
        'Observations',
        'etat',
        'Destinataire'
    ];

    /**
     * Les attributs qui doivent être convertis en types natifs.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'DateArrive' => 'date',
        'DateCorrespondanceArrive' => 'date',
        'numero_correspondance_arrive' => 'integer',
        'piece_jointe_arrive' => 'integer'
    ];

    /**
     * Obtenir l'état associé au courrier arrivé.
     */
    public function etat()
    {
        return $this->belongsTo(Etat::class, 'Reference', 'Reference');
    }

    /**
     * Définir les règles de validation pour un courrier arrivé
     * 
     * @return array<string, string>
     */
    public static function rules()
    {
        return [
            'Reference' => 'required|exists:etat,Reference',
            'DateArrive' => 'required|date',
            'Provenance' => 'required|string|max:255',
            'numero_correspondance_arrive' => 'required|integer',
            'DateCorrespondanceArrive' => 'required|date',
            'TexteCorespondanceArrive' => 'required|string',
            'piece_jointe_arrive' => 'required|integer',
            'Observations' => 'required|string|max:255'
        ];
    }

    /**
     * Obtenir les messages d'erreur personnalisés pour les règles de validation
     * 
     * @return array<string, string>
     */
    public static function messages()
    {
        return [
            'Reference.required' => 'La référence est requise',
            'Reference.exists' => 'La référence sélectionnée n\'existe pas',
            'DateArrive.required' => 'La date d\'arrivée est requise',
            'DateArrive.date' => 'La date d\'arrivée doit être une date valide',
            'Provenance.required' => 'La provenance est requise',
            'Provenance.max' => 'La provenance ne peut pas dépasser 255 caractères',
            'numero_correspondance_arrive.required' => 'Le numéro de correspondance est requis',
            'numero_correspondance_arrive.integer' => 'Le numéro de correspondance doit être un nombre entier',
            'DateCorrespondanceArrive.required' => 'La date de correspondance est requise',
            'DateCorrespondanceArrive.date' => 'La date de correspondance doit être une date valide',
            'TexteCorespondanceArrive.required' => 'Le texte de correspondance est requis',
            'piece_jointe_arrive.required' => 'Le nombre de pièces jointes est requis',
            'piece_jointe_arrive.integer' => 'Le nombre de pièces jointes doit être un nombre entier',
            'Observations.required' => 'Les observations sont requises',
            'Observations.max' => 'Les observations ne peuvent pas dépasser 255 caractères'
        ];
    }
}
