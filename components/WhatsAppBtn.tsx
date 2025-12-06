import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppBtn: React.FC = () => {
  const handleClick = () => {
    const message = encodeURIComponent("Halo KueKini, saya mau tanya-tanya tentang kue dong!");
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center gap-2 group"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-semibold">
        Chat Kami
      </span>
    </button>
  );
};

export default WhatsAppBtn;
