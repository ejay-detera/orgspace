const CommitteeCard = ({ committee }) => {
    return (
 
        <div className="flex flex-col md:flex-col justify-between w-full min-h-[220px] bg-neutral-primary-soft p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer space-y-4">
            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-heading">{committee.name}</h5>
                {committee.description && (
                    <p className="mb-4 text-body text-sm">{committee.description}</p>
                )}
                <div className="flex flex-wrap gap-2 items-center">
                    {committee.permissions.length ? (
                        committee.permissions.map((permission) => (
                            <span
                                key={permission.id}
                                className="inline-flex items-center bg-brand-softer border border-gray-300 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-md"
                            >
                                {permission.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-muted">No permissions yet</span>
                    )}
                </div>
            </div>

            {/* View Button */}
            <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white text-sm rounded-md mt-4 py-2 width-10"
            >
                View
            </button>
        </div>
    );
};

export default CommitteeCard;
