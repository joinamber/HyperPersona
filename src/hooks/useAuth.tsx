
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logAuthSuccess, logAuthFailure } from '@/utils/securityLogger';
import { authRateLimiter, getClientIdentifier } from '@/utils/rateLimiter';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state changed:', event, session?.user?.email);
        }
        
        // Log auth events
        if (event === 'SIGNED_IN' && session?.user) {
          logAuthSuccess(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          // Clear any sensitive data on sign out
          localStorage.removeItem('pendingFormData');
          localStorage.removeItem('pendingProductImages');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Check rate limit
    const clientId = getClientIdentifier();
    const rateLimitCheck = authRateLimiter.checkLimit(clientId);
    
    if (!rateLimitCheck.allowed) {
      const error = new Error(`Rate limit exceeded. Try again in ${rateLimitCheck.retryAfter} seconds.`);
      logAuthFailure('Rate limit exceeded');
      throw error;
    }

    // Use the current origin instead of hardcoded localhost
    // This ensures it works on both development and production environments
    const redirectUrl = window.location.origin + window.location.pathname;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      logAuthFailure(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
