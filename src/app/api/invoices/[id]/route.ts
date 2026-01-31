import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Invoice from '@/models/Invoice';
import { successResponse, errorResponse, isAdmin, unauthorizedResponse } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/invoices/[id] - Get invoice by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        await connectDB();

        const invoice = await Invoice.findById(id)
            .populate('jobCard', 'jobCardNumber mechanicAssigned serviceAdvisor')
            .lean();

        if (!invoice) {
            return errorResponse('Invoice not found', 404);
        }

        return successResponse(invoice);
    } catch (error) {
        console.error('Get invoice error:', error);
        return errorResponse('Failed to fetch invoice', 500);
    }
}

// PATCH /api/invoices/[id] - Update invoice payment (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        if (!isAdmin(request)) {
            return unauthorizedResponse('Admin access required');
        }

        const { id } = await params;
        const body = await request.json();
        await connectDB();

        // Only allow payment updates
        const allowedFields = ['paymentStatus', 'paymentMethod', 'amountPaid'];
        const updates: Record<string, unknown> = {};

        allowedFields.forEach((field) => {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return errorResponse('No valid fields to update', 400);
        }

        const invoice = await Invoice.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!invoice) {
            return errorResponse('Invoice not found', 404);
        }

        return successResponse(invoice, 'Invoice updated successfully');
    } catch (error) {
        console.error('Update invoice error:', error);
        return errorResponse('Failed to update invoice', 500);
    }
}
