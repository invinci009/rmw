'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowUp } from 'lucide-react';

const services = [
    { name: 'Car & Bike Detailing', href: '/services/car-bike-detailing' },
    { name: 'Paint Protection Film', href: '/services/paint-protection-film' },
    { name: 'Ceramic Coating', href: '/services/ceramic-coating' },
    { name: 'Vehicle Wraps', href: '/services/vehicle-wraps' },
    { name: 'Modifications', href: '/services/modifications-customization' },
];

const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Book Service', href: '/booking' },
    { name: 'Track Status', href: '/track-status' },
];

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Fixed Scroll to Top Button - appears after scrolling */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-24 right-6 z-40 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-orange-500 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                aria-label="Scroll to top"
            >
                <ArrowUp size={20} />
            </button>

            <footer className="bg-[#0f172a] text-white">
                {/* Newsletter Section */}
                <div className="container pt-12 pb-8">
                    <div className="bg-gradient-to-r from-orange-500/15 to-orange-600/10 rounded-2xl p-6 md:p-8 mb-10 border border-orange-500/20">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h4 className="text-xl font-bold mb-1 text-white">Get Exclusive Offers</h4>
                                <p className="text-gray-400 text-sm">Subscribe for special discounts and updates</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 sm:w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <button className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                        {/* Brand Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-900 font-bold text-lg">
                                    RMW
                                </div>
                                <div>
                                    <span className="font-bold text-lg block text-white">Republic</span>
                                    <span className="text-gray-500 text-xs">Motor Works</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                Patna&apos;s premier car and bike workshop since 1972.
                            </p>
                            <div className="flex gap-2">
                                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                                    <Facebook size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                                    <Instagram size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                                    <Youtube size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="font-bold text-white mb-4">Our Services</h4>
                            <ul className="space-y-2">
                                {services.map((service) => (
                                    <li key={service.name}>
                                        <Link
                                            href={service.href}
                                            className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                                        >
                                            {service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-bold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-bold text-white mb-4">Contact Us</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <Phone size={16} className="text-orange-400" />
                                    <a href="tel:9931759995" className="text-gray-400 hover:text-white text-sm">9931759995</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail size={16} className="text-orange-400" />
                                    <a href="mailto:republicmotorworks@gmail.com" className="text-gray-400 hover:text-white text-sm truncate">republicmotorworks@gmail.com</a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin size={16} className="text-orange-400 mt-0.5" />
                                    <span className="text-gray-400 text-sm">Patna, Bihar</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
                            <p>© {new Date().getFullYear()} Republic Motor Works. All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
