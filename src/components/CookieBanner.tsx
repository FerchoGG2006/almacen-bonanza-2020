import React, { useState, useEffect } from 'react';
import { Cookie, Shield, X, Check } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacyPolicy?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('bonanza_cookie_consent');
      if (!consent) {
        // Mostrar con un leve retraso para no bloquear el render inicial
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage bloqueado o deshabilitado
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('bonanza_cookie_consent', JSON.stringify({
        essential: true,
        analytics: true,
        timestamp: new Date().toISOString(),
      }));
      window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: { analytics: true } }));
    } catch {}
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem('bonanza_cookie_consent', JSON.stringify({
        essential: true,
        analytics: false,
        timestamp: new Date().toISOString(),
      }));
      window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: { analytics: false } }));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Consentimiento de cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#111111]/95 text-white p-5 rounded-3xl border border-neutral-800 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-9 h-9 rounded-2xl bg-neutral-800 flex items-center justify-center shrink-0 text-amber-400">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="font-display font-extrabold text-sm text-white leading-tight mb-1">
            Privacidad & Cookies
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Utilizamos cookies técnicas y analíticas para optimizar tu experiencia de compra y medir el rendimiento, conforme a nuestra política de Habeas Data (Ley 1581 de 2012).
          </p>
        </div>
        <button
          type="button"
          onClick={handleAcceptEssential}
          className="text-neutral-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
          title="Cerrar y usar solo necesarias"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-neutral-800">
        {onOpenPrivacyPolicy && (
          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="text-[11px] text-neutral-400 hover:text-neutral-200 underline text-center sm:text-left py-1 cursor-pointer"
          >
            Ver Política de Privacidad
          </button>
        )}

        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={handleAcceptEssential}
            className="flex-1 sm:flex-none text-xs font-semibold px-3.5 py-2 rounded-full border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer text-center"
          >
            Solo necesarias
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Aceptar todas</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
