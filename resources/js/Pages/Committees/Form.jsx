import { useState } from "react";
import PageTransition from "@/Components/PageTransition";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";


export default function Form({ organization, availablePermissions, committee, assignedPermissions = [] }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: committee?.name ?? '',
        description: committee?.description ?? '',
        is_public: committee?.is_public ?? false,
        permissions: assignedPermissions,
    });

    const handlePermissionToggle = (perm) => {
        if (data.permissions.includes(perm)) {
            setData(
                'permissions',
                data.permissions.filter(p => p !== perm)
            );
        } else {
            setData('permissions', [...data.permissions, perm]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                setModalState('success');
            },
            onError: (errs) => {
                const messages = Object.values(errs).flat().join(' ');
                setErrorMessage (messages || 'Something went wrong. Please try again.');
                setModalState('error');
            },
        };

            if (committee) {
                put(window.route('committees.update', committee.id), options);
            } else {
                post(window.route('committees.store', organization.id), options);
            }
    };

    const [modalState, setModalState] = useState(null);
    const closeModal = () => setModalState(null);
    const [errorMessage, setErrorMessage] = useState('');

    return (    
        <PageTransition>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold text-gray-800">
                        {committee ? 'Edit Committee' : 'Create Committee'}
                    </h2>
                }
            >
                <Head title={committee ? 'Edit Committee' : 'Create Committee'} />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex flex-wrap p-6 text-gray-700">
                                <form
                                    className="max-w-xl space-y-6"
                                    onSubmit={handleSubmit}
                                >
                                    {/* Committee Name */}
                                    <div>
                                        <label htmlFor="committee_name" className="font-medium block mb-2 text-sm">
                                            Committee Name
                                        </label>
                                        <input
                                            placeholder="Enter committee name..."
                                            type="text"
                                            id="committee_name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full rounded-xl px-4 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="font-medium mb-2 text-sm">
                                            Description
                                        </label>
                                        <textarea
                                            placeholder="Enter committee description..."
                                            id="description"
                                            rows="4"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full rounded-xl px-4 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    {/* Public */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="is-public"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 border-gray-400 rounded focus:ring-indigo-500"
                                            checked={data.is_public}
                                            onChange={e => setData('is_public', e.target.checked)}
                                        />
                                        <label htmlFor="is-public" className="text-sm font-medium">
                                            Public
                                        </label>
                                    </div>

                                    {/* Permissions */}
                                    <fieldset>
                                        <h3 className="font-medium block mb-2 text-sm">Permissions</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
                                            {availablePermissions.map(perm => (
                                                <div key={perm} className="flex items-center mb-3">
                                                    <input
                                                        id={perm}
                                                        type="checkbox"
                                                        className="h-4 w-4 text-indigo-600 border-gray-400 rounded focus:ring-indigo-500"
                                                        checked={data.permissions.includes(perm)}
                                                        onChange={() => handlePermissionToggle(perm)}
                                                    />
                                                    <label
                                                        htmlFor={perm}
                                                        className="ml-2 text-sm font-medium"
                                                    >
                                                        {perm}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </fieldset>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing 
                                            ? (committee ? 'Updating...' : 'Creating...')
                                            : (committee ? 'Update Committee' : 'Create Committee')
                                        }
                                    </button>
                                    
                                    {/* Success Modal - on going*/}
                                    <Modal show={modalState === 'success'} onClose={closeModal} maxWidth="sm">
                                        <div className="p-6 text-center">
                                           <h3 className="text-green-600 text-xl font-bold">
                                            {committee ? 'Committee Updated!' : 'Committee Created!'}
                                           </h3>
                                           <p className="mt-2 text-gray-600">
                                            {committee ? 'The committee has been successfully updated.' : 'The committee has been successfully created.'}
                                           </p>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Done
                                        </button>
                                    </Modal>
                                    
                                    {/* Error Modal */}
                                    <Modal show={modalState === 'error'} onClose={closeModal} maxWidth="sm">
                                        <div className="p-6 text-center">
                                            
                                           <h3 className="text-red-600 text-xl font-bold">
                                            {committee ? 'Update Failed' : 'Creation Failed'}
                                           </h3>
                                           <p className="mt-2 text-gray-600">
                                            {errorMessage}
                                           </p>
                                            <button
                                                onClick={closeModal}
                                                className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </Modal>
                                </form>
                            </div>
                        </div>
                    </div>    
                </div>  
            </AuthenticatedLayout>
        </PageTransition>
    );
}

