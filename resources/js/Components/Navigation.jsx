import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Navigation() {
    return (
        <nav className="w-full bg-gradient-to-r from-[#04095D] to-[#000000] px-6 py-4 flex items-center justify-between">
            <div className="flex-1"></div>
            
            <div className="flex items-center">
                <Link href="/" className="flex items-center">
                    <ApplicationLogo className="h-8 w-auto" />
                </Link>
            </div>
        </nav>
    );
}
