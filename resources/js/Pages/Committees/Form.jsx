import PageTransition from "@/Components/PageTransition";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

const Form = ({ organization, availablePermissions, committee, assignedPermissions = [] }) => {
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

        if (committee) {
            put(window.route('committees.update', committee.id));
        } else {
            post(window.route('committees.store', organization.id));
        }
    };

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

                <div className="bg-white p-10">
                    <form
                        className="max-w-sm mx-auto space-y-4"
                        onSubmit={handleSubmit}
                    >
                        {/* Committee Name */}
                        <div>
                            <label htmlFor="committee_name" className="font-bold block mb-2 text-sm">
                                Committee Name
                            </label>
                            <input
                                type="text"
                                id="committee_name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="font-bold block mb-2 text-sm">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows="4"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full border rounded p-3"
                            />
                        </div>

                        {/* Public */}
                        <div className="flex items-center gap-2">
                            <input
                                id="is-public"
                                type="checkbox"
                                checked={data.is_public}
                                onChange={e => setData('is_public', e.target.checked)}
                            />
                            <label htmlFor="is-public" className="text-sm font-medium">
                                Public
                            </label>
                        </div>

                        {/* Permissions */}
                        <fieldset>
                            <h3 className="mb-3 font-bold">Permissions</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                                {availablePermissions.map(perm => (
                                    <div key={perm} className="flex items-center mb-3">
                                        <input
                                            id={perm}
                                            type="checkbox"
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
                            className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
                        >
                            {committee ? 'Update Committee' : 'Create Committee'}
                        </button>
                    </form>
                </div>
            </AuthenticatedLayout>
        </PageTransition>
    );
};

export default Form;
