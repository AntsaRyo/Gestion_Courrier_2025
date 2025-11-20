<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        $request->validate([
            'Nom' => 'required|string|max:255',
            'Prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'Matricule' => 'required|string|max:255',
            'password' => 'nullable|min(8)',
        ]);

        $user->Nom = $request->Nom;
        $user->Prenom = $request->Prenom;
        $user->email = $request->email;
        $user->Matricule = $request->Matricule;

        if ($request->password) {
            $user->password = bcrypt($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Profil modifié avec succès',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
