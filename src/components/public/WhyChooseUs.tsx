'use client';

import { useEffect, useRef, useState } from 'react';
import { Award, Clock, Shield, Users, Wrench, ThumbsUp, CheckCircle, Phone } from 'lucide-react';

const features = [
    {
        icon: <Award size={28} />,
        title: '50+ Years Experience',
        description: 'Serving Patna since 1972 with unmatched expertise.',
        stat: '1972',
        statLabel: 'Since',
    },
    {
        icon: <Users size={28} />,
        title: 'Expert Technicians',
        description: 'Skilled professionals trained in latest techniques.',
        stat: '25+',
        statLabel: 'Experts',
    },
    {
        icon: <Shield size={28} />,
        title: 'Premium Materials',
        description: 'Only industry-grade products for lasting results.',
        stat: '100%',
        statLabel: 'Original',
    },
    {
        icon: <Clock size={28} />,
        title: 'Timely Delivery',
        description: 'We respect your time and deliver as promised.',
        stat: '24hr',
        statLabel: 'Updates',
    },
    {
        icon: <Wrench size={28} />,
        title: 'Modern Equipment',
        description: 'State-of-the-art tools for precision work.',
        stat: '50+',
        statLabel: 'Tools',
    },
    {
        icon: <ThumbsUp size={28} />,
        title: '100% Satisfaction',
        description: 'Your satisfaction is our top priority.',
        stat: '10K+',
        statLabel: 'Happy',
    },
];

export default function WhyChooseUs() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="section bg-[#0f172a] relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10">
                {/* Section Header - WHITE TEXT for contrast */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold mb-4">
                        Why Trust RMW
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Why Choose Us
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Every service is carried out with professional tools and premium materials.
                        Your vehicle deserves expert care.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                                    {feature.icon}
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-orange-400">{feature.stat}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">{feature.statLabel}</div>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2 group-hover:text-orange-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Guarantee Banner */}
                <div className={`mt-16 bg-gradient-to-r from-orange-500/20 to-orange-600/10 rounded-2xl p-8 border border-orange-500/30 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`} style={{ transitionDelay: '600ms' }}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                <CheckCircle size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">100% Quality Guarantee</h4>
                                <p className="text-gray-400">Not satisfied? We&apos;ll make it right — no questions asked.</p>
                            </div>
                        </div>
                        <a
                            href="tel:9931759995"
                            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                        >
                            <Phone size={20} />
                            Call: 9931759995
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
