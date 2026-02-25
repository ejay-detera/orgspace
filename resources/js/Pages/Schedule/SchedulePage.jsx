import React, {useState, useMemo} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage } from '@inertiajs/react';
import PageTransition from '@/Components/PageTransition';
import {Check, Plus, Upload, X, Trash2, List} from 'lucide-react';
import Modal from '@/Components/Modal';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel'
import {Button} from '@/Components/ui/button';
import {useDropzone} from 'react-dropzone';



export default function SchedulePage() {
    const [showList, setShowList] = useState(false); 
    const [showPersonal, setShowPersonal] = useState(true);
    const [showOrg, setShowOrg] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hasSchedule, setHasSched] = useState(false);
    //const [importModalOpen, setImportModalOpen] = useState(false);
    const [addSchedModal, setAddSchedModal] = useState(false);
    const [scheduleEntry, setSchedEntry] = useState([
        {day:'', time:'', subject:'', instructor:'', startTime: '', endTime: '', days: [], room: ''}
    ]);

    // Convert schedule entries to calendar events for display
    const calendarEvents = useMemo(() => {
        const validEntries = scheduleEntry.filter(entry => 
            entry.subject?.trim() && entry.startTime && entry.endTime && entry.days?.length > 0
        );
        
        return validEntries;
    }, [scheduleEntry]);

    //  calendar component
    const SimpleCalendar = () => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const timeSlots = [
            '08:00', '09:00', '10:00', '11:00', '12:00', 
            '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ];
        
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
        
        // Debug: Log calendar events
        console.log('Calendar events:', calendarEvents);
        
        const getEventsForDayAndTime = (day, time) => {
            const events = calendarEvents.filter(event => {
                const dayMap = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
                const eventDays = event.days.map(d => dayMap[d]);
                const startTime = event.startTime;
                const endTime = event.endTime;
                
                // Check if this day matches
                const dayMatches = eventDays.includes(day);
                
                // More flexible time comparison
                if (dayMatches && startTime && endTime) {
                    // Convert time to minutes for easier comparison
                    const timeToMinutes = (timeStr) => {
                        const [hours, minutes] = timeStr.split(':').map(Number);
                        return hours * 60 + minutes;
                    };
                    
                    const currentMinutes = timeToMinutes(time);
                    const startMinutes = timeToMinutes(startTime);
                    const endMinutes = timeToMinutes(endTime);
                    // Event should span this time slot
                    const timeMatches = currentMinutes >= startMinutes && currentMinutes < endMinutes;
                    if (dayMatches) {
                        console.log(`Day ${day}, Time ${time}: Event ${event.subject}, Start: ${startTime}, End: ${endTime}, TimeMatches: ${timeMatches}`);
                    }
                    return timeMatches;
                }
                return false;
            });
             return events;
        };
        
        return (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-8 bg-gray-50">
                    <div className="p-3 font-medium text-gray-700 border-r border-gray-200">Time</div>
                    {days.map(day => (
                        <div key={day} className="p-3 font-medium text-gray-700 text-center border-r border-gray-200 last:border-r-0">
                            {day.slice(0, 3)}
                        </div>
                    ))}
                </div>
                
                {timeSlots.map(time => (
                    <div key={time} className="grid grid-cols-8 border-t border-gray-200">
                        <div className="p-3 text-sm text-gray-600 border-r border-gray-200 bg-gray-50">
                            {time}
                        </div>
                        {days.map(day => {
                            const events = getEventsForDayAndTime(day, time);
                            return (
                                <div key={`${day}-${time}`} className="p-1 border-r border-gray-200 last:border-r-0 min-h-[60px]">
                                    {events.map((event, idx) => {
                                        const colors = getSubjectColor(event.subject);
                                        return (
                                            <div key={idx} className={`${colors.bg} border ${colors.border} rounded p-1 mb-1 text-xs`}>
                                                <div className={`font-medium ${colors.text} truncate`}>{event.subject}</div>
                                                {event.room && <div className={`${colors.textLight} truncate`}>{event.room}</div>}
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

    //Adding schedule
    const addEntry = () => {
        setSchedEntry([...scheduleEntry, {day: '', time:'', subject:'', instructor:'', startTime: '', endTime: '', days: [], room: ''}]);
    }

    const updateEntry = (index, field, value) => {
        const newEntry = [...scheduleEntry];
        newEntry[index][field] = value;
        setSchedEntry(newEntry);
    };

    //drag and drop files
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

    const hasValidationError = () => {
        return scheduleEntry.some(entry => 
            (entry.startTime && entry.endTime && entry.startTime >= entry.endTime) ||
            !entry.subject.trim()
        );
    };
    const hasOverlap = (currentEntry, currentIndex) => {
        return scheduleEntry.some((other, idx) => {
            if (idx === currentIndex) return false;
            if (!currentEntry.startTime || !currentEntry.endTime || !other.startTime || !other.endTime) return false;

            return currentEntry.startTime < other.endTime && currentEntry.endTime > other.startTime;
        });
    };

    const handleAddDone = async () => {
        const validEntries = scheduleEntry.filter(
            e => e.subject.trim() && e.startTime && e.endTime && e.startTime < e.endTime && e.days?.length > 0
        );

        if (validEntries.length === 0) return;

        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1200));

        console.log('Saving schedule:', validEntries);
        setHasSched(true);
        setShowSuccess(true);

        // Keep valid entries 
        setSchedEntry(validEntries.length > 0 ? validEntries : [{ day: '', time: '', subject: '', instructor: '', startTime: '', endTime: '', days: [], room: '' }]);
        setIsSaving(false);
        setTimeout(() => setShowSuccess(false), 3000);
        setAddSchedModal(false);
    };
    const removeEntry = (indexToRemove) => {
        if(scheduleEntry.length === 1) {
            setSchedEntry([{day:'', time:'', subject:'', instructor:'', startTime: '', endTime: '', days: [], room: ''}]);
            return;
        }
        const updateEntry = scheduleEntry.filter((_, idx) =>idx !== indexToRemove);
        setSchedEntry(updateEntry)
    }

    return (
        <PageTransition>
            <AuthenticatedLayout>
                <div className="flex-1 p-6 md:p-8">
                        <div className="flex-1 p-6 md:p-8">
                        <div className="max-w-6xl mx-auto relative">

                            {/* List toggle button */}
                            <button onClick={() => setShowList(!showList)}
                                className="absolute -top-20 right-2 z-10 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 transition-colors"
                                title={showList ? "Hide list" : "Show list"}
                            >
                                <List className="h-5 w-5 text-[#04095d]" />
                                <span className="text-sm font-medium text-gray-700">{showList ? "Hide List" : "List"}</span>
                            </button>

                            {/* Calendar     !showList */}
                            {!showList && (
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                        <h2 className="text-xl md:text-2xl font-bold text-[#04095d]">Calendar</h2>

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

                                    {scheduleEntry.some(entry => entry.subject?.trim() && entry.startTime && entry.endTime) ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Schedule </th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Subject </th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Instructor </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {scheduleEntry
                                                        .filter(entry => entry.subject?.trim() && entry.startTime && entry.endTime)
                                                        .sort((a, b) => {
                                                            // Sort by day of week (Monday first)
                                                            const dayOrder = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
                                                            const aMinDay = Math.min(...a.days.map(day => dayOrder[day] ?? 7));
                                                            const bMinDay = Math.min(...b.days.map(day => dayOrder[day] ?? 7));
                                                            if (aMinDay !== bMinDay) return aMinDay - bMinDay;
                                                            
                                                            // Then sort by start time
                                                            return a.startTime.localeCompare(b.startTime);
                                                        })
                                                        .map((entry, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {entry.days?.length > 0 ? entry.days.sort((a, b) => {
                                                                    const dayOrder = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
                                                                    return (dayOrder[a] ?? 7) - (dayOrder[b] ?? 7);
                                                                }).join(', ') + ' • ' : ''}
                                                                {entry.startTime && entry.endTime ? `${entry.startTime} - ${entry.endTime}` : <span className="text-gray-400 italic">—</span>}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {entry.subject}
                                                                {entry.room && <div className="text-xs text-gray-500 mt-1">{entry.room}</div>}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {entry.instructor || <span className="text-gray-400 italic">—</span>}
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {scheduleEntry.filter(entry => entry.subject?.trim() && entry.startTime && entry.endTime).length === 0 && (
                                                        <tr>
                                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">No valid schedule entries found</td>
                                                        </tr>
                                                    )}
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
                <Modal show={addSchedModal} onClose={() => setAddSchedModal(false)} maxWidth="2xl">
                    <div className="flex flex-col max-h-[85vh]">
                        <div className="sticky top-0 z-10 bg-white px-6 md:px-8 pt-6 pb-4 border-b border-gray-200">
                            <button onClick={() => setAddSchedModal(false)} className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 transition-colors z-20 pr-3">
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
                                        <InputLabel value="Subject Name" className="text-sm font-medium text-gray-700 mb-1.5" />
                                        <input type="text" value={entry.subject} onChange={(e) => updateEntry(index, 'subject', e.target.value)} placeholder="e.g. Data Structures and Algorithms"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30"
                                        />
                                    </div>

                                    {/* Day*/}
                                    <div className="mb-5">
                                        <InputLabel value="Day(s) of Week" className="text-sm font-medium text-gray-700 mb-1.5" />
                                        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                                <label key={day} className="flex items-center gap-2">
                                                    <input type="checkbox" checked={entry.days?.includes(day) || false} onChange={(e) => {
                                                            const newDays = e.target.checked ? [...(entry.days || []), day] : (entry.days || []).filter(d => d !== day);
                                                            updateEntry(index, 'days', newDays);
                                                        }}
                                                        className="h-5 w-5 text-[#04095d] border-gray-300 rounded focus:ring-[#04095d]"
                                                    />
                                                    <span className="text-sm text-gray-700">{day}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Start and end time*/}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                                        <div>
                                            <InputLabel value="Start Time" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <input type="time" value={entry.startTime || ''}  onChange={(e) => updateEntry(index, 'startTime', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="End Time" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <input  type="time" value={entry.endTime || ''} onChange={(e) => updateEntry(index, 'endTime', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30"
                                            />
                                        </div>
                                    </div>

                                    {/* Validation error for time */}
                                    {entry.startTime && entry.endTime && entry.startTime >= entry.endTime && entry.days?.length > 0 && (
                                        <p className="text-red-600 text-sm mt-1 mb-4"> End time must be after start time. </p>
                                    )}

                                    {/* Overlap warning */}
                                    {index > 0 && hasOverlap(entry, index) && (
                                        <p className="text-amber-600 text-sm mt-1 mb-4">Warning: This schedule overlaps with an existing entry. </p>
                                    )}

                                    {/* Room & Professor (optional) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel value="Room / Location (optional)" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <input type="text" value={entry.room || ''} onChange={(e) => updateEntry(index, 'room', e.target.value)} placeholder="e.g. Room 101, Academic Building"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Professor Name (optional)" className="text-sm font-medium text-gray-700 mb-1.5" />
                                            <input type="text" value={entry.instructor || ''}  onChange={(e) => updateEntry(index, 'instructor', e.target.value)} placeholder="Prof."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#04095d] focus:ring-1 focus:ring-[#04095d]/30"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Success message */}
                            {showSuccess && (
                                <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center"> Schedule successfully added! </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 left-0 right-0 bg-white pt-6 pb-4 border-t border-gray-200 px-6 md:px-8">
                            <div className="flex justify-between items-center">
                                <Button variant="outline" className="text-gray-600 hover:bg-gray-100"
                                    onClick={() => setAddSchedModal(false)}
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
                                        disabled={isSaving || hasValidationError()} onClick={handleAddDone}
                                    > {isSaving ? 'Saving...' : 'Done'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </AuthenticatedLayout>
        </PageTransition>
    );
}