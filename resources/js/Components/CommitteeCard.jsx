const CommitteeCard = ({ committee }) => {
    return (

        <div className="flex flex-col md:flex-col justify-between w-72 min-h-[220px] bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs cursor-pointer space-y-4">
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
                                className="inline-flex items-center bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-2 py-0.5 rounded-sm"
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
                className="mt-4 md:mt-0 inline-flex items-center text-body bg-neutral-secondary-medium border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium text-sm px-4 py-2 rounded-base"
            >
                View
                <svg
                    className="w-4 h-4 ml-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m14 0-4 4m4-4-4-4" />
                </svg>
            </button>
        </div>
    );
};

export default CommitteeCard;
