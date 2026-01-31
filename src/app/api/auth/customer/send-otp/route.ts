import { NextRequest } from 'next/server';
import { generateOTP, storeOTP, successResponse, errorResponse } from '@/lib/auth';

// POST /api/auth/customer/send-otp - Send OTP to phone number
export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return errorResponse('Phone number is required', 400);
        }

        // Validate phone number (Indian format)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, '').slice(-10))) {
            return errorResponse('Invalid phone number', 400);
        }

        // Generate and store OTP
        const otp = generateOTP();
        storeOTP(phone, otp);

        // In development, log OTP (in production, send via SMS service)
        if (process.env.NODE_ENV !== 'production') {
            console.log(`📱 OTP for ${phone}: ${otp}`);
        }

        // TODO: Integrate with SMS service (MSG91, Twilio, etc.)
        // await sendSMS(phone, `Your RMW verification code is: ${otp}`);

        return successResponse({
            message: 'OTP sent successfully',
            // Only include OTP in response during development
            ...(process.env.NODE_ENV !== 'production' && { otp }),
        }, 'OTP sent to your phone number');

    } catch (error) {
        console.error('Send OTP error:', error);
        return errorResponse('Failed to send OTP. Please try again.', 500);
    }
}
