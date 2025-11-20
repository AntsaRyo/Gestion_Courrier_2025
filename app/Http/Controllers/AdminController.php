<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Arrive;
use App\Models\Depart;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $users = User::count();
        $arrives = Arrive::count();
        $departs = Depart::count();

        return view('admin.dashboard', compact('users', 'arrives', 'departs'));
    }

    public function users()
    {
        $users = User::all();
        return view('admin.users.index', compact('users'));
    }

    public function editUser($id)
    {
        $user = User::findOrFail($id);
        return view('admin.users.edit', compact('user'));
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:user,admin'
        ]);

        $user->update($request->all());
        
        return redirect()->route('admin.users')->with('success', 'Utilisateur mis à jour avec succès');
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        return redirect()->route('admin.users')->with('success', 'Utilisateur supprimé avec succès');
    }
}