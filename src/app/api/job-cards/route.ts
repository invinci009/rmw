import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import JobCard from '@/models/JobCard';
import Booking from '@/models/Booking';
import { successResponse, errorResponse, isAdmin, unauthorizedResponse } from '@/lib/auth';

// GET /api/job-cards - List job cards (admin only)
export async function GET(request: NextRequest) {
    try {
        if (!isAdmin(request)) {
            return unauthorizedResponse('Admin access required');
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const phone = searchParams.get('phone');
        const vehicleNumber = searchParams.get('vehicleNumber');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const query: Record<string, unknown> = {};

        if (status) query.status = status;
        if (phone) query.phone = phone;
        if (vehicleNumber) query.vehicleNumber = vehicleNumber.toUpperCase();

        const skip = (page - 1) * limit;

        const [jobCards, total] = await Promise.all([
            JobCard.find(query)
                .populate('booking', 'bookingId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            JobCard.countDocuments(query),
        ]);

        return successResponse({
            jobCards,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get job cards error:', error);
        return errorResponse('Failed to fetch job cards', 500);
    }
}

// POST /api/job-cards - Create job card (admin only)
export async function POST(request: NextRequest) {
    try {
        if (!isAdmin(request)) {
            return unauthorizedResponse('Admin access required');
        }

        const body = await request.json();
        await connectDB();

        // If creating from booking, get booking details
        if (body.bookingId) {
            const booking = await Booking.findById(body.bookingId).populate('serviceType');
            if (booking) {
                body.booking = booking._id;
                body.customerName = body.customerName || booking.customerName;
                body.phone = body.phone || booking.phone;
                body.email = body.email || booking.email;
                body.vehicleType = body.vehicleType || booking.vehicleType;
                body.vehicleBrand = body.vehicleBrand || booking.vehicleBrand;
                body.vehicleModel = body.vehicleModel || booking.vehicleModel;
                body.vehicleNumber = body.vehicleNumber || booking.vehicleNumber;

                // Add booked service if not already in servicesRequested
                if (!body.servicesRequested?.length && booking.serviceType) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const service = booking.serviceType as any;
                    body.servicesRequested = [{
                        service: service._id,
                        name: service.name,
                        description: service.shortDescription || '',
                        estimatedCost: service.basePrice || 0,
                        actualCost: 0,
                    }];
                }

                // Update booking status to completed
                await Booking.findByIdAndUpdate(body.bookingId, { status: 'completed' });
            }
        }

        // Initialize status history
        body.statusHistory = [{
            status: 'received',
            timestamp: new Date(),
        }];

        const jobCard = await JobCard.create(body);

        return successResponse(jobCard, 'Job card created successfully');
    } catch (error) {
        console.error('Create job card error:', error);
        return errorResponse('Failed to create job card', 500);
    }
}
