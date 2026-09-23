import React, { useState, useRef, useEffect } from 'react';
import { ViewType } from '../types/index';
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { STORE_PHONE, formatCOP } from '../services/whatsapp';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType, param?: string | number) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onToggleWishlistFilter: () => void;
  isWishlistActive: boolean;
  onFocusSearch: () => void;
}

interface NavSublink {
  label: string;
  desc: string;
  view: ViewType;
  param?: string | number;
}

interface NavTile {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface NavCategory {
  id: string;
  title: string;
  headline: string;
  sublinks: NavSublink[];
  tiles: NavTile[];
}

const MULTILEVEL_DATA: NavCategory[] = [
  {
    id: 'calzado',
    title: 'Calzado & Sneakers',
    headline: 'Siluetas Icónicas y Rendimiento',
    sublinks: [
      {
        label: 'Zapatillas Urbanas',
        desc: 'Modelos retro, streetwear y uso diario',
        view: 'tienda',
        param: 'cat:Zapatillas',
      },
      {
        label: 'Running & Training',
        desc: 'Amortiguación avanzada y suela de tracción',
        view: 'tienda',
        param: 'cat:Running',
      },
      {
        label: 'Calzado Masculino',
        desc: 'Tallas 38 a 43 para caballero',
        view: 'hombres',
      },
      {
        label: 'Calzado Femenino',
        desc: 'Siluetas lifestyle y deportivas para mujer',
        view: 'mujeres',
      },
      {
        label: 'Ver Todo el Calzado',
        desc: 'Explora las más de 50 referencias en stock',
        view: 'tienda',
        param: 'cat:calzado',
      },
    ],
    tiles: [
      {
        id: 1,
        name: "Air Jordan 4 Retro 'Military Black'",
        brand: 'Nike',
        price: 245000,
        image: 'https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800',
      },
      {
        id: 2,
        name: "Nike Dunk Low 'Panda' Edition",
        brand: 'Nike',
        price: 185000,
        image: 'https://lh3.googleusercontent.com/d/1FNPxysGWORXe5tQgNpWSDb8hifbICziq=w800',
      },
    ],
  },
  {
    id: 'ropa',
    title: 'Ropa & Streetwear',
    headline: 'Textiles Premium y Estilo Deportivo',
    sublinks: [
      {
        label: 'Conjuntos Deportivos',
        desc: 'Microfibra transpirable y joggers de ajuste',
        view: 'tienda',
        param: 'cat:Conjuntos',
      },
      {
        label: 'Camisetas Retro',
        desc: 'Fútbol clásico y prendas urbanas',
        view: 'tienda',
        param: 'cat:Camisetas',
      },
      {
        label: 'Ropa Hombre',
        desc: 'Sets completos en tallas S a XL',
        view: 'hombres',
      },
      {
        label: 'Ver Toda la Ropa',
        desc: 'Catálogo textil disponible en Valledupar',
        view: 'tienda',
        param: 'cat:ropa',
      },
    ],
    tiles: [
      {
        id: 48,
        name: 'Conjunto Retro Windrunner 2026',
        brand: 'Bonanza Sport',
        price: 125000,
        image: 'https://lh3.googleusercontent.com/d/1bSocB32WaTigetHpiJZ035kVY5G2HnFZ=w800',
      },
      {
        id: 49,
        name: "Conjunto Tech Tracksuit 'Obsidian'",
        brand: 'Bonanza Sport',
        price: 115000,
        image: 'https://lh3.googleusercontent.com/d/1SwrD_v_ngcEif77GMxK4ue6rThTsfa1s=w800',
      },
    ],
  },
  {
    id: 'marcas',
    title: 'Marcas Oficiales',
    headline: 'Líderes Mundiales del Calzado',
    sublinks: [
      {
        label: 'Nike',
        desc: 'Air Jordan, Dunk Low y Air Force',
        view: 'tienda',
        param: 'brand:Nike',
      },
      {
        label: 'Adidas',
        desc: 'Originals, Forum y siluetas urbanas',
        view: 'tienda',
        param: 'brand:Adidas',
      },
      {
        label: 'New Balance',
        desc: 'Ediciones 9060, 550 y estilo dad-shoe',
        view: 'tienda',
        param: 'brand:New Balance',
      },
      {
        label: 'On Cloud',
        desc: 'Ingeniería suiza de ultra amortiguación',
        view: 'tienda',
        param: 'brand:On Cloud',
      },
      {
        label: 'Asics',
        desc: 'Línea de rendimiento Gel-Kayano y Nimbus',
        view: 'tienda',
        param: 'brand:Asics',
      },
    ],
    tiles: [
      {
        id: 19,
        name: "On Running Cloudsurfer 'Fade'",
        brand: 'On Cloud',
        price: 305000,
        image: 'https://lh3.googleusercontent.com/d/1Ypt3R_zksQpFwDbothWNjNg7QlhN6D70=w800',
      },
      {
        id: 3,
        name: 'Air Jordan 1 Retro High OG',
        brand: 'Nike',
        price: 220000,
        image: 'https://lh3.googleusercontent.com/d/15HQ-Zam7ME3yRxPCuyX0CezBv5y6xD3t=w800',
      },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onToggleWishlistFilter,
  isWishlistActive,
  onFocusSearch,
}) => {
  // Multilevel Dropdown State (Desktop)
  const [activeMegaCategory, setActiveMegaCategory] = useState<string | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('calzado');
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Multilevel Mobile Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuId, setMobileSubmenuId] = useState<string | null>(null);

  // Close mega menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveMegaCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: ViewType, param?: string | number) => {
    onNavigate(view, param);
    setActiveMegaCategory(null);
    setMobileMenuOpen(false);
    setMobileSubmenuId(null);
  };

  const currentMegaCategory =
    MULTILEVEL_DATA.find((c) => c.id === selectedCategoryTab) || MULTILEVEL_DATA[0];

  return (
    <header ref={navContainerRef} className="sticky top-0 z-50 bg-white border-b border-neutral-200 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-white text-[10px] sm:text-[11px] font-bold tracking-widest uppercase py-1.5 px-4 text-center overflow-hidden select-none">
        <div className="inline-flex items-center gap-3 sm:gap-4">
          <span>ENVÍOS A TODA COLOMBIA</span>
          <span className="text-neutral-500">·</span>
          <span className="hidden sm:inline">CONTRA ENTREGA EN VALLEDUPAR</span>
          <span className="hidden sm:inline text-neutral-500">·</span>
          <span>GARANTÍA DE TALLA</span>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group select-none text-left cursor-pointer bg-transparent border-0 p-0"
        >
          <img
            src="assets/logo.png"
            alt="Emblema Bonanza 2020"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-contain shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="font-extrabold tracking-[0.22em] text-lg sm:text-xl text-neutral-950 leading-tight">
              BONANZA
            </span>
            <span className="text-[9px] font-bold tracking-[0.35em] text-neutral-500 uppercase -mt-0.5">
              2020
            </span>
          </div>
        </button>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`transition-all cursor-pointer ${
              currentView === 'home' && !activeMegaCategory
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-1'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            Inicio
          </button>

          {/* Multilevel Trigger: Calzado */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryTab('calzado');
              setActiveMegaCategory(activeMegaCategory === 'calzado' ? null : 'calzado');
            }}
            onMouseEnter={() => {
              setSelectedCategoryTab('calzado');
              setActiveMegaCategory('calzado');
            }}
            className={`inline-flex items-center gap-1.5 transition-all cursor-pointer py-1 ${
              activeMegaCategory === 'calzado'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            <span>Calzado</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaCategory === 'calzado' ? 'rotate-180 text-neutral-950' : 'text-neutral-400'}`} />
          </button>

          {/* Multilevel Trigger: Ropa */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryTab('ropa');
              setActiveMegaCategory(activeMegaCategory === 'ropa' ? null : 'ropa');
            }}
            onMouseEnter={() => {
              setSelectedCategoryTab('ropa');
              setActiveMegaCategory('ropa');
            }}
            className={`inline-flex items-center gap-1.5 transition-all cursor-pointer py-1 ${
              activeMegaCategory === 'ropa'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            <span>Ropa</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaCategory === 'ropa' ? 'rotate-180 text-neutral-950' : 'text-neutral-400'}`} />
          </button>

          {/* Multilevel Trigger: Marcas */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryTab('marcas');
              setActiveMegaCategory(activeMegaCategory === 'marcas' ? null : 'marcas');
            }}
            onMouseEnter={() => {
              setSelectedCategoryTab('marcas');
              setActiveMegaCategory('marcas');
            }}
            className={`inline-flex items-center gap-1.5 transition-all cursor-pointer py-1 ${
              activeMegaCategory === 'marcas'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            <span>Marcas</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaCategory === 'marcas' ? 'rotate-180 text-neutral-950' : 'text-neutral-400'}`} />
          </button>

          {/* Direct Link: Tienda Completa */}
          <button
            type="button"
            onClick={() => handleNavClick('tienda')}
            className={`transition-all cursor-pointer ${
              currentView === 'tienda' && !activeMegaCategory
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-1'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            Tienda
          </button>

          {/* Direct Link: Nosotros */}
          <button
            type="button"
            onClick={() => handleNavClick('nosotros')}
            className={`transition-all cursor-pointer ${
              currentView === 'nosotros' && !activeMegaCategory
                ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-1'
                : 'text-neutral-700 hover:text-neutral-950'
            }`}
          >
            Nosotros
          </button>
        </nav>

        {/* Utility Actions (Right) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={onToggleWishlistFilter}
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${
              isWishlistActive
                ? 'bg-rose-50 text-rose-600'
                : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/50'
            }`}
            title="Ver mis favoritos"
            aria-label="Ver mis favoritos"
          >
            <Heart className={`w-5 h-5 ${isWishlistActive ? 'fill-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Search Trigger */}
          <button
            type="button"
            onClick={onFocusSearch}
            className="text-neutral-700 hover:text-neutral-950 p-2 rounded-full hover:bg-neutral-200/50 transition-colors cursor-pointer"
            title="Buscar productos"
            aria-label="Buscar productos"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* WhatsApp Direct Help */}
          <a
            href={`https://wa.me/${STORE_PHONE}?text=Hola%20Bonanza%202020,%20quisiera%20asesor%C3%ADa.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-neutral-700 hover:text-neutral-950 p-2 rounded-full hover:bg-neutral-200/50 transition-colors"
            title="Atención directa por WhatsApp"
            aria-label="Atención directa por WhatsApp"
          >
            <User className="w-5 h-5" />
          </a>

          {/* Cart Bag Button with Count */}
          <button
            type="button"
            id="cartBtn"
            onClick={onOpenCart}
            className="relative text-neutral-700 hover:text-neutral-950 p-2 rounded-full hover:bg-neutral-200/50 transition-colors cursor-pointer"
            title="Ver bolsa de compras"
            aria-label="Ver bolsa de compras"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                id="cartBadge"
                className="absolute -top-1 -right-1 bg-[#111111] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileSubmenuId(null);
            }}
            className="md:hidden text-neutral-700 hover:text-neutral-950 p-2 rounded-full hover:bg-neutral-200/50 cursor-pointer"
            title="Menú"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* DESKTOP MULTILEVEL MEGA NAVIGATION PANEL (Inspirado en Osmo Supply)       */}
      {/* ========================================================================= */}
      {activeMegaCategory !== null && (
        <>
          {/* Dimmed backdrop overlay covering the page below */}
          <div
            onClick={() => setActiveMegaCategory(null)}
            className="mega-menu-overlay cursor-pointer"
            aria-label="Cerrar navegación"
          />

          <div
            onMouseLeave={() => setActiveMegaCategory(null)}
            className="hidden md:block absolute top-full left-0 w-full mega-menu-panel z-50 bg-white"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 bg-white">
              <div className="grid grid-cols-12 gap-8 items-start">
                
                {/* Level 1: Category Selection Tabs */}
                <div className="col-span-3 border-r border-neutral-200 pr-6 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-3">
                    CATEGORÍAS
                  </span>

                  {MULTILEVEL_DATA.map((cat) => {
                    const isSelected = selectedCategoryTab === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onMouseEnter={() => setSelectedCategoryTab(cat.id)}
                        onClick={() => setSelectedCategoryTab(cat.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'bg-[#111111] text-white font-bold shadow-md'
                            : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 font-medium'
                        }`}
                      >
                        <span className="text-sm tracking-tight">{cat.title}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                      </button>
                    );
                  })}

                  <div className="pt-5 border-t border-neutral-200 mt-5 space-y-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleNavClick('tienda')}
                      className="w-full text-left font-bold text-neutral-900 hover:text-neutral-600 transition-colors flex items-center justify-between py-1 cursor-pointer group"
                    >
                      <span>Ver Catálogo Completo (65)</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavClick('nosotros')}
                      className="w-full text-left text-neutral-500 hover:text-neutral-900 transition-colors flex items-center justify-between py-1 cursor-pointer group"
                    >
                      <span>Tienda Física Valledupar</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Level 2: Subcategory Navigation Links */}
                <div className="col-span-4 px-4 border-r border-neutral-200">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-3">
                    {currentMegaCategory.headline}
                  </span>

                  <div className="space-y-2">
                    {currentMegaCategory.sublinks.map((sub, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleNavClick(sub.view, sub.param)}
                        className="w-full text-left p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200/80 transition-all group cursor-pointer block"
                      >
                        <div className="text-xs font-bold text-neutral-950 group-hover:text-black flex items-center justify-between transition-colors">
                          <span>{sub.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-snug mt-1 font-normal">
                          {sub.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level 3: Interactive Tiles (Tarjetas visuales con drops reales) */}
                <div className="col-span-5 pl-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                      SILUETAS DESTACADAS
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNavClick('tienda', `cat:${currentMegaCategory.id}`)}
                      className="text-[11px] font-bold text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
                    >
                      Ver todas →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {currentMegaCategory.tiles.map((tile) => (
                      <div
                        key={tile.id}
                        onClick={() => handleNavClick('producto', tile.id)}
                        className="group bg-[#FAFAFA] hover:bg-white rounded-2xl p-3.5 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        {/* Tile Image with hover zoom */}
                        <div className="relative aspect-square w-full rounded-xl bg-white p-3 mb-2.5 overflow-hidden border border-neutral-200/60 flex items-center justify-center">
                          <img
                            src={tile.image}
                            alt={tile.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                          />
                        </div>

                        {/* Tile Info */}
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">
                            {tile.brand}
                          </span>
                          <h4 className="text-xs font-bold text-neutral-950 line-clamp-1 group-hover:text-neutral-600 transition-colors mb-1.5" title={tile.name}>
                            {tile.name}
                          </h4>
                          <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60">
                            <span className="text-xs font-extrabold text-neutral-950 font-mono">
                              {formatCOP(tile.price)}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-600 group-hover:text-neutral-950 transition-colors flex items-center gap-0.5">
                              Ver ficha
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MOBILE MULTILEVEL DRAWER (Slide Transitions entre Nivel 1 y Nivel 2)      */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div
          id="mobileMenuDrawer"
          className="md:hidden border-t border-neutral-200 bg-[#F5F5F5] px-5 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto"
        >
          {/* Header Mobile Brand */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <img src="assets/logo.png" alt="Bonanza 2020" className="w-9 h-9 rounded-full object-contain shadow-sm" />
              <div className="flex flex-col">
                <span className="font-extrabold tracking-[0.2em] text-base text-neutral-950">BONANZA</span>
                <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-500 uppercase">2020</span>
              </div>
            </div>

            {mobileSubmenuId && (
              <button
                type="button"
                onClick={() => setMobileSubmenuId(null)}
                className="text-xs font-bold text-neutral-800 bg-white border border-neutral-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
            )}
          </div>

          {/* Level 1: Root Menu */}
          {!mobileSubmenuId ? (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className={`w-full text-left py-2.5 px-3.5 rounded-xl transition-colors cursor-pointer text-sm font-bold ${
                  currentView === 'home'
                    ? 'bg-neutral-950 text-white'
                    : 'hover:bg-neutral-200/60 text-neutral-800'
                }`}
              >
                Inicio
              </button>

              {/* Multilevel triggers for mobile */}
              {MULTILEVEL_DATA.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setMobileSubmenuId(cat.id)}
                  className="w-full text-left py-2.5 px-3.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-900 font-bold text-sm flex items-center justify-between transition-colors cursor-pointer shadow-xs"
                >
                  <span>{cat.title}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
              ))}

              <div className="pt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => handleNavClick('hombres')}
                  className="w-full text-left py-2 px-3.5 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-950 cursor-pointer"
                >
                  Colección Hombres
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('mujeres')}
                  className="w-full text-left py-2 px-3.5 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-950 cursor-pointer"
                >
                  Colección Mujeres
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('tienda')}
                  className="w-full text-left py-2 px-3.5 rounded-xl text-xs font-bold text-neutral-950 flex items-center justify-between cursor-pointer"
                >
                  <span>Ver Catálogo Completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('nosotros')}
                  className="w-full text-left py-2 px-3.5 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-950 cursor-pointer"
                >
                  Sobre Nosotros & Tienda Física
                </button>
              </div>
            </div>
          ) : (
            /* Level 2: Sublevel with Links and Interactive Tiles */
            (() => {
              const activeCat = MULTILEVEL_DATA.find((c) => c.id === mobileSubmenuId) || MULTILEVEL_DATA[0];
              return (
                <div className="space-y-4 animate-in slide-in-from-right duration-200">
                  <div className="px-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-0.5">
                      SUBCATEGORÍAS
                    </span>
                    <h3 className="font-display font-extrabold text-lg text-neutral-950">
                      {activeCat.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    {activeCat.sublinks.map((sub, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleNavClick(sub.view, sub.param)}
                        className="w-full text-left p-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 transition-colors cursor-pointer block shadow-2xs"
                      >
                        <div className="text-xs font-bold text-neutral-950 flex items-center justify-between">
                          <span>{sub.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{sub.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Mobile Interactive Tiles */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 px-1">
                      DESTACADOS DE ESTA LÍNEA
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {activeCat.tiles.map((tile) => (
                        <div
                          key={tile.id}
                          onClick={() => handleNavClick('producto', tile.id)}
                          className="bg-white rounded-2xl p-2.5 border border-neutral-200 shadow-xs flex flex-col justify-between cursor-pointer"
                        >
                          <div className="aspect-square bg-neutral-50 rounded-xl p-2 mb-2 flex items-center justify-center">
                            <img src={tile.image} alt={tile.name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-neutral-400 block">{tile.brand}</span>
                            <h4 className="text-[11px] font-bold text-neutral-900 truncate mb-1">{tile.name}</h4>
                            <span className="text-[11px] font-extrabold text-neutral-950 font-mono">{formatCOP(tile.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          {/* Footer Info in Mobile Drawer */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
            <span>Valledupar, Colombia</span>
            <a
              href={`https://wa.me/${STORE_PHONE}?text=Hola%20Bonanza%202020,%20quisiera%20asesor%C3%ADa.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold"
            >
              Atención WhatsApp →
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
