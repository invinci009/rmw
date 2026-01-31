'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search, Filter, Download, Eye,
    Receipt, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

interface Invoice {
    _id: string;
    invoiceNumber: string;
    customerName: string;
    phone: string;
    vehicleDetails: {
        brand: string;
        model: string;
        number: string;
    };
    finalAmount: number;
    paymentStatus: string;
    generatedAt: string;
    jobCard: { jobCardNumber: string };
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, [statusFilter]);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('rmw_admin_token');
            const params = new URLSearchParams();
            if (statusFilter) params.append('paymentStatus', statusFilter);

            const res = await fetch(`/api/invoices?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) {
                setInvoices(data.data.invoices);
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredInvoices = invoices.filter((inv) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            inv.invoiceNumber.toLowerCase().includes(query) ||
            inv.customerName.toLowerCase().includes(query) ||
            inv.phone.includes(query)
        );
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'partial':
                return <Clock size={16} className="text-yellow-600" />;
            default:
                return <AlertCircle size={16} className="text-red-600" />;
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">Invoices</h1>
                    <p className="text-[var(--muted-foreground)]">Manage customer invoices and payments</p>
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
                            placeholder="Search by invoice number, name, or phone..."
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
                            <option value="pending">Pending</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="card overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="spinner w-8 h-8 border-4 border-[var(--primary)]" />
                    </div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="text-center py-12">
                        <Receipt size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-[var(--muted-foreground)]">No invoices found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--muted)]">
                                <tr>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Invoice</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Customer</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Vehicle</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Amount</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Status</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Date</th>
                                    <th className="text-left p-4 font-medium text-[var(--muted-foreground)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-[var(--muted)]/50">
                                        <td className="p-4">
                                            <p className="font-medium text-[var(--primary)]">{invoice.invoiceNumber}</p>
                                            <p className="text-xs text-[var(--muted-foreground)]">
                                                {invoice.jobCard?.jobCardNumber}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium">{invoice.customerName}</p>
                                            <p className="text-sm text-[var(--muted-foreground)]">{invoice.phone}</p>
                                        </td>
                                        <td className="p-4">
                                            <p>{invoice.vehicleDetails.brand} {invoice.vehicleDetails.model}</p>
                                            <p className="text-sm text-[var(--muted-foreground)]">
                                                {invoice.vehicleDetails.number}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-[var(--primary)]">
                                                {formatCurrency(invoice.finalAmount)}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`status-badge flex items-center gap-1 status-${invoice.paymentStatus === 'paid' ? 'completed' : invoice.paymentStatus}`}>
                                                {getStatusIcon(invoice.paymentStatus)}
                                                {invoice.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p>{formatDate(invoice.generatedAt)}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/invoices/${invoice._id}`}
                                                    className="p-2 hover:bg-[var(--muted)] rounded-lg"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <button
                                                    className="p-2 hover:bg-[var(--muted)] rounded-lg"
                                                    title="Download PDF"
                                                >
                                                    <Download size={18} />
                                                </button>
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
