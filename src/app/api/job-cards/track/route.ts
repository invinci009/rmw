import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import JobCard from '@/models/JobCard';
import { successResponse, errorResponse } from '@/lib/auth';
import { STATUS_LABELS } from '@/types';

// GET /api/job-cards/track - Track service status by phone or job card number
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');
        const jobCardNumber = searchParams.get('jobCardNumber');

        if (!phone && !jobCardNumber) {
            return errorResponse('Phone number or job card number is required', 400);
        }

        await connectDB();

        const query: Record<string, unknown> = {};

        if (jobCardNumber) {
            query.jobCardNumber = jobCardNumber.toUpperCase();
        } else if (phone) {
            query.phone = phone;
            query.status = { $ne: 'delivered' }; // Only show active jobs for phone search
        }

        const jobCards = await JobCard.find(query)
            .select('jobCardNumber vehicleNumber vehicleBrand vehicleModel status statusHistory receivedAt estimatedDelivery')
            .sort({ createdAt: -1 })
            .limit(jobCardNumber ? 1 : 5)
            .lean();

        if (!jobCards.length) {
            return errorResponse('No service records found', 404);
        }

        // Format tracking response
        const trackingData = jobCards.map((jc) => {
            const allStatuses = ['received', 'diagnosis', 'in-progress', 'ready', 'delivered'] as const;
            const currentIndex = allStatuses.indexOf(jc.status as typeof allStatuses[number]);

            const timeline = allStatuses.map((status, index) => {
                const historyEntry = jc.statusHistory?.find((h) => h.status === status);
                return {
                    status,
                    label: STATUS_LABELS[status],
                    completed: index <= currentIndex,
                    timestamp: historyEntry?.timestamp?.toISOString(),
                };
            });

            return {
                jobCardNumber: jc.jobCardNumber,
                vehicleNumber: jc.vehicleNumber,
                vehicleBrand: jc.vehicleBrand,
                vehicleModel: jc.vehicleModel,
                status: jc.status,
                statusLabel: STATUS_LABELS[jc.status as keyof typeof STATUS_LABELS],
                receivedAt: jc.receivedAt,
                estimatedDelivery: jc.estimatedDelivery,
                timeline,
            };
        });

        return successResponse(jobCardNumber ? trackingData[0] : trackingData);
    } catch (error) {
        console.error('Track job card error:', error);
        return errorResponse('Failed to fetch tracking information', 500);
    }
}
