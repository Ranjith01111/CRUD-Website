import React from 'react';
import { Ticket } from '../types';
import { X, Download, Share2, MapPin, Ticket as TicketIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ETicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
}

export const ETicketModal: React.FC<ETicketModalProps> = ({ isOpen, onClose, ticket }) => {
  const [copied, setCopied] = React.useState(false);
  const ticketRef = React.useRef<HTMLDivElement>(null);

  const handleSavePDF = () => {
    // Inject a temporary print style that isolates just the e-ticket card
    const styleId = 'swiftticket-print-style';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      @media print {
        @page { margin: 0; }
        body { margin: 1cm; background: white !important; }
        body * { visibility: hidden !important; }
        
        #eticket-printable, #eticket-printable * { 
          visibility: visible !important; 
        }
        
        #eticket-printable {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 400px !important;
          transform: none !important;
          box-shadow: none !important;
          border: 1px solid #e2e8f0 !important;
        }

        #eticket-actions, #eticket-actions * {
          display: none !important;
          visibility: hidden !important;
        }
      }
    `;
    window.print();
    // Clean up after print dialog closes
    setTimeout(() => style && style.remove(), 1000);
  };

  const handleShare = async () => {
    const ticketText = `🎫 ${ticket.title}\n📍 ${ticket.venue}\n📅 ${ticket.date.toDate().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' })}\n💰 ${ticket.price === 0 ? 'Free' : `₹${ticket.price.toLocaleString('en-IN')}`}\n🔖 Ticket ID: #${ticket.id.slice(-8).toUpperCase()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `SwiftTicket – ${ticket.title}`,
          text: ticketText,
        });
      } catch {
        // user cancelled share — do nothing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(ticketText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            id="eticket-printable"
            ref={ticketRef}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* Ticket Header */}
            <div className="bg-slate-900 p-6 text-white relative">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <TicketIcon className="text-white" size={20} />
                  <span className="text-sm font-bold tracking-widest uppercase">SwiftTicket E-PASS</span>
                </div>
                <button id="eticket-close-btn" onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-black leading-tight mb-2">{ticket.title}</h2>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={14} />
                {ticket.venue}
              </div>
              
              {/* Decorative circles for ticket punch effect */}
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white rounded-full" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-white rounded-full" />
            </div>

            {/* Ticket Body */}
            <div className="p-8 pt-10 space-y-6 border-b-2 border-dashed border-slate-100 relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                  <p className="text-sm font-bold text-slate-900">
                    {ticket.date.toDate().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</p>
                  <p className="text-sm font-bold text-slate-900">
                    {ticket.date.toDate().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket ID</p>
                  <p className="text-sm font-mono font-bold text-slate-900">#{ticket.id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</p>
                  <p className="text-sm font-bold text-slate-900">
                    {ticket.price === 0 ? 'Free' : `₹${ticket.price.toLocaleString('en-IN')}`}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {/* Mock QR Code */}
                  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="140" height="140" rx="12" fill="white"/>
                    <path d="M20 20H50V50H20V20ZM25 25V45H45V25H25Z" fill="#0F172A"/>
                    <path d="M90 20H120V50H90V20ZM95 25V45H115V25H95Z" fill="#0F172A"/>
                    <path d="M20 90H50V120H20V90ZM25 95V115H45V95H25Z" fill="#0F172A"/>
                    <rect x="30" y="30" width="10" height="10" fill="#0F172A"/>
                    <rect x="100" y="30" width="10" height="10" fill="#0F172A"/>
                    <rect x="30" y="100" width="10" height="10" fill="#0F172A"/>
                    <path d="M60 20H80V30H60V20Z" fill="#0F172A"/>
                    <path d="M60 40H70V60H60V40Z" fill="#0F172A"/>
                    <path d="M80 60H120V70H80V60Z" fill="#0F172A"/>
                    <path d="M20 60H40V70H20V60Z" fill="#0F172A"/>
                    <path d="M60 80H70V120H60V80Z" fill="#0F172A"/>
                    <path d="M80 90H120V100H80V90Z" fill="#0F172A"/>
                    <path d="M100 110H120V120H100V110Z" fill="#0F172A"/>
                  </svg>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scan at the entrance</p>
              </div>
            </div>

            {/* Actions */}
            <div id="eticket-actions" className="p-6 bg-slate-50 flex gap-3">
              <button
                onClick={handleSavePDF}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors active:scale-95"
              >
                <Download size={18} />
                Save PDF
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors active:scale-95"
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
