import mongoose, { Schema, Document, Model } from 'mongoose';

// Service line item
interface IInvoiceService {
    name: string;
    description?: string;
    quantity: number;
    rate: number;
    amount: number;
}

// Part line item
interface IInvoicePart {
    name: string;
    partNumber?: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

// Vehicle details
interface IVehicleDetails {
    type: '2W' | '4W';
    brand: string;
    model: string;
    number: string;
    color?: string;
}

// Invoice interface
export interface IInvoice extends Document {
    _id: mongoose.Types.ObjectId;
    invoiceNumber: string;
    jobCard: mongoose.Types.ObjectId;
    customerName: string;
    phone: string;
    email?: string;
    address?: string;
    vehicleDetails: IVehicleDetails;
    services: IInvoiceService[];
    parts: IInvoicePart[];
    labourCharges: number;
    subtotal: number;
    discountPercent: number;
    discountAmount: number;
    taxableAmount: number;
    cgstPercent: number;
    cgstAmount: number;
    sgstPercent: number;
    sgstAmount: number;
    totalTax: number;
    grandTotal: number;
    roundOff: number;
    finalAmount: number;
    paymentStatus: 'pending' | 'partial' | 'paid';
    paymentMethod?: string;
    amountPaid: number;
    balanceDue: number;
    notes?: string;
    termsAndConditions?: string;
    generatedAt: Date;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const invoiceServiceSchema = new Schema<IInvoiceService>({
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, default: 1 },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
}, { _id: false });

const invoicePartSchema = new Schema<IInvoicePart>({
    name: { type: String, required: true },
    partNumber: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
}, { _id: false });

const vehicleDetailsSchema = new Schema<IVehicleDetails>({
    type: { type: String, enum: ['2W', '4W'], required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    number: { type: String, required: true },
    color: { type: String },
}, { _id: false });

const invoiceSchema = new Schema<IInvoice>(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        jobCard: {
            type: Schema.Types.ObjectId,
            ref: 'JobCard',
            required: true,
        },
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        address: {
            type: String,
            trim: true,
        },
        vehicleDetails: vehicleDetailsSchema,
        services: [invoiceServiceSchema],
        parts: [invoicePartSchema],
        labourCharges: {
            type: Number,
            default: 0,
        },
        subtotal: {
            type: Number,
            required: true,
        },
        discountPercent: {
            type: Number,
            default: 0,
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        taxableAmount: {
            type: Number,
            required: true,
        },
        cgstPercent: {
            type: Number,
            default: 9, // 9% CGST
        },
        cgstAmount: {
            type: Number,
            default: 0,
        },
        sgstPercent: {
            type: Number,
            default: 9, // 9% SGST
        },
        sgstAmount: {
            type: Number,
            default: 0,
        },
        totalTax: {
            type: Number,
            default: 0,
        },
        grandTotal: {
            type: Number,
            required: true,
        },
        roundOff: {
            type: Number,
            default: 0,
        },
        finalAmount: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'partial', 'paid'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            trim: true,
        },
        amountPaid: {
            type: Number,
            default: 0,
        },
        balanceDue: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
            maxlength: 500,
        },
        termsAndConditions: {
            type: String,
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },
        paidAt: Date,
    },
    {
        timestamps: true,
    }
);

// Indexes
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ phone: 1 });
invoiceSchema.index({ jobCard: 1 });
invoiceSchema.index({ paymentStatus: 1 });

// Generate invoice number before saving
invoiceSchema.pre('save', async function () {
    if (!this.invoiceNumber) {
        const year = new Date().getFullYear();
        const count = await mongoose.models.Invoice.countDocuments();
        this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
    }

    // Calculate balance due
    this.balanceDue = this.finalAmount - this.amountPaid;

    // Update payment status
    if (this.amountPaid >= this.finalAmount) {
        this.paymentStatus = 'paid';
        if (!this.paidAt) this.paidAt = new Date();
    } else if (this.amountPaid > 0) {
        this.paymentStatus = 'partial';
    }
});

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice;
