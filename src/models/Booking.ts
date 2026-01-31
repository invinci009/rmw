import mongoose, { Schema, Document, Model } from 'mongoose';

// Booking interface
export interface IBooking extends Document {
    _id: mongoose.Types.ObjectId;
    bookingId: string;
    customerName: string;
    phone: string;
    email?: string;
    vehicleType: '2W' | '4W';
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber?: string;
    serviceType: mongoose.Types.ObjectId;
    preferredDate: Date;
    preferredTime: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true,
        },
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        vehicleType: {
            type: String,
            enum: ['2W', '4W'],
            required: [true, 'Vehicle type is required'],
        },
        vehicleBrand: {
            type: String,
            required: [true, 'Vehicle brand is required'],
            trim: true,
        },
        vehicleModel: {
            type: String,
            required: [true, 'Vehicle model is required'],
            trim: true,
        },
        vehicleNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        serviceType: {
            type: Schema.Types.ObjectId,
            ref: 'Service',
            required: [true, 'Service type is required'],
        },
        preferredDate: {
            type: Date,
            required: [true, 'Preferred date is required'],
        },
        preferredTime: {
            type: String,
            required: [true, 'Preferred time is required'],
        },
        notes: {
            type: String,
            maxlength: 500,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
bookingSchema.index({ phone: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ status: 1, preferredDate: 1 });

// Generate booking ID before saving
bookingSchema.pre('save', async function () {
    if (!this.bookingId) {
        const year = new Date().getFullYear();
        const count = await mongoose.models.Booking.countDocuments();
        this.bookingId = `RMW-${year}-${String(count + 1).padStart(4, '0')}`;
    }
});

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
