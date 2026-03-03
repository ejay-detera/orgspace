import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PageTransition from '@/Components/PageTransition';

export default function CommitteeIndex() {
    const { auth, committees = [] } = usePage().props;
    const user = auth.user;
    
    // Check if user has President role
    const isPresident = user?.role === 'President' || user?.roles?.includes('President');

    const handleDelete = (committeeId) => {
        if (confirm('Are you sure you want to delete this committee?')) {
            router.delete(route('committees.destroy', committeeId), {
                onSuccess: () => {
                    // Success notification will be handled by flash message
                },
                onError: (errors) => {
                    const errorMessage = typeof errors === 'string' 
                        ? errors 
                        : Object.values(errors).flat().join(', ') || 'Failed to delete committee';
                    alert(errorMessage);
                }
            });
        }
    };

    return (
        <PageTransition>
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Committees Management
                        </h2>
                        
                        {isPresident && (
                            <Link
                                href={route('committees.create')}
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Create Committee
                            </Link>
                        )}
                    </div>
                }
            >
                <Head title="Committees Management" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        
                        {isPresident ? (
                            <div className="bg-white shadow-sm sm:rounded-lg">
                                {committees.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Committee Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {committees.map((committee) => (
                                                    <tr key={committee.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {committee.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                committee.is_public 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {committee.is_public ? 'Public' : 'Private'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={route('committees.show', committee.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                                                >
                                                                    View
                                                                </Link>
                                                                <Link
                                                                    href={route('committees.edit', committee.id)}
                                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(committee.id)}
                                                                    className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-500 text-lg mb-4">No committees found</div>
                                        <Link
                                            href={route('committees.create')}
                                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                                        >
                                            Create Your First Committee
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white shadow-sm sm:rounded-lg p-8 text-center">
                                <div className="text-red-600 text-xl font-semibold mb-4">Access Restricted</div>
                                <div className="text-gray-600 text-lg mb-6">
                                    Only users with President role can access the Committees Management page.
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Please contact your organization administrator if you need committee management access.
                                </div>
                                <div className="mt-8">
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Back to Dashboard
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </PageTransition>
    );
}
