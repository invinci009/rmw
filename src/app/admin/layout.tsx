'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Calendar, FileText, Receipt,
    Users, Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Job Cards', href: '/admin/job-cards', icon: FileText },
    { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
    { name: 'Customers', href: '/admin/customers', icon: Users },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        // Check if logged in
        const token = localStorage.getItem('rmw_admin_token');
        const userData = localStorage.getItem('rmw_admin_user');

        if (!token) {
            router.push('/admin/login');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('rmw_admin_token');
        localStorage.removeItem('rmw_admin_user');
        router.push('/admin/login');
    };

    // Don't show layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[var(--muted)]">
            {/* Mobile Header */}
            <div className="lg:hidden bg-[var(--primary)] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[var(--primary)] font-bold text-sm">
                        RMW
                    </div>
                    <span className="font-semibold">Admin Panel</span>
                </Link>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2"
                    aria-label="Toggle menu"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-[var(--primary)] transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-4 hidden lg:block">
                        <Link href="/admin/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                                RMW
                            </div>
                            <div>
                                <div className="text-white font-semibold">Admin Panel</div>
                                <div className="text-gray-400 text-xs">Republic Motor Works</div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto mt-12 lg:mt-0">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-white/10">
                        {user && (
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-semibold">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{user.name}</p>
                                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full px-3 py-2"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
