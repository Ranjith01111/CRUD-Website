import React from 'react';
import { LiveEvent } from '../types';
import { Star, MapPin, Calendar, ArrowRight, Zap, Film, Music, Trophy, Theater } from 'lucide-react';
import { motion } from 'motion/react';

interface RecommendationsProps {
  events: LiveEvent[];
  onBook: (event: LiveEvent) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ events, onBook }) => {
  const categoryIcons = {
    movie: Film,
    concert: Music,
    sports: Trophy,
    theater: Theater,
  };

  if (events.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Zap className="text-amber-600 fill-amber-600" size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kovai's Best Recommendations</h2>
        </div>
        <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1">
          View All <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        {events.map((event) => {
          const Icon = categoryIcons[event.category];
          return (
            <motion.div
              key={event.id}
              whileHover={{ y: -8 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-sm">
                  <Icon size={14} className="text-slate-900" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{event.category}</span>
                </div>
                {event.isLive && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-200">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Live</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6 space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                      <MapPin size={12} className="fill-indigo-600/20" />
                      <span>Coimbatore Surroundings</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <MapPin size={12} className="text-indigo-500" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Price</span>
                    <span className="text-xl font-black text-slate-900 leading-none">
                      {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <button
                    onClick={() => onBook(event)}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
