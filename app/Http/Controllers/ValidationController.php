<?php

namespace App\Http\Controllers;

use App\Models\Arrive;
use App\Models\Depart;
use App\Models\User;
use App\Notifications\NouvelleValidation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ValidationController extends Controller
{
    //fonction pour afficher les departs non validés
    public function index() {
        $courriers = Depart::OrderBy('DateDepart','Desc')->where('etat_depart','Non validé')->get();
        return response()->json($courriers,200);
    }

    //validation des départs
    public function valider(Request $request, $NumeroDepart) {
        $courrier = Depart::where('NumeroDepart', $NumeroDepart)->first();
        if(!$courrier) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }

        $courrier->etat_depart = 'Validé';
        $courrier->save();
        
        $secretaires = User::where('role', 'Secretaire')->get();

        foreach ($secretaires as $secretaire) {
            try {
                $secretaire->notify(new NouvelleValidation($courrier));
                Log::info("Notification envoyée à " . $secretaire->email);
            } catch (\Exception $e) {
                Log::error("Échec de l'envoi de la notification à " . $secretaire->email . ": " . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Courrier validé avec succès']);
    }

    //archiver un courrier arrive
    public function archiverArrive(Request $request, $NumeroArrive) {
        $courrier = Arrive::where('NumeroArrive', $NumeroArrive)->first();
        if(!$courrier) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }

        $courrier->etat = 'Archivé';
        $courrier->save();

        return response()->json(['message' => 'Courrier validé avec succès']);
    }

    //archiver depart
    public function archiverDepart(Request $request, $NumeroDepart) {
        $courrier = Depart::where('NumeroDepart', $NumeroDepart)->first();
        if(!$courrier) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }

        $courrier->etat_depart = 'Archivé';
        $courrier->DateDepart = now();
        $courrier->save();

        return response()->json(['message' => 'Courrier validé avec succès']);
    }

    public function assigneCourrier(Request $request, $NumeroArrive) {
        $courrier = Arrive::where('NumeroArrive', $NumeroArrive)->first();
        if(!$courrier) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }

        $courrier->etat = 'Envoyé';
        $courrier->save();

        return response()->json(['message' => 'Courrier validé avec succès']);
    }
}
