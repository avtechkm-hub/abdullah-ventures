import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/8801999907883"
    className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-green-500 text-white w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full shadow-2xl z-[100] hover:-translate-y-1 transition-all duration-300"
    target="_blank"
    rel="noreferrer noopener"
    aria-label="Chat with Abdullah Ventures on WhatsApp"
  >
    <MessageCircle size={24} className="sm:w-7 sm:h-7" />
  </a>
);

export default WhatsAppButton;
