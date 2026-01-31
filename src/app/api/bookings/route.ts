import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import { successResponse, errorResponse, isAdmin } from '@/lib/auth';

// GET /api/bookings - List bookings (admin) or by phone (customer)
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const query: Record<string, unknown> = {};

        // Non-admin can only see their own bookings
        if (!isAdmin(request)) {
            if (!phone) {
                return errorResponse('Phone number is required', 400);
            }
            query.phone = phone;
        } else {
            if (phone) query.phone = phone;
        }

        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const [bookings, total] = await Promise.all([
            Booking.find(query)
                .populate('serviceType', 'name slug')
                .sort({ preferredDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Booking.countDocuments(query),
        ]);

        return successResponse({
            bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        return errorResponse('Failed to fetch bookings', 500);
    }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        await connectDB();

        // Validate required fields
        const required = ['customerName', 'phone', 'vehicleType', 'vehicleBrand', 'vehicleModel', 'serviceType', 'preferredDate', 'preferredTime'];
        for (const field of required) {
            if (!body[field]) {
                return errorResponse(`${field} is required`, 400);
            }
        }

        // Validate service exists
        const service = await Service.findById(body.serviceType);
        if (!service) {
            return errorResponse('Invalid service type', 400);
        }

        // Create booking
        const booking = await Booking.create(body);

        // Populate service for response
        await booking.populate('serviceType', 'name slug');

        return successResponse(booking, 'Booking created successfully');
    } catch (error) {
        console.error('Create booking error:', error);
        return errorResponse('Failed to create booking', 500);
    }
}
