'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
}

export default function WhatsAppButton({
    phoneNumber = '919931759995',
    message = 'Hi, I would like to know more about your services.',
}: WhatsAppButtonProps) {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={28} fill="white" />
        </a>
    );
}
