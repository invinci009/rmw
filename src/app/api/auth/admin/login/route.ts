import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken, successResponse, errorResponse } from '@/lib/auth';

// POST /api/auth/admin/login - Admin login with email/password
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return errorResponse('Email and password are required', 400);
        }

        await connectDB();

        // Find admin user with password
        const user = await User.findOne({ email, role: 'admin' }).select('+password');

        if (!user) {
            return errorResponse('Invalid credentials', 401);
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return errorResponse('Invalid credentials', 401);
        }

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            role: 'admin',
            email: user.email,
        });

        return successResponse({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, 'Login successful');

    } catch (error) {
        console.error('Admin login error:', error);
        return errorResponse('Login failed. Please try again.', 500);
    }
}
