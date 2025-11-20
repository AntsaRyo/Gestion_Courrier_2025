<?php

namespace App\Http\Controllers;

use App\Models\Arrive;
use App\Models\User;
use App\Notifications\NouveauCourrierNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

    class ArriveController extends Controller
    {
    //fonction pour afficher la liste des courriers et gérer la recherche
    public function index(){
        $courriers = Arrive::orderBy('DateArrive','desc')->where('etat', 'En attente')->get();
        return response()->json($courriers, 200);
    }


    //fonction ajouter
    public function ajouter(Request $request) {
        $request->validate([
            'DateArrive'=>'required|date',
            'Provenance'=>'required|string',
            'numero_correspondance_arrive'=>'required|integer',
            'DateCorrespondanceArrive'=>'required|date',
            'TexteCorespondanceArrive'=>'required|string',
            'piece_jointe_arrive'=>'required|integer'
        ]);

        $arrive = Arrive::create([
            'DateArrive'=>$request->DateArrive,
            'Provenance'=>$request->Provenance,
            'numero_correspondance_arrive'=>$request->numero_correspondance_arrive,
            'DateCorrespondanceArrive'=>$request->DateCorrespondanceArrive,
            'TexteCorespondanceArrive'=>$request->TexteCorespondanceArrive,
            'piece_jointe_arrive'=>$request->piece_jointe_arrive
        ]);

        $chefs = User::where('role', 'Chef de service')->get();

        foreach ($chefs as $chef) {
            try {
                $chef->notify(new NouveauCourrierNotification($arrive));
                Log::info("Notification envoyée à " . $chef->email);
            } catch (\Exception $e) {
                Log::error("Échec de l'envoi de la notification à " . $chef ->email . ": " . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Courrier enregistré avec succès']);
    }

    //fonction modifier
    public function modifierCourrier($NumeroArrive) {
    $courrier = Arrive::find($NumeroArrive);
    if (!$courrier) {
        return response()->json(['message' => 'Courrier introuvable']);
    }
    return $courrier;
    }

    public function modification(Request $request, $NumeroArrive) {
        $request->validate([
            'DateArrive'=>'required|date',
            'Provenance'=>'required|string',
            'numero_correspondance_arrive'=>'required|integer',
            'DateCorrespondanceArrive'=>'required|date',
            'TexteCorespondanceArrive'=>'required|string',
            'piece_jointe_arrive'=>'required|integer'
        ]);

        $courriers = Arrive::find($NumeroArrive);
        if(!$courriers) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }

        $courriers->update([
            'DateArrive'=>$request->DateArrive,
            'Provenance'=>$request->Provenance,
            'numero_correspondance_arrive'=>$request->numero_correspondance_arrive,
            'DateCorrespondanceArrive'=>$request->DateCorrespondanceArrive,
            'TexteCorespondanceArrive'=>$request->TexteCorespondanceArrive,
            'piece_jointe_arrive'=>$request->piece_jointe_arrive
        ]);
        return response()->json(['message' => 'Courrier modifié avec succès']);
    }

    //fonction supprimer
    public function supprimer($NumeroArrive) {
        $courriers = Arrive::findOrFail($NumeroArrive);
        if(!$courriers) {
            return response()->json(['message' => 'Courrier non trouvé']);
        }
        $courriers->delete();
        return response()->json(['message' => 'Courrier supprimé']);
    }

    //courrier archivés
    public function archivesArrive(){
        $courriers = Arrive::orderBy('DateArrive','desc')->where('etat', 'Archivé')->get();
        return response()->json($courriers, 200);
    }

    //courrier assigné
    public function voirAssignation(){
        $courriers = Arrive::orderBy('DateArrive','desc')->where('etat', 'Assigné')->get();
        return response()->json($courriers, 200);
    }

    //suivi des courriers
    public function suiviCourrier($nomDivision){
        Log::info('Nom de la division reçu: ' . $nomDivision);
        $courriers = Arrive::where('etat','Envoyé')->where('Destinataire',$nomDivision)->orWhere('Destinataire','LIKE','% . $nomDivision .%')->orderBy('DateArrive','desc')->get();
        return response()->json($courriers, 200);
    }
}
