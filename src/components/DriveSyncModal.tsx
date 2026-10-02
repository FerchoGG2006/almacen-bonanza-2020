import React, { useState } from 'react';
import {
  X,
  Cloud,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Database,
  Link as LinkIcon,
  FileSpreadsheet,
  Copy,
  Check,
} from 'lucide-react';
import { getDriveApiUrl, setDriveApiUrl, syncDriveCatalog, STORAGE_KEY_LAST_SYNC } from '../services/driveSync';
import {
  getSheetId,
  setSheetId,
  getSheetTab,
  setSheetTab,
  fetchPricesFromGoogleSheet,
  STORAGE_KEY_PRICES_LAST_SYNC,
  applySheetPricesToProducts,
} from '../services/googleSheetsPrices';
import { Product } from '../types/index';

interface DriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsCount: number;
  products?: Product[];
  onSyncSuccess: (updatedProducts: Product[], addedCount?: number) => void;
}

export const DriveSyncModal: React.FC<DriveSyncModalProps> = ({
  isOpen,
  onClose,
  productsCount,
  products = [],
  onSyncSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'sheets' | 'drive'>('sheets');
  const [apiUrl, setApiUrlState] = useState(getDriveApiUrl());
  const [sheetId, setSheetIdState] = useState(getSheetId());
  const [sheetTab, setSheetTabState] = useState(getSheetTab());
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const lastDriveSync = localStorage.getItem(STORAGE_KEY_LAST_SYNC);
  const formattedLastDriveSync = lastDriveSync
    ? new Date(lastDriveSync).toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Nunca';

  const lastPricesSync = localStorage.getItem(STORAGE_KEY_PRICES_LAST_SYNC);
  const formattedLastPricesSync = lastPricesSync
    ? new Date(lastPricesSync).toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Nunca';

  const handleSyncPrices = async () => {
    if (!sheetId.trim()) {
      setResultMessage({
        type: 'error',
        text: 'Por favor ingresa el ID del Google Sheet.',
      });
      return;
    }

    setSheetId(sheetId);
    setSheetTab(sheetTab);
    setLoading(true);
    setResultMessage(null);

    const res = await fetchPricesFromGoogleSheet(sheetId.trim(), sheetTab.trim());
    setLoading(false);

    if (res.success) {
      setResultMessage({
        type: 'success',
        text: `¡Precios actualizados con éxito! Se sincronizaron ${res.prices.size} referencias desde la pestaña "${sheetTab}".`,
      });
      if (products.length > 0) {
        const updated = applySheetPricesToProducts(products, res.prices);
        onSyncSuccess(updated);
      }
    } else {
      setResultMessage({
        type: 'error',
        text: res.error || 'No se pudieron leer los precios del Google Sheet.',
      });
    }
  };

  const handleCopyTemplate = () => {
    const headers = [
      'ID',
      'FOTO',
      'REFERENCIA',
      'MARCA',
      'CATEGORIA',
      'GENERO',
      'PRECIO_VENTA_COP',
      'PRECIO_OFERTA_COP',
      'ESTADO',
    ];
    const rows = products.slice(0, 65).map((p) => {
      const foto = `=IMAGE("${p.image}")`;
      const precioVenta = p.original_price ? p.original_price : p.price;
      const precioOferta = p.original_price ? p.price : '';
      return [
        p.id,
        foto,
        `"${p.name.replace(/"/g, '""')}"`,
        p.brand,
        p.category,
        p.gender,
        precioVenta,
        precioOferta,
        'DISPONIBLE',
      ].join('\t');
    });

    const fullTsv = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(fullTsv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleSyncDrive = async () => {
    if (!apiUrl.trim()) {
      setResultMessage({
        type: 'error',
        text: 'Por favor ingresa la URL de tu Google Apps Script antes de sincronizar.',
      });
      return;
    }

    setDriveApiUrl(apiUrl);
    setLoading(true);
    setResultMessage(null);

    const res = await syncDriveCatalog(apiUrl.trim(), true);
    setLoading(false);

    if (res.success) {
      setResultMessage({
        type: 'success',
        text: res.message,
      });
      onSyncSuccess(res.products, res.addedCount);
    } else {
      setResultMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 z-10 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-neutral-950 leading-tight">
                Control de Precios e Inventario
              </h3>
              <p className="text-[11px] text-neutral-500">
                Sincronización en vivo con Google Sheets y Google Drive
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-1 border-b border-neutral-200 bg-white shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('sheets');
              setResultMessage(null);
            }}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sheets'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Precios (Google Sheets)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('drive');
              setResultMessage(null);
            }}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'drive'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Fotos (Google Drive)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-700 leading-relaxed">
          {/* Status summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                Catálogo Activo
              </span>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-neutral-900" />
                <span className="font-mono font-black text-sm sm:text-base text-neutral-950">
                  {productsCount} refs
                </span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                {activeTab === 'sheets' ? 'Último Sync de Precios' : 'Último Sync de Fotos'}
              </span>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-neutral-900" />
                <span className="font-mono font-bold text-[11px] sm:text-xs text-neutral-900 truncate">
                  {activeTab === 'sheets' ? formattedLastPricesSync : formattedLastDriveSync}
                </span>
              </div>
            </div>
          </div>

          {activeTab === 'sheets' ? (
            <>
              {/* Google Sheets Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-neutral-950 block text-xs">
                      ID de la Hoja de Cálculo (Google Sheets)
                    </label>
                    <a
                      href={sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Abrir Sheet ↗</span>
                    </a>
                  </div>
                  <input
                    type="text"
                    value={sheetId}
                    onChange={(e) => setSheetIdState(e.target.value)}
                    placeholder="16bNKtZkxBzyUaRHjcVJQGhC8tWsorXTJHzUN648idVk"
                    className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-950 text-neutral-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-950 block text-xs">
                    Nombre de la Pestaña
                  </label>
                  <input
                    type="text"
                    value={sheetTab}
                    onChange={(e) => setSheetTabState(e.target.value)}
                    placeholder="LISTA_PRECIOS"
                    className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-950 text-neutral-900 font-mono"
                  />
                  <p className="text-[11px] text-neutral-500">
                    Crea una pestaña con este nombre en tu Google Sheet donde colocas los precios.
                  </p>
                </div>
              </div>

              {/* Plantilla rápida para copiar y pegar */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-neutral-900 text-xs mb-0.5">
                    Plantilla con 65 referencias y fotos
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Copia la tabla formateada con fórmulas de fotos y pégala en la celda A1 de tu pestaña.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="shrink-0 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Copiar Plantilla</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Drive Web App URL Input */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-950 block text-xs">
                  URL del Web App (Google Apps Script de Drive)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="url"
                    value={apiUrl}
                    onChange={(e) => setApiUrlState(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-950 text-neutral-900 font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* Feedback message */}
          {resultMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 animate-in fade-in ${
                resultMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : resultMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-900 border border-rose-200'
                  : 'bg-neutral-100 text-neutral-900 border border-neutral-200'
              }`}
            >
              {resultMessage.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {resultMessage.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              {resultMessage.type === 'info' && (
                <Cloud className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
              )}
              <div className="font-medium">{resultMessage.text}</div>
            </div>
          )}

          {/* Instrucciones de uso */}
          <div className="bg-neutral-50/80 rounded-2xl p-3.5 border border-neutral-200 space-y-1.5">
            <h4 className="font-bold text-neutral-950 text-xs">
              {activeTab === 'sheets'
                ? '¿Cómo actualiza los precios el dueño del almacén?'
                : '¿Cómo funciona la incorporación de nuevas fotos?'}
            </h4>
            {activeTab === 'sheets' ? (
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-600">
                <li>
                  Entra a su Google Sheet desde su celular o computador.
                </li>
                <li>
                  Modifica la columna <strong>PRECIO_VENTA_COP</strong> de la referencia deseada.
                </li>
                <li>
                  ¡Listo! La tienda web lee el cambio automáticamente en tiempo real.
                </li>
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-600">
                <li>Subes tus fotos a cualquier carpeta de Google Drive.</li>
                <li>Google Apps Script detecta la nueva imagen y genera su enlace CDN.</li>
                <li>La tienda web añade automáticamente el producto al catálogo.</li>
              </ol>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-neutral-500 font-mono">
            {activeTab === 'sheets' ? `Hoja: ${sheetTab}` : 'Drive CDN'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-neutral-200 rounded-full text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer text-center"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={activeTab === 'sheets' ? handleSyncPrices : handleSyncDrive}
              disabled={loading}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-full text-xs font-bold transition-all inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>
                {loading
                  ? 'Sincronizando...'
                  : activeTab === 'sheets'
                  ? 'Actualizar Precios'
                  : 'Sincronizar Fotos'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
