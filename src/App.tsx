import React from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Trophy, Users, Shield, Zap, Wallet, Gift, LayoutDashboard, LogOut, Menu, X, Bell, Settings, ExternalLink, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency, formatDate } from './lib/utils';

// --- UI Components ---

function SetupGuide() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 space-y-8 border-orange-600/30 bg-zinc-900/80">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-600/20 rounded-2xl flex items-center justify-center border border-orange-600/30">
            <Settings className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase italic italic-font">Setup Required</h1>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Connect your Supabase backend to start</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-600/20 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
            <p className="text-sm text-orange-200">
              Supabase environment variables are missing. You need to configure them in the <strong>Secrets</strong> panel of AI Studio.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase italic italic-font">Steps to fix:</h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <div>
                  <p className="font-bold">Create a Supabase Project</p>
                  <p className="text-sm text-zinc-500">Go to <a href="https://supabase.com" target="_blank" className="text-orange-500 hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> and create a new project.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <div>
                  <p className="font-bold">Get API Keys</p>
                  <p className="text-sm text-zinc-500">In your Supabase dashboard, go to <strong>Settings &gt; API</strong> and copy the <strong>Project URL</strong> and <strong>anon public key</strong>.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <div>
                  <p className="font-bold">Add to AI Studio Secrets</p>
                  <p className="text-sm text-zinc-500">Click the <strong>Settings (Gear icon)</strong> in the top right of AI Studio, go to <strong>Secrets</strong>, and add:</p>
                  <div className="mt-2 space-y-2 font-mono text-xs bg-black p-3 rounded-lg border border-zinc-800">
                    <p><span className="text-orange-500">VITE_SUPABASE_URL</span> = (your project url)</p>
                    <p><span className="text-orange-500">VITE_SUPABASE_ANON_KEY</span> = (your anon key)</p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full py-4 rounded-xl" onClick={() => window.location.reload()}>
            I've added the secrets, refresh app
          </Button>
        </div>
      </Card>
    </div>
  );
}

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-900/20',
      secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
      outline: 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800',
      ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-800',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg font-bold',
    };
    return (
      <button
        ref={ref}
        className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none', variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm', className)} {...props}>
    {children}
  </div>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn('w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-600/50 transition-all placeholder:text-zinc-600', className)}
    {...props}
  />
));

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' }) => {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300',
    success: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50',
    warning: 'bg-amber-900/30 text-amber-400 border border-amber-800/50',
    danger: 'bg-red-900/30 text-red-400 border border-red-800/50',
  };
  return <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider', variants[variant])}>{children}</span>;
};

// --- Main App Component ---

export default function App() {
  const [user, setUser] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<'landing' | 'tournaments' | 'dashboard' | 'admin' | 'wallet' | 'referral'>('landing');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (data) setProfile(data);
    setLoading(false);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) console.error(error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
  };

  if (!isSupabaseConfigured) {
    return <SetupGuide />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-orange-600/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-bottom border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">FireTourney</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setView('tournaments')} className={cn("text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors", view === 'tournaments' ? 'text-orange-500' : 'text-zinc-400')}>Tournaments</button>
            {user && (
              <>
                <button onClick={() => setView('dashboard')} className={cn("text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors", view === 'dashboard' ? 'text-orange-500' : 'text-zinc-400')}>Dashboard</button>
                <button onClick={() => setView('wallet')} className={cn("text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors", view === 'wallet' ? 'text-orange-500' : 'text-zinc-400')}>Wallet</button>
                {profile?.role === 'admin' && (
                  <button onClick={() => setView('admin')} className={cn("text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors", view === 'admin' ? 'text-orange-500' : 'text-zinc-400')}>Admin</button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Balance</p>
                  <p className="text-sm font-black text-orange-500">{formatCurrency(profile?.wallet_balance || 0)}</p>
                </div>
                <button onClick={() => setView('dashboard')} className="w-10 h-10 rounded-full border-2 border-orange-600 overflow-hidden">
                  <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="Avatar" referrerPolicy="no-referrer" />
                </button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin} className="rounded-full px-6">Login</Button>
            )}
            <button className="md:hidden text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-20 px-4 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <button onClick={() => { setView('tournaments'); setIsMenuOpen(false); }} className="text-2xl font-black uppercase italic text-left">Tournaments</button>
              {user && (
                <>
                  <button onClick={() => { setView('dashboard'); setIsMenuOpen(false); }} className="text-2xl font-black uppercase italic text-left">Dashboard</button>
                  <button onClick={() => { setView('wallet'); setIsMenuOpen(false); }} className="text-2xl font-black uppercase italic text-left">Wallet</button>
                  <button onClick={() => { setView('referral'); setIsMenuOpen(false); }} className="text-2xl font-black uppercase italic text-left">Referral</button>
                  {profile?.role === 'admin' && (
                    <button onClick={() => { setView('admin'); setIsMenuOpen(false); }} className="text-2xl font-black uppercase italic text-left text-orange-500">Admin Panel</button>
                  )}
                  <Button variant="danger" onClick={handleLogout} className="mt-4">Logout</Button>
                </>
              )}
              {!user && <Button onClick={handleLogin} className="mt-4">Login with Google</Button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {view === 'landing' && <LandingView onExplore={() => setView('tournaments')} onLogin={handleLogin} user={user} />}
        {view === 'tournaments' && <TournamentsView />}
        {view === 'dashboard' && <PlayerDashboard profile={profile} />}
        {view === 'admin' && <AdminDashboard />}
        {view === 'wallet' && <WalletView profile={profile} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-orange-600 w-8 h-8" />
              <span className="text-2xl font-black tracking-tighter uppercase italic">FireTourney</span>
            </div>
            <p className="text-zinc-500 max-w-md">
              The ultimate platform for Free Fire esports. Join tournaments, track your stats, and win big. Professional management for serious players.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><button onClick={() => setView('tournaments')}>Browse Tournaments</button></li>
              <li><button onClick={() => setView('dashboard')}>Player Dashboard</button></li>
              <li><button onClick={() => setView('wallet')}>Wallet & Payouts</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-xs uppercase tracking-widest">
          © 2026 FireTourney. All rights reserved. Not affiliated with Garena.
        </div>
      </footer>
    </div>
  );
}

// --- View Components ---

function LandingView({ onExplore, onLogin, user }: { onExplore: () => void, onLogin: () => void, user: any }) {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-xs font-black uppercase tracking-[0.2em]"
          >
            <Zap className="w-3 h-3" /> The Future of Free Fire Esports
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]"
          >
            Dominate the <br /> <span className="text-orange-600">Battlefield</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Join professional tournaments, track your kills in real-time, and withdraw your winnings instantly. The most advanced tournament manager for Free Fire.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button size="lg" className="w-full sm:w-auto px-12 rounded-full" onClick={onExplore}>Explore Tournaments</Button>
            {!user && <Button size="lg" variant="outline" className="w-full sm:w-auto px-12 rounded-full" onClick={onLogin}>Join Now</Button>}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Players', value: '10K+', icon: Users },
          { label: 'Total Prize Pool', value: '$50K+', icon: Wallet },
          { label: 'Tournaments', value: '500+', icon: Trophy },
          { label: 'Fast Payouts', value: '24h', icon: Zap },
        ].map((stat, i) => (
          <Card key={i} className="p-6 text-center space-y-2 group hover:border-orange-600/50 transition-colors">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto group-hover:bg-orange-600 transition-colors">
              <stat.icon className="w-6 h-6 text-orange-500 group-hover:text-white" />
            </div>
            <p className="text-3xl font-black italic uppercase">{stat.value}</p>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
          </Card>
        ))}
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black uppercase italic">Why Choose <span className="text-orange-600">FireTourney?</span></h2>
          <p className="text-zinc-500 max-w-xl mx-auto uppercase text-xs font-bold tracking-widest">Built by gamers, for gamers. Professional features for everyone.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'AI Result Parsing', desc: 'Upload a screenshot and our AI automatically extracts kills and placements. No more manual errors.', icon: Zap },
            { title: 'Auto Slot Allocation', desc: 'Register and get your room slot instantly. Automated squad grouping for solo players.', icon: LayoutDashboard },
            { title: 'Instant Wallet', desc: 'Winnings are credited to your wallet automatically after match verification. Withdraw anytime.', icon: Wallet },
          ].map((feature, i) => (
            <div key={i} className="space-y-4 p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50">
              <div className="w-14 h-14 bg-orange-600/10 border border-orange-600/20 rounded-2xl flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-black uppercase italic">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TournamentsView() {
  const [tournaments, setTournaments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTournaments = async () => {
      const { data, error } = await supabase.from('tournaments').select('*').order('start_time', { ascending: true });
      if (data) setTournaments(data);
      setLoading(false);
    };
    fetchTournaments();
  }, []);

  if (loading) return <div className="py-20 text-center text-zinc-500 uppercase font-black animate-pulse">Loading Tournaments...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase italic">Active <span className="text-orange-600">Tournaments</span></h2>
          <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest">Join the battle and claim your glory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Solo</Button>
          <Button variant="secondary" size="sm">Squad</Button>
          <Button variant="secondary" size="sm">Completed</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tournaments.map((t) => (
          <Card key={t.id} className="group cursor-pointer hover:border-orange-600/50 transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img src={t.banner_url || `https://picsum.photos/seed/${t.id}/800/450`} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4">
                <Badge variant={t.status === 'upcoming' ? 'success' : 'warning'}>{t.status}</Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">{t.type} Tournament</p>
                    <h3 className="text-xl font-black uppercase italic">{t.title}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Prize Pool</p>
                  <p className="text-lg font-black text-white">{formatCurrency(t.prize_pool)}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Entry Fee</p>
                  <p className="text-lg font-black text-orange-500">{formatCurrency(t.entry_fee)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{formatDate(t.start_time)}</span>
                </div>
                <Button size="sm">Join Now</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PlayerDashboard({ profile }: { profile: any }) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800">
        <div className="w-32 h-32 rounded-full border-4 border-orange-600 p-1">
          <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.id}`} alt="Avatar" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-4xl font-black uppercase italic">{profile?.full_name || 'Survivor'}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-orange-500" /> UID: {profile?.ff_uid || 'Not Set'}</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-orange-500" /> IGN: {profile?.ign || 'Not Set'}</span>
            <span className="flex items-center gap-1"><Gift className="w-4 h-4 text-orange-500" /> Referral: {profile?.referral_code}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Edit Profile</Button>
          <Button>Withdraw</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Wallet Balance</h3>
            <Wallet className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-4xl font-black italic">{formatCurrency(profile?.wallet_balance || 0)}</p>
          <Button variant="secondary" className="w-full">Add Funds</Button>
        </Card>
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total Kills</h3>
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-4xl font-black italic">124</p>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">+12 this week</p>
        </Card>
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tournaments Won</h3>
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-4xl font-black italic">08</p>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Rank #42 Global</p>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black uppercase italic">Recent <span className="text-orange-600">Activity</span></h3>
        <Card className="divide-y divide-zinc-800">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-zinc-500" />
                </div>
                <div>
                  <p className="font-bold uppercase italic">Free Fire Pro League S4</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Registered • {formatDate(new Date().toISOString())}</p>
                </div>
              </div>
              <Badge variant="success">Approved</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function WalletView({ profile }: { profile: any }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase italic">My <span className="text-orange-600">Wallet</span></h2>
        <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest">Manage your winnings and deposits</p>
      </div>

      <Card className="p-12 text-center space-y-8 bg-gradient-to-br from-zinc-900 to-black border-orange-600/20">
        <div className="space-y-2">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em]">Available Balance</p>
          <p className="text-7xl font-black italic text-orange-500">{formatCurrency(profile?.wallet_balance || 0)}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-12 rounded-full">Deposit Funds</Button>
          <Button size="lg" variant="outline" className="px-12 rounded-full">Withdraw Winnings</Button>
        </div>
      </Card>

      <div className="space-y-6">
        <h3 className="text-2xl font-black uppercase italic">Transaction <span className="text-orange-600">History</span></h3>
        <Card className="divide-y divide-zinc-800">
          {[
            { type: 'winning', amount: 50, desc: 'Tournament Prize - FF Cup', date: new Date().toISOString() },
            { type: 'entry_fee', amount: -10, desc: 'Entry Fee - Pro League', date: new Date().toISOString() },
            { type: 'referral', amount: 5, desc: 'Referral Bonus', date: new Date().toISOString() },
          ].map((tx, i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", tx.amount > 0 ? "bg-emerald-900/20 text-emerald-500" : "bg-red-900/20 text-red-500")}>
                  {tx.amount > 0 ? <Zap className="w-6 h-6" /> : <LogOut className="w-6 h-6 rotate-180" />}
                </div>
                <div>
                  <p className="font-bold uppercase italic">{tx.desc}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">{formatDate(tx.date)}</p>
                </div>
              </div>
              <p className={cn("text-xl font-black italic", tx.amount > 0 ? "text-emerald-500" : "text-red-500")}>
                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = React.useState<'tournaments' | 'players' | 'results' | 'withdrawals'>('tournaments');

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase italic">Admin <span className="text-orange-600">Command Center</span></h2>
          <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest">Manage the battlefield operations</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          {(['tournaments', 'players', 'results', 'withdrawals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn("px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all", activeTab === tab ? "bg-orange-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'tournaments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black uppercase italic">Manage Tournaments</h3>
            <Button size="sm">+ Create New</Button>
          </div>
          <Card className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Tournament</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Type</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Players</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 font-bold uppercase italic">Free Fire Pro League S4</td>
                    <td className="px-6 py-4 text-sm font-bold text-zinc-400 uppercase">Squad</td>
                    <td className="px-6 py-4"><Badge variant="success">Upcoming</Badge></td>
                    <td className="px-6 py-4 text-sm font-bold">24 / 48</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="secondary" size="sm">Slots</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="p-8 space-y-6 text-center">
            <div className="w-20 h-20 bg-orange-600/10 rounded-3xl flex items-center justify-center mx-auto border border-orange-600/20">
              <Zap className="w-10 h-10 text-orange-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic">AI Result Parser</h3>
              <p className="text-zinc-500 text-sm">Upload a match result screenshot and our AI will automatically extract kills and placements for all players.</p>
            </div>
            <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-12 hover:border-orange-600/50 transition-colors cursor-pointer group">
              <LayoutDashboard className="w-12 h-12 text-zinc-700 mx-auto mb-4 group-hover:text-orange-500 transition-colors" />
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Drop screenshot here or click to upload</p>
            </div>
            <Button className="w-full" size="lg">Process Results</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
