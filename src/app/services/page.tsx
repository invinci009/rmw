import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import {
    Car, Film, Droplets, Layers, Wrench,
    Sofa, Sun, Waves, ArrowRight, Clock
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Our Services',
    description: 'Explore our comprehensive range of car and bike care services including detailing, PPF, ceramic coating, wraps, and more.',
};

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
    Car: <Car size={40} />,
    Film: <Film size={40} />,
    Droplets: <Droplets size={40} />,
    Layers: <Layers size={40} />,
    Wrench: <Wrench size={40} />,
    Sofa: <Sofa size={40} />,
    Sun: <Sun size={40} />,
    Waves: <Waves size={40} />,
};

// Services data
const services = [
    {
        name: 'Car & Bike Detailing',
        slug: 'car-bike-detailing',
        shortDescription: 'Complete interior and exterior detailing to restore your vehicle\'s shine.',
        description: 'We clean, polish, and protect every surface—paint, glass, wheels, and interiors—for that fresh, showroom look.',
        icon: 'Car',
        vehicleTypes: ['2W', '4W'],
        basePrice: 2500,
        estimatedTime: '3-5 hours',
        features: ['Deep interior cleaning', 'Paint protection', 'Glass treatment', 'Tire shine', 'Fresh fragrance'],
    },
    {
        name: 'Paint Protection Film (PPF)',
        slug: 'paint-protection-film',
        shortDescription: 'Transparent, durable film that protects your paint from scratches and chips.',
        description: 'We use high-quality films with precision fitting for invisible protection.',
        icon: 'Film',
        vehicleTypes: ['2W', '4W'],
        basePrice: 15000,
        estimatedTime: '1-2 days',
        features: ['Self-healing film', 'UV protection', 'Stone chip protection', '5+ year durability', 'Invisible protection'],
    },
    {
        name: 'Ceramic Coating',
        slug: 'ceramic-coating',
        shortDescription: 'Advanced nano-technology coating for glossy, hydrophobic protection.',
        description: 'Keeps your vehicle looking new while making it easier to clean and maintain.',
        icon: 'Droplets',
        vehicleTypes: ['2W', '4W'],
        basePrice: 12000,
        estimatedTime: '1-2 days',
        features: ['9H hardness', 'Hydrophobic coating', 'UV protection', '3-5 year protection', 'Enhanced gloss'],
    },
    {
        name: 'Vehicle Wraps',
        slug: 'vehicle-wraps',
        shortDescription: 'Change your vehicle\'s look with custom wraps without permanent paintwork.',
        description: 'Choose from glossy, matte, metallic, or custom-designed wraps that reflect your style.',
        icon: 'Layers',
        vehicleTypes: ['2W', '4W'],
        basePrice: 25000,
        estimatedTime: '2-4 days',
        features: ['Color change', 'Matte & gloss options', 'Custom designs', 'Paint protection', 'Removable'],
    },
    {
        name: 'Modifications & Customization',
        slug: 'modifications-customization',
        shortDescription: 'Cosmetic and performance upgrades tailored to your vision.',
        description: 'From body kits and alloy wheels to lighting and exhausts—we tailor modifications to match your vision.',
        icon: 'Wrench',
        vehicleTypes: ['2W', '4W'],
        basePrice: 5000,
        estimatedTime: 'Varies',
        features: ['Body kits', 'Alloy wheels', 'Lighting upgrades', 'Exhaust systems', 'Custom interiors'],
    },
    {
        name: 'Interior Protection',
        slug: 'interior-protection',
        shortDescription: 'Professional treatment for seats, dashboard, and trims.',
        description: 'Prevents fading, cracking, and stains while keeping interiors fresh and comfortable.',
        icon: 'Sofa',
        vehicleTypes: ['2W', '4W'],
        basePrice: 3000,
        estimatedTime: '2-3 hours',
        features: ['Leather care', 'Fabric protection', 'UV protection', 'Stain resistance', 'Fresh fragrance'],
    },
    {
        name: 'Exterior Protection',
        slug: 'exterior-protection',
        shortDescription: 'Polishing, waxing, and coating to fight sun damage and oxidation.',
        description: 'Extends the life of your paint and keeps your car shining longer.',
        icon: 'Sun',
        vehicleTypes: ['2W', '4W'],
        basePrice: 3500,
        estimatedTime: '4-6 hours',
        features: ['Paint correction', 'Oxidation removal', 'Wax protection', 'Trim restoration', 'Long-lasting shine'],
    },
    {
        name: 'Wash & Maintenance Packages',
        slug: 'wash-maintenance-packages',
        shortDescription: 'Regular care plans for consistent cleanliness and maintenance.',
        description: 'Ideal for keeping your vehicle consistently clean and well-maintained.',
        icon: 'Waves',
        vehicleTypes: ['2W', '4W'],
        basePrice: 500,
        estimatedTime: '30-60 mins',
        features: ['Regular washing', 'Interior cleaning', 'Tire care', 'Glass cleaning', 'Flexible plans'],
    },
];

export default function ServicesPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-[var(--primary)] text-white pt-28 pb-12 md:py-24">
                    <div className="container px-4">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                                Our Services
                            </h1>
                            <p className="text-base sm:text-lg text-gray-200">
                                Comprehensive car and bike care solutions from basic wash to complete
                                protection. Each service is performed by skilled technicians using
                                premium materials.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Services List */}
                <section className="section bg-[var(--muted)]">
                    <div className="container">
                        <div className="space-y-6">
                            {services.map((service) => (
                                <div key={service.slug} className="card overflow-hidden">
                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Icon & Title */}
                                            <div className="flex items-start gap-4 lg:w-1/3">
                                                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                                                    {iconMap[service.icon] || <Wrench size={40} />}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-[var(--primary)] mb-1">
                                                        {service.name}
                                                    </h2>
                                                    <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                                                        <Clock size={14} />
                                                        <span>{service.estimatedTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mt-1">
                                                        <Car size={14} />
                                                        <span>{service.vehicleTypes.join(' & ')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="lg:w-1/3">
                                                <p className="text-[var(--muted-foreground)] mb-3">
                                                    {service.shortDescription}
                                                </p>
                                                <p className="text-sm text-[var(--foreground)]">
                                                    {service.description}
                                                </p>
                                            </div>

                                            {/* Features & CTA */}
                                            <div className="lg:w-1/3">
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {service.features.slice(0, 4).map((feature) => (
                                                        <span
                                                            key={feature}
                                                            className="text-xs bg-[var(--muted)] px-2 py-1 rounded-full text-[var(--muted-foreground)]"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm text-[var(--muted-foreground)]">Starting from</p>
                                                        <p className="text-2xl font-bold text-[var(--accent)]">
                                                            ₹{service.basePrice.toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={`/booking?service=${service.slug}`}
                                                        className="btn btn-primary w-full sm:w-auto"
                                                    >
                                                        Book Now
                                                        <ArrowRight size={18} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-[var(--primary)] text-white py-12 md:py-16">
                    <div className="container text-center px-4">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                            Not Sure Which Service You Need?
                        </h2>
                        <p className="text-gray-200 mb-8 max-w-xl mx-auto text-sm sm:text-base">
                            Call us or visit our workshop. Our experts will inspect your vehicle
                            and recommend the best care solution.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                            <a href="tel:9931759995" className="btn bg-white text-[var(--primary)] hover:bg-gray-100">
                                Call: 9931759995
                            </a>
                            <Link href="/booking" className="btn btn-primary border-2 border-white">
                                Book a Visit
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
