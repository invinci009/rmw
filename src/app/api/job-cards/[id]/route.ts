import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import JobCard from '@/models/JobCard';
import { successResponse, errorResponse, isAdmin, unauthorizedResponse } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/job-cards/[id] - Get job card by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        await connectDB();

        const jobCard = await JobCard.findById(id)
            .populate('booking', 'bookingId preferredDate')
            .lean();

        if (!jobCard) {
            return errorResponse('Job card not found', 404);
        }

        return successResponse(jobCard);
    } catch (error) {
        console.error('Get job card error:', error);
        return errorResponse('Failed to fetch job card', 500);
    }
}

// PATCH /api/job-cards/[id] - Update job card (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        if (!isAdmin(request)) {
            return unauthorizedResponse('Admin access required');
        }

        const { id } = await params;
        const body = await request.json();
        await connectDB();

        // Calculate totals if parts or services are updated
        if (body.partsUsed || body.servicesRequested || body.labourCharges !== undefined) {
            const jobCard = await JobCard.findById(id);
            if (jobCard) {
                let partsTotal = 0;
                let servicesTotal = 0;

                const parts = body.partsUsed || jobCard.partsUsed;
                const services = body.servicesRequested || jobCard.servicesRequested;
                const labour = body.labourCharges ?? jobCard.labourCharges;

                parts.forEach((part: { total: number }) => {
                    partsTotal += part.total || 0;
                });

                services.forEach((service: { actualCost: number }) => {
                    servicesTotal += service.actualCost || 0;
                });

                body.finalTotal = partsTotal + servicesTotal + labour;
            }
        }

        const jobCard = await JobCard.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!jobCard) {
            return errorResponse('Job card not found', 404);
        }

        return successResponse(jobCard, 'Job card updated successfully');
    } catch (error) {
        console.error('Update job card error:', error);
        return errorResponse('Failed to update job card', 500);
    }
}

// DELETE /api/job-cards/[id] - Delete job card (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        if (!isAdmin(request)) {
            return unauthorizedResponse('Admin access required');
        }

        const { id } = await params;
        await connectDB();

        const jobCard = await JobCard.findByIdAndDelete(id);

        if (!jobCard) {
            return errorResponse('Job card not found', 404);
        }

        return successResponse(null, 'Job card deleted successfully');
    } catch (error) {
        console.error('Delete job card error:', error);
        return errorResponse('Failed to delete job card', 500);
    }
}
