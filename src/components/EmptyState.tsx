import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Icon className="w-12 h-12 text-emerald-500" />
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="bg-gradient-to-l from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
