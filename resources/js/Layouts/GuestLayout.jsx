import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function GuestLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 md:px-8 py-4 md:py-6 absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 font-roboto-serif">
                    <img 
                        src="/images/org-space-logo.svg" 
                        alt="OrgSpace" 
                        className="h-8 w-8 md:h-10 md:w-10"
                    />
                    <span className="text-lg md:text-2xl font-bold text-gradient-secondary-primary">OrgSpace</span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center space-x-8 lg:space-x-12 font-roboto-serif">
                    <a href="#" className="text-white text-lg lg:text-xl font-medium hover:text-[var(--color-accent)] transition-all duration-300 relative group">
                        About
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a href="#" className="text-white text-lg lg:text-xl font-medium hover:text-[var(--color-accent)] transition-all duration-300 relative group">
                        Contact
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <Link 
                        href={route('login')} 
                        className="bg-[var(--color-primary)] text-white text-lg lg:text-xl font-semibold px-6 py-2 rounded-lg hover:bg-[var(--color-accent)] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-accent)]/25"
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-white hover:text-[var(--color-accent)] transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 z-20 bg-black/90 backdrop-blur-md border-b border-white/10">
                    <div className="flex flex-col space-y-4 px-6 py-4 font-roboto-serif">
                        <a href="#" className="text-white text-lg font-medium hover:text-[var(--color-accent)] transition-all duration-300">About</a>
                        <a href="#" className="text-white text-lg font-medium hover:text-[var(--color-accent)] transition-all duration-300">Contact</a>
                        <Link 
                            href={route('login')} 
                            className="bg-[var(--color-primary)] text-white text-lg font-semibold px-6 py-2 rounded-lg hover:bg-[var(--color-accent)] transition-all duration-300 text-center"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {children}
        </div>
    );
}
