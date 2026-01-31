import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { successResponse, errorResponse, isAdmin } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// GET /api/services/[slug] - Get service by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        await connectDB();

        const service = await Service.findOne({ slug }).lean();

        if (!service) {
            return errorResponse('Service not found', 404);
        }

        return successResponse(service);
    } catch (error) {
        console.error('Get service error:', error);
        return errorResponse('Failed to fetch service', 500);
    }
}

// PATCH /api/services/[slug] - Update service (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        if (!isAdmin(request)) {
            return errorResponse('Admin access required', 403);
        }

        const { slug } = await params;
        const body = await request.json();
        await connectDB();

        const service = await Service.findOneAndUpdate(
            { slug },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!service) {
            return errorResponse('Service not found', 404);
        }

        return successResponse(service, 'Service updated successfully');
    } catch (error) {
        console.error('Update service error:', error);
        return errorResponse('Failed to update service', 500);
    }
}

// DELETE /api/services/[slug] - Delete service (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        if (!isAdmin(request)) {
            return errorResponse('Admin access required', 403);
        }

        const { slug } = await params;
        await connectDB();

        const service = await Service.findOneAndDelete({ slug });

        if (!service) {
            return errorResponse('Service not found', 404);
        }

        return successResponse(null, 'Service deleted successfully');
    } catch (error) {
        console.error('Delete service error:', error);
        return errorResponse('Failed to delete service', 500);
    }
}
