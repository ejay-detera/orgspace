import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Bell, Home, Building, Clipboard, Megaphone, Calendar, LogOut, User, Settings, UserCircle, Cog } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Navigation Bar - Same gradient as login/signup */}
            <nav className="bg-gradient-to-r from-[#04095D] via-[#000000] to-[#04095D] p-4">
                <div className="flex justify-between items-center">
                    {/* Logo and Name - Left side */}
                    <div className="hidden lg:flex items-center space-x-3">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo className="h-8 w-auto" />
                        </Link>
                    </div>
                    
                    {/* Mobile menu button - Left side on mobile */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    
                    {/* Search Box - Center */}
                    <div className="hidden md:flex flex-1 max-w-4xl mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/20 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-3">
                    {/* Notification Bell with Dropdown */}
                    <div className="relative">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="relative text-white p-2 rounded-md hover:bg-white/10 transition-colors">
                                    <Bell className="h-6 w-6" />
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="80">
                                <div className="py-2">
                                    <div className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Bell className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">New Project Created</p>
                                                <p className="text-xs text-gray-500">2 minutes ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Calendar className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Meeting Reminder</p>
                                                <p className="text-xs text-gray-500">1 hour ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Megaphone className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">System Update</p>
                                                <p className="text-xs text-gray-500">3 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-white/10 px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-white/20 focus:outline-none"
                                    >
                                        <UserCircle className="h-8 w-8 mr"/>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="56">
                                <div className="py-1">
                                    <div className="px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <UserCircle className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm text-gray-700">Profile</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <Cog className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm text-gray-700">Settings</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-2 hover:bg-red-50 transition-colors cursor-pointer">
                                        <button
                                            onClick={() => router.post(route('logout'))}
                                            className="flex items-center space-x-3 w-full"
                                        >
                                            <LogOut className="h-4 w-4 text-red-600" />
                                            <span className="text-sm text-red-700 font-medium">Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
                </div>
            </nav>

            <div className="flex flex-1">
                {/* Sidebar - Same gradient as topbar */}
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#04095D] to-[#000000] transition-transform duration-300 ease-in-out lg:transition-none`}>
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                                    <p className="text-gray-300 text-sm">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="flex-1 p-4 space-y-2">
                            <NavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                                className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
                                activeClassName="bg-white/20"
                            >
                                <Home className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                                <span className="text-gray-300 group-hover:text-white transition-colors">Dashboard</span>
                            </NavLink>

                            <NavLink
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/10 transition-all duration-200 cursor-not-allowed"
                                title="Coming soon"
                            >
                                <Building className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                <span className="text-gray-400 group-hover:text-white transition-colors">Organizations</span>
                                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">Soon</span>
                            </NavLink>

                            <NavLink
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/10 transition-all duration-200 cursor-not-allowed"
                                title="Coming soon"
                            >
                                <Clipboard className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                <span className="text-gray-400 group-hover:text-white transition-colors">Projects</span>
                                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">Soon</span>
                            </NavLink>

                            <NavLink
                                href={route('announcements.index')}
                                active={route().current('announcements.*')}
                                className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/10 transition-all duration-200"
                            >
                                <Megaphone className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                <span className="text-gray-400 group-hover:text-white transition-colors">Announcements</span>
                            </NavLink>

                            <NavLink
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/10 transition-all duration-200 cursor-not-allowed"
                                title="Coming soon"
                            >
                                <Calendar className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                <span className="text-gray-400 group-hover:text-white transition-colors">Schedules</span>
                                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">Soon</span>
                            </NavLink>
                        </nav>

                        {/* Sidebar Footer */}
                        <div className="p-4 border-t border-white/10">
                            <NavLink
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-200 w-full"
                                title="Coming soon"
                            >
                                <Settings className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                                <span className="text-gray-300 group-hover:text-white transition-colors">Settings</span>
                                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">Soon</span>
                            </NavLink>
                        </div>
                    </div>
                </aside>

                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 overflow-auto">
                    {header && (
                        <header className="bg-white shadow-sm border-b border-gray-200">
                            <div className="px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
