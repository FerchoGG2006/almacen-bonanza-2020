import React, { useState } from 'react';
import { X, Cloud, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Database, Link as LinkIcon } from 'lucide-react';
import { getDriveApiUrl, setDriveApiUrl, syncDriveCatalog, STORAGE_KEY_LAST_SYNC } from '../services/driveSync';
import { Product } from '../types/index';

interface DriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsCount: number;
  onSyncSuccess: (updatedProducts: Product[], addedCount: number) => void;
}

export const DriveSyncModal: React.FC<DriveSyncModalProps> = ({
  isOpen,
  onClose,
  productsCount,
  onSyncSuccess,
}) => {
  const [apiUrl, setApiUrlState] = useState(getDriveApiUrl());
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const lastSync = localStorage.getItem(STORAGE_KEY_LAST_SYNC);
  const formattedLastSync = lastSync
    ? new Date(lastSync).toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Nunca';

  const handleSaveUrl = () => {
    setDriveApiUrl(apiUrl);
    setResultMessage({
      type: 'info',
      text: 'URL de Google Apps Script guardada en la configuración local.',
    });
  };

  const handleSyncNow = async () => {
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

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-neutral-950 leading-tight">
                Sincronización con Google Drive
              </h3>
              <p className="text-[11px] text-neutral-500">
                Conecta tu catálogo en vivo con la carpeta de Google Drive
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700 leading-relaxed">
          
          {/* Status summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Catálogo Activo
              </span>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-neutral-900" />
                <span className="font-mono font-black text-base text-neutral-950">
                  {productsCount} refs
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Última Sincronización
              </span>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-neutral-900" />
                <span className="font-mono font-bold text-xs text-neutral-900">
                  {formattedLastSync}
                </span>
              </div>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <label className="font-bold text-neutral-950 block text-xs">
              URL del Web App (Google Apps Script)
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
            <p className="text-[11px] text-neutral-500">
              Obtienes esta URL al publicar el script en Google Drive como Web App con acceso público.
            </p>
          </div>

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

          {/* Quick Explanation */}
          <div className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-200 space-y-2">
            <h4 className="font-bold text-neutral-950 text-xs flex items-center gap-1.5">
              <span>¿Cómo funciona la incorporación automática?</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-neutral-600">
              <li>Subes tus fotos a cualquier carpeta de Google Drive (ej. <em>CALZADO HOMBRE / Nike</em>).</li>
              <li>Google Apps Script detecta la nueva imagen y genera su enlace CDN de alta resolución.</li>
              <li>La tienda web añade automáticamente el producto al catálogo sin necesidad de tocar código ni recompilar.</li>
            </ol>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSaveUrl}
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            Guardar URL
          </button>

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
              onClick={handleSyncNow}
              disabled={loading}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-full text-xs font-bold transition-all inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
