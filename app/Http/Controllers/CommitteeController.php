<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\Committee;
use App\Models\CommitteePermission;
use App\Services\CommitteeService;
use Inertia\Inertia;


class CommitteeController extends Controller
{
    public function show(Committee $committee)
    {
        return Inertia::render('Committees/Show', ['committee' => $committee]);
    }


    public function create(Organization $organization)
    {
        if ($organization->created_by !== auth()->id()) abort(403);

        return Inertia::render('Committees/Form', [
            'organization' => $organization,
            'availablePermissions' => CommitteeService::getAvailablePermissions(),
            'committee' => null,
            'assignedPermissions' => [],
        ]);
    }


    public function store(Request $request, Organization $organization)
    {
        if ($organization->created_by !== auth()->id()) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $committee = Committee::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'is_public' => $validated['is_public'] ?? false,
            'organization_id' => $organization->id,
            'created_by' => auth()->id(),
        ]);

        CommitteeService::syncPermissions($committee, $validated['permissions'] ?? []);

        return redirect()->route('organizations.show', $organization->id) // this should redirect to organizations home
            ->with('success', 'Committee created with permissions!');
    }


    public function edit(Committee $committee)
    {
        if ($committee->created_by !== auth()->id()) abort(403);

        $availablePermissions = CommitteeService::getAvailablePermissions();
        $assignedPermissions = $committee->permissions()->pluck('name')->toArray();

        return Inertia::render('Committees/Form', [
            'organization' => $committee->organization,
            'committee' => $committee,
            'availablePermissions' => $availablePermissions,
            'assignedPermissions' => $assignedPermissions,
        ]);
    }


    public function update(Request $request, Committee $committee)
    {
        if ($committee->created_by !== auth()->id()) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $committee->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'is_public' => $validated['is_public'] ?? false,
        ]);

        CommitteeService::syncPermissions($committee, $validated['permissions'] ?? []);

        return redirect()->route('organizations.show', $committee->organization_id)
            ->with('success', 'Committee updated successfully!');
    }


    public function destroy(Committee $committee)
    {
        if ($committee->created_by !== auth()->id()) abort(403);

        CommitteePermission::where('committee_id', $committee->id)->delete();

        $committee->delete();

        return redirect()->route('organizations.show', $committee->organization_id)
            ->with('success', 'Committee deleted successfully!');
    }
}
