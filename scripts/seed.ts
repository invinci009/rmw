import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rmw';

// Service seed data based on actual RMW services
const services = [
    {
        name: 'Car & Bike Detailing',
        slug: 'car-bike-detailing',
        shortDescription: 'Complete interior and exterior detailing to restore your vehicle\'s shine.',
        fullDescription: `Complete interior and exterior detailing to restore your vehicle's shine. We clean, polish, and protect every surface—paint, glass, wheels, and interiors—for that fresh, showroom look.

Our detailing service includes:
- Exterior wash and dry
- Paint decontamination
- Polish and wax application
- Interior vacuuming and shampooing
- Dashboard and trim dressing
- Glass cleaning inside and out
- Tire and wheel cleaning
- Engine bay cleaning (optional)`,
        image: '/images/services/detailing.jpg',
        icon: 'Sparkles',
        vehicleTypes: ['2W', '4W'],
        basePrice: 2500,
        estimatedTime: '3-5 hours',
        features: [
            'Deep interior cleaning',
            'Paint protection',
            'Glass treatment',
            'Tire shine',
            'Fresh fragrance'
        ],
        order: 1,
    },
    {
        name: 'Paint Protection Film (PPF)',
        slug: 'paint-protection-film',
        shortDescription: 'Transparent, durable film that protects your paint from scratches and chips.',
        fullDescription: `Transparent, durable film that protects your paint from scratches, stone chips, and weather damage. We use high-quality films with precision fitting for invisible protection.

Benefits of PPF:
- Self-healing technology
- UV protection
- Chemical resistance
- Maintains resale value
- 5-10 year warranty options`,
        image: '/images/services/ppf.jpg',
        icon: 'Shield',
        vehicleTypes: ['2W', '4W'],
        basePrice: 15000,
        estimatedTime: '1-2 days',
        features: [
            'Self-healing film',
            'UV protection',
            'Stone chip protection',
            '5+ year durability',
            'Invisible protection'
        ],
        order: 2,
    },
    {
        name: 'Ceramic Coating',
        slug: 'ceramic-coating',
        shortDescription: 'Advanced nano-technology coating for glossy, hydrophobic protection.',
        fullDescription: `Advanced nano-technology coating that bonds with your paint, creating a glossy, hydrophobic layer. Keeps your vehicle looking new while making it easier to clean and maintain.

Our ceramic coating packages:
- 9H hardness rating
- Hydrophobic properties
- UV protection
- Chemical resistance
- Easy maintenance`,
        image: '/images/services/ceramic.jpg',
        icon: 'Gem',
        vehicleTypes: ['2W', '4W'],
        basePrice: 12000,
        estimatedTime: '1-2 days',
        features: [
            '9H hardness',
            'Hydrophobic coating',
            'UV protection',
            '3-5 year protection',
            'Enhanced gloss'
        ],
        order: 3,
    },
    {
        name: 'Vehicle Wraps',
        slug: 'vehicle-wraps',
        shortDescription: 'Change your vehicle\'s look with custom wraps without permanent paintwork.',
        fullDescription: `Change your vehicle's look without permanent paintwork. Choose from glossy, matte, metallic, or custom-designed wraps that reflect your style.

Wrap options:
- Gloss finish
- Matte finish
- Satin finish
- Chrome and metallic
- Custom printed designs
- Color change wraps`,
        image: '/images/services/wraps.jpg',
        icon: 'Palette',
        vehicleTypes: ['2W', '4W'],
        basePrice: 25000,
        estimatedTime: '2-4 days',
        features: [
            'Color change',
            'Matte & gloss options',
            'Custom designs available',
            'Paint protection',
            'Removable'
        ],
        order: 4,
    },
    {
        name: 'Modifications & Customization',
        slug: 'modifications-customization',
        shortDescription: 'Cosmetic and performance upgrades tailored to your vision.',
        fullDescription: `From cosmetic upgrades to performance enhancements, we tailor modifications to match your vision—body kits, alloy wheels, lighting, exhausts, and more.

Popular modifications:
- Alloy wheel upgrades
- Body kit installation
- LED/HID lighting upgrades
- Exhaust system upgrades
- Interior customization
- Audio system installation`,
        image: '/images/services/modifications.jpg',
        icon: 'Wrench',
        vehicleTypes: ['2W', '4W'],
        basePrice: 5000,
        estimatedTime: 'Varies',
        features: [
            'Body kits',
            'Alloy wheels',
            'Lighting upgrades',
            'Exhaust systems',
            'Custom interiors'
        ],
        order: 5,
    },
    {
        name: 'Interior Protection',
        slug: 'interior-protection',
        shortDescription: 'Professional treatment for seats, dashboard, and trims.',
        fullDescription: `Professional treatment for seats, dashboard, and trims. Prevents fading, cracking, and stains while keeping interiors fresh and comfortable.

Services included:
- Leather conditioning
- Fabric protection
- Dashboard treatment
- UV protection
- Anti-bacterial treatment`,
        image: '/images/services/interior.jpg',
        icon: 'Armchair',
        vehicleTypes: ['2W', '4W'],
        basePrice: 3000,
        estimatedTime: '2-3 hours',
        features: [
            'Leather care',
            'Fabric protection',
            'UV protection',
            'Stain resistance',
            'Fresh fragrance'
        ],
        order: 6,
    },
    {
        name: 'Exterior Protection',
        slug: 'exterior-protection',
        shortDescription: 'Polishing, waxing, and coating to fight sun damage and oxidation.',
        fullDescription: `Polishing, waxing, and coating services designed to fight off sun damage, oxidation, and pollution. Extends the life of your paint and keeps your car shining longer.

Our process:
- Paint correction
- Swirl removal
- Wax application
- Sealant protection
- Trim restoration`,
        image: '/images/services/exterior.jpg',
        icon: 'Sun',
        vehicleTypes: ['2W', '4W'],
        basePrice: 3500,
        estimatedTime: '4-6 hours',
        features: [
            'Paint correction',
            'Oxidation removal',
            'Wax protection',
            'Trim restoration',
            'Long-lasting shine'
        ],
        order: 7,
    },
    {
        name: 'Wash & Maintenance Packages',
        slug: 'wash-maintenance-packages',
        shortDescription: 'Regular care plans for consistent cleanliness and maintenance.',
        fullDescription: `Regular care plans that include washing, polishing, and touch-ups—ideal for keeping your vehicle consistently clean and well-maintained.

Package options:
- Weekly wash plan
- Monthly maintenance
- Quarterly detailing
- Annual protection package
- Corporate fleet plans`,
        image: '/images/services/wash.jpg',
        icon: 'Droplets',
        vehicleTypes: ['2W', '4W'],
        basePrice: 500,
        estimatedTime: '30-60 mins',
        features: [
            'Regular washing',
            'Interior cleaning',
            'Tire care',
            'Glass cleaning',
            'Flexible plans'
        ],
        order: 8,
    },
];

// Sample admin user
const adminUser = {
    name: 'RMW Admin',
    email: process.env.ADMIN_EMAIL || 'admin@rmw.com',
    phone: '9931759995',
    password: process.env.ADMIN_PASSWORD || 'RMW@Admin123',
    role: 'admin',
};

// Sample bookings
const sampleBookings = [
    {
        bookingId: 'RMW-2026-0001',
        customerName: 'Rahul Kumar',
        phone: '9876543210',
        email: 'rahul@example.com',
        vehicleType: '4W',
        vehicleBrand: 'Maruti Suzuki',
        vehicleModel: 'Swift',
        vehicleNumber: 'BR01AB1234',
        preferredDate: new Date('2026-02-01'),
        preferredTime: '10:00 AM',
        status: 'confirmed',
    },
    {
        bookingId: 'RMW-2026-0002',
        customerName: 'Priya Singh',
        phone: '9876543211',
        vehicleType: '2W',
        vehicleBrand: 'Honda',
        vehicleModel: 'Activa',
        vehicleNumber: 'BR01CD5678',
        preferredDate: new Date('2026-02-02'),
        preferredTime: '11:00 AM',
        status: 'pending',
    },
];

async function seed() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await mongoose.connection.db?.dropDatabase();

        // Create admin user
        console.log('👤 Creating admin user...');
        const UserModel = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: { type: String, unique: true, sparse: true },
            phone: String,
            password: String,
            role: String,
        }, { timestamps: true }));

        const hashedPassword = await bcrypt.hash(adminUser.password, 10);
        await UserModel.create({
            ...adminUser,
            password: hashedPassword,
        });
        console.log(`   Admin: ${adminUser.email} / ${adminUser.password}`);

        // Create services
        console.log('🔧 Creating services...');
        const ServiceModel = mongoose.model('Service', new mongoose.Schema({
            name: String,
            slug: { type: String, unique: true },
            shortDescription: String,
            fullDescription: String,
            image: String,
            icon: String,
            vehicleTypes: [String],
            basePrice: Number,
            estimatedTime: String,
            features: [String],
            isActive: { type: Boolean, default: true },
            order: Number,
        }, { timestamps: true }));

        const createdServices = await ServiceModel.insertMany(services);
        console.log(`   Created ${createdServices.length} services`);

        // Create sample bookings
        console.log('📅 Creating sample bookings...');
        const BookingModel = mongoose.model('Booking', new mongoose.Schema({
            bookingId: { type: String, unique: true },
            customerName: String,
            phone: String,
            email: String,
            vehicleType: String,
            vehicleBrand: String,
            vehicleModel: String,
            vehicleNumber: String,
            serviceType: mongoose.Schema.Types.ObjectId,
            preferredDate: Date,
            preferredTime: String,
            notes: String,
            status: String,
        }, { timestamps: true }));

        for (const booking of sampleBookings) {
            await BookingModel.create({
                ...booking,
                serviceType: createdServices[0]._id,
            });
        }
        console.log(`   Created ${sampleBookings.length} bookings`);

        console.log('\n✅ Seed completed successfully!');
        console.log('\n📋 Summary:');
        console.log(`   - Admin user: ${adminUser.email}`);
        console.log(`   - Services: ${services.length}`);
        console.log(`   - Sample bookings: ${sampleBookings.length}`);

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

seed();
