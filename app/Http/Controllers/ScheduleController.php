<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function add()
    {
        return Inertia::render('Schedule/SchedulePage');
    }
}