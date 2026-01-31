'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Car, Film, Droplets, Layers, ArrowRight, Check
} from 'lucide-react';
import TrustBadges from '@/components/shared/TrustBadges';

// Icon mapping for services
const iconMap: Record<string, React.ReactNode> = {
    Car: <Car size={24} />,
    Film: <Film size={24} />,
    Droplets: <Droplets size={24} />,
    Layers: <Layers size={24} />,
};

// Services with images
const services = [
    {
        name: 'Car & Bike Detailing',
        slug: 'car-bike-detailing',
        shortDescription: 'Complete interior and exterior restoration for that showroom shine.',
        icon: 'Car',
        basePrice: 2500,
        image: '/images/gallery/hero_car_detailing_1769637970473.png',
        features: ['Interior Deep Clean', 'Exterior Polish', 'Engine Bay Cleaning'],
        popular: true,
    },
    {
        name: 'Paint Protection Film',
        slug: 'paint-protection-film',
        shortDescription: 'Invisible armor that protects your paint from scratches and chips.',
        icon: 'Film',
        basePrice: 15000,
        image: '/images/gallery/ppf_installation_1769638005839.png',
        features: ['Self-Healing Technology', 'UV Protection', '5+ Year Warranty'],
        popular: true,
    },
    {
        name: 'Ceramic Coating',
        slug: 'ceramic-coating',
        shortDescription: 'Advanced nano-technology for ultimate gloss and hydrophobic protection.',
        icon: 'Droplets',
        basePrice: 12000,
        image: '/images/gallery/ceramic_coating_1769637989851.png',
        features: ['9H Hardness', 'Hydrophobic Effect', '3-5 Year Protection'],
        popular: false,
    },
    {
        name: 'Vehicle Wraps',
        slug: 'vehicle-wraps',
        shortDescription: 'Transform your vehicle with custom colors and finishes.',
        icon: 'Layers',
        basePrice: 25000,
        image: '/images/gallery/car_wrap_1769638040079.png',
        features: ['Color Change', 'Matte/Gloss Options', 'Paint Protection'],
        popular: false,
    },
];

export default function ServicesSection() {
    const [activeService, setActiveService] = useState(0);

    return (
        <section className="section bg-gray-50" id="services">
            <div className="container">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
                        Premium Services
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What We Offer
                    </h2>
                    <p className="text-gray-600 text-lg">
                        From basic wash to complete protection — premium care for your vehicle.
                    </p>
                </div>

                {/* Trust Badges */}
                <div className="mb-12">
                    <TrustBadges />
                </div>

                {/* Featured Services - Interactive Display */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-12">
                    {/* Service Image - with strong overlay for text */}
                    <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] rounded-2xl overflow-hidden shadow-xl">
                        <Image
                            src={services[activeService].image}
                            alt={services[activeService].name}
                            fill
                            className="object-cover transition-all duration-700"
                        />
                        {/* Strong gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-white rounded-xl px-4 py-2 shadow-lg">
                            <p className="text-xs text-gray-500">Starting from</p>
                            <p className="text-xl font-bold text-orange-500">
                                ₹{services[activeService].basePrice.toLocaleString('en-IN')}
                            </p>
                        </div>

                        {/* Service Info Overlay - at bottom with dark background */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                                    {iconMap[services[activeService].icon]}
                                </div>
                                {services[activeService].popular && (
                                    <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                                        POPULAR
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {services[activeService].name}
                            </h3>
                            <p className="text-white/80">
                                {services[activeService].shortDescription}
                            </p>
                        </div>
                    </div>

                    {/* Service Features & CTA */}
                    <div className="flex flex-col justify-center bg-white rounded-2xl p-8 shadow-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-6">What&apos;s Included:</h4>
                        <div className="space-y-4 mb-8">
                            {services[activeService].features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check size={16} className="text-green-600" />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href={`/booking?service=${services[activeService].slug}`}
                            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02]"
                        >
                            Book This Service
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Service Selector Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {services.map((service, index) => (
                        <button
                            key={service.slug}
                            onClick={() => setActiveService(index)}
                            className={`group relative p-5 rounded-xl text-left transition-all duration-300 ${activeService === index
                                ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-[1.02]'
                                : 'bg-white hover:bg-gray-50 shadow hover:shadow-lg hover:-translate-y-1'
                                }`}
                        >
                            {/* Active indicator */}
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-b-full transition-all duration-300 ${activeService === index ? 'w-12 bg-orange-500' : 'w-0'}`} />

                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 ${activeService === index
                                ? 'bg-orange-500 text-white'
                                : 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                                }`}>
                                {iconMap[service.icon]}
                            </div>
                            <h4 className={`font-semibold text-sm mb-1 ${activeService === index ? 'text-white' : 'text-gray-900'
                                }`}>
                                {service.name}
                            </h4>
                            <p className={`text-xs ${activeService === index ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                From ₹{service.basePrice.toLocaleString('en-IN')}
                            </p>
                        </button>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-10">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                        View All 8 Services
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
