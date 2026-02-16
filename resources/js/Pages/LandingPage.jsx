import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import PageTransition from '@/Components/PageTransition';
export default function LandingPage() {
    return (
        <PageTransition>
        <GuestLayout>
            <div className="min-h-screen bg-gradient-to-r from-black via-black to-[var(--color-primary)]">
                {/* Main Content */}
                <div className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-8 py-12 md:py-16 max-w-7xl mx-auto min-h-screen">
                    {/* Left Content */}
                    <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 mt-16 lg:mt-20">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight font-roboto-serif">
                            The <span className="text-gradient-secondary-primary">perfect</span> <span>space for</span>
                            <span className="block">Student Organization.</span>
                        </h1>
                        
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 leading-relaxed font-roboto-serif italic">
                            Plan, manage, and grow your organization with ease.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                            <button className="bg-white text-[var(--color-primary)] px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 flex items-center justify-center group font-roboto-serif text-sm md:text-base">
                                Get Started
                                <svg 
                                    className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                            
                            <Link 
                                href={route('login')}
                                className="bg-[var(--color-primary)] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-[var(--color-accent)] transition-all duration-300 hover:scale-105 font-roboto-serif text-sm md:text-base"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>

                    {/* Right Graphic - Circular Diagram */}
                    <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
                        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                            {/* Orbital rings */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-56 w-56 sm:h-72 sm:w-72 rounded-full border border-white/20"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-44 w-44 sm:h-56 sm:w-56 rounded-full border border-white/30"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border border-white/40"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border border-white/50"></div>
                            </div>
                            
                            {/* Central circle */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-lg shadow-white/50"></div>
                            
                            {/* Orbiting elements */}
                            <div className="absolute top-8 sm:top-12 right-12 sm:right-16 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                            <div className="absolute top-16 sm:top-24 left-8 sm:left-12 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                            <div className="absolute bottom-16 sm:bottom-20 right-16 sm:right-20 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50"></div>
                            <div className="absolute bottom-24 sm:bottom-32 left-16 sm:left-24 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50"></div>
                            <div className="absolute top-32 sm:top-40 left-24 sm:left-32 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-400 shadow-lg shadow-pink-400/50"></div>
                            <div className="absolute top-44 sm:top-56 right-24 sm:right-32 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50"></div>
                            
                            {/* Small stars/dots */}
                            <div className="absolute top-6 sm:top-8 left-6 sm:left-8 w-1 h-1 rounded-full bg-white opacity-60"></div>
                            <div className="absolute top-12 sm:top-16 right-6 sm:right-8 w-1 h-1 rounded-full bg-white opacity-60"></div>
                            <div className="absolute bottom-12 sm:bottom-16 left-12 sm:left-16 w-1 h-1 rounded-full bg-white opacity-60"></div>
                            <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 w-1 h-1 rounded-full bg-white opacity-60"></div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
        </PageTransition>
    );
}