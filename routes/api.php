<?php

use App\Http\Controllers\ArriveController;
use App\Http\Controllers\AssignationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ValidationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


use App\Mail\NotificationCourrier;
use Illuminate\Support\Facades\Mail;
use App\Models\Arrive;


Auth::routes(['verify' => 'false']);

Route::post('/register', [RegisterController::class, 'register']);
// Routes d'authentification (sans vérification CSRF)
Route::post('/login', [LoginController::class, 'login']);
// Allow logout without requiring the auth middleware so client can always call it
// (server will invalidate session if present)
Route::post('/logout', [LoginController::class, 'logout']);
Route::put('/edit/{id}',[UserController::class, 'update']);

//affichage des courriers
Route::get('/affichage', [ArriveController::class, 'index']);

//ajout des courriers
Route::post('/ajouter_arrive', [ArriveController::class, 'ajouter']);

//supprimer arrive
Route::delete('/supprimer_arrive/{NumeroArrive}', [ArriveController::class, 'supprimer']);

// modifier un courrier
Route::get('/modifier_arrive/{NumeroArrive}', [ArriveController::class, 'modifierCourrier']);
Route::post('/modification_arrive/{NumeroArrive}', [ArriveController::class, 'modification']);

/*------------------------------------------------------------------------------------------------------------------*/

//affichage des courriers depart etat=non validé
Route::get('/affichage_depart', [DepartController::class, 'index']);

//ajout des courriers depart
Route::post('/ajouter_depart', [DepartController::class, 'ajouter']);

//supprimer depart
Route::delete('/supprimer_depart/{NumeroDepart}', [DepartController::class, 'supprimer']);

// modifier un courrier depart
Route::get('/modifier_depart/{NumeroDepart}', [DepartController::class, 'modifierCourrier']);
Route::post('/modification_depart/{NumeroDepart}', [DepartController::class, 'modification']);

/*------------------------------------------------------------------------------------------------------------------*/  

//affichage des courriers en attente d'assignation
Route::get('/assignation/affichage', [AssignationController::class, 'index']);

//ajout d'un destinataire
Route::post('/assignation/ajouter_destinataire/{NumeroArrive}', [AssignationController::class, 'ajouterDestinataire']);

//ajout d'une observation
Route::post('/assignation/ajouter_observation/{NumeroArrive}', [AssignationController::class, 'ajouterObservation']);


/*------------------------------------------------------------------------------------------------------------------*/  

//affichage des courriers non validé 
Route::get('/validation/affichage', [ValidationController::class, 'index']);

//ajout d'un destinataire
Route::post('/valider/{NumeroDepart}', [ValidationController::class, 'valider']);


/*------------------------------------------------------------------------------------------------------------------*/  

//affichage des courriers depart etat=validé
Route::get('/DepartTraite', [DepartController::class, 'MontrerValide']);

//archiver arriver
Route::post('/archivageDepart/{NumeroDepart}', [ValidationController::class, 'archiverDepart']);


/*------------------------------------------------------------------------------------------------------------------*/ 

//secretaire dashboard
Route::get('/nombre_arrive', [DashboardController::class, 'totalArrive']);
Route::get('/nombre_depart', [DashboardController::class, 'totalDepart']);
Route::get('/nombre_envoye', [DashboardController::class, 'totalEnvoye']);
Route::get('/nombre_assigne', [DashboardController::class, 'totalAssigne']);
Route::get('/nombre_archive', [DashboardController::class, 'totalArchive']);
Route::get('/statistiques-mensuelles', [DashboardController::class, 'courriersParMois']);
Route::get('/rapport-mensuel/{mois}', [DashboardController::class, 'nbRapportMensuel']);
Route::get('/rapport-annuel/{annee}', [DashboardController::class, 'nbRapportAnnuel']);
Route::get('/rapport-trimestriel/{annee}/{trimestre}', [DashboardController::class, 'nbRapportTrimestriel']);

/*---------------------------------------------------------------------------------------------------------------------*/

//chef de service dashboard
Route::get('/total_assignes', [DashboardController::class, 'totalAssigne']);
Route::get('/total_valide', [DashboardController::class, 'totalDepart']);
Route::get('/statistiques-mensuelles-chef', [DashboardController::class, 'courriersParMoisChef']);

//archives arrive
Route::get('/affichageArchiveArrive', [ArriveController::class, 'archivesArrive']);
//archives depqrt
Route::get('/affichageArchiveDepart', [DepartController::class, 'archivesDepart']);


//dispatché
Route::get('/assigne', [ArriveController::class, 'voirAssignation']);
//dispatché
Route::post('/assignation/{NumeroArrive}', [ValidationController::class, 'assigneCourrier']);

/*---------------------------------------------------------------------------------------------------------------------*/

Route::get('/CourrierSuivi/{nomDivision}', [ArriveController::class, 'suiviCourrier']);
Route::post('/archiver/{NumeroArrive}', [ValidationController::class, 'archiverArrive']);