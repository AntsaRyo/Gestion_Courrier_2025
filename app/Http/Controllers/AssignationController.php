<?php

namespace App\Http\Controllers;

use App\Models\Arrive;
use App\Models\User;
use App\Notifications\NouvelleAssignation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AssignationController extends Controller
{
    //fonction pour aficher les courriers en attente d'assignation
    public function index(){
        $courriers = Arrive::orderBy('DateArrive','desc')->where('etat', 'En attente')->get();
        return response()->json($courriers, 200);
    }
    
    //fonction pour ajouter un destinataire
    public function ajouterDestinataire(Request $request,$NumeroArrive) {
        $request->validate([
            'Destinataire'=>'nullable|string',
            'Autre_Destinataire'=>'nullable|string|max:255'
        ]);

        $destinataireFinal = $request->Autre_Destinataire ?: $request->Destinataire;

        if(!$destinataireFinal){
            return response()->json([
                'message' => 'Veuillez sélectionner ou saisir un destinataire.'
            ], 422);
        }

        $courrier = Arrive::where('NumeroArrive', $NumeroArrive)->first();
        if(!$courrier) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }

        $courrier->Destinataire=$destinataireFinal;
        $courrier->save();

        return response()->json(['message' => 'Destinataire ajouté avec succès']);
    }

    //fonction pour ajouter une observation
    public function ajouterObservation(Request $request, $NumeroArrive) {
        $request->validate([
            'Observation'=>'nullable|string',
            'Autre_Observation'=>'nullable|string|max:255'
        ]);

        $observationFinal = $request->Autre_Observation ?: $request->Observation;

        if(!$observationFinal){
            return response()->json([
                'message' => 'Veuillez sélectionner ou saisir une observation.'
            ], 422);
        }

        $courrier = Arrive::where('NumeroArrive', $NumeroArrive)->first();
        if(!$courrier) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }

        $courrier->observations = $observationFinal;
        $courrier->etat = 'Assigné';
        $courrier->save();

        $secretaires = User::where('role', 'Secretaire')->get();

        foreach ($secretaires as $secretaire) {
            try {
                $secretaire->notify(new NouvelleAssignation($courrier));
                Log::info("Notification envoyée à " . $secretaire->email);
            } catch (\Exception $e) {
                Log::error("Échec de l'envoi de la notification à " . $secretaire->email . ": " . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Observation ajoutée avec succès']);
    }
}
