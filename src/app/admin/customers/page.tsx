'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Phone, Car, Eye, History } from 'lucide-react';

interface Customer {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    vehicleCount: number;
    serviceCount: number;
    lastService?: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Simulated customer data - in production, aggregate from job cards
        setCustomers([
            {
                _id: '1',
                name: 'Rahul Kumar',
                phone: '9876543210',
                email: 'rahul@example.com',
                vehicleCount: 2,
                serviceCount: 5,
                lastService: '2026-01-15',
            },
            {
                _id: '2',
                name: 'Priya Singh',
                phone: '9876543211',
                vehicleCount: 1,
                serviceCount: 3,
                lastService: '2026-01-20',
            },
            {
                _id: '3',
                name: 'Amit Verma',
                phone: '9876543212',
                email: 'amit.verma@gmail.com',
                vehicleCount: 1,
                serviceCount: 1,
                lastService: '2026-01-25',
            },
        ]);
        setIsLoading(false);
    }, []);

    const filteredCustomers = customers.filter((customer) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            customer.name.toLowerCase().includes(query) ||
            customer.phone.includes(query) ||
            customer.email?.toLowerCase().includes(query)
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
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">Customers</h1>
                <p className="text-[var(--muted-foreground)]">View customer database and service history</p>
            </div>

            {/* Search */}
            <div className="card p-4 mb-6">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, phone, or email..."
                        className="form-input pl-10 w-full"
                    />
                </div>
            </div>

            {/* Customers Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="spinner w-8 h-8 border-4 border-[var(--primary)]" />
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-[var(--muted-foreground)]">No customers found</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCustomers.map((customer) => (
                        <div key={customer._id} className="card p-5">
                            {/* Customer Info */}
                            <div className="mb-4">
                                <h3 className="font-bold text-[var(--primary)] text-lg">{customer.name}</h3>
                                <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1 mt-1">
                                    <Phone size={14} />
                                    {customer.phone}
                                </p>
                                {customer.email && (
                                    <p className="text-sm text-[var(--muted-foreground)]">{customer.email}</p>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-[var(--muted)] rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-[var(--primary)]">{customer.vehicleCount}</p>
                                    <p className="text-xs text-[var(--muted-foreground)]">Vehicles</p>
                                </div>
                                <div className="bg-[var(--muted)] rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-[var(--accent)]">{customer.serviceCount}</p>
                                    <p className="text-xs text-[var(--muted-foreground)]">Services</p>
                                </div>
                            </div>

                            {/* Last Service */}
                            {customer.lastService && (
                                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                                    Last service: {formatDate(customer.lastService)}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
                                <Link
                                    href={`/admin/customers/${customer.phone}`}
                                    className="btn btn-outline flex-1 text-sm py-2"
                                >
                                    <Eye size={16} />
                                    View
                                </Link>
                                <Link
                                    href={`/admin/customers/${customer.phone}/history`}
                                    className="btn btn-secondary flex-1 text-sm py-2"
                                >
                                    <History size={16} />
                                    History
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
