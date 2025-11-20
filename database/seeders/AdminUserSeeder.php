<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@example.test');
        $adminPassword = env('ADMIN_PASSWORD', 'password');

        if (! User::where('email', $adminEmail)->exists()) {
            User::create([
                'Matricule' => env('ADMIN_MATRICULE', 'ADM001'),
                'Nom' => env('ADMIN_NOM', 'Admin'),
                'Prenom' => env('ADMIN_PRENOM', 'Principal'),
                'email' => $adminEmail,
                'password' => bcrypt($adminPassword),
                'role' => 'admin',
            ]);
        }
    }
}
