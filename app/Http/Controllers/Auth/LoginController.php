<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
#use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => Auth::user()
        ])->cookie('X-XSRF-TOKEN', csrf_token(), 60);
    }

    public function logout(Request $request)
    {
        // Only attempt to logout / invalidate session if present
        try {
            if (Auth::check()) {
                Auth::logout();
            }

            if (method_exists($request, 'hasSession') && $request->hasSession()) {
                $request->session()->invalidate();
                // Regenerate CSRF token
                $request->session()->regenerateToken();
            }
    } catch (\Exception $e) {
            // swallow exceptions during logout to ensure client can always clear local state
        }

        return response()->json(['message' => 'Déconnexion réussie']);
    } 

    //use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // Allow guests to access login/register; logout kept public so client can always call it
        $this->middleware('guest')->except('logout');
    }
}
