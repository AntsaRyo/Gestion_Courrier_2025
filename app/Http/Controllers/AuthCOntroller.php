<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthCOntroller extends Controller
{
    public function showSignUp() {
        if(Auth::check()){
            return view('dashboard.dashboard');
        }
        return view('authentification.register');
    }

    public function showFormLogin() {
        if(Auth::check()){
            return view('dashboard.dashboard');
        }
        return view('authentification.login');
    }

    public function login(Request $request) {
        $request->validate([
            'email'=>'required|email',
            'password'=>'required|string'
        ]);

        if(Auth::attempt($request->only('email','password' ))) {
            return view('dashboard.dashboard');
        }

        return back()->withErrors(['email'=>'Données de connexion invalides']);
    }

    public function SignUp(Request $request) {
        $request->validate([
            'Matricule' => 'required|string|unique:users,Matricule',
            'Nom' => 'required|string',
            'Prenom' => 'required|string',
            'role' => 'nullable|string|in:admin,secretaire',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|confirmed|min:8'
        ]);

        // Par défaut, un visiteur qui s'inscrit devient 'secretaire'. Seul un admin connecté peut attribuer 'admin'.
        $role = 'secretaire';
        if (Auth::check() && Auth::user()->role === 'admin' && $request->filled('role')) {
            $role = $request->input('role');
        }

        User::create([
            'Matricule' => $request->input('Matricule'),
            'Nom' => $request->input('Nom'),
            'Prenom' => $request->input('Prenom'),
            'role' => $role,
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password'))
        ]);

        return back()->with('success','Vous avez bien été inscrit');
    }

    public function logout() {
        Auth::logout();
        return redirect('/login');
    }
}
