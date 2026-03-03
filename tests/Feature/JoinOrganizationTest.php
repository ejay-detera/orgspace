<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JoinOrganizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_discover_organizations()
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create(['name' => 'Tech Club', 'status' => 'active']);

        $response = $this->actingAs($user)->get('/organizations/discover?q=Tech', ['X-Inertia' => 'true']);

        $response->assertStatus(200);
    }

    public function test_user_can_send_join_request()
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create();

        $response = $this->actingAs($user)->post("/organizations/{$organization->id}/join");

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('organization_members', [
            'user_id' => $user->id,
            'organization_id' => $organization->id,
            'role' => 'Member',
            'status' => 'pending',
        ]);
    }

    public function test_user_cannot_join_if_already_member_or_pending()
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create();

        $organization->members()->attach($user->id, ['role' => 'Member', 'status' => 'pending']);

        $response = $this->actingAs($user)->post("/organizations/{$organization->id}/join");

        $response->assertSessionHasErrors('error');
    }

    public function test_president_can_approve_request()
    {
        $president = User::factory()->create();
        $organization = Organization::factory()->create();
        $organization->members()->attach($president->id, ['role' => 'President', 'status' => 'active']);

        $applicant = User::factory()->create();
        $organization->members()->attach($applicant->id, ['role' => 'Member', 'status' => 'pending']);

        $response = $this->actingAs($president)->post("/organizations/{$organization->id}/approve/{$applicant->id}");

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('organization_members', [
            'user_id' => $applicant->id,
            'organization_id' => $organization->id,
            'status' => 'active',
        ]);
    }

    public function test_president_can_reject_request()
    {
        $president = User::factory()->create();
        $organization = Organization::factory()->create();
        $organization->members()->attach($president->id, ['role' => 'President', 'status' => 'active']);

        $applicant = User::factory()->create();
        $organization->members()->attach($applicant->id, ['role' => 'Member', 'status' => 'pending']);

        $response = $this->actingAs($president)->post("/organizations/{$organization->id}/reject/{$applicant->id}");

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('organization_members', [
            'user_id' => $applicant->id,
            'organization_id' => $organization->id,
        ]);
    }

    public function test_non_president_cannot_approve_request()
    {
        $member = User::factory()->create();
        $organization = Organization::factory()->create();
        $organization->members()->attach($member->id, ['role' => 'Member', 'status' => 'active']);

        $applicant = User::factory()->create();
        $organization->members()->attach($applicant->id, ['role' => 'Member', 'status' => 'pending']);

        $response = $this->actingAs($member)->post("/organizations/{$organization->id}/approve/{$applicant->id}");

        $response->assertStatus(403);
    }
}
