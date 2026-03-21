import React from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  OperationType, 
  handleFirestoreError,
  Timestamp
} from './firebase';
import { Ticket, UserProfile, LiveEvent } from './types';
import { Layout } from './components/Layout';
import { TicketCard } from './components/TicketCard';
import { TicketModal } from './components/TicketModal';
import { ChatBot } from './components/ChatBot';
import { Recommendations } from './components/Recommendations';
import { ETicketModal } from './components/ETicketModal';
import { TheaterSearch } from './components/TheaterSearch';
import { Plus, Search, Filter, Ticket as TicketIcon, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = React.useState(auth.currentUser);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [liveEvents, setLiveEvents] = React.useState<LiveEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isETicketOpen, setIsETicketOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | undefined>();
  const [editingTicket, setEditingTicket] = React.useState<Ticket | undefined>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'cancelled' | 'completed'>('all');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setTickets([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  React.useEffect(() => {
    // Fetch Live Events for recommendations
    const liveEventsRef = collection(db, 'live_events');
    const unsubscribe = onSnapshot(liveEventsRef, (snapshot) => {
      const events: LiveEvent[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<LiveEvent, 'id'>;
        // Only include events that are in Coimbatore or Kovai
        if (
          data.venue.toLowerCase().includes('coimbatore') || 
          data.venue.toLowerCase().includes('kovai') ||
          data.title.toLowerCase().includes('coimbatore') ||
          data.title.toLowerCase().includes('kovai')
        ) {
          events.push({ id: doc.id, ...data } as LiveEvent);
        }
      });
      setLiveEvents(events);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    // Seed Live Events if empty or outdated (Admin only)
    if (user?.email === "ranjithvasu499@gmail.com" && !isLoading) {
      // Check if we already have these specific Coimbatore events to avoid duplicates
      const hasCoimbatoreEvents = liveEvents.some(e => 
        e.venue.toLowerCase().includes('coimbatore') || 
        e.venue.toLowerCase().includes('kovai')
      );

      if (!hasCoimbatoreEvents && liveEvents.length < 5) {
        const seedData: Omit<LiveEvent, 'id'>[] = [
        {
          title: "Varisu: Mega Blockbuster",
          description: "Experience the family entertainer on the giant screen of KG Cinemas.",
          category: "movie",
          imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
          date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 2)),
          venue: "KG Cinemas, Race Course, Coimbatore",
          price: 190,
          isLive: true
        },
        {
          title: "Anirudh 'Hukum' World Tour",
          description: "The Rockstar is coming to Kovai! Don't miss the high-energy concert.",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
          date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 5)),
          venue: "CODISSIA Ground, Avinashi Road, Coimbatore",
          price: 2500,
          isLive: true
        },
        {
          title: "TNPL: Lyca Kovai Kings vs Chepauk Super Gillies",
          description: "Support our home team in this thrilling T20 clash.",
          category: "sports",
          imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800",
          date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 1)),
          venue: "SNR College Cricket Ground, Coimbatore",
          price: 300,
          isLive: true
        },
        {
          title: "Coimbatore Vizha: Carnival",
          description: "Celebrating the spirit of Kovai with food, music, and art.",
          category: "theater",
          imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
          date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 8)),
          venue: "Race Course Road, Coimbatore",
          price: 0,
          isLive: false
        },
        {
          title: "Ponniyin Selvan: Stage Adaptation",
          description: "The grand historical novel comes to life on the stage.",
          category: "theater",
          imageUrl: "https://images.unsplash.com/photo-1503095396549-807a89010046?auto=format&fit=crop&q=80&w=800",
          date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 12)),
          venue: "Corporation Kalaiarangam, R.S. Puram, Coimbatore",
          price: 500,
          isLive: false
        },
        {
          title: "ISL: Chennaiyin FC vs Kerala Blasters",
          description: "The Southern Derby live at the Nehru Stadium.",
          category: "sports",
          imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
          date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 1)),
          venue: "Nehru Stadium, Coimbatore",
          price: 499,
          isLive: true
        },
        {
          title: "Jailer: Weekend Show",
          description: "Superstar Rajinikanth's massive hit at INOX.",
          category: "movie",
          imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
          date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 1)),
          venue: "INOX, Prozone Mall, Coimbatore",
          price: 250,
          isLive: true
        },
        {
          title: "Tamil Drama: Ponniyin Selvan Stage Play",
          description: "Experience the grand stage adaptation of the classic novel.",
          category: "theater",
          imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=800",
          date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 10)),
          venue: "Corporation Kalaiarangam, Coimbatore",
          price: 350,
          isLive: false
        },
      ];

      seedData.forEach(event => {
        addDoc(collection(db, 'live_events'), event).catch(err => {
          console.error("Error seeding event:", err);
        });
      });
    }
  }
}, [user, liveEvents, isLoading]);

  React.useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const ticketsRef = collection(db, 'tickets');
    const q = query(ticketsRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData: Ticket[] = [];
      snapshot.forEach((doc) => {
        ticketsData.push({ id: doc.id, ...doc.data() } as Ticket);
      });
      // Sort by date descending
      ticketsData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      setTickets(ticketsData);
      setIsLoading(false);
      setError(null);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'tickets');
      setError("Failed to load tickets. Please check your permissions.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSaveTicket = async (ticketData: Partial<Ticket>) => {
    if (!user) return;

    // Strip id and createdAt from data before saving to Firestore
    const { id, createdAt, ...dataToSave } = ticketData;

    try {
      if (editingTicket && editingTicket.id) {
        const ticketRef = doc(db, 'tickets', editingTicket.id);
        await updateDoc(ticketRef, {
          ...dataToSave,
          userId: user.uid, // Ensure userId is preserved
        });
      } else {
        await addDoc(collection(db, 'tickets'), {
          ...dataToSave,
          userId: user.uid,
          createdAt: serverTimestamp(),
          status: 'active',
          qrCode: `TICKET-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        });
      }
      setIsModalOpen(false);
      setEditingTicket(undefined);
    } catch (err) {
      handleFirestoreError(err, (editingTicket && editingTicket.id) ? OperationType.UPDATE : OperationType.CREATE, 'tickets');
      setError("Failed to save ticket. Please try again.");
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tickets', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `tickets/${id}`);
      setError("Failed to delete ticket.");
    }
  };

  const handleCancelTicket = async (id: string) => {
    try {
      const ticketRef = doc(db, 'tickets', id);
      await updateDoc(ticketRef, {
        status: 'cancelled'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `tickets/${id}`);
      setError("Failed to cancel ticket.");
    }
  };

  const handleBookFromRecommendation = (event: LiveEvent) => {
    setEditingTicket({
      id: '',
      userId: user?.uid || '',
      title: event.title,
      description: event.description,
      date: event.date,
      venue: event.venue,
      price: event.price,
      status: 'active',
      createdAt: Timestamp.now(),
    });
    setIsModalOpen(true);
  };

  const handleBookFromTheater = (theater: { name: string; location: string; details: string }) => {
    setEditingTicket({
      id: '',
      userId: user?.uid || '',
      title: `Movie at ${theater.name}`,
      description: theater.details,
      date: Timestamp.fromDate(new Date(Date.now() + 86400000)), // Default to tomorrow
      venue: theater.location,
      price: 150, // Default price for movie theaters
      status: 'active',
      createdAt: Timestamp.now(),
    });
    setIsModalOpen(true);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-8"
          >
            <TicketIcon size={48} className="text-slate-400" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Welcome to SwiftTicket</h1>
          <p className="text-lg text-slate-500 max-w-md mb-10 leading-relaxed">
            The simplest way to manage your event bookings. Sign in to start organizing your tickets today.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Tickets</h1>
            <p className="text-slate-500 font-medium">Manage and track all your event bookings in one place.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingTicket(undefined);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
          >
            <Plus size={20} />
            Book New Ticket
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by event or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600"
          >
            <AlertCircle size={20} />
            <span className="text-sm font-semibold">{error}</span>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-slate-400" size={40} />
            <p className="text-slate-500 font-medium">Loading your tickets...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {liveEvents.length > 0 && (
              <Recommendations 
                events={liveEvents} 
                onBook={handleBookFromRecommendation} 
              />
            )}

            <TheaterSearch onBook={handleBookFromTheater} />

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <TicketIcon className="text-indigo-600" size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Bookings</h2>
              </div>

              {filteredTickets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredTickets.map((ticket) => (
                      <div key={ticket.id}>
                        <TicketCard
                          ticket={ticket}
                          onEdit={(t) => {
                            setEditingTicket(t);
                            setIsModalOpen(true);
                          }}
                          onDelete={handleDeleteTicket}
                          onCancel={handleCancelTicket}
                          onViewPass={(t) => {
                            setSelectedTicket(t);
                            setIsETicketOpen(true);
                          }}
                        />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                    <TicketIcon size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No tickets found</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">
                    {searchQuery || filterStatus !== 'all' 
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "You haven't booked any tickets yet. Click the button above to get started!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTicket(undefined);
        }}
        onSave={handleSaveTicket}
        ticket={editingTicket}
      />

      {selectedTicket && (
        <ETicketModal
          isOpen={isETicketOpen}
          onClose={() => {
            setIsETicketOpen(false);
            setSelectedTicket(undefined);
          }}
          ticket={selectedTicket}
        />
      )}

      <ChatBot />
    </Layout>
  );
}
