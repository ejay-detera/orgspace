import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PageTransition from '@/Components/PageTransition';
import { useState } from 'react';

export default function Discover({ organizations, filters }) {
    const [search, setSearch] = useState(filters.q || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('organizations.discover'), { q: search }, { preserveState: true, replace: true });
    };

    const handleJoin = (orgId) => {
        if (confirm("Are you sure you want to request to join this organization?")) {
            router.post(route('organizations.join', orgId), {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <PageTransition>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Discover Organizations
                    </h2>
                }
            >
                <Head title="Discover Organizations" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="mb-6 bg-white p-4 shadow-sm sm:rounded-lg">
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or code..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-4 pr-4 py-2"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition w-auto"
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                {organizations.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No organizations found matching your search. Try adjusting your query or creating a new organization.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {organizations.map((org) => (
                                            <div key={org.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
                                                <div>
                                                    {org.image && (
                                                        <img
                                                            src={`/storage/${org.image}`}
                                                            alt={org.name}
                                                            className="w-full h-32 object-cover rounded-md mb-4"
                                                        />
                                                    )}
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{org.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold text-gray-800">Type:</span> {org.type}</p>
                                                    <p className="text-sm text-gray-600 mb-4"><span className="font-semibold text-gray-800">Code:</span> {org.organization_code}</p>
                                                    <p className="text-sm text-gray-700 line-clamp-3 mb-6 bg-gray-50 p-3 rounded">{org.description}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleJoin(org.id)}
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                                                >
                                                    Request to Join
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </PageTransition>
    );
}
