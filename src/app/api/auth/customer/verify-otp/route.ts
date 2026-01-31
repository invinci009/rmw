import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyOTP, generateToken, successResponse, errorResponse } from '@/lib/auth';

// POST /api/auth/customer/verify-otp - Verify OTP and login/register
export async function POST(request: NextRequest) {
    try {
        const { phone, otp, name } = await request.json();

        if (!phone || !otp) {
            return errorResponse('Phone number and OTP are required', 400);
        }

        // Verify OTP
        const isValid = verifyOTP(phone, otp);
        if (!isValid) {
            return errorResponse('Invalid or expired OTP', 401);
        }

        await connectDB();

        // Find or create customer
        let user = await User.findOne({ phone, role: 'customer' });

        if (!user) {
            // Create new customer
            if (!name) {
                return errorResponse('Name is required for new customers', 400);
            }

            user = await User.create({
                name,
                phone,
                role: 'customer',
            });
        }

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            role: 'customer',
            phone: user.phone,
        });

        return successResponse({
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
            },
            isNewUser: !user.createdAt || Date.now() - user.createdAt.getTime() < 1000,
        }, 'Verification successful');

    } catch (error) {
        console.error('Verify OTP error:', error);
        return errorResponse('Verification failed. Please try again.', 500);
    }
}
