<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;

class OrganizationPolicy
{
    /**
     * Determine whether the user can manage join requests for the organization.
     */
    public function manageRequests(User $user, Organization $organization): bool
    {
        $member = $organization->members()->where('user_id', $user->id)->first();

        return $member && $member->pivot->role === 'President' && $member->pivot->status === 'active';
    }
}
