import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Navigation Bar - Same color as left sidebar */}
            <nav className="bg-gradient-to-r from-[#04095D] via-[#000000] to-[#04095D] p-3 sm:p-4 flex justify-end items-center">
                <Link href="/" className="flex items-center">
                    <ApplicationLogo className="h-6 sm:h-8 w-auto" />
                </Link>
            </nav>

            <div className="flex flex-1">
                {/* Left Section - Same gradient as navigation - Hidden on mobile/tablet */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-[#04095D] to-[#000000] items-center justify-center p-6 lg:p-8">
                    <div className="text-white text-center max-w-2xl">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-4 lg:mb-6 leading-tight font-roboto-serif">
                            The <span className="text-gradient-secondary-primary">perfect</span> <span>space for</span>
                            <span className="block"> Student Organization.</span>
                        </h1>
                        
                        <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 md:mb-8 leading-relaxed font-roboto-serif italic">
                            Plan, manage, and grow your organization with ease.
                        </p>
                        
                        <Link
                            href={route('register')}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-[#04095D] bg-white hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        >
                            Sign Up Now
                        </Link>
                    </div>
                </div>

                {/* Right Section - White Login Form - Full width on mobile/tablet */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
