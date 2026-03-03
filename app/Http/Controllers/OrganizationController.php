<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Committee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $organizations = Auth::user()->organizations()->get();
        return Inertia::render('Organization/Index', [
            'organizations' => $organizations,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        return Inertia::render('Organization/Create');
    }

    /**
     * Store a newly created organization in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:organizations'],
            'description' => ['required', 'string'],
            'type' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('organizations', 'public');
        }

        return DB::transaction(function () use ($validated, $imagePath) {
            // Create Organization
            $organization = Organization::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'type' => $validated['type'],
                'status' => 'active',
                'organization_code' => Str::upper(Str::random(10)), // Generate random code
                'image' => $imagePath,
                'created_by' => Auth::id(),
            ]);

            // Create Default Committee
            Committee::create([
                'name' => 'Executive Committee',
                'description' => 'The highest governing body of the organization.',
                'is_public' => false,
                'organization_id' => $organization->id,
                'created_by' => Auth::id(),
            ]);

            // Add Creator as President
            $organization->members()->attach(Auth::id(), [
                'role' => 'President',
                'status' => 'active',
            ]);

            // Return success response
            return redirect()->route('organizations.index')->with('success', 'Organization created successfully!');
        });
    }

    /**
     * Display a page to discover/search organizations to join.
     */
    public function discover(Request $request)
    {
        $query = $request->input('q');

        $organizations = Organization::query()
            ->where('status', 'active')
            ->when($query, function ($q) use ($query) {
                $q->where('name', 'ilike', "%{$query}%")
                    ->orWhere('organization_code', 'ilike', "%{$query}%");
            })
            // Optionally, exclude orgs the user is already part of
            ->whereDoesntHave('members', function ($q) {
                $q->where('user_id', Auth::id());
            })
            ->get();

        return Inertia::render('Organization/Discover', [
            'organizations' => $organizations,
            'filters' => $request->only('q'),
        ]);
    }

    /**
     * Send a join request to an organization.
     */
    public function join(Request $request, Organization $organization)
    {
        // Validate user is not already a member or pending
        $existing = $organization->members()->where('user_id', Auth::id())->first();

        if ($existing) {
            return back()->withErrors(['error' => 'You are already a member or have a pending request.']);
        }

        $organization->members()->attach(Auth::id(), [
            'role' => 'Member',
            'status' => 'pending',
        ]);

        return back()->with('success', 'Join request sent successfully.');
    }

    /**
     * View pending join requests (President only).
     */
    public function requests(Organization $organization)
    {
        \Illuminate\Support\Facades\Gate::authorize('manageRequests', $organization);

        $pendingRequests = $organization->members()
            ->wherePivot('status', 'pending')
            ->get();

        return Inertia::render('Organization/Requests', [
            'organization' => $organization,
            'requests' => $pendingRequests,
        ]);
    }

    /**
     * Approve a pending join request.
     */
    public function approveRequest(Request $request, Organization $organization, \App\Models\User $user)
    {
        \Illuminate\Support\Facades\Gate::authorize('manageRequests', $organization);

        $organization->members()->updateExistingPivot($user->id, [
            'status' => 'active'
        ]);

        return back()->with('success', 'Join request approved.');
    }

    /**
     * Reject a pending join request.
     */
    public function rejectRequest(Request $request, Organization $organization, \App\Models\User $user)
    {
        \Illuminate\Support\Facades\Gate::authorize('manageRequests', $organization);

        $organization->members()->detach($user->id);

        return back()->with('success', 'Join request rejected.');
    }
}
