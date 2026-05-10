import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/8801999907883"
    className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-green-500 text-white p-3 sm:p-4 rounded-full shadow-2xl z-[100] hover:scale-110 transition"
    target="_blank"
    rel="noreferrer noopener"
    aria-label="Chat with Abdullah Ventures on WhatsApp"
  >
    <MessageCircle size={20} className="sm:w-6 sm:h-6" />
  </a>
);

export default WhatsAppButton;
