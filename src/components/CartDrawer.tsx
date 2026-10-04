import React, { useState } from 'react';
import { CartItem } from '../types/index';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, User, ShieldCheck, Truck } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { formatCOP, STORE_ADDRESS } from '../services/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckoutWhatsApp: (
    clientName: string,
    clientAddress: string,
    deliveryMethod: 'valledupar' | 'nacional',
    paymentMethod: 'contraentrega' | 'transferencia'
  ) => void;
  onNavigateToTienda: () => void;
  onOpenLegal?: (tab: 'terms' | 'guarantee' | 'privacy' | 'pqr') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckoutWhatsApp,
  onNavigateToTienda,
  onOpenLegal,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'valledupar' | 'nacional'>('valledupar');
  const [paymentMethod, setPaymentMethod] = useState<'contraentrega' | 'transferencia'>('contraentrega');
  
  // Anti-spam honeypot & Form validation
  const [honeypot, setHoneypot] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; address?: string }>({});

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSendOrder = () => {
    // 1. Anti-spam check (honeypot filled by bot)
    if (honeypot.trim().length > 0) {
      console.warn('Bot detected and blocked.');
      return;
    }

    const errors: { name?: string; address?: string } = {};

    // Validar nombre si fue ingresado
    if (clientName.trim().length > 0 && clientName.trim().length < 3) {
      errors.name = 'Por favor ingresa un nombre válido (mínimo 3 letras).';
    }

    // Validar dirección si fue ingresada
    if (clientAddress.trim().length > 0 && clientAddress.trim().length < 6) {
      errors.address = 'Por favor ingresa una dirección completa (barrio y nomenclatura).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    onCheckoutWhatsApp(clientName.trim(), clientAddress.trim(), deliveryMethod, paymentMethod);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container: Responsive width and dvh height for mobile */}
      <div className="relative w-full sm:max-w-md bg-white h-full h-[100dvh] max-h-[100dvh] shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg text-neutral-950 leading-none">
                  Bolsa de Compras
                </h3>
                <span className="text-xs font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-mono">
                  {cart.reduce((c, item) => c + item.qty, 0)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 active:bg-neutral-200 transition-colors cursor-pointer"
            title="Cerrar bolsa"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body: flex-1 min-h-0 prevents iOS overflow cutoff */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4 overscroll-contain">
          {cart.length > 0 ? (
            <>
              {/* Product items */}
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.size}-${idx}`}
                    className="group relative flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:border-neutral-300 transition-all"
                  >
                    {/* Fixed aspect-square product image container */}
                    <div className="w-20 h-20 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-100 aspect-square">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 truncate">
                          {item.brand}
                        </span>
                        {/* Remove button - larger touch target for mobile */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          className="p-1.5 -mr-1 -mt-1 text-neutral-400 hover:text-rose-600 active:text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Eliminar producto"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4
                        className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 mb-1.5 leading-snug"
                        title={item.name}
                      >
                        {item.name}
                      </h4>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200/80 font-mono">
                          Talla: {item.size}
                        </span>
                      </div>

                      {/* Quantity Stepper and Total Price */}
                      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-neutral-100">
                        {/* Mobile friendly touch stepper */}
                        <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(idx, -1)}
                            className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-950 active:bg-neutral-200 hover:bg-white rounded transition-colors cursor-pointer"
                            title="Disminuir cantidad"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-neutral-950 min-w-[24px] sm:min-w-[20px] text-center font-mono select-none">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(idx, 1)}
                            className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-950 active:bg-neutral-200 hover:bg-white rounded transition-colors cursor-pointer"
                            title="Aumentar cantidad"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-black text-neutral-950 font-mono tracking-tight">
                          {formatCOP(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery and Customer Form */}
              <div className="pt-4 border-t border-neutral-200 space-y-3.5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                    Método de Entrega:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('valledupar')}
                      className={`text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                        deliveryMethod === 'valledupar'
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>Valledupar</span>
                      </div>
                      <span className={`text-[10px] block ${deliveryMethod === 'valledupar' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Contra entrega local
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('nacional')}
                      className={`text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                        deliveryMethod === 'nacional'
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                        <Truck className="w-3.5 h-3.5 shrink-0" />
                        <span>Nacional</span>
                      </div>
                      <span className={`text-[10px] block ${deliveryMethod === 'nacional' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Envío a toda Colombia
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                    Datos del Cliente (Opcional)
                  </span>

                  {/* Anti-spam honeypot - invisible to humans */}
                  <input
                    type="text"
                    name="b_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }}
                    aria-hidden="true"
                  />

                  {/* 16px font on mobile prevents iOS auto-zoom */}
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Tu nombre completo"
                      className={`w-full text-base sm:text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border rounded-xl outline-none focus:border-neutral-950 text-neutral-900 transition-colors ${
                        formErrors.name ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200'
                      }`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-[10px] text-rose-600 font-medium pl-1 animate-in fade-in">
                      {formErrors.name}
                    </p>
                  )}

                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={clientAddress}
                      onChange={(e) => {
                        setClientAddress(e.target.value);
                        if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: undefined }));
                      }}
                      placeholder={
                        deliveryMethod === 'valledupar'
                          ? 'Barrio y dirección en Valledupar'
                          : 'Dirección, ciudad y departamento'
                      }
                      className={`w-full text-base sm:text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border rounded-xl outline-none focus:border-neutral-950 text-neutral-900 transition-colors ${
                        formErrors.address ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200'
                      }`}
                    />
                  </div>
                  {formErrors.address && (
                    <p className="text-[10px] text-rose-600 font-medium pl-1 animate-in fade-in">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                {/* Payment preference */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                    Forma de Pago Preferida:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('contraentrega')}
                      className={`text-xs sm:text-[11px] font-semibold py-2.5 sm:py-2 px-2.5 rounded-xl border transition-all cursor-pointer text-center ${
                        paymentMethod === 'contraentrega'
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100'
                      }`}
                    >
                      Contra Entrega
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transferencia')}
                      className={`text-xs sm:text-[11px] font-semibold py-2.5 sm:py-2 px-2.5 rounded-xl border transition-all cursor-pointer text-center ${
                        paymentMethod === 'transferencia'
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100'
                      }`}
                    >
                      Nequi / Bancolombia
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h4 className="font-bold text-base text-neutral-900 mb-1">Tu bolsa está vacía</h4>
              <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto">
                Explora el catálogo y añade tus sneakers o prendas favoritas con tu talla.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTienda();
                }}
                className="bg-neutral-950 hover:bg-neutral-800 active:scale-95 text-white text-xs font-bold px-6 py-3 rounded-full transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Ir a la Tienda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer with Subtotal & CTA: Responsive padding & safe-area-inset for mobile */}
        {cart.length > 0 && (
          <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-t border-neutral-200 bg-neutral-50 space-y-3 sm:space-y-4 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Subtotal
              </span>
              <span className="font-black text-lg sm:text-xl text-neutral-950 font-mono">
                {formatCOP(total)}
              </span>
            </div>

            <div className="flex items-start sm:items-center gap-2 text-[10px] sm:text-[11px] text-neutral-600 font-medium leading-tight">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              <span>Despachos a domicilio o retiro en tienda ({STORE_ADDRESS}).</span>
            </div>

            <button
              type="button"
              onClick={handleSendOrder}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm sm:text-base font-bold py-3.5 sm:py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-700/20 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
              <span>Enviar Pedido a WhatsApp</span>
            </button>

            <p className="text-[9px] sm:text-[10px] text-neutral-500 text-center leading-relaxed px-1">
              Al confirmar tu pedido autorizas el uso de tus datos para coordinar el despacho según nuestra{' '}
              <button
                type="button"
                onClick={() => onOpenLegal?.('privacy')}
                className="underline hover:text-neutral-900 font-semibold cursor-pointer"
              >
                Política de Privacidad (Ley 1581 de 2012)
              </button>
              {' '}y{' '}
              <button
                type="button"
                onClick={() => onOpenLegal?.('guarantee')}
                className="underline hover:text-neutral-900 font-semibold cursor-pointer"
              >
                Garantía de Cambios (Ley 1480)
              </button>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
