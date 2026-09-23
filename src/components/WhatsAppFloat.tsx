import React from 'react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { STORE_PHONE } from '../services/whatsapp';

export const WhatsAppFloat: React.FC = () => {
  return (
    <aside aria-label="Asistencia por WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={`https://wa.me/${STORE_PHONE}?text=Hola%20Bonanza%202020,%20quisiera%20asesor%C3%ADa%20sobre%20sus%20productos.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/40 transition-all hover:scale-108 cursor-pointer group"
        title="Chatear con un asesor por WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white shrink-0" />
      </a>
    </aside>
  );
};
