<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_register_and_get_default_role_secretaire()
    {
        $response = $this->post(route('registration.register'), [
            'Matricule' => 'U123',
            'Nom' => 'Dupont',
            'Prenom' => 'Jean',
            'email' => 'jean@example.test',
            'password' => 'password',
            'password_confirmation' => 'password',
            // role omitted on purpose
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('users', [
            'email' => 'jean@example.test',
            'role' => 'secretaire',
        ]);
    }
}
