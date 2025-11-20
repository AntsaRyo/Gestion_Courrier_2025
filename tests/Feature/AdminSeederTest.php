<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AdminSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_seeder_creates_admin_from_env_defaults()
    {
        // Run the seeder
        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\AdminUserSeeder'])->run();

        $this->assertDatabaseHas('users', [
            'email' => env('ADMIN_EMAIL', 'admin@example.test'),
            'role' => 'admin',
        ]);
    }
}
