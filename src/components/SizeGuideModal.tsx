import React, { useState } from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'shoes' | 'apparel';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'shoes'
}) => {
  const [activeTab, setActiveTab] = useState<'shoes' | 'apparel'>(initialTab);

  if (!isOpen) return null;

  const shoeSizes = [
    { col: 37, usMen: '6.5', usWomen: '8.0', eur: 39, cm: '24.5' },
    { col: 38, usMen: '7.0', usWomen: '8.5', eur: 40, cm: '25.0' },
    { col: 39, usMen: '8.0', usWomen: '9.5', eur: 41, cm: '26.0' },
    { col: 40, usMen: '8.5', usWomen: '10.0', eur: 42, cm: '26.5' },
    { col: 41, usMen: '9.5', usWomen: '11.0', eur: 43, cm: '27.5' },
    { col: 42, usMen: '10.0', usWomen: '11.5', eur: 44, cm: '28.0' },
    { col: 43, usMen: '11.0', usWomen: '12.5', eur: 45, cm: '29.0' },
  ];

  const apparelSizes = [
    { size: 'S', chest: '88 - 96 cm', waist: '73 - 81 cm', hip: '88 - 96 cm' },
    { size: 'M', chest: '96 - 104 cm', waist: '81 - 89 cm', hip: '96 - 104 cm' },
    { size: 'L', chest: '104 - 112 cm', waist: '89 - 97 cm', hip: '104 - 112 cm' },
    { size: 'XL', chest: '112 - 124 cm', waist: '97 - 109 cm', hip: '112 - 120 cm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 z-10 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center">
              <Ruler className="w-4 h-4 text-neutral-900" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-neutral-950">
                Guia Oficial de Tallas
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                Equivalencias para calzado y ropa deportiva
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
            title="Cerrar guia de tallas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-neutral-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('shoes')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'shoes'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Calzado (Sneakers)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('apparel')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'apparel'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Ropa y Conjuntos
          </button>
        </div>

        {/* Table Content */}
        {activeTab === 'shoes' ? (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-900 font-bold border-b border-neutral-200">
                    <th className="py-2.5 px-3">Talla COL</th>
                    <th className="py-2.5 px-3">US Hombre</th>
                    <th className="py-2.5 px-3">US Mujer</th>
                    <th className="py-2.5 px-3">EUR</th>
                    <th className="py-2.5 px-3">Largo (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                  {shoeSizes.map((row) => (
                    <tr key={row.col} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-2 px-3 font-bold text-neutral-950 font-mono">{row.col}</td>
                      <td className="py-2 px-3 font-mono">{row.usMen}</td>
                      <td className="py-2 px-3 font-mono">{row.usWomen}</td>
                      <td className="py-2 px-3 font-mono">{row.eur}</td>
                      <td className="py-2 px-3 font-mono text-neutral-900 font-semibold">{row.cm} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Measuring instruction */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 text-xs text-neutral-600 space-y-2">
              <span className="font-bold text-neutral-900 block">
                ¿Como medir la longitud de tu pie?
              </span>
              <p className="leading-relaxed">
                Coloca una hoja de papel en el suelo pegada a la pared. Apoya tu talon descalzo firmemente contra la pared y marca la punta de tu dedo mas largo. Mide en centimetros la distancia entre el borde de la hoja y la marca.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-900 font-bold border-b border-neutral-200">
                    <th className="py-2.5 px-3">Talla</th>
                    <th className="py-2.5 px-3">Pecho</th>
                    <th className="py-2.5 px-3">Cintura</th>
                    <th className="py-2.5 px-3">Cadera</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                  {apparelSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-2 px-3 font-bold text-neutral-950 font-mono">{row.size}</td>
                      <td className="py-2 px-3">{row.chest}</td>
                      <td className="py-2 px-3">{row.waist}</td>
                      <td className="py-2 px-3">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 text-xs text-neutral-600">
              <span className="font-bold text-neutral-900 block mb-1">
                Ajuste y Horma
              </span>
              <p className="leading-relaxed">
                Las camisetas y conjuntos deportivos de Bonanza cuentan con corte regular atletico. Si prefieres un estilo oversize o mas holgado, te recomendamos seleccionar una talla superior.
              </p>
            </div>
          </div>
        )}

        {/* Guarantee footer */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-start gap-2.5 text-xs text-neutral-600">
          <CheckCircle className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
          <span>
            <strong>Garantia de talla:</strong> Si al recibir tu pedido la talla no se ajusta con total comodidad, gestionamos el cambio de referencia de forma rapida y segura.
          </span>
        </div>

      </div>
    </div>
  );
};
