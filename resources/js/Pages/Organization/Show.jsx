import CommitteeCard from "@/Components/CommitteeCard";
import PageTransition from "@/Components/PageTransition";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

const Show = ({ organization, committees }) => {
    const route = useRoute();

    return (
        <PageTransition>
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Committees
                        </h2>
                        <Link
                            href={route('committees.create', organization.id)}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Create Committee
                        </Link>
                    </div>

                }
            >
                <Head title="Committees" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 flex flex-wrap justify-start gap-5"> {committees.map(c => (
                                <Link href={route("committees.show", c.id)}>
                                    < CommitteeCard key={c.id} committee={c} />
                                </Link>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </PageTransition >
    )

}

export default Show;
