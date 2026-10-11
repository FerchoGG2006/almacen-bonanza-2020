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
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-200">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-neutral-950 leading-tight">
                Marco Legal y Garantías
              </h3>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">
                Bonanza 2020 · Comercio Electrónico Seguro en Colombia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full text-neutral-400 hover:text-neutral-950 hover:bg-neutral-200/60 transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar modal legal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 bg-white px-3 sm:px-6 gap-1 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
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
        <div className="p-4 sm:p-8 overflow-y-auto text-xs text-neutral-700 leading-relaxed space-y-4">
          
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

          {/* TAB 2: CAMBIOS, GARANTÍAS Y DERECHO DE RETRACTO */}
          {activeTab === 'guarantee' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-700">
                  En cumplimiento del <strong>Estatuto del Consumidor (Ley 1480 de 2011 de la República de Colombia)</strong>, garantizamos el derecho de retracto, la garantía legal de calidad y el respaldo de satisfacción en cada una de tus compras.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">1. Derecho de Retracto (Artículo 47, Ley 1480 de 2011)</h4>
                <p className="mb-2">
                  Para las compras a distancia realizadas a través de nuestra tienda online y canal de WhatsApp, el consumidor tiene la facultad de ejercer el <strong>derecho de retracto</strong> dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la fecha en que recibe el producto.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                  <li>El producto debe ser devuelto en las mismas condiciones en que fue recibido: completamente nuevo, sin pisadas ni muestras de uso, con sus etiquetas y en su caja o empaque original.</li>
                  <li>Los costos de transporte y demás que conlleve la devolución del bien serán cubiertos por el consumidor según lo dispuesto en el Art. 47 de la Ley 1480.</li>
                  <li>La devolución de la suma pagada se efectuará en un plazo máximo de <strong>treinta (30) días calendario</strong> a partir del momento en que se ejerza el retracto y se verifique el estado del bien devuelto.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">2. Garantía Legal por Defectos de Fabricación</h4>
                <p className="mb-2">
                  Todos nuestros productos cuentan con garantía legal por fallas o defectos de manufactura no atribuibles al uso indebido o desgaste natural:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                  <li><strong>Calzado deportivo y sneakers:</strong> Garantía legal de <strong>noventa (90) días calendario</strong> contados a partir de la entrega para desperfectos de suela, despegue o costuras.</li>
                  <li><strong>Prendas de vestir y conjuntos:</strong> Garantía legal de <strong>treinta (30) días calendario</strong> por costuras descosidas o defectos de tejido.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">3. Garantía Amigable de Cambio de Talla</h4>
                <p>
                  Si la talla que elegiste no se ajusta con total comodidad a tu pie, gestionamos el cambio ágil por otra talla disponible. Solo debes notificarnos dentro de los <strong>cinco (5) días hábiles</strong> posteriores a la entrega con el calzado sin pisadas exteriores.
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
                  Política formulada conforme a la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto Reglamentario 1377 de 2013 de Protección de Datos Personales (Habeas Data) en Colombia.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">1. Responsable del Tratamiento</h4>
                <p>
                  El responsable del tratamiento de los datos es el establecimiento <strong>Bonanza 2020</strong>, con sede en {STORE_ADDRESS}, Valledupar, Cesar. Canal de atención oficial de Habeas Data: WhatsApp {STORE_PHONE_DISPLAY}.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">2. Finalidad del Tratamiento</h4>
                <p>
                  Los datos suministrados por el comprador (nombre, teléfono celular, ciudad y dirección física) se tratarán con las siguientes finalidades exclusivas: coordinar el despacho, emitir las guías de transporte nacional, gestionar el cobro o validación de pago, y prestar servicio post-venta y garantías.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">3. Derechos del Titular y Plazos de Respuesta</h4>
                <p>
                  El titular tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales. Las solicitudes de consulta y reclamos serán resueltas en un término máximo legal de <strong>quince (15) días hábiles</strong> conforme al artículo 15 de la Ley 1581 de 2012.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ATENCIÓN Y PQR */}
          {activeTab === 'pqr' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-neutral-950 mb-1">Trámite de Peticiones, Quejas y Reclamos (PQR)</h4>
                <p>
                  Conforme a la normativa colombiana de protección al consumidor, todo cliente tiene derecho a formular Peticiones, Quejas o Reclamos (PQR). Nuestro tiempo máximo legal de respuesta y solución formal es de <strong>quince (15) días hábiles</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sede Física en Valledupar</span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    {STORE_ADDRESS}<br />
                    Valledupar, Cesar, Colombia<br />
                    Lunes a Sábado: 8:30 AM – 7:00 PM
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Atención Digital WhatsApp</span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    Línea oficial: {STORE_PHONE_DISPLAY}<br />
                    Respuesta en tiempo real y radicación formal de PQRs.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-500">
                <span>En caso de inconformidad con la respuesta, el consumidor podrá acudir ante la <strong>Superintendencia de Industria y Comercio (SIC)</strong> en su portal oficial www.sic.gov.co.</span>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${STORE_PHONE}?text=Hola%20Bonanza%202020,%20deseo%20radicar%20una%20solicitud%20formal%20de%20PQR%20o%20garantía.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#111111] hover:bg-neutral-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
                >
                  <span>Radicar PQR o Garantía por WhatsApp Oficial</span>
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
