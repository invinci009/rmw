'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Calendar, FileText, Receipt, CheckCircle2,
    Clock, AlertCircle, TrendingUp, ArrowRight
} from 'lucide-react';

interface DashboardStats {
    todayBookings: number;
    pendingBookings: number;
    activeJobCards: number;
    readyForDelivery: number;
    completedThisMonth: number;
    pendingPayments: number;
}

interface RecentBooking {
    _id: string;
    bookingId: string;
    customerName: string;
    phone: string;
    vehicleBrand: string;
    vehicleModel: string;
    preferredDate: string;
    status: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulated stats - in production, fetch from API
        setStats({
            todayBookings: 5,
            pendingBookings: 12,
            activeJobCards: 8,
            readyForDelivery: 3,
            completedThisMonth: 45,
            pendingPayments: 7,
        });

        // Simulated recent bookings
        setRecentBookings([
            {
                _id: '1',
                bookingId: 'RMW-2026-0001',
                customerName: 'Rahul Kumar',
                phone: '9876543210',
                vehicleBrand: 'Maruti Suzuki',
                vehicleModel: 'Swift',
                preferredDate: '2026-02-01',
                status: 'pending',
            },
            {
                _id: '2',
                bookingId: 'RMW-2026-0002',
                customerName: 'Priya Singh',
                phone: '9876543211',
                vehicleBrand: 'Honda',
                vehicleModel: 'Activa',
                preferredDate: '2026-02-02',
                status: 'confirmed',
            },
        ]);

        setIsLoading(false);
    }, []);

    const statCards = [
        {
            title: "Today's Appointments",
            value: stats?.todayBookings || 0,
            icon: Calendar,
            color: 'bg-blue-500',
            href: '/admin/appointments',
        },
        {
            title: 'Pending Bookings',
            value: stats?.pendingBookings || 0,
            icon: Clock,
            color: 'bg-yellow-500',
            href: '/admin/appointments?status=pending',
        },
        {
            title: 'Active Job Cards',
            value: stats?.activeJobCards || 0,
            icon: FileText,
            color: 'bg-purple-500',
            href: '/admin/job-cards',
        },
        {
            title: 'Ready for Delivery',
            value: stats?.readyForDelivery || 0,
            icon: CheckCircle2,
            color: 'bg-green-500',
            href: '/admin/job-cards?status=ready',
        },
        {
            title: 'Completed This Month',
            value: stats?.completedThisMonth || 0,
            icon: TrendingUp,
            color: 'bg-indigo-500',
            href: '/admin/job-cards?status=delivered',
        },
        {
            title: 'Pending Payments',
            value: stats?.pendingPayments || 0,
            icon: AlertCircle,
            color: 'bg-red-500',
            href: '/admin/invoices?status=pending',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner w-8 h-8 border-4 border-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">Dashboard</h1>
                <p className="text-[var(--muted-foreground)]">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map((stat) => (
                    <Link
                        key={stat.title}
                        href={stat.href}
                        className="card p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-[var(--muted-foreground)] mb-1">{stat.title}</p>
                                <p className="text-3xl font-bold text-[var(--primary)]">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card p-6">
                    <h2 className="font-semibold text-lg text-[var(--primary)] mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/job-cards/new"
                            className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-medium">Create New Job Card</span>
                            <ArrowRight size={18} className="text-[var(--muted-foreground)]" />
                        </Link>
                        <Link
                            href="/admin/appointments"
                            className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-medium">View Today&apos;s Appointments</span>
                            <ArrowRight size={18} className="text-[var(--muted-foreground)]" />
                        </Link>
                        <Link
                            href="/admin/invoices/new"
                            className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-medium">Generate Invoice</span>
                            <ArrowRight size={18} className="text-[var(--muted-foreground)]" />
                        </Link>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-lg text-[var(--primary)]">Recent Bookings</h2>
                        <Link href="/admin/appointments" className="text-sm text-[var(--accent)] hover:underline">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-[var(--primary)]">{booking.customerName}</p>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        {booking.vehicleBrand} {booking.vehicleModel}
                                    </p>
                                </div>
                                <span className={`status-badge status-${booking.status}`}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                        {recentBookings.length === 0 && (
                            <p className="text-[var(--muted-foreground)] text-center py-4">No recent bookings</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
