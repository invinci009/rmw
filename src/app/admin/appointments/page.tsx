'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search, Filter, Calendar, Phone, Car,
    MoreVertical, Check, X, FileText, Eye
} from 'lucide-react';

interface Booking {
    _id: string;
    bookingId: string;
    customerName: string;
    phone: string;
    vehicleType: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber?: string;
    serviceType: { name: string };
    preferredDate: string;
    preferredTime: string;
    status: string;
    createdAt: string;
}

export default function AppointmentsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('rmw_admin_token');
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const res = await fetch(`/api/bookings?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) {
                setBookings(data.data.bookings);
            }
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateBookingStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('rmw_admin_token');
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                fetchBookings();
            }
        } catch (error) {
            console.error('Failed to update booking:', error);
        }
        setSelectedBooking(null);
    };

    const filteredBookings = bookings.filter((booking) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            booking.bookingId.toLowerCase().includes(query) ||
            booking.customerName.toLowerCase().includes(query) ||
            booking.phone.includes(query) ||
            booking.vehicleBrand.toLowerCase().includes(query)
        );
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">Appointments</h1>
                    <p className="text-[var(--muted-foreground)]">Manage customer bookings</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, phone, or booking ID..."
                            className="form-input pl-10 w-full"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <div className="relative">
                            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="form-input form-select pl-10 pr-8"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="card overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="spinner w-8 h-8 border-4 border-[var(--primary)]" />
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-[var(--muted-foreground)]">No bookings found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--muted)]">
                                <tr>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Booking</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Customer</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Vehicle</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Service</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Date & Time</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Status</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-[var(--muted)]/50">
                                        <td className="p-4">
                                            <p className="font-medium text-[var(--primary)]">{booking.bookingId}</p>
                                            <p className="text-xs text-[var(--muted-foreground)]">
                                                {formatDate(booking.createdAt)}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium">{booking.customerName}</p>
                                            <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
                                                <Phone size={12} />
                                                {booking.phone}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="flex items-center gap-1">
                                                <Car size={14} className="text-[var(--muted-foreground)]" />
                                                {booking.vehicleBrand} {booking.vehicleModel}
                                            </p>
                                            <p className="text-sm text-[var(--muted-foreground)]">
                                                {booking.vehicleType === '2W' ? 'Two Wheeler' : 'Four Wheeler'}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p>{booking.serviceType?.name || 'N/A'}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="flex items-center gap-1">
                                                <Calendar size={14} className="text-[var(--muted-foreground)]" />
                                                {formatDate(booking.preferredDate)}
                                            </p>
                                            <p className="text-sm text-[var(--muted-foreground)]">
                                                {booking.preferredTime}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`status-badge status-${booking.status}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setSelectedBooking(selectedBooking === booking._id ? null : booking._id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {selectedBooking === booking._id && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-[var(--border)] z-10 min-w-[160px]">
                                                        <Link
                                                            href={`/admin/appointments/${booking._id}`}
                                                            className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--muted)] text-sm"
                                                        >
                                                            <Eye size={16} />
                                                            View Details
                                                        </Link>
                                                        {booking.status === 'pending' && (
                                                            <button
                                                                onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                                                className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--muted)] text-sm w-full text-left text-green-600"
                                                            >
                                                                <Check size={16} />
                                                                Confirm
                                                            </button>
                                                        )}
                                                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                            <button
                                                                onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                                                className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--muted)] text-sm w-full text-left text-red-600"
                                                            >
                                                                <X size={16} />
                                                                Cancel
                                                            </button>
                                                        )}
                                                        {booking.status === 'confirmed' && (
                                                            <Link
                                                                href={`/admin/job-cards/new?bookingId=${booking._id}`}
                                                                className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--muted)] text-sm text-[var(--accent)]"
                                                            >
                                                                <FileText size={16} />
                                                                Create Job Card
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
