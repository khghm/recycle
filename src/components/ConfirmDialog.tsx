import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تأیید',
  cancelText = 'انصراف',
  type = 'warning',
}: ConfirmDialogProps) {
  const typeStyles = {
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const styles = typeStyles[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-12 h-12 ${styles.bg} ${styles.border} border-2 rounded-2xl flex items-center justify-center shrink-0`}>
                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-50 transition"
              >
                {cancelText}
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 ${styles.button} text-white py-3 rounded-2xl font-bold shadow-lg transition`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
