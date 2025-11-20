<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Accepts one or more roles as parameters.
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $userRole = Auth::user()->role ?? null;
        if (! $userRole || ! in_array($userRole, $roles)) {
            abort(403, 'Accès interdit');
        }

        return $next($request);
    }
}
