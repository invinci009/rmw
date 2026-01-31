import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import JobCard from '@/models/JobCard';
import Invoice from '@/models/Invoice';
import { successResponse, errorResponse } from '@/lib/auth';

// GET /api/vehicles/history - Get vehicle service history by phone
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');

        if (!phone) {
            return errorResponse('Phone number is required', 400);
        }

        await connectDB();

        // Get all job cards for this phone number
        const jobCards = await JobCard.find({ phone })
            .sort({ createdAt: -1 })
            .lean();

        if (!jobCards.length) {
            return errorResponse('No service history found', 404);
        }

        // Get invoices for these job cards
        const jobCardIds = jobCards.map(jc => jc._id);
        const invoices = await Invoice.find({ jobCard: { $in: jobCardIds } })
            .select('jobCard finalAmount paymentStatus invoiceNumber')
            .lean();

        // Create invoice lookup map
        const invoiceMap = new Map(
            invoices.map(inv => [inv.jobCard.toString(), inv])
        );

        // Group by vehicle
        const vehicleMap = new Map<string, {
            vehicleNumber: string;
            vehicleType: string;
            vehicleBrand: string;
            vehicleModel: string;
            services: {
                jobCardNumber: string;
                date: string;
                services: string[];
                totalAmount: number;
                status: string;
                invoiceNumber?: string;
            }[];
        }>();

        jobCards.forEach((jc) => {
            const vehicleKey = jc.vehicleNumber;
            const invoice = invoiceMap.get(jc._id.toString());

            const serviceEntry = {
                jobCardNumber: jc.jobCardNumber,
                date: jc.createdAt.toISOString(),
                services: jc.servicesRequested.map((s) => s.name),
                totalAmount: invoice?.finalAmount || jc.finalTotal || 0,
                status: jc.status,
                invoiceNumber: invoice?.invoiceNumber,
            };

            if (vehicleMap.has(vehicleKey)) {
                vehicleMap.get(vehicleKey)!.services.push(serviceEntry);
            } else {
                vehicleMap.set(vehicleKey, {
                    vehicleNumber: jc.vehicleNumber,
                    vehicleType: jc.vehicleType,
                    vehicleBrand: jc.vehicleBrand,
                    vehicleModel: jc.vehicleModel,
                    services: [serviceEntry],
                });
            }
        });

        const customerName = jobCards[0].customerName;
        const vehicles = Array.from(vehicleMap.values());

        return successResponse({
            phone,
            customerName,
            totalVehicles: vehicles.length,
            totalServices: jobCards.length,
            vehicles,
        });
    } catch (error) {
        console.error('Get vehicle history error:', error);
        return errorResponse('Failed to fetch vehicle history', 500);
    }
}
