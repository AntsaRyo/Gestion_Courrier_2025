<?php

namespace App\Http\Controllers;

use App\Models\Depart;
use App\Models\User;
use App\Notifications\NouveauDepartNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

    class DepartController extends Controller
    {
    //fonction pour afficher la liste des courriers et gérer la recherche
    public function index(){
        $courriers = Depart::orderBy('NumeroDepart','desc')->where('etat_depart', 'Non validé')->get();
        return response()->json($courriers, 200);
    }


    //fonction ajouter
    public function ajouter(Request $request) {
        $request->validate([
            'DateDepart'=>'required|date',
            'DestinataireDepart'=>'required|string',
            'numero_correspondance_depart'=>'required|integer',
            'DateCorrespondanceDepart'=>'required|date',
            'ObjetDepart'=>'required|string',
            'nombre_pieces_jointes'=>'required|integer',
            'ObservationsDepart'=>'required|string'
        ]);

        $depart = Depart ::create([
            'DateDepart'=>$request->DateDepart,
            'DestinataireDepart'=>$request->DestinataireDepart,
            'numero_correspondance_depart'=>$request->numero_correspondance_depart,
            'DateCorrespondanceDepart'=>$request->DateCorrespondanceDepart,
            'ObjetDepart'=>$request->ObjetDepart,
            'nombre_pieces_jointes'=>$request->nombre_pieces_jointes,
            'ObservationsDepart'=>$request->ObservationsDepart
        ]);

        $chefs = User::where('role', 'Chef de service')->get();

        foreach ($chefs as $chef) {
            try {
                $chef->notify(new NouveauDepartNotification($depart));
                Log::info("Notification envoyée à " . $chef->email);
            } catch (\Exception $e) {
                Log::error("Échec de l'envoi de la notification à " . $chef ->email . ": " . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Courrier enregistré avec succès']);
    }

    //fonction modifier
    public function modifierCourrier($NumeroDepart) { 
    $courrier = Depart::find($NumeroDepart);
    if (!$courrier) {
        return response()->json(['message' => 'Courrier introuvable']);
    }
    return $courrier;
    }

    public function modification(Request $request, $NumeroDepart) {
        $request->validate([
            'DateDepart'=>'required|date',
            'DestinataireDepart'=>'required|string',
            'numero_correspondance_depart'=>'required|integer',
            'DateCorrespondanceDepart'=>'required|date',
            'ObjetDepart'=>'required|string',
            'nombre_pieces_jointes'=>'required|integer',
            'ObservationsDepart'=>'required|string'
        ]);

        $courriers = Depart::find($NumeroDepart);
        if(!$courriers) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }

        $courriers->update([
            'DateDepart'=>$request->DateDepart,
            'DestinataireDepart'=>$request->DestinataireDepart,
            'numero_correspondance_depart'=>$request->numero_correspondance_depart,
            'DateCorrespondanceDepart'=>$request->DateCorrespondanceDepart,
            'ObjetDepart'=>$request->ObjetDepart,
            'nombre_pieces_jointes'=>$request->nombre_pieces_jointes,
            'ObservationsDepart'=>$request->ObservationsDepart
        ]);
        return response()->json(['message' => 'Courrier modifié avec succès']);
    }

    //fonction supprimer
    public function supprimer($NumeroDepart) {
        $courriers = Depart::findOrFail($NumeroDepart);
        if(!$courriers) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }
        $courriers->delete();
        return response()->json(['message' => 'Courrier supprimé']);
    }

    //fonction pour les dossiers validés
    public function MontrerValide() {
        $courriers = Depart::orderBy('NumeroDepart','desc')->where('etat_depart','Validé')->get();
        return response()->json($courriers,200);
    }

    //courrier archivés
    public function archivesDepart(){
        $courriers = Depart::orderBy('DateDepart','desc')->where('etat_depart', 'Archivé')->get();
        return response()->json($courriers, 200);
    }
}
