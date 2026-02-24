import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage } from '@inertiajs/react';
import { Plus, CheckCircle } from 'lucide-react';
import PageTransition from '@/Components/PageTransition';

export default function AnnouncementIndex({ announcements = [], canCreateAnnouncement = false }) {
    const { flash } = usePage().props;



    return (
        <PageTransition>
            <AuthenticatedLayout header={
               <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Announcements</h2>

                    {canCreateAnnouncement && (
                        <Link href={route('announcements.create')} className="flex items-center gap-2 px-4 py-2 bg-[#04095D] text-white rounded-lg hover:-translate-y-1 transform transition duration-200 shadow-md hover:shadow-lg">
                            <Plus size={18}/> Create
                        </Link>
                    )}
               </div>
            }
            >
                <div className="py-10">
                    <div className="mx-auto max-w-5xl sm:px-6 lg:px-6 space-y-6">

                        {/* Show success banner */}
                        {flash?.success && (
                            <div className="flex items-center gap-3 px-5 py-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium shadow-sm">
                                <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                                {flash.success}
                            </div>
                        )}

                        {announcements.length === 0 && (
                            <p className="text-center text-gray-400 py-24 text-sm">No announcements yet.</p>
                        )}

                        {announcements.map((ann) => (
                            <div key={ann.id} className="bg-white rounded-2xl p-8 shadow-2xl border border-[#B3B3B3]/20 text-black min-h-[260px] flex flex-col justify-between hover:-translate-y-1 transform transition duration-200 hover:shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        {/* Show full name  */}
                                        <h3 className="text-md text-[#04095D] font-bold">{ann.creator_name}</h3>
                                        <p className="text-sm text-black/70">{ann.committee?.name ?? 'All Members'}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(ann.created_at).toLocaleString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-4 py-1 text-xs font-semibold rounded-full border ${
                                        ann.type === 'Critical' ? 'bg-red-600 text-white border-red-400/40' :
                                        ann.type === 'High'     ? 'bg-orange-500 text-white border-orange-400/40' :
                                        ann.type === 'Normal'   ? 'bg-blue-600 text-white border-blue-400/40' :
                                                                   'bg-gray-500 text-white border-gray-400/40'
                                    }`}>
                                        {ann.type}
                                    </span>
                                </div>
                                <div className="mt-8">
                                    <h4 className="text-lg font-semibold mb-2">{ann.title}</h4>
                                    <div
                                        className="text-black/80 leading-relaxed prose max-w-none text-sm"
                                        dangerouslySetInnerHTML={{ __html: ann.content }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AuthenticatedLayout>
        </PageTransition>
    );
}
