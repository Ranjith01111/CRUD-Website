import React from 'react';
import { Ticket } from '../types';
import { Calendar, MapPin, Tag, Trash2, Edit2, CheckCircle, XCircle, Clock, Ban } from 'lucide-react';
import { motion } from 'motion/react';
import { ConfirmationModal } from './ConfirmationModal';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  onViewPass: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onEdit, onDelete, onCancel, onViewPass }) => {
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

  const statusConfig = {
    active: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  };

  const StatusIcon = statusConfig[ticket.status].icon;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 ${ticket.status === 'cancelled' ? 'opacity-75 grayscale-[0.3]' : ''}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusConfig[ticket.status].bg} ${statusConfig[ticket.status].color} ${statusConfig[ticket.status].border} border`}>
            <StatusIcon size={14} />
            {ticket.status}
          </div>
          <div className="flex gap-1 transition-opacity">
            {ticket.status === 'active' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(ticket);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  title="Edit Ticket"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCancelConfirmOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Cancel Ticket"
                >
                  <Ban size={18} />
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteConfirmOpen(true);
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Ticket"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <h3 className={`text-lg font-bold text-slate-900 mb-2 leading-tight ${ticket.status === 'cancelled' ? 'line-through text-slate-400' : ''}`}>{ticket.title}</h3>
        {ticket.description && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{ticket.description}</p>
        )}

        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-slate-600">
            <Calendar size={16} className="text-slate-400" />
            <span className="text-sm font-medium">
              {ticket.date.toDate().toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm font-medium">{ticket.venue}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600 pt-2 border-t border-slate-100 mt-4">
            <Tag size={16} className="text-slate-400" />
            <span className={`text-lg font-bold text-slate-900 ${ticket.status === 'cancelled' ? 'text-slate-400' : ''}`}>
              {ticket.price === 0 ? 'Free' : `₹${ticket.price.toLocaleString('en-IN')}`}
            </span>
          </div>
          
          <button
            disabled={ticket.status === 'cancelled'}
            onClick={() => onViewPass(ticket)}
            className={`w-full mt-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              ticket.status === 'cancelled' 
                ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            {ticket.status === 'cancelled' ? 'Pass Invalid' : 'View Pass'}
          </button>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={() => onCancel(ticket.id)}
        title="Cancel Ticket"
        message="Are you sure you want to cancel this ticket? This action cannot be undone."
        confirmText="Yes, Cancel Ticket"
        type="warning"
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => onDelete(ticket.id)}
        title="Delete Ticket"
        message="Are you sure you want to permanently delete this ticket record? This action cannot be undone."
        confirmText="Yes, Delete Permanently"
        type="danger"
      />
    </>
  );
};
