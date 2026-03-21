import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  const colors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    info: 'bg-slate-900 hover:bg-slate-800 text-white'
  };

  const iconColors = {
    danger: 'text-red-600 bg-red-50',
    warning: 'text-amber-600 bg-amber-50',
    info: 'text-slate-600 bg-slate-50'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-2xl ${iconColors[type]}`}>
                <AlertTriangle size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-4">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${colors[type]}`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
                >
                  {cancelText}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
