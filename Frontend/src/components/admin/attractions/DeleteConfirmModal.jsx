import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from '../../Modal';
import Button from '../../Button';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  item,
  onConfirm,
  deleting,
}) {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Attraction">
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-rose-900 dark:text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold font-heading">Permanent Action Warning</p>
            <p className="text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
              Are you sure you want to delete this attraction? This action cannot be undone and will immediately remove it from public discovery.
            </p>
          </div>
        </div>

        {/* Item Preview Card */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-slate-700">
          <img
            src={item.image || FALLBACK_IMAGE}
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
              {item.category}
            </span>
            <h4 className="text-sm font-bold text-ocean-950 dark:text-white font-heading truncate">
              {item.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {item.description}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={deleting}
          >
            Keep Attraction
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={deleting}
            disabled={deleting}
            className="cursor-pointer"
          >
            Delete Attraction
          </Button>
        </div>
      </div>
    </Modal>
  );
}
