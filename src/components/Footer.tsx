import React, { useState } from 'react';
import { ViewType } from '../types/index';
import { MapPin, CheckCircle, Scale } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { STORE_PHONE, STORE_ADDRESS, STORE_MAPS_URL } from '../services/whatsapp';
import { LegalModal, LegalTab } from './LegalModal';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  const [internalLegalModalOpen, setInternalLegalModalOpen] = useState(false);
  const [internalSelectedLegalTab, setInternalSelectedLegalTab] = useState<LegalTab>('terms');

  const openLegalModal = (tab: LegalTab) => {
    if (onOpenLegal) {
      onOpenLegal(tab);
    } else {
      setInternalSelectedLegalTab(tab);
      setInternalLegalModalOpen(true);
    }
  };

  return (
    <>
      <footer className="bg-[#111111] text-neutral-400 border-t border-neutral-800 text-xs py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Identity */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="assets/logo.png" alt="Logo Bonanza 2020" className="w-10 h-10 rounded-full object-contain" />
              <div className="font-extrabold tracking-[0.22em] text-base text-white">BONANZA 2020</div>
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs mb-4">
              Tienda oficial de ropa, calzado deportivo y streetwear en Valledupar, Colombia.
            </p>
            <div className="space-y-3 text-neutral-300 font-medium">
              <a
                href={STORE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-white transition-colors group cursor-pointer"
                title="Abrir ubicación en Google Maps"
              >
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-white font-bold block text-xs">{STORE_ADDRESS}</span>
                  <span className="text-[11px] text-neutral-400">Valledupar, Cesar, Colombia · Ver en Maps ↗</span>
                </div>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">
              Navegación
            </div>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('tienda')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Tienda Online
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hombres')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Ropa & Calzado Hombre
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('mujeres')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Ropa & Calzado Mujer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('nosotros')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sobre Nosotros
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Customer Care */}
          <div>
            <div className="text-[11px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-neutral-400" />
              <span>Marco Legal & Envíos</span>
            </div>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('guarantee')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Garantía de Talla (Ley 1480)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Términos y Condiciones</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Tratamiento de Datos (Ley 1581)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('pqr')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Canal PQR & Reclamaciones</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <div className="text-[11px] font-bold text-white uppercase tracking-wider mb-3">
              WhatsApp Directo
            </div>
            <p className="text-neutral-400 mb-4 leading-relaxed">
              Escríbenos para consultar tallas, confirmar pedidos o solicitar asesoría en cualquier referencia.
            </p>
            <a
              href={`https://wa.me/${STORE_PHONE}?text=Hola%20Bonanza%202020,%20quisiera%20asesor%C3%ADa.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Chat de WhatsApp</span>
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div>© {new Date().getFullYear()} BONANZA 2020. Todos los derechos reservados.</div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => openLegalModal('terms')}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Términos
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => openLegalModal('privacy')}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Privacidad (Habeas Data)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => openLegalModal('guarantee')}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Garantías
            </button>
          </div>
        </div>
      </footer>

      {/* Fallback Legal Modal if not provided globally */}
      {!onOpenLegal && (
        <LegalModal
          isOpen={internalLegalModalOpen}
          onClose={() => setInternalLegalModalOpen(false)}
          initialTab={internalSelectedLegalTab}
        />
      )}
    </>
  );
};

