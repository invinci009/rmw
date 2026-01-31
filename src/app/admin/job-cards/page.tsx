'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search, Filter, Plus, Phone, Car,
    MoreVertical, Eye, Receipt, Settings
} from 'lucide-react';

interface JobCard {
    _id: string;
    jobCardNumber: string;
    customerName: string;
    phone: string;
    vehicleType: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber: string;
    mechanicAssigned: string;
    status: string;
    createdAt: string;
    estimatedDelivery?: string;
}

const statusOptions = [
    { value: 'received', label: 'Received' },
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'ready', label: 'Ready' },
    { value: 'delivered', label: 'Delivered' },
];

export default function JobCardsPage() {
    const [jobCards, setJobCards] = useState<JobCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJobCard, setSelectedJobCard] = useState<string | null>(null);

    useEffect(() => {
        fetchJobCards();
    }, [statusFilter]);

    const fetchJobCards = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('rmw_admin_token');
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const res = await fetch(`/api/job-cards?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) {
                setJobCards(data.data.jobCards);
            }
        } catch (error) {
            console.error('Failed to fetch job cards:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateJobCardStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('rmw_admin_token');
            const res = await fetch(`/api/job-cards/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                fetchJobCards();
            }
        } catch (error) {
            console.error('Failed to update job card:', error);
        }
        setSelectedJobCard(null);
    };

    const filteredJobCards = jobCards.filter((jc) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            jc.jobCardNumber.toLowerCase().includes(query) ||
            jc.customerName.toLowerCase().includes(query) ||
            jc.phone.includes(query) ||
            jc.vehicleNumber.toLowerCase().includes(query)
        );
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'received': 'bg-blue-100 text-blue-700',
            'diagnosis': 'bg-purple-100 text-purple-700',
            'in-progress': 'bg-orange-100 text-orange-700',
            'ready': 'bg-green-100 text-green-700',
            'delivered': 'bg-gray-100 text-gray-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">Job Cards</h1>
                    <p className="text-[var(--muted-foreground)]">Manage service job cards</p>
                </div>
                <Link href="/admin/job-cards/new" className="btn btn-primary">
                    <Plus size={18} />
                    New Job Card
                </Link>
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
                            placeholder="Search by job card, name, phone, or vehicle number..."
                            className="form-input pl-10 w-full"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="form-input form-select pl-10 pr-8"
                        >
                            <option value="">All Status</option>
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Job Cards Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="spinner w-8 h-8 border-4 border-[var(--primary)]" />
                </div>
            ) : filteredJobCards.length === 0 ? (
                <div className="card text-center py-12">
                    <Settings size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-[var(--muted-foreground)]">No job cards found</p>
                    <Link href="/admin/job-cards/new" className="btn btn-primary mt-4">
                        Create First Job Card
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredJobCards.map((jc) => (
                        <div key={jc._id} className="card p-5 relative">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="font-bold text-[var(--primary)] text-lg">{jc.jobCardNumber}</p>
                                    <p className="text-xs text-[var(--muted-foreground)]">{formatDate(jc.createdAt)}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(jc.status)}`}>
                                    {jc.status.replace('-', ' ')}
                                </span>
                            </div>

                            {/* Customer & Vehicle */}
                            <div className="space-y-2 mb-4">
                                <p className="font-medium">{jc.customerName}</p>
                                <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
                                    <Phone size={14} />
                                    {jc.phone}
                                </p>
                                <p className="text-sm flex items-center gap-1">
                                    <Car size={14} className="text-[var(--muted-foreground)]" />
                                    {jc.vehicleBrand} {jc.vehicleModel}
                                </p>
                                <p className="text-sm font-medium">{jc.vehicleNumber}</p>
                            </div>

                            {/* Mechanic */}
                            {jc.mechanicAssigned && (
                                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                                    Mechanic: <span className="text-[var(--foreground)]">{jc.mechanicAssigned}</span>
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
                                <Link
                                    href={`/admin/job-cards/${jc._id}`}
                                    className="btn btn-outline flex-1 text-sm py-2"
                                >
                                    <Eye size={16} />
                                    View
                                </Link>
                                {jc.status === 'ready' && (
                                    <Link
                                        href={`/admin/invoices/new?jobCardId=${jc._id}`}
                                        className="btn btn-primary flex-1 text-sm py-2"
                                    >
                                        <Receipt size={16} />
                                        Invoice
                                    </Link>
                                )}
                                {jc.status !== 'delivered' && jc.status !== 'ready' && (
                                    <div className="relative flex-1">
                                        <button
                                            onClick={() => setSelectedJobCard(selectedJobCard === jc._id ? null : jc._id)}
                                            className="btn btn-secondary w-full text-sm py-2"
                                        >
                                            Update Status
                                        </button>
                                        {selectedJobCard === jc._id && (
                                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-[var(--border)] z-10">
                                                {statusOptions.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => updateJobCardStatus(jc._id, opt.value)}
                                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--muted)] ${jc.status === opt.value ? 'bg-[var(--muted)] font-medium' : ''
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
