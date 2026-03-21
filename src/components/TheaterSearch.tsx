import React from 'react';
import { Search, MapPin, Info, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TheaterInfo {
  name: string;
  location: string;
  details: string;
  url?: string;
}

interface TheaterSearchProps {
  onBook: (theater: TheaterInfo) => void;
}

export const TheaterSearch: React.FC<TheaterSearchProps> = ({ onBook }) => {
  const [loading, setLoading] = React.useState(false);
  const [theaters, setTheaters] = React.useState<TheaterInfo[]>([]);

  const searchTheaters = () => {
    setLoading(true);
    
    // Simulate a quick network request for better UX
    setTimeout(() => {
      setTheaters([
        {
          name: "KG Cinemas",
          location: "Race Course Road, Coimbatore",
          details: "Premium multiplex with 4K projection, Dolby Atmos, and comfortable seating in the heart of the city."
        },
        {
          name: "INOX Prozone Mall",
          location: "Prozone Mall, Sivanandhapuram",
          details: "Modern cinema complex offering multiple screens, luxury recliners, and an extensive food menu."
        },
        {
          name: "SPI Cinemas (The Cinema)",
          location: "Brookefields Mall, Krishnasamy Road",
          details: "Renowned for its excellent acoustics, pristine picture quality, and signature popcorn."
        },
        {
          name: "Miraj Cinemas",
          location: "Fun Republic Mall, Peelamedu",
          details: "Popular destination for students and families with great screens and affordable pricing."
        },
        {
          name: "Karpagam Theatres",
          location: "Dr Nanjappa Road, Coimbatore",
          details: "One of the largest screens in the city, recently renovated with state-of-the-art sound systems."
        }
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <MapPin size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Local Theaters</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Find Nearby Theaters</h2>
          <p className="text-slate-500 text-sm font-medium">Discover top-rated movie theaters in Coimbatore.</p>
        </div>
        <button
          onClick={searchTheaters}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Search size={20} />
          {loading ? 'Searching...' : 'Search Coimbatore Theaters'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {theaters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {theaters.map((theater, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{theater.name}</h3>
                  <MapPin size={16} className="text-slate-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                    {theater.location}
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <Info size={12} className="mt-0.5 flex-shrink-0 text-indigo-400" />
                    {theater.details}
                  </div>
                  <button
                    onClick={() => onBook(theater)}
                    className="w-full mt-4 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MapPin size={12} />
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
