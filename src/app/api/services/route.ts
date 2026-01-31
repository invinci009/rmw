import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { successResponse, errorResponse, isAdmin } from '@/lib/auth';

// GET /api/services - List all active services
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const vehicleType = searchParams.get('vehicleType');
        const includeInactive = searchParams.get('includeInactive') === 'true' && isAdmin(request);

        const query: Record<string, unknown> = {};

        if (!includeInactive) {
            query.isActive = true;
        }

        if (vehicleType && ['2W', '4W'].includes(vehicleType)) {
            query.vehicleTypes = vehicleType;
        }

        const services = await Service.find(query)
            .sort({ order: 1, name: 1 })
            .lean();

        return successResponse(services);
    } catch (error) {
        console.error('Get services error:', error);
        return errorResponse('Failed to fetch services', 500);
    }
}

// POST /api/services - Create new service (admin only)
export async function POST(request: NextRequest) {
    try {
        if (!isAdmin(request)) {
            return errorResponse('Admin access required', 403);
        }

        const body = await request.json();
        await connectDB();

        // Generate slug from name
        const slug = body.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const service = await Service.create({
            ...body,
            slug,
        });

        return successResponse(service, 'Service created successfully');
    } catch (error) {
        console.error('Create service error:', error);
        return errorResponse('Failed to create service', 500);
    }
}
