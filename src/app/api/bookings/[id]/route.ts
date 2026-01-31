import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { successResponse, errorResponse, isAdmin } from '@/lib/auth';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/bookings/[id] - Get booking by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        await connectDB();

        const booking = await Booking.findById(id)
            .populate('serviceType', 'name slug shortDescription basePrice')
            .lean();

        if (!booking) {
            return errorResponse('Booking not found', 404);
        }

        return successResponse(booking);
    } catch (error) {
        console.error('Get booking error:', error);
        return errorResponse('Failed to fetch booking', 500);
    }
}

// PATCH /api/bookings/[id] - Update booking (admin only for status)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectDB();

        // Only admin can update status
        if (body.status && !isAdmin(request)) {
            return errorResponse('Admin access required to update status', 403);
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).populate('serviceType', 'name slug');

        if (!booking) {
            return errorResponse('Booking not found', 404);
        }

        return successResponse(booking, 'Booking updated successfully');
    } catch (error) {
        console.error('Update booking error:', error);
        return errorResponse('Failed to update booking', 500);
    }
}

// DELETE /api/bookings/[id] - Cancel booking
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        await connectDB();

        const booking = await Booking.findByIdAndUpdate(
            id,
            { $set: { status: 'cancelled' } },
            { new: true }
        );

        if (!booking) {
            return errorResponse('Booking not found', 404);
        }

        return successResponse(null, 'Booking cancelled successfully');
    } catch (error) {
        console.error('Cancel booking error:', error);
        return errorResponse('Failed to cancel booking', 500);
    }
}
