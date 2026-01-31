'use client';

import { useState } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import { Search, Phone, FileText, CheckCircle2, Circle, Truck, Settings, ClipboardCheck } from 'lucide-react';
import { TrackingResponse, JobCardStatus } from '@/types';

// Status icons
const statusIcons: Record<JobCardStatus, React.ReactNode> = {
    'received': <ClipboardCheck size={20} />,
    'diagnosis': <Search size={20} />,
    'in-progress': <Settings size={20} />,
    'ready': <CheckCircle2 size={20} />,
    'delivered': <Truck size={20} />,
};

export default function TrackStatusPage() {
    const [searchType, setSearchType] = useState<'phone' | 'jobcard'>('phone');
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [trackingData, setTrackingData] = useState<TrackingResponse | TrackingResponse[] | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        setIsLoading(true);
        setError('');
        setTrackingData(null);

        try {
            const param = searchType === 'phone' ? `phone=${searchValue}` : `jobCardNumber=${searchValue}`;
            const res = await fetch(`/api/job-cards/track?${param}`);
            const data = await res.json();

            if (data.success) {
                setTrackingData(data.data);
            } else {
                setError(data.message || 'No records found');
            }
        } catch (err) {
            console.error('Track error:', err);
            setError('Failed to fetch tracking information. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderTimeline = (tracking: TrackingResponse) => {
        return (
            <div className="relative">
                {tracking.timeline.map((step, index) => (
                    <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                        {/* Timeline Line */}
                        <div className="relative flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${step.completed
                                    ? 'bg-[var(--accent)] text-white'
                                    : 'bg-gray-200 text-gray-400'
                                    }`}
                            >
                                {step.completed ? (
                                    statusIcons[step.status as JobCardStatus]
                                ) : (
                                    <Circle size={20} />
                                )}
                            </div>
                            {index < tracking.timeline.length - 1 && (
                                <div
                                    className={`absolute top-10 w-0.5 h-full ${step.completed ? 'bg-[var(--accent)]' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <h4
                                className={`font-semibold ${step.completed ? 'text-[var(--primary)]' : 'text-gray-400'
                                    }`}
                            >
                                {step.label}
                            </h4>
                            {step.timestamp && (
                                <p className="text-sm text-[var(--muted-foreground)]">
                                    {new Date(step.timestamp).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderTrackingCard = (tracking: TrackingResponse) => {
        return (
            <div className="card p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                    <div>
                        <p className="text-sm text-[var(--muted-foreground)]">Job Card Number</p>
                        <p className="text-xl font-bold text-[var(--primary)]">
                            {tracking.jobCardNumber}
                        </p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm text-[var(--muted-foreground)]">Vehicle</p>
                        <p className="font-semibold text-[var(--primary)]">
                            {tracking.vehicleBrand} {tracking.vehicleModel}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            {tracking.vehicleNumber}
                        </p>
                    </div>
                </div>

                {/* Current Status */}
                <div className="bg-[var(--muted)] rounded-lg p-4 mb-6">
                    <p className="text-sm text-[var(--muted-foreground)] mb-1">Current Status</p>
                    <p className="text-lg font-semibold text-[var(--accent)]">
                        {tracking.statusLabel}
                    </p>
                    {tracking.estimatedDelivery && (
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">
                            Estimated Delivery: {new Date(tracking.estimatedDelivery).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </p>
                    )}
                </div>

                {/* Timeline */}
                {renderTimeline(tracking)}
            </div>
        );
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[var(--muted)] pt-24 pb-12">
                <div className="container max-w-2xl px-4">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2">
                            Track Service Status
                        </h1>
                        <p className="text-[var(--muted-foreground)]">
                            Enter your phone number or job card number to track your vehicle.
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="card p-6 md:p-8 mb-8">
                        <form onSubmit={handleSearch}>
                            {/* Search Type Tabs */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => { setSearchType('phone'); setSearchValue(''); setTrackingData(null); setError(''); }}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${searchType === 'phone'
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-gray-200'
                                        }`}
                                >
                                    <Phone size={18} />
                                    Phone Number
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSearchType('jobcard'); setSearchValue(''); setTrackingData(null); setError(''); }}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${searchType === 'jobcard'
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-gray-200'
                                        }`}
                                >
                                    <FileText size={18} />
                                    Job Card No.
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="form-input flex-1"
                                    placeholder={
                                        searchType === 'phone'
                                            ? 'Enter 10-digit phone number'
                                            : 'Enter job card number (e.g., JC-2026-0001)'
                                    }
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary w-full sm:w-auto"
                                >
                                    {isLoading ? (
                                        <span className="spinner" />
                                    ) : (
                                        <Search size={20} />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 text-center">
                            {error}
                        </div>
                    )}

                    {/* Results */}
                    {trackingData && (
                        <div className="space-y-6">
                            {Array.isArray(trackingData) ? (
                                <>
                                    <p className="text-[var(--muted-foreground)]">
                                        Found {trackingData.length} active service(s)
                                    </p>
                                    {trackingData.map((tracking) => (
                                        <div key={tracking.jobCardNumber}>
                                            {renderTrackingCard(tracking)}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                renderTrackingCard(trackingData)
                            )}
                        </div>
                    )}

                    {/* Help Text */}
                    {!trackingData && !error && (
                        <div className="text-center text-[var(--muted-foreground)]">
                            <p className="mb-2">Can&apos;t find your job card?</p>
                            <a href="tel:9931759995" className="text-[var(--accent)] font-medium hover:underline">
                                Call us at 9931759995
                            </a>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
