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

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSendOrder = () => {
    onCheckoutWhatsApp(clientName, clientAddress, deliveryMethod, paymentMethod);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h3 className="font-display font-extrabold text-lg text-neutral-950">
              Bolsa de Compras
            </h3>
            <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
              {cart.reduce((c, item) => c + item.qty, 0)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            title="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {cart.length > 0 ? (
            <>
              {/* Product items */}
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.size}-${idx}`}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl bg-white p-2 border border-neutral-200/80 flex items-center justify-center shrink-0">
                      <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block truncate">
                        {item.brand}
                      </span>
                      <h4 className="text-xs font-bold text-neutral-900 truncate mb-1" title={item.name}>
                        {item.name}
                      </h4>
                      <div className="text-[11px] text-neutral-500 mb-1.5">
                        Talla: <strong className="text-neutral-900 font-semibold">{item.size}</strong>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(idx, -1)}
                            className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-neutral-900 min-w-[16px] text-center font-mono">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(idx, 1)}
                            className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-neutral-950 font-mono">
                          {formatCOP(item.price * item.qty)}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer self-start"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery and Customer Form */}
              <div className="pt-4 border-t border-neutral-200 space-y-3.5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                    Metodo de Entrega:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('valledupar')}
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                        deliveryMethod === 'valledupar'
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
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
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                        deliveryMethod === 'nacional'
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                        <Truck className="w-3.5 h-3.5 shrink-0" />
                        <span>Nacional</span>
                      </div>
                      <span className={`text-[10px] block ${deliveryMethod === 'nacional' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Envio a toda Colombia
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                    Datos del Cliente (Opcional)
                  </span>

                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-950 text-neutral-900"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder={
                        deliveryMethod === 'valledupar'
                          ? 'Barrio y direccion en Valledupar'
                          : 'Direccion, ciudad y departamento'
                      }
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-950 text-neutral-900"
                    />
                  </div>
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
                      className={`text-[11px] font-semibold py-2 px-2.5 rounded-xl border transition-all cursor-pointer text-center ${
                        paymentMethod === 'contraentrega'
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      Contra Entrega
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transferencia')}
                      className={`text-[11px] font-semibold py-2 px-2.5 rounded-xl border transition-all cursor-pointer text-center ${
                        paymentMethod === 'transferencia'
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      Nequi / Bancolombia
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h4 className="font-bold text-base text-neutral-900 mb-1">Tu bolsa esta vacia</h4>
              <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto">
                Explora el catalogo y añade tus sneakers o prendas favoritas con tu talla.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTienda();
                }}
                className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Ir a la Tienda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer with Subtotal & CTA */}
        {cart.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-neutral-200 bg-neutral-50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Subtotal
              </span>
              <span className="font-black text-xl text-neutral-950 font-mono">
                {formatCOP(total)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
              <span>Despachos a domicilio o retiro en tienda ({STORE_ADDRESS}).</span>
            </div>

            <button
              type="button"
              onClick={handleSendOrder}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-bold py-4 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-700/20 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" />
              <span>Enviar Pedido a WhatsApp</span>
            </button>

            <p className="text-[10px] text-neutral-500 text-center leading-relaxed px-1">
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
