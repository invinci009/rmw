'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const galleryImages = [
    {
        id: 1,
        src: '/images/gallery/hero_car_detailing_1769637970473.png',
        alt: 'Premium Car Detailing',
        category: 'Detailing',
    },
    {
        id: 2,
        src: '/images/gallery/ceramic_coating_1769637989851.png',
        alt: 'Ceramic Coating Application',
        category: 'Ceramic',
    },
    {
        id: 3,
        src: '/images/gallery/ppf_installation_1769638005839.png',
        alt: 'PPF Installation',
        category: 'PPF',
    },
    {
        id: 4,
        src: '/images/gallery/bike_detailing_1769638023883.png',
        alt: 'Premium Bike Detailing',
        category: 'Bike Care',
    },
    {
        id: 5,
        src: '/images/gallery/car_wrap_1769638040079.png',
        alt: 'Vehicle Wrapping',
        category: 'Wraps',
    },
    {
        id: 6,
        src: '/images/gallery/workshop_interior_1769638060106.png',
        alt: 'Our Workshop',
        category: 'Workshop',
    },
];

export default function GallerySection() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
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

    const openLightbox = (index: number) => {
        setSelectedImage(index);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % galleryImages.length);
        }
    };

    const prevImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
        }
    };

    return (
        <section ref={sectionRef} className="section bg-white" id="gallery">
            <div className="container">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
                        Our Work
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Workshop Gallery
                    </h2>
                    <p className="text-gray-600 text-lg">
                        See our craftsmanship in action. Every vehicle gets premium treatment.
                    </p>
                </div>

                {/* Clean Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {galleryImages.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => openLightbox(index)}
                            className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-700 ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className={`relative ${index === 0 ? 'aspect-[4/3] md:aspect-square' : 'aspect-[4/3]'}`}>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                                {/* Zoom Icon on Hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <ZoomIn size={20} className="text-gray-900" />
                                    </div>
                                </div>

                                {/* Small Category Label */}
                                <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 rounded-md">
                                    <span className="text-gray-900 text-xs font-medium">{image.category}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    {/* Navigation */}
                    <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Image */}
                    <div
                        className="relative w-full max-w-4xl aspect-[4/3] rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={galleryImages[selectedImage].src}
                            alt={galleryImages[selectedImage].alt}
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Caption */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-20">
                        <p className="text-white font-medium text-lg">
                            {galleryImages[selectedImage].alt}
                        </p>
                        <p className="text-white/60 text-sm">
                            {selectedImage + 1} / {galleryImages.length}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
