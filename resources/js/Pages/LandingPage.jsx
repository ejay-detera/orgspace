import { Link } from '@inertiajs/react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-blue-900"></div>
                    </div>
                    <span className="text-white text-xl font-bold">OrgSpace</span>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#" className="text-white hover:text-blue-200 transition">About</a>
                    <a href="#" className="text-white hover:text-blue-200 transition">Contact</a>
                    <Link 
                        href={route('login')} 
                        className="text-white hover:text-blue-200 transition"
                    >
                        Login
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto">
                {/* Left Content */}
                <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        The perfect Space for 
                        <br />
                        Student Organization.
                    </h1>
                    
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Plan, manage, and grow your organization with ease.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center group">
                            Get Started
                            <svg 
                                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        
                        <Link 
                            href={route('login')}
                            className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition border border-blue-600"
                        >
                            Log In
                        </Link>
                    </div>
                </div>

                {/* Right Graphic */}
                <div className="md:w-1/2 flex justify-center">
                    <div className="relative w-80 h-80">
                        {/* Orbital rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-72 w-72 rounded-full border border-gray-600 opacity-30"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-56 w-56 rounded-full border border-gray-500 opacity-40"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-40 w-40 rounded-full border border-gray-400 opacity-50"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-24 w-24 rounded-full border border-gray-300 opacity-60"></div>
                        </div>
                        
                        {/* Central sun/planet */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/50"></div>
                        
                        {/* Orbiting planets */}
                        <div className="absolute top-12 right-16 w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                        <div className="absolute top-24 left-12 w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                        <div className="absolute bottom-20 right-20 w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50"></div>
                        <div className="absolute bottom-32 left-24 w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50"></div>
                        <div className="absolute top-40 left-32 w-2 h-2 rounded-full bg-pink-400 shadow-lg shadow-pink-400/50"></div>
                        <div className="absolute top-56 right-32 w-3 h-3 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50"></div>
                        
                        {/* Small stars/dots */}
                        <div className="absolute top-8 left-8 w-1 h-1 rounded-full bg-white opacity-60"></div>
                        <div className="absolute top-16 right-8 w-1 h-1 rounded-full bg-white opacity-60"></div>
                        <div className="absolute bottom-16 left-16 w-1 h-1 rounded-full bg-white opacity-60"></div>
                        <div className="absolute bottom-8 right-8 w-1 h-1 rounded-full bg-white opacity-60"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
