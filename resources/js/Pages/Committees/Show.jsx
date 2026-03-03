import PageTransition from "@/Components/PageTransition";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Show({ committee }) {
    const { delete: destroy } = useForm()


    const handleDelete = () => {
        destroy(route('committees.destroy', committee.id))
    }

    return (
        <PageTransition>
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Committees
                        </h2>

                        <div className="flex gap-4">
                            <Link
                                href={route('committees.edit', committee.id)}
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                            >
                                Delete
                            </button>

                        </div>
                    </div>

                }
            >
                <Head title={`${committee.name} - Committee`} />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Committee Name */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{committee.name}</h3>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            committee.is_public 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {committee.is_public ? 'Public' : 'Private'}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {committee.description && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                                            <p className="text-gray-600">{committee.description}</p>
                                        </div>
                                    )}

                                    {/* Permissions */}
                                    {committee.permissions && committee.permissions.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Permissions</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {committee.permissions.map(permission => (
                                                    <span 
                                                        key={permission.name || permission}
                                                        className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-700"
                                                    >
                                                        {permission.name || permission}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Organization Info */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Organization</h4>
                                        <p className="text-gray-600">{committee.organization?.name || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </AuthenticatedLayout>
        </PageTransition>
    )
}


