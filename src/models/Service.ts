import mongoose, { Schema, Document, Model } from 'mongoose';

// Service interface
export interface IService extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    image: string;
    icon: string;
    vehicleTypes: ('2W' | '4W')[];
    basePrice: number;
    estimatedTime: string;
    features: string[];
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
    {
        name: {
            type: String,
            required: [true, 'Service name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        shortDescription: {
            type: String,
            required: true,
            maxlength: 200,
        },
        fullDescription: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: '/images/services/default.jpg',
        },
        icon: {
            type: String,
            default: 'Wrench',
        },
        vehicleTypes: [{
            type: String,
            enum: ['2W', '4W'],
        }],
        basePrice: {
            type: Number,
            required: true,
            min: 0,
        },
        estimatedTime: {
            type: String,
            default: '1-2 hours',
        },
        features: [{
            type: String,
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
serviceSchema.index({ slug: 1 });
serviceSchema.index({ isActive: 1, order: 1 });

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);

export default Service;
