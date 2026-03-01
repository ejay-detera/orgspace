import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PageTransition from '@/Components/PageTransition';

export default function Index({ organizations }) {
    return (
        <PageTransition>
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Organizations
                        </h2>
                        <div className="flex gap-4">
                            <Link
                                href={route('organizations.discover')}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                            >
                                Find Organizations
                            </Link>
                            <Link
                                href={route('organizations.create')}
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                            >
                                Create Organization
                            </Link>
                        </div>
                    </div>
                }
            >
                <Head title="Organizations" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                {organizations.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">You don't belong to any organizations yet.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {organizations.map((org) => (
                                            <div key={org.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-bold text-gray-900">{org.name}</h3>
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${org.pivot.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {org.pivot.status === 'pending' ? 'Pending' : org.pivot.role}
                                                    </span>
                                                </div>
                                                {org.image && (
                                                    <img
                                                        src={`/storage/${org.image}`}
                                                        alt={org.name}
                                                        className="w-full h-32 object-cover rounded-md mb-4"
                                                    />
                                                )}
                                                <p className="text-sm text-gray-600 mb-2">{org.type}</p>
                                                <p className="text-sm text-gray-700 line-clamp-3 mb-4">{org.description}</p>

                                                {org.pivot.role === 'President' && org.pivot.status === 'active' && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <Link
                                                            href={route('organizations.requests', org.id)}
                                                            className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
                                                        >
                                                            Manage Join Requests
                                                        </Link>
                                                    </div>
                                                )}
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
