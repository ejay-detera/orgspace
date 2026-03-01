<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_organization()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/organizations', [
            'name' => 'New Organization',
            'description' => 'A test organization',
            'type' => 'Tech Society',
            'image' => null,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('organizations', [
            'name' => 'New Organization',
            'type' => 'Tech Society',
            'created_by' => $user->id,
        ]);

        $this->assertDatabaseHas('committee', [
            'name' => 'Executive Committee',
            'is_public' => false,
        ]);

        $this->assertDatabaseHas('organization_members', [
            'user_id' => $user->id,
            'role' => 'President',
            'status' => 'active',
        ]);
    }
}
