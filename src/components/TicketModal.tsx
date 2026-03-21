import React from 'react';
import { Ticket } from '../types';
import { X, Calendar, MapPin, Tag, Type, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Timestamp } from '../firebase';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Partial<Ticket>) => void;
  ticket?: Ticket;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, onSave, ticket }) => {
  const [formData, setFormData] = React.useState<Partial<Ticket>>({
    title: '',
    description: '',
    date: Timestamp.now(),
    venue: '',
    price: 0,
    status: 'active',
  });

  React.useEffect(() => {
    if (ticket) {
      setFormData(ticket);
    } else {
      setFormData({
        title: '',
        description: '',
        date: Timestamp.now(),
        venue: '',
        price: 0,
        status: 'active',
      });
    }
  }, [ticket, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setFormData({ ...formData, date: Timestamp.fromDate(date) });
  };

  const formatForInput = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {ticket ? 'Edit Ticket' : 'Create New Ticket'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Type size={16} />
                  Event Title
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                  placeholder="e.g. Summer Music Festival"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <AlignLeft size={16} />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none min-h-[100px] resize-none"
                  placeholder="Tell us more about the event..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Calendar size={16} />
                    Date & Time
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={formatForInput(formData.date)}
                    onChange={handleDateChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Tag size={16} />
                    Price (₹)
                  </label>
                  <input
                    required
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin size={16} />
                  Venue
                </label>
                <input
                  required
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                  placeholder="e.g. Central Park, NY"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                  {ticket ? 'Update Ticket' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
