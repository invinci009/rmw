'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        alert('Thank you! We will contact you soon.');
        setFormData({ name: '', phone: '', email: '', service: '', message: '' });
        setIsSubmitting(false);
    };

    return (
        <section className="section bg-gray-50" id="contact">
            <div className="container">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
                        Get in Touch
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Contact Us
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Have questions? Reach out and we&apos;ll get back to you shortly.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Contact Info - Left Side */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Contact Cards - Clean Design */}
                        <a
                            href="tel:9931759995"
                            className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                                <Phone size={20} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Call Us</p>
                                <p className="font-semibold text-gray-900">9931759995</p>
                                <p className="text-gray-500 text-sm">8409969995</p>
                            </div>
                        </a>

                        <a
                            href="https://wa.me/919931759995"
                            target="_blank"
                            className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-200 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                                <MessageCircle size={20} className="text-green-500 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">WhatsApp</p>
                                <p className="font-semibold text-gray-900">Chat with us</p>
                            </div>
                        </a>

                        <a
                            href="mailto:republicmotorworks@gmail.com"
                            className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                                <Mail size={20} className="text-blue-500 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Email</p>
                                <p className="font-semibold text-gray-900 text-sm">republicmotorworks@gmail.com</p>
                            </div>
                        </a>

                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <MapPin size={20} className="text-purple-500" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Address</p>
                                <p className="font-semibold text-gray-900">Republic Motor Works</p>
                                <p className="text-gray-600 text-sm">Patna, Bihar</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                <Clock size={20} className="text-amber-500" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Working Hours</p>
                                <p className="font-semibold text-gray-900">Mon - Sat: 9 AM - 7 PM</p>
                                <p className="text-gray-600 text-sm">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Right Side */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                            placeholder="Your phone number"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                            placeholder="Your email (optional)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Service</label>
                                        <select
                                            value={formData.service}
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
                                        >
                                            <option value="">Select a service</option>
                                            <option value="detailing">Car & Bike Detailing</option>
                                            <option value="ppf">Paint Protection Film</option>
                                            <option value="ceramic">Ceramic Coating</option>
                                            <option value="wraps">Vehicle Wraps</option>
                                            <option value="modifications">Modifications</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                    <textarea
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                                        placeholder="Tell us about your vehicle and requirements..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
