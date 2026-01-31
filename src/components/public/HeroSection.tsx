'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Calendar, ChevronDown, Sparkles, Shield, Star } from 'lucide-react';

export default function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative min-h-[100svh] md:min-h-[90vh] flex items-center overflow-hidden pt-20 md:pt-0">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/gallery/hero_car_detailing_1769637970473.png"
                    alt="Premium Car Detailing Workshop"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Strong dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>

            {/* Subtle Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md rounded-full px-3 sm:px-5 py-2 sm:py-2.5 mb-4 sm:mb-6 border border-white/20">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400 sm:w-3.5 sm:h-3.5" />
                                ))}
                            </div>
                            <span className="text-white text-xs sm:text-sm font-medium">Since 1972 • 50+ Years</span>
                        </div>

                        {/* Heading - ALL WHITE for maximum contrast */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.1]">
                            Premium
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400">
                                Car & Bike Care
                            </span>
                            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 sm:mt-3 font-semibold text-white/90">
                                in Patna, Bihar
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                            Transform your vehicle with our expert detailing, PPF,
                            ceramic coating, and custom wraps.
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20">
                                <Sparkles size={14} className="text-orange-400" />
                                <span className="text-white text-xs sm:text-sm font-medium">Premium Detailing</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20">
                                <Shield size={14} className="text-orange-400" />
                                <span className="text-white text-xs sm:text-sm font-medium">PPF & Ceramic</span>
                            </div>
                        </div>

                        {/* CTA Buttons - Both prominent */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Link
                                href="/booking"
                                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 overflow-hidden"
                            >
                                {/* Shimmer effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <Calendar size={18} className="relative z-10" />
                                <span className="relative z-10">Book Service</span>
                            </Link>
                            <a
                                href="tel:9931759995"
                                className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg"
                            >
                                <Phone size={18} />
                                Call Now
                            </a>
                        </div>
                    </div>

                    {/* Stats Card - Right Side */}
                    <div className={`hidden lg:block transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { value: '50+', label: 'Years Experience' },
                                    { value: '10K+', label: 'Happy Customers' },
                                    { value: '8+', label: 'Premium Services' },
                                    { value: '100%', label: 'Satisfaction' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center p-4">
                                        <div className="text-4xl lg:text-5xl font-bold text-orange-400">
                                            {stat.value}
                                        </div>
                                        <div className="text-white/80 mt-2 text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                <ChevronDown size={32} className="text-white/60" />
            </div>
        </section>
    );
}
