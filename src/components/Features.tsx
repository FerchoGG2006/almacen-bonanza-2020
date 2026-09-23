import React from 'react';
import { Truck, ShieldCheck, RefreshCw, PhoneCall } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Truck className="w-5 h-5 text-neutral-900" />,
      title: "Envíos Nacionales Rápidos",
      desc: "Despachos a toda Colombia vía Servientrega e Interrapidísimo en 2-4 días."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-neutral-900" />,
      title: "Contra Entrega & Tienda Física",
      desc: "Paga al recibir en Valledupar o visítanos en Calle 16B # 7A-55 Barrio Centro."
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-neutral-900" />,
      title: "Garantía de Talla y Calidad",
      desc: "¿No te quedó? Realizamos cambio inmediato de talla con total respaldo."
    },
    {
      icon: <PhoneCall className="w-5 h-5 text-neutral-900" />,
      title: "Asesoría Directa WhatsApp",
      desc: "Atención personalizada para elegir la horma perfecta y verificar stock."
    }
  ];

  return (
    <section className="border-y border-neutral-200 bg-white/60 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3.5 p-3 rounded-2xl transition-colors hover:bg-neutral-100/70">
              <div className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200/80 shadow-xs shrink-0">
                {f.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-950 mb-0.5">{f.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
