import React from 'react';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const Auth: React.FC = () => {
  const [user, setUser] = React.useState(auth.currentUser);

  React.useEffect(() => {
    return auth.onAuthStateChanged((u) => setUser(u));
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <UserIcon size={16} className="text-slate-500" />
          )}
          <span className="text-sm font-medium text-slate-700 hidden sm:inline">{user.displayName}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSignIn}
      className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
    >
      <LogIn size={18} />
      Sign In with Google
    </motion.button>
  );
};
