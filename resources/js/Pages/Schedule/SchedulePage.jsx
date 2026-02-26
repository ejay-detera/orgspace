import React, {useState, useMemo} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage, router } from '@inertiajs/react';
import PageTransition from '@/Components/PageTransition';
import {Check, Plus, Upload, X, Trash2, List, ChevronLeft, ChevronRight} from 'lucide-react';
import Modal from '@/Components/Modal';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel'
import {Button} from '@/Components/ui/button';
import {useDropzone} from 'react-dropzone';


export default function SchedulePage() {
    const { schedules = [], activeSemester = null, errors: pageErrors } = usePage().props;
    const [showList, setShowList] = useState(false); 
    const [showPersonal, setShowPersonal] = useState(true);
    const [showOrg, setShowOrg] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hasSchedule, setHasSched] = useState(false);
    const [errors, setErrors] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [showOverlapWarning, setShowOverlapWarning] = useState(false);
    const [overlapWarningMessages, setOverlapWarningMessages] = useState([]);
    const [pendingSavePayload, setPendingSavePayload] = useState(null);
    //const [importModalOpen, setImportModalOpen] = useState(false);
    const [addSchedModal, setAddSchedModal] = useState(false);
    const [scheduleEntry, setSchedEntry] = useState([
        { name: '', days: [], start_time: '', end_time: '', professor_name: '', location: '', recurring: true, specific_date: '' }
    ]);
    
    // Current week for calendar navigation (start with today)
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);
        return monday;
    });
    
    // year and month
    const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());

    // Show errors / warnings 
    React.useEffect(() => {
        if (pageErrors && pageErrors.errors) {
            const errorArray = Array.isArray(pageErrors.errors) ? pageErrors.errors : [pageErrors.errors];
            setErrors(errorArray);
        }
        if (pageErrors && pageErrors.overlap_warnings) {
            const warnings = Array.isArray(pageErrors.overlap_warnings)
                ? pageErrors.overlap_warnings
                : [pageErrors.overlap_warnings];
            setOverlapWarningMessages(warnings);
            setShowOverlapWarning(true);
        }
    }, [pageErrors]);

    // Format a "HH:MM" time string as "h:MM AM/PM"
    const formatTime = (t) => {
        if (!t) return '';
        const [hStr, mStr] = t.split(':');
        let h = parseInt(hStr, 10);
        const m = mStr || '00';
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
    };

    const dayMap = {
        'Mon': 'Monday',
        'Tue': 'Tuesday',
        'Wed': 'Wednesday',
        'Thu': 'Thursday',
        'Fri': 'Friday',
        'Sat': 'Saturday',
        'Sun': 'Sunday'
    };

    // Send data to the backend
    const handleAddDone = () => {
        // Reset errors
        setErrors([]);
        setValidationErrors({});

        // Validate if time overlap
        const timesOverlap = (s1, e1, s2, e2) => s1 < e2 && e1 > s2;

        // Validate all entries
        const newValidationErrors = {};
        let hasErrors = false;

        scheduleEntry.forEach((entry, index) => {
            const entryErrors = [];
            
            if (!entry.name?.trim()) {
                entryErrors.push('Subject name is required');
                hasErrors = true;
            }
            
            // Validate based on recurring vs one-time
            if (entry.recurring) {
                if (!entry.days || entry.days.length === 0) {
                    entryErrors.push('At least one day must be selected for recurring schedules');
                    hasErrors = true;
                } else {
                    // Check each selected day against existing recurring schedules
                    if (entry.start_time && entry.end_time && entry.start_time < entry.end_time) {
                        entry.days.forEach(shortDay => {
                            const fullDay = dayMap[shortDay] || shortDay;

                            // 1. Check already-saved schedules
                            const conflict = schedules.find(s =>
                                s.recurring &&
                                !s.specific_date &&
                                s.day === fullDay &&
                                timesOverlap(entry.start_time, entry.end_time, s.start_time, s.end_time)
                            );
                            if (conflict) {
                                entryErrors.push(
                                    `Overlaps with recurring class "${conflict.name}" on ${fullDay} (${conflict.start_time}–${conflict.end_time}). Recurring schedules cannot overlap.`
                                );
                                hasErrors = true;
                            }

                            // 2. Check other entries in this same batch
                            scheduleEntry.forEach((other, otherIndex) => {
                                if (otherIndex === index) return;
                                if (!other.recurring || !other.days || !other.start_time || !other.end_time) return;
                                const otherDays = other.days.map(d => dayMap[d] || d);
                                if (
                                    otherDays.includes(fullDay) &&
                                    timesOverlap(entry.start_time, entry.end_time, other.start_time, other.end_time)
                                ) {
                                    entryErrors.push(
                                        `Conflicts with entry #${otherIndex + 1} ("${other.name || 'unnamed'}") on ${fullDay}. Recurring schedules in the same batch cannot overlap.`
                                    );
                                    hasErrors = true;
                                }
                            });
                        });
                    }
                }
            } else {
                if (!entry.specific_date) {
                    entryErrors.push('Specific date is required for one-time schedules');
                    hasErrors = true;
                }
            }
            
            if (!entry.start_time) {
                entryErrors.push('Start time is required');
                hasErrors = true;
            }
            if (!entry.end_time) {
                entryErrors.push('End time is required');
                hasErrors = true;
            }
            if (entry.start_time && entry.end_time && entry.start_time >= entry.end_time) {
                entryErrors.push('End time must be after start time');
                hasErrors = true;
            }

            if (entryErrors.length > 0) {
                newValidationErrors[index] = entryErrors;
            }
        });

        if (hasErrors) {
            setValidationErrors(newValidationErrors);
            setErrors(['Please fix the errors below before submitting']);
            return;
        }

        const expanded = [];
        scheduleEntry.forEach(e => {
            if (e.recurring) {
                // Recurring: create entry for each selected day
                e.days.forEach(day => {
                    expanded.push({
                        name: e.name,
                        day: dayMap[day] || day,
                        specific_date: null,
                        start_time: e.start_time,
                        end_time: e.end_time,
                        professor_name: e.professor_name || null,
                        location: e.location || null,
                        recurring: true,
                    });
                });
            } else {
                // One time: create one entry for specific date
                expanded.push({
                    name: e.name,
                    day: null,
                    specific_date: e.specific_date,
                    start_time: e.start_time,
                    end_time: e.end_time,
                    professor_name: e.professor_name || null,
                    location: e.location || null,
                    recurring: false,
                });
            }
        });

        if (expanded.length === 0) return;

        setPendingSavePayload(expanded);
        submitSchedules(expanded, false);
    };

    const submitSchedules = (payload, forceOverride) => {
        setIsSaving(true);
        router.post('/schedule', { schedules: payload, force_override: forceOverride }, {
            onSuccess: () => {
                setHasSched(true);
                setShowSuccess(true);
                setAddSchedModal(false);
                setShowOverlapWarning(false);
                setPendingSavePayload(null);
                setSchedEntry([
                    { name: '', days: [], start_time: '', end_time: '', professor_name: '', location: '', recurring: true, specific_date: '' }
                ]);
                setErrors([]);
                setValidationErrors({});
                setIsSaving(false);
                setTimeout(() => setShowSuccess(false), 3000);
            },
            onError: () => {
                setIsSaving(false);
            }
        });
    };

    // user clicks "Save Anyway"for the overlap warning dialog
    const handleForceOverride = () => {
        if (pendingSavePayload) {
            setShowOverlapWarning(false);
            submitSchedules(pendingSavePayload, true);
        }
    };

    const calendarEvents = useMemo(() => {
        return schedules || [];
    }, [schedules]);

    //  calendar component with weekly view
    const SimpleCalendar = () => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // adjust range (min 5 AM), end at (max 9 PM)
        const MIN_HOUR = 5;
        const MAX_HOUR = 21;
        const startHour = calendarEvents.reduce((min, e) => {
            if (!e.start_time) return min;
            const h = parseInt(e.start_time.split(':')[0], 10);
            return h < min ? h : min;
        }, 8);
        const endHour = calendarEvents.reduce((max, e) => {
            if (!e.end_time) return max;
            const h = parseInt(e.end_time.split(':')[0], 10);
            return h > max ? h : max;
        }, 18);
        const clampedStart = Math.max(MIN_HOUR, Math.min(startHour, 8));
        const clampedEnd = Math.min(MAX_HOUR, Math.max(endHour, 18));
        const timeSlots = Array.from({ length: clampedEnd - clampedStart + 1 }, (_, i) =>
            `${String(clampedStart + i).padStart(2, '0')}:00`
        );
        
        // Get dates for the current week
        const getWeekDates = () => {
            const dates = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(currentWeekStart);
                date.setDate(currentWeekStart.getDate() + i);
                dates.push(date);
            }
            return dates;
        };
        
        const weekDates = getWeekDates();
        
        // Navigate weeks
        const goToPreviousWeek = () => {
            const newStart = new Date(currentWeekStart);
            newStart.setDate(currentWeekStart.getDate() - 7);
            setCurrentWeekStart(newStart);
            setSelectedYear(newStart.getFullYear());
            setSelectedMonth(newStart.getMonth());
        };
        
        const goToNextWeek = () => {
            const newStart = new Date(currentWeekStart);
            newStart.setDate(currentWeekStart.getDate() + 7);
            setCurrentWeekStart(newStart);
            setSelectedYear(newStart.getFullYear());
            setSelectedMonth(newStart.getMonth());
        };
        
        const goToToday = () => {
            const today = new Date();
            const day = today.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            const monday = new Date(today);
            monday.setDate(today.getDate() + diff);
            setCurrentWeekStart(monday);
            setSelectedYear(monday.getFullYear());
            setSelectedMonth(monday.getMonth());
        };
        
        // Format date 
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        // Color palette for diff schedule entries
        const colorPalette = [
            { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', textLight: 'text-blue-600' },
            { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', textLight: 'text-green-600' },
            { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', textLight: 'text-purple-600' },
            { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800', textLight: 'text-orange-600' },
            { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', textLight: 'text-red-600' },
            { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-800', textLight: 'text-teal-600' },
            { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-800', textLight: 'text-indigo-600' },
            { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800', textLight: 'text-pink-600' },
            { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800', textLight: 'text-yellow-600' },
            { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-800', textLight: 'text-cyan-600' }
        ];
        
        // color for subject
        const getSubjectColor = (subject) => {
            // hashed subj name for diff colors
            let hash = 0;
            for (let i = 0; i < subject.length; i++) {
                hash = ((hash << 5) - hash) + subject.charCodeAt(i);
                hash = hash & hash; // convert to 32 bit int
            }
            return colorPalette[Math.abs(hash) % colorPalette.length];
        };
        
        // Get events for a specific date and time
        const getEventsForDateAndTime = (date, time) => {
            const dateStr = formatDate(date);
            const dayOfWeek = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Monday start
            
            return calendarEvents.filter(event => {
                if (!event.start_time || !event.end_time) return false;

                const timeToMinutes = (t) => {
                    const [h, m] = t.split(':').map(Number);
                    return h * 60 + m;
                };
                const current = timeToMinutes(time);
                const inTimeRange = current >= timeToMinutes(event.start_time) && current < timeToMinutes(event.end_time);
                
                if (!inTimeRange) return false;
                
                // Check if it's a recurring schedule matching the day
                if (event.day && event.day === dayOfWeek && !event.specific_date) {
                    // For recurring schedules check if date is within semester range
                    if (activeSemester) {
                        const semesterStart = new Date(activeSemester.start_date);
                        const semesterEnd = new Date(activeSemester.end_date);
                        const currentDate = new Date(date);
                        
                        // Only show recurring schedule if date is within semester range
                        if (currentDate < semesterStart || currentDate > semesterEnd) {
                            return false;
                        }
                    }
                    return true;
                }
                
                // Check if it's a one-time schedule matching the specific date
                if (event.specific_date && event.specific_date === dateStr) {
                    return true;
                }
                
                return false;
            });
        };
        
        return (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Week navigation with year/month selector */}
                <div className="flex flex-col gap-3 p-4 bg-gray-50 border-b border-gray-200">
                    {/* Year and Month Selector */}
                    <div className="flex items-center justify-center gap-6">
                        {/* Year Dropdown */}
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            Year:
                            <select
                                value={selectedYear}
                                onChange={(e) => {
                                    const newYear = parseInt(e.target.value);
                                    setSelectedYear(newYear);
                                    const newDate = new Date(currentWeekStart);
                                    newDate.setFullYear(newYear);
                                    setCurrentWeekStart(newDate);
                                }}
                                className="px-3 py-1.5 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30"
                            >
                                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </label>
                        {/* Month Dropdown */}
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            Month:
                            <select
                                value={selectedMonth}
                                onChange={(e) => {
                                    const newMonth = parseInt(e.target.value);
                                    setSelectedMonth(newMonth);
                                    const newDate = new Date(selectedYear, newMonth, 1);
                                    const day = newDate.getDay();
                                    const diff = day === 0 ? -6 : 1 - day;
                                    newDate.setDate(1 + diff);
                                    setCurrentWeekStart(newDate);
                                }}
                                className="px-3 py-1.5 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30"
                            >
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                                    <option key={idx} value={idx}>{month}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    
                    {/* Week navigation */}
                    <div className="flex items-center justify-between">
                        <button onClick={goToPreviousWeek} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                            <ChevronLeft className="h-5 w-5 text-gray-700" />
                        </button>
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </h3>
                            <button onClick={goToToday} className="text-sm text-[#04095d] hover:underline mt-1">
                                Today
                            </button>
                        </div>
                        <button onClick={goToNextWeek} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                            <ChevronRight className="h-5 w-5 text-gray-700" />
                        </button>
                    </div>
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-8 bg-gray-50">
                    <div className="p-3 font-medium text-gray-700 border-r border-gray-200">Time</div>
                    {weekDates.map((date, idx) => (
                        <div key={idx} className="p-3 font-medium text-gray-700 text-center border-r border-gray-200 last:border-r-0">
                            <div>{days[idx].slice(0, 3)}</div>
                            <div className="text-xs font-normal text-gray-500 mt-1">
                                {date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                            </div>
                        </div>
                    ))}
                </div>
                
                {timeSlots.map(time => (
                    <div key={time} className="grid grid-cols-8 border-t border-gray-200">
                        <div className="p-3 text-sm text-gray-600 border-r border-gray-200 bg-gray-50">
                            {time}
                        </div>
                        {weekDates.map((date, idx) => {
                            const events = getEventsForDateAndTime(date, time);
                            const dayOfWeek = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
                            return (
                                <div 
                                    key={idx} 
                                    className="p-1 border-r border-gray-200 last:border-r-0 min-h-[60px] cursor-pointer hover:bg-blue-50 transition-colors relative group"
                                    onClick={() => handleCellClick(date, time, dayOfWeek)}
                                    title="Click to add schedule"
                                >
                                    {events.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus className="h-4 w-4 text-gray-400" />
                                        </div>
                                    )}
                                    {events.map((event, eventIdx) => {
                                        const colors = getSubjectColor(event.name);
                                        return (
                                            <div key={eventIdx} className={`${colors.bg} border ${colors.border} rounded p-1 mb-1 text-xs`}>
                                                <div className={`font-medium ${colors.text} truncate`}>
                                                    {event.name}
                                                    {!event.recurring && <span className="ml-1 text-[10px]">📍</span>}
                                                </div>
                                                {event.location && <div className={`${colors.textLight} truncate`}>{event.location}</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    // Handle clicking on a calendar cell
    const handleCellClick = (date, time, dayOfWeek) => {
        const formatDate = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        // Calculate end time (1 hour after start)
        const [hours, minutes] = time.split(':').map(Number);
        const endHours = (hours + 1) % 24;
        const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        // Map full day name to short name for days
        const dayShortMap = {
            'Monday': 'Mon',
            'Tuesday': 'Tue',
            'Wednesday': 'Wed',
            'Thursday': 'Thu',
            'Friday': 'Fri',
            'Saturday': 'Sat',
            'Sunday': 'Sun'
        };
        
        // Prefill the form with clicked date or time
        setSchedEntry([{
            name: '',
            days: [dayShortMap[dayOfWeek]],
            start_time: time,
            end_time: endTime,
            professor_name: '',
            location: '',
            recurring: false, // Default to one-time for clicked cells
            specific_date: formatDate(date)
        }]);
        
        // Clear any errors
        setErrors([]);
        setValidationErrors({});
        
        // Open the modal
        setAddSchedModal(true);
    };
    
    //Adding schedule
    const addEntry = () => {
        setSchedEntry([...scheduleEntry, { name: '', days: [], start_time: '', end_time: '', professor_name: '', location: '', recurring: true, specific_date: '' }]);
        // Clear validation errors when adding new entry
        setValidationErrors({});
    };

    const updateEntry = (index, field, value) => {
        const newEntry = [...scheduleEntry];
        newEntry[index][field] = value;
        setSchedEntry(newEntry);

        // Clear validation errors for this entry if the user edit it
        setValidationErrors(prev => {
            if (!prev[index]) return prev;
            const next = { ...prev };
            delete next[index];
            //  clear the top-level banner if no entries have errors left
            if (Object.keys(next).length === 0) setErrors([]);
            return next;
        });
    };

    //drag and drop files
    /*
    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        accept: {
            'text/csv' : ['.csv'],
            'application/pdf' : ['.pdf'],
            'text/calendar' : ['.ics'],
        },
        maxFiles: 1,
        onDrop: (files) =>{
            console.log('Dropped Files: ', files);
        },
    });
    */

    const hasOverlap = (currentEntry, currentIndex) => {
        return scheduleEntry.some((other, idx) => {
            if (idx === currentIndex) return false;
            if (!currentEntry.start_time || !currentEntry.end_time || !other.start_time || !other.end_time) return false;
            const sharedDay = currentEntry.days?.some(d => other.days?.includes(d));
            return sharedDay && currentEntry.start_time < other.end_time && currentEntry.end_time > other.start_time;
        });
    };

    const removeEntry = (indexToRemove) => {
        if (scheduleEntry.length === 1) {
            setSchedEntry([{ name: '', days: [], start_time: '', end_time: '', professor_name: '', location: '', recurring: true, specific_date: '' }]);
            return;
        }
        setSchedEntry(scheduleEntry.filter((_, idx) => idx !== indexToRemove));
    };

    const handleCloseModal = () => {
        setAddSchedModal(false);
        // Reset form and errors
        setSchedEntry([{ name: '', days: [], start_time: '', end_time: '', professor_name: '', location: '', recurring: true, specific_date: '' }]);
        setErrors([]);
        setValidationErrors({});
    };

    return (
        <PageTransition>
            <AuthenticatedLayout>
                <div className="flex-1 p-6 md:p-8">
                        <div className="flex-1 p-6 md:p-8">
                        <div className="max-w-6xl mx-auto relative">

                            {/* Success message */}
                            {showSuccess && (
                                <div className="fixed top-20 right-6 z-50 bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-5 w-5" />
                                        <span className="font-medium">Schedule successfully added!</span>
                                    </div>
                                </div>
                            )}

                            {/* View toggle button */}
                            <button onClick={() => setShowList(!showList)}
                                className="absolute -top-20 right-2 z-10 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 transition-colors"
                                title={showList ? "Switch to Calendar View" : "Switch to List View"}
                            >
                                <List className="h-5 w-5 text-[#04095d]" />
                                <span className="text-sm font-medium text-gray-700">{showList ? "Calendar View" : "List View"}</span>
                            </button>

                            {/* Calendar     !showList */}
                            {!showList && (
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-bold text-[#04095d]">Calendar</h2>
                                            {activeSemester && (
                                                <div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {activeSemester.name} • {new Date(activeSemester.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(activeSemester.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 italic">
                                                        Recurring schedules will only appear within the semester dates
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Personal / Org */}
                                        <div className="flex gap-6">
                                            <label>
                                                <Checkbox label="Personal" checked={showPersonal} onChange={(e) => setShowPersonal(e.target.checked)} className="h-5 w-5"/>
                                                <span className="text-sm font-md text-gray-800 pl-2">Personal</span>
                                            </label>
                                            <label>
                                                <Checkbox label="Personal" checked={showOrg} onChange={(e) => setShowOrg(e.target.checked)} className="h-5 w-5"/>
                                                <span className="text-sm font-md text-gray-800 pl-2">Organization</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Calendar */}
                                    <div className="p-6">
                                        {showPersonal || showOrg ? (
                                            <div>
                                                {showPersonal && <SimpleCalendar />}{!showPersonal && showOrg && (
                                                    <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg"> Coming Soon</div>
                                                )}
                                            </div>
                                        ) : ( 
                                            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg"> Select at least one view (Personal or Organization) to display the calendar</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* List view   showList === true */}
                            {showList && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-xl font-bold text-[#04095d] mb-4">Schedule List</h2>

                                    {schedules && schedules.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Schedule </th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Subject </th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Room/Location </th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Instructor </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {schedules
                                                        .sort((a, b) => {
                                                            const dayOrder = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 };
                                                            if (a.day !== b.day) return (dayOrder[a.day] ?? 7) - (dayOrder[b.day] ?? 7);
                                                            return a.start_time.localeCompare(b.start_time);
                                                        })
                                                        .map((entry, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {entry.specific_date
                                                                    ? new Date(entry.specific_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                                    : entry.day
                                                                }{(entry.specific_date || entry.day) ? ' • ' : ''}
                                                                {entry.start_time && entry.end_time
                                                                    ? `${formatTime(entry.start_time)} – ${formatTime(entry.end_time)}`
                                                                    : <span className="text-gray-400 italic">—</span>}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {entry.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {entry.location || <span className="text-gray-400 italic">—</span>}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {entry.professor_name || <span className="text-gray-400 italic">—</span>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : ( //defailt display
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-b from-[#04095d] to-black bg-clip-text text-transparent"> Share Your Schedule</h1>
                                            <p className="text-lg text-gray-400 mb-8">Add your class schedule so org heads can plan activities around your availability</p>
                                            <ul className="space-y-4 mb-10 text-gray-400">
                                                <li className="flex items-center">
                                                    <Check className="mr-3 h-6 w-6 text-green-400" />Plan meetings when you're free
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="mr-3 h-6 w-6 text-green-400" />Assign tasks at convenient time
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="mr-3 h-6 w-6 text-green-400" />Coordinate organization events better
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    <div className="fixed bottom-16 right-6 flex flex-col gap-4 z-50">
                        <Button
                            className="bg-[#04095d] hover:bg-indigo-900 shadow-lg rounded-full text-white px-6 py-5 min-w-[180px] justify-center"
                            onClick={() => setAddSchedModal(true)}
                        >
                            <Plus className="mr-2 h-5 w-5" />Add Schedule
                        </Button>

                        {/*<Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 border-gray-600 rounded-full text-white px-6 py-5 min-w-[180px] justify-center shadow-lg"
                            onClick={() => setImportModalOpen(true)}
                        >
                            <Upload className="mr-2 h-5 w-5" /> Import File
                        </Button>*/}
                    </div>
                </div>
            </div>
                
                {/* Adding schedule manually */}
                <Modal show={addSchedModal} onClose={handleCloseModal} maxWidth="2xl">
                    <div className="flex flex-col max-h-[85vh]">
                        <div className="sticky top-0 z-10 bg-white px-6 md:px-8 pt-6 pb-4 border-b border-gray-200">
                            <button onClick={handleCloseModal} className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 transition-colors z-20 pr-3">
                                <X className="h-7 w-7" />
                            </button>

                        <div className="flex items-center justify-between mt-10 ">
                                <h2 className="text-3xl md:text-4xl font-bold text-[#04095d]"> Add Schedule </h2>
                                <Button size="icon"  className="bg-[#04095d] hover:bg-indigo-800 text-white rounded-full shadow-sm flex-shrink-0"  onClick={addEntry}>
                                    <Plus className="h-7 w-7" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">

                            {/* General Error Messages */}
                            {errors.length > 0 && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-red-800 mb-1">Error</h4>
                                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                                {errors.map((error, idx) => (
                                                    <li key={idx}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button onClick={() => setErrors([])} className="text-red-500 hover:text-red-700">
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Form rows */}
                            {scheduleEntry.map((entry, index) => (
                                <div key={index} className="relative mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
                                >
                                    {/* Remove entry btn*/}
                                    {scheduleEntry.length > 1 && (
                                        <button  onClick={() => removeEntry(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors z-10"
                                            title="Remove this entry"
                                        > <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}

                                    {/* Subject Name */}
                                    <div className="mb-5">
                                        <InputLabel name="name" value="Subject Name" className="text-sm font-medium text-gray-700 mb-1.5" />
                                        <input type="text" value={entry.name} onChange={(e) => updateEntry(index, 'name', e.target.value)} placeholder="e.g. Data Structures and Algorithms"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30 ${validationErrors[index]?.some(e => e.includes('Subject name')) ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    </div>


                                    <div className="mb-5">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={entry.recurring ?? true}
                                                onChange={(e) => {
                                                    updateEntry(index, 'recurring', e.target.checked);
                                                    // Clear days or date when switching between recurring and non
                                                    if (e.target.checked) {
                                                        updateEntry(index, 'specific_date', '');
                                                    } else {
                                                        updateEntry(index, 'days', []);
                                                    }
                                                }}
                                                className="h-5 w-5 text-[#04095d] border-gray-300 rounded focus:ring-[#04095d]"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Recurring Schedule</span>
                                        </label>
                                        <p className="text-xs text-gray-500 ml-8 mt-1">
                                            {entry.recurring ? 'This schedule will repeat every week' : 'This is a one-time schedule for a specific date'}
                                        </p>
                                    </div>

                                    {/* Day(s) of Week - visible only for recurring */}
                                    {entry.recurring ? (
                                        <div className="mb-5">
                                            <InputLabel value="Day(s) of Week" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                                    <label key={day} className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox"
                                                            checked={entry.days?.includes(day) || false}
                                                            onChange={(e) => {
                                                                const newDays = e.target.checked
                                                                    ? [...(entry.days || []), day]
                                                                    : (entry.days || []).filter(d => d !== day);
                                                                updateEntry(index, 'days', newDays);
                                                            }}
                                                            className="h-5 w-5 text-[#04095d] border-gray-300 rounded focus:ring-[#04095d]"
                                                        />
                                                        <span className="text-sm text-gray-700">{day}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {entry.days?.length > 0 && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Will recur every {entry.days.map((d, i) => 
                                                        i === entry.days.length - 1 && entry.days.length > 1 
                                                            ? `and ${d}` 
                                                            : i === entry.days.length - 2 && entry.days.length > 2
                                                                ? `${d} `
                                                                : `${d}${i < entry.days.length - 1 && entry.days.length > 2 ? ', ' : entry.days.length === 2 && i === 0 ? ' ' : ''}`
                                                    ).join('')}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        /* Specific Date - shown only for one-time */
                                        <div className="mb-5">
                                            <InputLabel value="Specific Date" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <input 
                                                type="date" 
                                                value={entry.specific_date || ''}
                                                onChange={(e) => updateEntry(index, 'specific_date', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30 ${validationErrors[index]?.some(e => e.includes('Specific date')) ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        </div>
                                    )}

                                    {/* Start and end time*/}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                                        <div>
                                            <InputLabel value="Start Time" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <input name="start_time" type="time" value={entry.start_time || ''}  onChange={(e) => updateEntry(index, 'start_time', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30 ${validationErrors[index]?.some(e => e.includes('Start time') || e.includes('End time must be after')) ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="End Time" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <input name="end_time" type="time" value={entry.end_time || ''} onChange={(e) => updateEntry(index, 'end_time', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30 ${validationErrors[index]?.some(e => e.includes('End time')) ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Time validation error banner */}
                                    {entry.start_time && entry.end_time && entry.start_time >= entry.end_time && (
                                        <div className="mb-5 p-3 bg-red-50 border border-red-300 rounded-lg flex items-center gap-2">
                                            <X className="h-4 w-4 text-red-600" />
                                            <p className="text-sm text-red-800 font-medium">End time must be after start time</p>
                                        </div>
                                    )}

                                    {/* Room & Professor (optional) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                                        <div>
                                            <InputLabel value="Room / Location (optional)" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <input name="location" type="text" value={entry.location || ''} onChange={(e) => updateEntry(index, 'location', e.target.value)} placeholder="e.g. Room 101, Academic Building"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Professor Name (optional)" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <input name="professor_name" type="text" value={entry.professor_name || ''}  onChange={(e) => updateEntry(index, 'professor_name', e.target.value)} placeholder="Prof."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30"
                                            />
                                        </div>
                                    </div>

                                    {/* Validation errors for this entry */}
                                    {validationErrors[index] && validationErrors[index].length > 0 && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                                {validationErrors[index].map((error, errIdx) => (
                                                    <li key={errIdx}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="sticky bottom-0 left-0 right-0 bg-white pt-6 pb-4 border-t border-gray-200 px-6 md:px-8">
                                <div className="flex justify-between items-center">
                                <Button variant="outline" className="text-gray-600 hover:bg-gray-100"
                                    onClick={handleCloseModal}
                                > Cancel
                                </Button>

                                <div className="flex items-center gap-4">
                                    {isSaving && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg> Saving...
                                        </div>
                                    )}

                                    <Button className="bg-[#04095d] hover:bg-indigo-800 text-white px-10 py-6 rounded-full shadow-md disabled:opacity-50"
                                        disabled={isSaving} onClick={handleAddDone}
                                    > {isSaving ? 'Saving...' : 'Done'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* Overlap Warning Dialog */}
                <Modal show={showOverlapWarning} onClose={() => setShowOverlapWarning(false)} maxWidth="md">
                    <div className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center">
                                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Schedule Conflict Warning</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Your one-time schedule overlaps with a recurring class.</p>
                            </div>
                        </div>

    
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                className="text-gray-600 hover:bg-gray-100"
                                onClick={() => setShowOverlapWarning(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                                onClick={handleForceOverride}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Anyway'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </AuthenticatedLayout>
        </PageTransition>
    );
}