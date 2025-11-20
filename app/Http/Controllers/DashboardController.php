<?php

namespace App\Http\Controllers;

use App\Models\Arrive;
use App\Models\Depart;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    //récupérer le nombre de courrier reçu
    public function totalArrive() {
        $totalCourriersArrive = Arrive::count();
        return response()->json([
            "totalCourriersArrive" => $totalCourriersArrive
        ]);
    }

    //récupérer le nombre de courrier envoyé
    public function totalDepart() {
        $totalCourriersDepart = Depart::where('etat_depart', 'Validé')->count();
        return response()->json([
            "totalCourriersDepart" => $totalCourriersDepart
        ]);
    }

    //récupérer le nombre de courrier traité
    public function totalEnvoye() {
        $totalCourriersEnvoye = Arrive::where('etat', 'Envoyé')->count();
        return response()->json([
            "totalCourriersEnvoye" => $totalCourriersEnvoye
        ]);
    }

    //récupérer le nombre de courrier assigné
    public function totalAssigne() {
        $totalCourriersAssigne = Arrive::where('etat', 'Assigné')->count();
        return response()->json([
            "totalCourriersAssigne" => $totalCourriersAssigne
        ]);
    }

    public function totalArchive() {
        $archiveArrive = Arrive::where('etat', 'Archivé')->count();
        $archiveDepart = Depart::where('etat_depart', 'Archivé')->count();
        $totalArchive = $archiveArrive + $archiveDepart;
        return response()->json([
            "totalArchive" => $totalArchive
        ]);
    }

    //récupérer les courriers par mois pour les 6 derniers mois(secrétaire)
    public function courriersParMois() {
        $data = collect(range(0, 2))->map(function ($i) {
            $date = Carbon::now()->subMonths($i);
            $month = $date->format('Y-m');

            return [
                'month' => $month,
                'recu' => Arrive::whereMonth('created_at', $date->month)
                                 ->whereYear('created_at', $date->year)
                                 ->count(),

                'envoye' => Depart::where('etat_depart', 'Validé')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),
                
                'dispatche' => Arrive::where('etat', 'Envoyé')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),

                'archiveArrive' => Arrive::where('etat', 'Archivé')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),
                'archiveDepart' => Depart::where('etat_depart', 'Archivé')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),
            ];
        });

        return response()->json($data->reverse()->values());
    }

    //récupérer les courriers par mois pour les 6 derniers mois (chef de service)
    public function courriersParMoisChef() {
        $data = collect(range(0, 5))->map(function ($i) {
            $date = Carbon::now()->subMonths($i);
            $month = $date->format('Y-m');

            return [
                'month' => $month,
                'valides' => Depart::where('etat_depart', 'Validé')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),

                'assignes' => Arrive::where('etat', 'Assigné')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),
            ];
        });

        return response()->json($data->reverse()->values());
    }

    //rapport mensuel
    public function nbRapportMensuel($mois) {
        try {
            $date = Carbon::createFromFormat('Y-m', $mois);
            $moisLetre = $date->translatedFormat('F Y');
            $moisLettre = ucfirst($moisLetre);

            return response()->json([
                'month_label' => $moisLettre,
                'recu' => Arrive::whereMonth('created_at', $date->month)
                                    ->whereYear('created_at', $date->year)
                                    ->count(),

                'envoye' => Depart::where('etat_depart', 'Validé')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),
                    
                'dispatche' => Arrive::where('etat', 'Envoyé')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),

                'archiveArrive' => Arrive::where('etat', 'Archivé')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),
                'archiveDepart' => Depart::where('etat_depart', 'Archivé')
                                ->whereMonth('created_at', $date->month)
                                ->whereYear('created_at', $date->year)
                                ->count(),

            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Format invalide'], 400);
        }
    }

    //rapport annuel
    public function nbRapportAnnuel($annee) {
        $mois = [
            "01" => "Janvier", "02" => "Février", "03" => "Mars",
            "04" => "Avril", "05" => "Mai", "06" => "Juin",
            "07" => "Juillet", "08" => "Août", "09" => "Septembre",
            "10" => "Octobre", "11" => "Novembre", "12" => "Décembre",
        ];

        $resultat = [];

        foreach($mois as $num => $nom) {
            $resultat[] = [
                "mois" => $nom,

                "recu" => Arrive::whereYear("created_at", $annee)
                                ->whereMonth("created_at", $num)
                                ->count(),

                "envoye" => Depart::where("etat_depart", "Validé")
                                ->whereYear("created_at", $annee)
                                ->whereMonth("created_at", $num)
                                ->count(),

                "dispatche" => Arrive::where("etat", "Envoyé")
                                    ->whereYear("created_at", $annee)
                                    ->whereMonth("created_at", $num)
                                    ->count(),

                "archiveArrive" => Arrive::where("etat", "Archivé")
                                        ->whereYear("created_at", $annee)
                                        ->whereMonth("created_at", $num)
                                        ->count(),

                "archiveDepart" => Depart::where("etat_depart", "Archivé")
                                        ->whereYear("created_at", $annee)
                                        ->whereMonth("created_at", $num)
                                        ->count(),
            ];
        }
        return response()->json($resultat);
    }

    public function nbRapportTrimestriel($annee, $trimestre) {
        $ranges = [
            1 => ['01', '02', '03'],
            2 => ['04', '05', '06'],
            3 => ['07', '08', '09'],
            4 => ['10', '11', '12'],
        ];

        $mois = $ranges[$trimestre];

        $data = collect($mois)->map(function ($m) use ($annee) {
            $moisComplet = $annee . "-" . $m;

            return [
                "mois" => Carbon::createFromFormat("Y-m",$moisComplet)
                    ->locale('fr_FR')
                    ->monthName,
                "recu" => Arrive::whereYear("created_at", $annee)
                        ->whereMonth("created_at", $m)->count(),
                "envoye" => Depart::where("etat_depart", "Validé")->whereYear("created_at", $annee)
                        ->whereMonth("created_at", $m)->count(),
                "dispatche" => Arrive::where("etat", "Envoyé")->whereYear("created_at", $annee)
                        ->whereMonth("created_at", $m)->count(),
                "archiveArrive" => Arrive::where("etat", "Archivé")->whereYear("created_at", $annee)
                        ->whereMonth("created_at", $m)->count(),
                "archiveDepart" => Depart::where("etat_depart", "Archivé")->whereYear("created_at", $annee)
                        ->whereMonth("created_at", $m)->count(),

            ];
        });

        return response()->json($data);
    }

}
