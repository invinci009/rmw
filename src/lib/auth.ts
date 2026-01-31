import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const TOKEN_NAME = 'rmw_auth_token';

export interface JWTPayload {
    userId: string;
    role: 'admin' | 'customer';
    phone?: string;
    email?: string;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

// Get token from request
export function getTokenFromRequest(request: NextRequest): string | null {
    // Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    // Check cookies
    const cookieToken = request.cookies.get(TOKEN_NAME)?.value;
    return cookieToken || null;
}

// Get current user from request
export function getCurrentUser(request: NextRequest): JWTPayload | null {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token);
}

// Check if user is admin
export function isAdmin(request: NextRequest): boolean {
    const user = getCurrentUser(request);
    return user?.role === 'admin';
}

// Set auth cookie (for server actions)
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

// Clear auth cookie
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_NAME);
}

// Generate OTP (mock for development)
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in memory (use Redis in production)
const otpStore: Map<string, { otp: string; expiresAt: Date }> = new Map();

export function storeOTP(phone: string, otp: string) {
    otpStore.set(phone, {
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });
}

export function verifyOTP(phone: string, otp: string): boolean {
    const stored = otpStore.get(phone);
    if (!stored) return false;

    if (new Date() > stored.expiresAt) {
        otpStore.delete(phone);
        return false;
    }

    if (stored.otp === otp) {
        otpStore.delete(phone);
        return true;
    }

    return false;
}

// API response helpers
export function successResponse(data: unknown, message?: string) {
    return Response.json({
        success: true,
        message,
        data,
    });
}

export function errorResponse(message: string, status: number = 400) {
    return Response.json(
        { success: false, message },
        { status }
    );
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
    return errorResponse(message, 401);
}
