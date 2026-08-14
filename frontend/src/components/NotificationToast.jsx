import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function NotificationToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'info', message = '' } = toast;

  const styles = {
    success: 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200',
    error: 'bg-rose-950/90 border-rose-800/80 text-rose-200',
    warning: 'bg-amber-950/90 border-amber-800/80 text-amber-200',
    info: 'bg-sky-950/90 border-sky-800/80 text-sky-200',
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-[200] max-w-sm w-full animate-bounce-in">
      <div
        className={`p-3.5 rounded-lg border shadow-xl flex items-start justify-between gap-3 text-xs font-medium backdrop-blur-md ${
          styles[type] || styles.info
        }`}
      >
        <div className="flex items-start gap-2.5">
          {icons[type]}
          <p className="line-clamp-3 leading-snug">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-100 p-0.5 rounded hover:bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
