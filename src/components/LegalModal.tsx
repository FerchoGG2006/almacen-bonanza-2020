import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Scale, FileText, HelpCircle, MapPin, Truck, RefreshCw } from 'lucide-react';
import { STORE_ADDRESS, STORE_PHONE_DISPLAY, STORE_PHONE } from '../services/whatsapp';

export type LegalTab = 'terms' | 'guarantee' | 'privacy' | 'pqr';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-neutral-950 leading-tight">
                Marco Legal y Garantías
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                Bonanza 2020 · Comercio Electrónico Seguro en Colombia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-950 hover:bg-neutral-200/60 transition-colors cursor-pointer"
            aria-label="Cerrar modal legal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 bg-white px-6 gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Términos y Condiciones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guarantee')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guarantee'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cambios y Garantías (Ley 1480)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tratamiento de Datos (Ley 1581)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pqr')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pqr'
                ? 'border-neutral-950 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Atención y PQR</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-xs text-neutral-700 leading-relaxed space-y-4">
          
          {/* TAB 1: TÉRMINOS Y CONDICIONES */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">1. Identificación del Comercio</h4>
                <p>
                  El sitio web y la operación comercial pertenecen al establecimiento de comercio <strong>Bonanza 2020</strong>, con sede física abierta al público en la <strong>{STORE_ADDRESS}</strong> en Valledupar, Cesar, Colombia. Canal oficial de atención digital: WhatsApp {STORE_PHONE_DISPLAY}.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">2. Mecánica de Pedidos y Precios</h4>
                <p>
                  Todos los precios expuestos en la plataforma están expresados en pesos colombianos ($COP) e incluyen los impuestos aplicables. Los pedidos se procesan y validan a través del canal oficial de WhatsApp, donde un asesor confirma en tiempo real la disponibilidad de talla y el método de entrega acordado.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">3. Métodos de Pago y Despacho</h4>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                  <li><strong>Entregas locales (Valledupar):</strong> Modalidad contra entrega en efectivo o transferencia electrónica al momento de recibir el producto en tu domicilio o al recogerlo en tienda.</li>
                  <li><strong>Envíos nacionales:</strong> Despachos a todas las ciudades y municipios de Colombia a través de transportadoras aliadas certificadas (Servientrega, Interrapidísimo o Envía) previo acuerdo de pago. El tiempo habitual de tránsito es de 2 a 4 días hábiles.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">4. Disponibilidad y Autenticidad</h4>
                <p>
                  Cada referencia publicada cuenta con fotos reales tomadas en tienda. Debido a la alta rotación de inventario en calzado y streetwear, la reserva formal de una talla se perfecciona al confirmar el pedido por WhatsApp.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CAMBIOS Y GARANTÍAS */}
          {activeTab === 'guarantee' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-700">
                  En cumplimiento del <strong>Estatuto del Consumidor (Ley 1480 de 2011 de la República de Colombia)</strong>, garantizamos el derecho de retracto y el respaldo de satisfacción en cada una de tus compras.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">1. Garantía de Talla y Cambios</h4>
                <p>
                  Si al recibir el calzado o prenda la horma no se ajusta adecuadamente a tu pie o cuerpo, gestionamos el <strong>cambio inmediato por otra talla</strong> o referencia disponible de igual valor.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">2. Condiciones indispensables para el cambio</h4>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                  <li>El calzado debe estar <strong>completamente nuevo, limpio y sin pisadas ni marcas de uso</strong> en la suela o plantilla.</li>
                  <li>Conservar su caja original, etiquetas y envoltorios intactos tal como fue entregado.</li>
                  <li>Solicitar el cambio dentro de los <strong>5 días hábiles</strong> siguientes a la recepción física del producto.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">3. ¿Cómo solicitar un cambio?</h4>
                <p>
                  Escríbenos a nuestro WhatsApp oficial con tu nombre y foto del producto para autorizar el cambio, o acércate personalmente a nuestra tienda física en la <strong>{STORE_ADDRESS}</strong> en Valledupar.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TRATAMIENTO DE DATOS PERSONALES */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-start gap-3">
                <Scale className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-700">
                  Política formulada conforme a la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013 de Protección de Datos Personales (Habeas Data) en Colombia.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">1. Finalidad de la Información Recolectada</h4>
                <p>
                  Los datos que suministras en el proceso de compra (nombre completo, número de teléfono WhatsApp y dirección de domicilio) son utilizados <strong>exclusivamente para coordinar la entrega física del pedido</strong>, confirmar disponibilidad de talla y emitir la guía de transporte correspondiente.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">2. Privacidad Absoluta y No Venta de Datos</h4>
                <p>
                  <strong>Bonanza 2020 no comercializa, no transfiere ni comparte</strong> tus datos con terceros para fines publicitarios externos. No enviamos spam masivo no solicitado.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">3. Derechos del Titular (Habeas Data)</h4>
                <p>
                  Como titular de tus datos personales, tienes derecho a conocer, actualizar, rectificar y solicitar la supresión de tu información de nuestros registros en cualquier momento a través de nuestro canal de atención por WhatsApp.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ATENCIÓN Y PQR */}
          {activeTab === 'pqr' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">Canales Oficiales de Atención Directa</h4>
                <p>
                  Para cualquier consulta, inquietud, felicitación o petición formal (PQR), dispones de canales directos con atención humana real:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sede Física</span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    {STORE_ADDRESS}<br />
                    Valledupar, Cesar, Colombia<br />
                    Lunes a Sábado: 8:00 AM – 7:00 PM
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Atención Digital WhatsApp</span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    Línea oficial: {STORE_PHONE_DISPLAY}<br />
                    Respuesta en tiempo real para seguimiento de guías de envío y despachos.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${STORE_PHONE}?text=Hola%20Bonanza%202020,%20tengo%20una%20consulta%20formal%20sobre%20mi%20pedido.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#111111] hover:bg-neutral-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
                >
                  <span>Contactar al Responsable de PQR por WhatsApp</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between shrink-0 text-[11px] text-neutral-500">
          <span>Bonanza 2020 · Valledupar, Cesar</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-neutral-900 hover:underline cursor-pointer"
          >
            Entendido, cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
