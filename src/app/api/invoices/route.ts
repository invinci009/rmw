import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Invoice from '@/models/Invoice';
import JobCard from '@/models/JobCard';
import { successResponse, errorResponse, isAdmin, unauthorizedResponse } from '@/lib/auth';

// GET /api/invoices - List invoices (admin only)
export async function GET(request: NextRequest) {
    try {
        if (!isAdmin(request)) {
            return unauthorizedResponse('Admin access required');
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const paymentStatus = searchParams.get('paymentStatus');
        const phone = searchParams.get('phone');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const query: Record<string, unknown> = {};

        if (paymentStatus) query.paymentStatus = paymentStatus;
        if (phone) query.phone = phone;

        const skip = (page - 1) * limit;

        const [invoices, total] = await Promise.all([
            Invoice.find(query)
                .populate('jobCard', 'jobCardNumber')
                .sort({ generatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Invoice.countDocuments(query),
        ]);

        return successResponse({
            invoices,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get invoices error:', error);
        return errorResponse('Failed to fetch invoices', 500);
    }
}

// POST /api/invoices - Create invoice from job card (admin only)
export async function POST(request: NextRequest) {
    try {
        if (!isAdmin(request)) {
            return unauthorizedResponse('Admin access required');
        }

        const body = await request.json();
        await connectDB();

        if (!body.jobCardId) {
            return errorResponse('Job card ID is required', 400);
        }

        // Get job card
        const jobCard = await JobCard.findById(body.jobCardId);
        if (!jobCard) {
            return errorResponse('Job card not found', 404);
        }

        // Check if invoice already exists
        const existingInvoice = await Invoice.findOne({ jobCard: body.jobCardId });
        if (existingInvoice) {
            return errorResponse('Invoice already exists for this job card', 400);
        }

        // Calculate amounts
        const services = jobCard.servicesRequested.map((s) => ({
            name: s.name,
            description: s.description,
            quantity: 1,
            rate: s.actualCost || s.estimatedCost,
            amount: s.actualCost || s.estimatedCost,
        }));

        const parts = jobCard.partsUsed.map((p) => ({
            name: p.name,
            partNumber: p.partNumber,
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            amount: p.total,
        }));

        const servicesTotal = services.reduce((sum, s) => sum + s.amount, 0);
        const partsTotal = parts.reduce((sum, p) => sum + p.amount, 0);
        const labourCharges = jobCard.labourCharges;

        const subtotal = servicesTotal + partsTotal + labourCharges;
        const discountPercent = body.discountPercent || 0;
        const discountAmount = (subtotal * discountPercent) / 100;
        const taxableAmount = subtotal - discountAmount;

        const cgstPercent = body.cgstPercent ?? 9;
        const sgstPercent = body.sgstPercent ?? 9;
        const cgstAmount = (taxableAmount * cgstPercent) / 100;
        const sgstAmount = (taxableAmount * sgstPercent) / 100;
        const totalTax = cgstAmount + sgstAmount;

        const grandTotal = taxableAmount + totalTax;
        const roundOff = Math.round(grandTotal) - grandTotal;
        const finalAmount = Math.round(grandTotal);

        // Create invoice
        const invoice = await Invoice.create({
            jobCard: jobCard._id,
            customerName: jobCard.customerName,
            phone: jobCard.phone,
            email: jobCard.email,
            address: body.address,
            vehicleDetails: {
                type: jobCard.vehicleType,
                brand: jobCard.vehicleBrand,
                model: jobCard.vehicleModel,
                number: jobCard.vehicleNumber,
                color: jobCard.vehicleColor,
            },
            services,
            parts,
            labourCharges,
            subtotal,
            discountPercent,
            discountAmount,
            taxableAmount,
            cgstPercent,
            cgstAmount,
            sgstPercent,
            sgstAmount,
            totalTax,
            grandTotal,
            roundOff,
            finalAmount,
            notes: body.notes,
            termsAndConditions: body.termsAndConditions || 'Thank you for choosing Republic Motor Works. Warranty terms apply as per service type.',
        });

        return successResponse(invoice, 'Invoice created successfully');
    } catch (error) {
        console.error('Create invoice error:', error);
        return errorResponse('Failed to create invoice', 500);
    }
}
