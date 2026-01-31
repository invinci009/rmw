'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/#about' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Contact', href: '/#contact' },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white shadow-lg py-3'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="container">
                <nav className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-lg transition-all ${isScrolled
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-900'
                            }`}>
                            RMW
                        </div>
                        <div className={`hidden sm:block transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                            <span className="font-bold text-lg block leading-tight">Republic</span>
                            <span className="text-xs opacity-70">Motor Works</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isScrolled
                                    ? 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href="tel:9931759995"
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'
                                }`}
                        >
                            <Phone size={16} />
                            <span className="hidden xl:inline">9931759995</span>
                        </a>
                        <Link
                            href="/booking"
                            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Book Now
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-white hover:bg-white/10'
                            }`}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4">
                        <div className="bg-white rounded-xl shadow-xl p-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <hr className="my-2" />
                            <Link
                                href="/booking"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full text-center py-3 bg-orange-500 text-white rounded-lg font-semibold"
                            >
                                Book Service
                            </Link>
                            <a
                                href="tel:9931759995"
                                className="flex items-center justify-center gap-2 py-3 text-gray-700 font-medium"
                            >
                                <Phone size={18} />
                                Call: 9931759995
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
