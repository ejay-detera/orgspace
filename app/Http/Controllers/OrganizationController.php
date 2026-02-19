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
            'image' => ['nullable', 'string'], // Assuming URL or path string for now
        ]);

        return DB::transaction(function () use ($validated) {
            // Create Organization
            $organization = Organization::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'type' => $validated['type'],
                'status' => 'active',
                'organization_code' => Str::upper(Str::random(10)), // Generate random code
                'image' => $validated['image'] ?? null,
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
            // In a real Inertia app, we might redirect to the new org page
            return redirect()->back()->with('success', 'Organization created successfully!');
        });
    }
}
