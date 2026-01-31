import mongoose, { Schema, Document, Model } from 'mongoose';

// Service item in job card
interface IServiceItem {
    service: mongoose.Types.ObjectId;
    name: string;
    description: string;
    estimatedCost: number;
    actualCost: number;
}

// Part used in job card
interface IPart {
    name: string;
    partNumber?: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

// Status history entry
interface IStatusHistory {
    status: string;
    timestamp: Date;
    notes?: string;
    updatedBy?: string;
}

// Job Card interface
export interface IJobCard extends Document {
    _id: mongoose.Types.ObjectId;
    jobCardNumber: string;
    booking?: mongoose.Types.ObjectId;
    customerName: string;
    phone: string;
    email?: string;
    vehicleType: '2W' | '4W';
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber: string;
    vehicleColor?: string;
    odometerReading?: number;
    fuelLevel?: string;
    servicesRequested: IServiceItem[];
    partsUsed: IPart[];
    labourCharges: number;
    mechanicAssigned: string;
    serviceAdvisor?: string;
    status: 'received' | 'diagnosis' | 'in-progress' | 'ready' | 'delivered';
    statusHistory: IStatusHistory[];
    estimatedDelivery?: Date;
    estimatedTotal: number;
    finalTotal: number;
    customerNotes?: string;
    internalNotes?: string;
    receivedAt: Date;
    diagnosisCompletedAt?: Date;
    repairStartedAt?: Date;
    readyAt?: Date;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const serviceItemSchema = new Schema<IServiceItem>({
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
    },
    name: { type: String, required: true },
    description: { type: String },
    estimatedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
}, { _id: false });

const partSchema = new Schema<IPart>({
    name: { type: String, required: true },
    partNumber: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true },
}, { _id: false });

const statusHistorySchema = new Schema<IStatusHistory>({
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
    updatedBy: { type: String },
}, { _id: false });

const jobCardSchema = new Schema<IJobCard>(
    {
        jobCardNumber: {
            type: String,
            required: true,
            unique: true,
        },
        booking: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
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
            required: true,
        },
        vehicleBrand: {
            type: String,
            required: true,
            trim: true,
        },
        vehicleModel: {
            type: String,
            required: true,
            trim: true,
        },
        vehicleNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        vehicleColor: {
            type: String,
            trim: true,
        },
        odometerReading: {
            type: Number,
            min: 0,
        },
        fuelLevel: {
            type: String,
            enum: ['empty', 'quarter', 'half', 'three-quarter', 'full'],
        },
        servicesRequested: [serviceItemSchema],
        partsUsed: [partSchema],
        labourCharges: {
            type: Number,
            default: 0,
            min: 0,
        },
        mechanicAssigned: {
            type: String,
            trim: true,
        },
        serviceAdvisor: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['received', 'diagnosis', 'in-progress', 'ready', 'delivered'],
            default: 'received',
        },
        statusHistory: [statusHistorySchema],
        estimatedDelivery: {
            type: Date,
        },
        estimatedTotal: {
            type: Number,
            default: 0,
        },
        finalTotal: {
            type: Number,
            default: 0,
        },
        customerNotes: {
            type: String,
            maxlength: 1000,
        },
        internalNotes: {
            type: String,
            maxlength: 1000,
        },
        receivedAt: {
            type: Date,
            default: Date.now,
        },
        diagnosisCompletedAt: Date,
        repairStartedAt: Date,
        readyAt: Date,
        deliveredAt: Date,
    },
    {
        timestamps: true,
    }
);

// Indexes
jobCardSchema.index({ jobCardNumber: 1 });
jobCardSchema.index({ phone: 1 });
jobCardSchema.index({ vehicleNumber: 1 });
jobCardSchema.index({ status: 1 });

// Generate job card number before saving
jobCardSchema.pre('save', async function () {
    if (!this.jobCardNumber) {
        const year = new Date().getFullYear();
        const count = await mongoose.models.JobCard.countDocuments();
        this.jobCardNumber = `JC-${year}-${String(count + 1).padStart(4, '0')}`;
    }

    // Add status history entry if status changed
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
        });

        // Update timestamp fields based on status
        const now = new Date();
        switch (this.status) {
            case 'diagnosis':
                this.diagnosisCompletedAt = now;
                break;
            case 'in-progress':
                this.repairStartedAt = now;
                break;
            case 'ready':
                this.readyAt = now;
                break;
            case 'delivered':
                this.deliveredAt = now;
                break;
        }
    }
});

const JobCard: Model<IJobCard> = mongoose.models.JobCard || mongoose.model<IJobCard>('JobCard', jobCardSchema);

export default JobCard;
