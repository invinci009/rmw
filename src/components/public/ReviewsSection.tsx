'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: 'Rahul Sharma',
        vehicle: 'BMW 5 Series',
        rating: 5,
        text: 'Got ceramic coating done for my BMW. The finish is absolutely stunning — looks better than when it was new! The team was very professional.',
        service: 'Ceramic Coating',
        initials: 'RS',
    },
    {
        id: 2,
        name: 'Priya Singh',
        vehicle: 'Honda Activa',
        rating: 5,
        text: 'Best detailing service in Patna! My Activa looks brand new. The staff is friendly and they take excellent care of vehicles.',
        service: 'Bike Detailing',
        initials: 'PS',
    },
    {
        id: 3,
        name: 'Amit Kumar',
        vehicle: 'Maruti Swift',
        rating: 5,
        text: 'Excellent PPF installation. The team was meticulous and the quality of film used is top-notch. Been 6 months and it still looks perfect.',
        service: 'Paint Protection Film',
        initials: 'AK',
    },
    {
        id: 4,
        name: 'Vikash Ranjan',
        vehicle: 'Royal Enfield Classic',
        rating: 5,
        text: 'Got my Classic 350 wrapped in matte black. The transformation is incredible! Great attention to detail and very fair pricing.',
        service: 'Vehicle Wrap',
        initials: 'VR',
    },
];

export default function ReviewsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

    useEffect(() => {
        if (isAutoPlaying) {
            intervalRef.current = setInterval(next, 5000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isAutoPlaying]);

    const handleInteraction = () => {
        setIsAutoPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    return (
        <section className="section bg-gray-50">
            <div className="container">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-4">
                        ⭐ Reviews
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Real reviews from real customers who trusted us with their vehicles.
                    </p>
                </div>

                {/* Main Review Display */}
                <div className="max-w-3xl mx-auto">
                    <div className="relative">
                        {/* Quote Icon */}
                        <div className="absolute -top-3 left-6 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center z-10 shadow-lg shadow-orange-500/30">
                            <Quote size={20} className="text-white" />
                        </div>

                        {/* Review Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 pt-12 border border-gray-100 relative overflow-hidden">
                            {/* Subtle gradient accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-transparent rounded-bl-full" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-4 relative z-10">
                                {Array.from({ length: reviews[currentIndex].rating }).map((_, i) => (
                                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                &ldquo;{reviews[currentIndex].text}&rdquo;
                            </p>

                            {/* Reviewer Info */}
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                                        {reviews[currentIndex].initials}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{reviews[currentIndex].name}</p>
                                        <p className="text-gray-500 text-sm">
                                            {reviews[currentIndex].vehicle} • {reviews[currentIndex].service}
                                        </p>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { handleInteraction(); prev(); }}
                                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors"
                                        aria-label="Previous"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => { handleInteraction(); next(); }}
                                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors"
                                        aria-label="Next"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => { handleInteraction(); setCurrentIndex(index); }}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'w-6 bg-orange-500'
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Review ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900">4.9</div>
                        <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900">500+</div>
                        <div className="text-xs text-gray-500">Reviews</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900">98%</div>
                        <div className="text-xs text-gray-500">Recommend</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900">10K+</div>
                        <div className="text-xs text-gray-500">Customers</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
