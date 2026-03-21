import React from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { role: 'model', content: 'Hello! I am your SwiftTicket Support assistant. How can I help you today?' }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate network delay for a more natural feel
    setTimeout(() => {
      const lowerInput = userMessage.toLowerCase();
      let response = "I'm sorry, as a basic support bot I didn't catch that. Try asking me about booking tickets, finding theaters, saving a PDF pass, or canceling an event.";

      if (/book|buy|ticket|reser|purch/i.test(lowerInput)) {
        response = "To book a new ticket, click the 'Book New Ticket' button at the top of the main dashboard. You can also select an event directly from our recommendations or nearby theaters.";
      } else if (/cancel|refund|delete|remove|change/i.test(lowerInput)) {
        response = "You can cancel an active ticket by clicking the '🚫' (Cancel) icon on your ticket card. Please note that refunds are subject to our 24-hour policy.";
      } else if (/theater|cinema|location|place|venue|screen/i.test(lowerInput)) {
        response = "We have a dedicated 'Local Theaters' section on the dashboard where you can find top-rated cinemas in Coimbatore and book directly.";
      } else if (/print|pdf|pass|download|share|view/i.test(lowerInput)) {
        response = "You can view, share, or save your e-ticket as a PDF by clicking the 'View Pass' button on any of your active tickets.";
      } else if (/hello|hi|hey|greet|morning|afternoon/i.test(lowerInput)) {
        response = "Hello there! Let me know if you need help navigating the app or managing your tickets.";
      } else if (/price|cost|money|rupee|rs|pay|how much/i.test(lowerInput)) {
        response = "Ticket prices vary by event and theater. You can see the exact price listed on the event card before you book. Some local events may even be free!";
      } else if (/time|date|when|schedule/i.test(lowerInput)) {
        response = "You can select your preferred date and time during the booking process. Your active tickets will display the exact schedule on your dashboard.";
      } else if (/help|support|contact|issue|problem/i.test(lowerInput)) {
        response = "If you're having an issue, please contact our support team at support@swiftticket.com or try asking me about bookings, theaters, or your tickets.";
      }

      setMessages(prev => [...prev, { role: 'model', content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-2xl z-50 hover:bg-slate-800 transition-colors"
      >
        <MessageSquare size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-100"
          >
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SwiftTicket Support</h3>
                  <p className="text-[10px] text-emerald-400">Online & Ready to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}`}>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-slate-200"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
