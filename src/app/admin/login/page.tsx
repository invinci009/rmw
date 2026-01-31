'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                // Store token
                localStorage.setItem('rmw_admin_token', data.data.token);
                localStorage.setItem('rmw_admin_user', JSON.stringify(data.data.user));

                // Redirect to dashboard
                router.push('/admin/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--primary)] flex items-center justify-center p-4">
            <div className="card w-full max-w-md p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        RMW
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--primary)]">Admin Login</h1>
                    <p className="text-[var(--muted-foreground)]">Republic Motor Works</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input pl-10"
                                placeholder="admin@rmw.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input pl-10 pr-10"
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full"
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-[var(--muted)] rounded-lg text-sm">
                    <p className="text-[var(--muted-foreground)] mb-2">Demo Credentials:</p>
                    <p className="text-[var(--foreground)]">
                        Email: <code className="bg-white px-1 rounded">admin@rmw.com</code>
                    </p>
                    <p className="text-[var(--foreground)]">
                        Password: <code className="bg-white px-1 rounded">RMW@Admin123</code>
                    </p>
                </div>
            </div>
        </div>
    );
}
