import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import HeroSection from '@/components/public/HeroSection';
import ServicesSection from '@/components/public/ServicesSection';
import WhyChooseUs from '@/components/public/WhyChooseUs';
import ReviewsSection from '@/components/public/ReviewsSection';
import GallerySection from '@/components/public/GallerySection';
import ContactSection from '@/components/public/ContactSection';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import ScrollProgress from '@/components/shared/ScrollProgress';

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyChooseUs />
        <ReviewsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
