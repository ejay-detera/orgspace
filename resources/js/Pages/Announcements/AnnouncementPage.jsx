import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NavLink from '@/Components/NavLink';
import {Link} from '@inertiajs/react';
import {Plus} from 'lucide-react';
import PageTransition from '@/Components/PageTransition';

export default function AnnouncementIndex() {
    //test data
    const announcements = [
        {
            id: 1,
            user: {name: "Test User 1", position: "President"},
            type: 'Low',
            title: 'General Assembly',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            id: 2,
            user: {name: "Test User 2", position: "President"},
            type: 'High',
            title: 'General Assembly',
            body: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
         {
            id: 3,
            user: {name: "Test User 3", position: "President"},
            type: 'Normal',
            title: 'General Assembly',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            id: 4,
            user: {name: "Test User 4", position: "President"},
            type: 'Critical',
            title: 'General Assembly',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        }
    ];

    const sortedAnnouncements = [...announcements].sort((a,b) => {
        const typeOrder = {
            'Critical' : 4,
            'High' : 3,
            'Normal' : 2,
            'Low': 1
        }; return typeOrder[b.type] - typeOrder[a.type];
    });



    return (
        <PageTransition>
            <AuthenticatedLayout header={
               <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Announcements</h2>

                    <Link href={route('announcements.create')} className="flex items-center gap-2 px-4 py-2 bg-[#04095D] text-white rounded-lg hover:-translate-y-1 transform transition duration-200 shadow-md hover:shadow-lg">
                        <Plus size={18}/> Create
                    </Link>
               </div>
            }
            >
                <div className="py-10">
                    <div className="mx-auto max-w-5xl sm:px-6 lg:px-6 space-y-10 ">
                        {sortedAnnouncements.map((ann) => (
                            <div key={ann.id} className="bg-[#FFFFFF] rounded-2xl p-8 shadow-2xl border border-[#B3B3B3]/20 text-black min-h-[260px] flex flex-col justify-between hover:-translate-y-1 transform transition duration-200 shadow-md hover:shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-md text-[#04095D] font-bold">{ann.user.name}</h3>
                                        <p className="text-sm text-black/70">{ann.user.position}</p>
                                    </div>
                                    <span className={`px-4 py-1 text-xs font-semibold rounded-full border ${ann.type === "Critical" ? "bg-red-600 text-white border-red-400/40": ann.type === "High"
                                                ? "bg-orange-500 text-white border-orange-400/40": ann.type === "Normal"? "bg-blue-600 text-white border-blue-400/40": "bg-gray-500 text-white border-gray-400/40"}`}
                                    >{ann.type}</span>
                                </div>
                                <div className="mt-8">
                                    <h4 className="text-lg font-semibold mb-2">{ann.title}</h4>
                                    <p className="text-black/80 leading-relaxed">{ann.body}</p>
                                </div>
                            </div>
                            
                            
                        ))}
                    </div>
                </div>
            </AuthenticatedLayout>
        </PageTransition>
        
    )
}