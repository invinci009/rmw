'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import { Calendar, Clock, Phone, User, Car, Wrench, ChevronDown, Check } from 'lucide-react';
import { VEHICLE_BRANDS, TIME_SLOTS, ServiceType } from '@/types';

export default function BookingPage() {
    const router = useRouter();
    const [services, setServices] = useState<ServiceType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [bookingId, setBookingId] = useState('');

    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        email: '',
        vehicleType: '' as '2W' | '4W' | '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleNumber: '',
        serviceType: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
    });

    // Fetch services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/services');
                const data = await res.json();
                if (data.success) {
                    setServices(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    // Get available brands based on vehicle type
    const availableBrands = formData.vehicleType
        ? VEHICLE_BRANDS[formData.vehicleType]
        : [];

    // Get min date (tomorrow)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setBookingId(data.data.bookingId);
                setSubmitted(true);
            } else {
                alert(data.message || 'Failed to create booking');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-[var(--muted)] pt-24 pb-12">
                    <div className="container max-w-lg">
                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={32} className="text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-[var(--primary)] mb-2">
                                Booking Confirmed!
                            </h1>
                            <p className="text-[var(--muted-foreground)] mb-6">
                                Your service appointment has been booked successfully.
                            </p>
                            <div className="bg-[var(--muted)] rounded-lg p-4 mb-6">
                                <p className="text-sm text-[var(--muted-foreground)]">Booking ID</p>
                                <p className="text-xl font-bold text-[var(--primary)]">{bookingId}</p>
                            </div>
                            <p className="text-sm text-[var(--muted-foreground)] mb-6">
                                We will call you shortly to confirm the appointment details.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => router.push('/track-status')}
                                    className="btn btn-primary w-full"
                                >
                                    Track Status
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="btn btn-outline w-full"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[var(--muted)] pt-24 pb-12">
                <div className="container max-w-2xl px-4">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2">
                            Book a Service
                        </h1>
                        <p className="text-[var(--muted-foreground)]">
                            Fill in the details below and we&apos;ll confirm your appointment.
                        </p>
                    </div>

                    {/* Booking Form */}
                    <div className="card p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Details */}
                            <div>
                                <h2 className="font-semibold text-lg text-[var(--primary)] mb-4 flex items-center gap-2">
                                    <User size={20} />
                                    Personal Details
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label htmlFor="customerName" className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            id="customerName"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            className="form-input"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">Phone Number *</label>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="form-input pl-10"
                                                placeholder="10-digit mobile number"
                                                pattern="[6-9][0-9]{9}"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mt-4">
                                    <label htmlFor="email" className="form-label">Email (Optional)</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="form-input"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Vehicle Details */}
                            <div>
                                <h2 className="font-semibold text-lg text-[var(--primary)] mb-4 flex items-center gap-2">
                                    <Car size={20} />
                                    Vehicle Details
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label htmlFor="vehicleType" className="form-label">Vehicle Type *</label>
                                        <div className="relative">
                                            <select
                                                id="vehicleType"
                                                value={formData.vehicleType}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    vehicleType: e.target.value as '2W' | '4W',
                                                    vehicleBrand: '',
                                                })}
                                                className="form-input form-select"
                                                required
                                            >
                                                <option value="">Select type</option>
                                                <option value="2W">Two Wheeler (Bike/Scooter)</option>
                                                <option value="4W">Four Wheeler (Car)</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="vehicleBrand" className="form-label">Brand *</label>
                                        <select
                                            id="vehicleBrand"
                                            value={formData.vehicleBrand}
                                            onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                                            className="form-input form-select"
                                            required
                                            disabled={!formData.vehicleType}
                                        >
                                            <option value="">Select brand</option>
                                            {availableBrands.map((brand) => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div className="form-group">
                                        <label htmlFor="vehicleModel" className="form-label">Model *</label>
                                        <input
                                            type="text"
                                            id="vehicleModel"
                                            value={formData.vehicleModel}
                                            onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                            className="form-input"
                                            placeholder="e.g., Swift, Activa"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="vehicleNumber" className="form-label">Vehicle Number</label>
                                        <input
                                            type="text"
                                            id="vehicleNumber"
                                            value={formData.vehicleNumber}
                                            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                                            className="form-input"
                                            placeholder="e.g., BR01AB1234"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Service Details */}
                            <div>
                                <h2 className="font-semibold text-lg text-[var(--primary)] mb-4 flex items-center gap-2">
                                    <Wrench size={20} />
                                    Service Details
                                </h2>
                                <div className="form-group">
                                    <label htmlFor="serviceType" className="form-label">Service Type *</label>
                                    <select
                                        id="serviceType"
                                        value={formData.serviceType}
                                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                        className="form-input form-select"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Select service</option>
                                        {services.map((service) => (
                                            <option key={service._id} value={service._id}>
                                                {service.name} - From ₹{service.basePrice.toLocaleString('en-IN')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div className="form-group">
                                        <label htmlFor="preferredDate" className="form-label">
                                            <Calendar size={16} className="inline mr-1" />
                                            Preferred Date *
                                        </label>
                                        <input
                                            type="date"
                                            id="preferredDate"
                                            value={formData.preferredDate}
                                            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                            className="form-input"
                                            min={getMinDate()}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="preferredTime" className="form-label">
                                            <Clock size={16} className="inline mr-1" />
                                            Preferred Time *
                                        </label>
                                        <select
                                            id="preferredTime"
                                            value={formData.preferredTime}
                                            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                            className="form-input form-select"
                                            required
                                        >
                                            <option value="">Select time</option>
                                            {TIME_SLOTS.map((slot) => (
                                                <option key={slot} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group mt-4">
                                    <label htmlFor="notes" className="form-label">Additional Notes</label>
                                    <textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="form-input resize-none"
                                        rows={3}
                                        placeholder="Any specific requirements or issues with your vehicle..."
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className="btn btn-primary w-full text-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner" />
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        <Calendar size={20} />
                                        Book Appointment
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-[var(--muted-foreground)]">
                                By booking, you agree to our terms and conditions.
                                We&apos;ll contact you to confirm the appointment.
                            </p>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
