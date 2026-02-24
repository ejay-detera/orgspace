import PageTransition from "@/Components/PageTransition";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

const Show = ({ committee }) => {
    const route = useRoute();
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
                                className="inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Delete
                            </button>

                        </div>
                    </div>

                }
            >
                <Head title="Committees" />
                <div>{committee.id}</div>

            </AuthenticatedLayout>
        </PageTransition>
    )
}

export default Show;
