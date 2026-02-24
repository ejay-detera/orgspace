<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;
use App\Models\AnnouncementAttachment;
use App\Models\AnnouncementUser;
use App\Models\Committee;
use App\Mail\CriticalAnnouncementMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    //Load committee, organization, and permissions
    public function index()
    {
        $user = Auth::user()->load('committee.organization', 'permissionUser');
        $organizationId = $user->committee?->organization_id;
        $userCommitteeId = $user->committee_id;
        $userId = $user->id;

        if (!$organizationId) {
            return inertia('Announcements/AnnouncementPage', [
                'announcements'         => [],
                'canCreateAnnouncement' => false,
            ]);
        }

        $canCreate = $user->permissionUser?->create_announcement ?? false;

        // Visibility rules:
        // There is a table called announcement_user for custom member list

        //  1. All Members  — committee_id IS NULL and no rows in announcement_user
        //  2. Committee    — committee_id matches the user's committee
        //  3. Custom list  — user has a row in announcement_user
        $announcements = Announcement::with(['creator', 'committee', 'attachments'])
            ->where('organization_id', $organizationId)
            ->where(function ($q) use ($userId, $userCommitteeId) {
                $q->where(function ($allMembers) {
                        // All Members: no committee target and no custom list
                        $allMembers->whereNull('committee_id')
                                   ->whereDoesntHave('customUsers');
                    })
                  ->orWhere('committee_id', $userCommitteeId) // for committee only
                  ->orWhereHas('customUsers', function ($sub) use ($userId) {
                        $sub->where('users.id', $userId); // user is in custom list
                    })
                  ->orWhere('created_by', $userId); // president always sees their own announcements
            })
            ->orderBy('created_at', 'desc') // chronological order or newest first
            ->get()
            ->map(function ($ann) {
                // Show the full name of the creator of the announcement
                $ann->creator_name = $ann->creator?->name ?? 'Unknown';
                return $ann;
            });

        return inertia('Announcements/AnnouncementPage', [
            'announcements'         => $announcements,
            'canCreateAnnouncement' => $canCreate,
        ]);
    }

    
    //creating announcement
    public function create()
    {
        $user = Auth::user()->load('committee', 'permissionUser');

        //fallback
        if (!($user->permissionUser?->create_announcement ?? false)) {
            abort(403, 'You do not have permission to create announcements.');
        }

        $organizationId = $user->committee?->organization_id;

        // Committees with their members (for the custom member list picker)
        $committees = Committee::with(['users' => function ($q) {
            $q->select('id', 'first_name', 'middle_name', 'last_name', 'committee_id');
        }])
        ->where('organization_id', $organizationId)
        ->select('id', 'name')
        ->get()
        ->map(function ($committee) {
            // Add full name to each member
            $committee->users->each(function ($u) {
                $u->full_name = trim(implode(' ', array_filter([
                    $u->first_name, $u->middle_name, $u->last_name,
                ])));
            });
            return $committee;
        });

        return inertia('Announcements/CreateAnnouncement', [
            'committees' => $committees,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user()->load('committee', 'permissionUser');

        if (!($user->permissionUser?->create_announcement ?? false)) {
            abort(403, 'You do not have permission to create announcements.');
        }

        $organizationId = $user->committee?->organization_id;

        if (!$organizationId) {
            return back()->withErrors(['error' => 'You are not part of any organization.']);
        }

        $request->validate([
            'title'          => 'required|string|max:200',
            'content'        => 'required|string',
            'type'           => 'required|string|in:Low,Normal,High,Critical',
            'committee_id'   => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!in_array($value, ['all', 'custom']) && !Committee::find($value)) {
                        $fail('The selected committee is invalid.');
                    }
                },
            ],
            'custom_user_ids'   => 'required_if:committee_id,custom|array',
            'custom_user_ids.*' => 'integer|exists:users,id',
            'files.*'           => 'file|max:10240',
        ]);

        // Determine committee_id to store
        $committeeId = in_array($request->committee_id, ['all', 'custom'])
            ? null
            : (int) $request->committee_id;

        $announcement = Announcement::create([
            'title'           => $request->title,
            'content'         => $request->content,
            'type'            => $request->type,
            'committee_id'    => $committeeId,
            'created_by'      => Auth::id(),
            'organization_id' => $organizationId,
        ]);

        // Custom member list 
        if ($request->committee_id === 'custom' && !empty($request->custom_user_ids)) {
            $rows = array_map(fn($uid) => [
                'user_id'         => $uid,
                'announcement_id' => $announcement->id,
            ], $request->custom_user_ids);

            AnnouncementUser::insert($rows);
        }

        // File uploads 
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('announcements/' . $announcement->id, 'public');

                AnnouncementAttachment::create([
                    'filename'        => $file->getClientOriginalName(),
                    'file_url'        => Storage::url($path),
                    'created_by'      => Auth::id(),
                    'announcement_id' => $announcement->id,
                ]);
            }
        }

        // Critical email notifications 
        if ($announcement->type === 'Critical') {
            $announcement->load('creator');

            // Show members who will get the email
            if ($request->committee_id === 'all') {
                // All org members
                $recipients = \App\Models\User::whereHas('committee', function ($q) use ($organizationId) {
                    $q->where('organization_id', $organizationId);
                })->pluck('email');
            } elseif ($request->committee_id === 'custom') {
                $recipients = \App\Models\User::whereIn('id', $request->custom_user_ids ?? [])
                    ->pluck('email');
            } else {
                // Specific committee members
                $recipients = \App\Models\User::where('committee_id', $committeeId)
                    ->pluck('email');
            }

            foreach ($recipients as $email) {
                Mail::to($email)->send(new CriticalAnnouncementMail($announcement));
            }
        }

        return redirect()->route('announcements.index')
            ->with('success', 'Announcement created successfully!');
    }
}
