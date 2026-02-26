<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\Semester;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::where('user_id', auth()->id())
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        $activeSemester = Semester::getActive();

        return Inertia::render('Schedule/SchedulePage', [
            'schedules' => $schedules,
            'activeSemester' => $activeSemester,
        ]);
    }

    public function store(Request $request)
    {
        $userId = auth()->id();
        
        // Get active semester
        $activeSemester = Semester::getActive();
        
        if (!$activeSemester) {
            return back()->withErrors(['errors' => ['No active semester is currently set.']]);
        }
        
        $data = $request->validate([
            'schedules' => 'required|array|min:1',
            'schedules.*.name' => 'required|string|max:200',
            'schedules.*.day' => 'nullable|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'schedules.*.specific_date' => 'nullable|date',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
            'schedules.*.professor_name' => 'nullable|string|max:150',
            'schedules.*.location' => 'nullable|string|max:100',
            'schedules.*.recurring' => 'boolean',
        ]);

        $errors = [];
        $toCreate = [];

        foreach ($data['schedules'] as $entry) {
            $isRecurring = $entry['recurring'] ?? true;
            
            // Validation:
            //1. Recurring Dates
            if ($isRecurring && empty($entry['day'])) {
                $errors[] = "Recurring schedule for '{$entry['name']}' requires a day of the week.";
                continue;
            }

            //2. One Time Schedule
            if (!$isRecurring && empty($entry['specific_date'])) {
                $errors[] = "One-time schedule for '{$entry['name']}' requires a specific date.";
                continue;
            }

            //Validate to make sure that end time must be after start time
            $timeOverlap = function($q) use ($entry) {
                $q->where('start_time', '<', $entry['end_time'])
                  ->where('end_time', '>', $entry['start_time']);
            };

            if ($isRecurring) {
                // Don't allow overlapping of time slot for recurring schedules
                $recurringOverlap = Schedule::where('user_id', $userId)
                    ->where('semester_id', $activeSemester->id)
                    ->where('day', $entry['day'])
                    ->whereNull('specific_date')
                    ->where($timeOverlap)
                    ->first();

                if ($recurringOverlap) {
                    $errors[] = "'{$entry['name']}' overlaps with the recurring class '{$recurringOverlap->name}' on {$entry['day']} ({$recurringOverlap->start_time}–{$recurringOverlap->end_time}). Recurring schedules cannot overlap.";
                    continue;
                }
            
            }

            $toCreate[] = $entry;
        }

        // Hard errors: stop everything
        if (!empty($errors)) {
            return back()->withErrors(['errors' => $errors]);
        }

        // Save all valid entries
        foreach ($toCreate as $entry) {
            $isRecurring = $entry['recurring'] ?? true;
            Schedule::create([
                'name' => $entry['name'],
                'day' => $isRecurring ? $entry['day'] : null,
                'specific_date' => !$isRecurring ? $entry['specific_date'] : null,
                'start_time' => $entry['start_time'],
                'end_time' => $entry['end_time'],
                'professor_name' => $entry['professor_name'] ?? null,
                'location' => $entry['location'] ?? null,
                'recurring' => $isRecurring,
                'semester_id' => $activeSemester->id,
                'user_id' => $userId,
            ]);
        }

        return redirect()->route('schedule.index');
    }
}