import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, ChevronDown, ArrowRight, MapPin } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { STORE_PHONE, STORE_PHONE_DISPLAY, STORE_ADDRESS, STORE_MAPS_URL } from '../services/whatsapp';

interface AboutProps {
  onNavigateToTienda: () => void;
  onNavigateHome: () => void;
}

export const About: React.FC<AboutProps> = ({ onNavigateToTienda, onNavigateHome }) => {
  const pillars = [
    {
      icon: <Award className="w-6 h-6 text-neutral-950" />,
      title: "Calidad y Siluetas Auténticas",
      desc: "Seleccionamos minuciosamente cada referencia para asegurar materiales resistentes, comodidad de primer nivel y acabados estéticos impecables."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-neutral-950" />,
      title: "Contra Entrega en Valledupar",
      desc: "Tu tranquilidad es prioridad. Si estás en Valledupar recibes tu calzado en tus manos y pagas al instante en efectivo o transferencia."
    },
    {
      icon: <Truck className="w-6 h-6 text-neutral-950" />,
      title: "Envíos a Nivel Nacional",
      desc: "Despachamos con número de guía inmediato a Bogotá, Medellín, Barranquilla, Cali, Bucaramanga y cualquier rincón de Colombia."
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-neutral-950" />,
      title: "Garantía de Cambio de Talla",
      desc: "Comprar calzado por internet debe ser seguro. Si la horma no te ajusta a la perfección, gestionamos tu cambio ágilmente."
    }
  ];

  const faqs = [
    {
      q: "¿Cómo se realiza la compra a través de WhatsApp?",
      a: "Simplemente navega por nuestro catálogo, añade las prendas o zapatillas con tu talla a la bolsa de compras y haz clic en 'Enviar Pedido a WhatsApp'. Nuestro sistema genera automáticamente un mensaje con la lista exacta, precios y tus datos de entrega para que un asesor confirme tu despacho de inmediato."
    },
    {
      q: "¿Cuáles son las formas de pago aceptadas?",
      a: "En Valledupar puedes pagar en efectivo contra entrega al recibir tu producto. También aceptamos transferencias electrónicas inmediatas vía Nequi, Daviplata y Bancolombia para envíos locales y despachos nacionales."
    },
    {
      q: "¿Cómo sé cuál es mi talla adecuada de calzado?",
      a: "En Colombia manejamos normalmente tallaje nacional y referencia US / EUR (ejemplo: 38 a 43). En la ficha de cada producto verás las tallas disponibles. Si tienes dudas respecto a si la horma viene justa o amplia, puedes consultarnos directamente al WhatsApp y te indicaremos los centímetros exactos de plantilla."
    },
    {
      q: "¿Cuánto demora la entrega de mi pedido?",
      a: "En Valledupar las entregas se realizan el mismo día o en un plazo máximo de 24 horas hábiles. Para otras ciudades del país (Bogotá, Medellín, Barranquilla, Cali, Bucaramanga, etc.) el envío toma entre 2 a 4 días hábiles mediante Servientrega o Interrapidísimo."
    },
    {
      q: "¿Tienen tienda física para ver y medirme los productos?",
      a: "¡Sí, totalmente! Puedes visitarnos directamente en nuestro local en Valledupar: Calle 16B # 7A-55 Barrio Centro. Puedes medírtelas, confirmar tu horma y llevarte tus modelos favoritos con atención personalizada de nuestro equipo."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-5">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-neutral-900 transition-colors cursor-pointer"
        >
          Inicio
        </button>
        <span>/</span>
        <span className="text-neutral-950 font-bold">Sobre Nosotros</span>
      </nav>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs text-center max-w-4xl mx-auto mb-8">
        <span className="text-xs font-extrabold tracking-[0.25em] text-neutral-500 uppercase mb-3 block">
          BONANZA 2020 · VALLEDUPAR, COLOMBIA
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-neutral-950 tracking-tight leading-tight mb-6">
          Moda urbana, calzado deportivo y autenticidad con buen gusto.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Nacimos con una misión clara: acercar las mejores siluetas y tendencias mundiales del streetwear y la moda deportiva a la Costa y a toda Colombia, con precios accesibles, atención directa y total confiabilidad.
        </p>
        <div className="pt-6 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={onNavigateToTienda}
            className="bg-[#111111] hover:bg-neutral-800 text-white font-bold px-7 py-3.5 rounded-full text-sm inline-flex items-center gap-2.5 transition-all shadow-md cursor-pointer"
          >
            <span>Explorar Tienda</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={`https://wa.me/${STORE_PHONE}?text=Hola%20Bonanza%202020,%20quisiera%20asesor%C3%ADa%20personalizada.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold px-7 py-3.5 rounded-full text-sm inline-flex items-center gap-2.5 transition-all cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp {STORE_PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>

      {/* 4 Pilares de Confianza */}
      <div className="mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950 tracking-tight">
            ¿Por qué elegir Bonanza 2020?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-5">
                {p.icon}
              </div>
              <h3 className="font-extrabold text-base text-neutral-950 mb-2">{p.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Valledupar */}
      <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 mb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block mb-2">
            ORGULLOSAMENTE VALLENATOS
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl tracking-tight mb-4 leading-tight">
            Desde la capital mundial del Vallenato para todo el territorio colombiano.
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed mb-5">
            Ubicados en Valledupar, Cesar, conectamos a jóvenes y amantes de los sneakers con el mejor catálogo deportivo. Compras seguras, despacho puntual y servicio cercano.
          </p>

          {/* Tarjeta de Tienda Física */}
          <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
                  Visítanos en Nuestra Tienda Física
                </span>
                <span className="text-sm font-bold text-white block">
                  {STORE_ADDRESS}
                </span>
                <span className="text-xs text-neutral-400 block">
                  Valledupar, Cesar, Colombia
                </span>
              </div>
            </div>
            <a
              href={STORE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0 cursor-pointer self-start sm:self-auto bg-emerald-950/60 px-3.5 py-2 rounded-xl border border-emerald-500/30"
            >
              <span>Abrir en Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-300 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>Barrio Centro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Despachos Nacionales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Garantía de Satisfacción</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center backdrop-blur-xs">
            <img src="assets/logo.png" alt="Bonanza 2020 Emblema" className="w-28 h-28 object-contain mb-4 drop-shadow-md" />
            <span className="font-black text-2xl tracking-[0.25em] text-white">BONANZA</span>
            <span className="text-xs font-bold tracking-[0.4em] text-neutral-400 uppercase">2020</span>
            <span className="mt-3 text-xs text-neutral-400 font-medium">
              Sede Principal · Valledupar, Colombia
            </span>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950 tracking-tight">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="bg-white rounded-2xl p-6 border border-neutral-200/80 group">
              <summary className="font-bold text-neutral-950 text-base cursor-pointer flex justify-between items-center list-none select-none">
                <span>{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

    </section>
  );
};
