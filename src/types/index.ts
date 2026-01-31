// Shared TypeScript types for API requests and responses

// Vehicle types
export type VehicleType = '2W' | '4W';

// Booking status
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Job card status
export type JobCardStatus = 'received' | 'diagnosis' | 'in-progress' | 'ready' | 'delivered';

// Payment status
export type PaymentStatus = 'pending' | 'partial' | 'paid';

// User role
export type UserRole = 'admin' | 'customer';

// API Response wrapper
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// Service type
export interface ServiceType {
    _id: string;
    name: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    image: string;
    icon: string;
    vehicleTypes: VehicleType[];
    basePrice: number;
    estimatedTime: string;
    features: string[];
    isActive: boolean;
    order: number;
}

// Booking type
export interface BookingType {
    _id: string;
    bookingId: string;
    customerName: string;
    phone: string;
    email?: string;
    vehicleType: VehicleType;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber?: string;
    serviceType: string | ServiceType;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
    status: BookingStatus;
    createdAt: string;
}

// Job card type
export interface JobCardType {
    _id: string;
    jobCardNumber: string;
    customerName: string;
    phone: string;
    vehicleType: VehicleType;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber: string;
    odometerReading?: number;
    servicesRequested: {
        service?: string;
        name: string;
        description?: string;
        estimatedCost: number;
        actualCost: number;
    }[];
    partsUsed: {
        name: string;
        partNumber?: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    labourCharges: number;
    mechanicAssigned: string;
    status: JobCardStatus;
    estimatedDelivery?: string;
    receivedAt: string;
    createdAt: string;
}

// Invoice type
export interface InvoiceType {
    _id: string;
    invoiceNumber: string;
    jobCard: string | JobCardType;
    customerName: string;
    phone: string;
    vehicleDetails: {
        type: VehicleType;
        brand: string;
        model: string;
        number: string;
    };
    services: {
        name: string;
        description?: string;
        quantity: number;
        rate: number;
        amount: number;
    }[];
    parts: {
        name: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }[];
    labourCharges: number;
    subtotal: number;
    cgstAmount: number;
    sgstAmount: number;
    totalTax: number;
    grandTotal: number;
    finalAmount: number;
    paymentStatus: PaymentStatus;
    generatedAt: string;
}

// Status tracking response
export interface TrackingResponse {
    jobCardNumber: string;
    vehicleNumber: string;
    vehicleBrand: string;
    vehicleModel: string;
    status: JobCardStatus;
    statusLabel: string;
    receivedAt: string;
    estimatedDelivery?: string;
    timeline: {
        status: string;
        label: string;
        completed: boolean;
        timestamp?: string;
    }[];
}

// Vehicle history response
export interface VehicleHistoryResponse {
    phone: string;
    customerName: string;
    vehicles: {
        vehicleNumber: string;
        vehicleType: VehicleType;
        vehicleBrand: string;
        vehicleModel: string;
        services: {
            jobCardNumber: string;
            date: string;
            services: string[];
            totalAmount: number;
            status: JobCardStatus;
        }[];
    }[];
}

// Booking form data
export interface BookingFormData {
    customerName: string;
    phone: string;
    email?: string;
    vehicleType: VehicleType;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber?: string;
    serviceType: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
}

// Job card form data
export interface JobCardFormData {
    bookingId?: string;
    customerName: string;
    phone: string;
    email?: string;
    vehicleType: VehicleType;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber: string;
    vehicleColor?: string;
    odometerReading?: number;
    fuelLevel?: string;
    servicesRequested: {
        serviceId?: string;
        name: string;
        description?: string;
        estimatedCost: number;
    }[];
    mechanicAssigned?: string;
    serviceAdvisor?: string;
    estimatedDelivery?: string;
    customerNotes?: string;
}

// Status labels mapping
export const STATUS_LABELS: Record<JobCardStatus, string> = {
    'received': 'Vehicle Received',
    'diagnosis': 'Diagnosis Completed',
    'in-progress': 'Repair in Progress',
    'ready': 'Ready for Delivery',
    'delivered': 'Delivered',
};

// Vehicle brands
export const VEHICLE_BRANDS = {
    '2W': [
        'Honda', 'Hero', 'Bajaj', 'TVS', 'Royal Enfield', 'KTM',
        'Yamaha', 'Suzuki', 'Kawasaki', 'Harley-Davidson', 'Other'
    ],
    '4W': [
        'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda',
        'Toyota', 'Kia', 'Volkswagen', 'Skoda', 'MG', 'Ford',
        'Renault', 'Nissan', 'Jeep', 'Mercedes-Benz', 'BMW',
        'Audi', 'Other'
    ],
};

// Time slots
export const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];
