import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LoginScreen } from '@/components/LoginScreen';
import { Header } from '@/components/Header';
import { Dashboard } from '@/pages/Dashboard';
import { Eye, AlertTriangle } from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002B49] to-[#003366] flex items-center justify-center border border-[#D4AF37]/30">
            <Eye className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Domain restriction
  if (!user.email.endsWith('@senado.leg.br')) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-[#0c1526] border border-red-500/30 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Acesso Negado</h2>
          <p className="text-[#94a3b8] text-sm">
            Este sistema é restrito a e-mails <span className="text-white font-medium">@senado.leg.br</span>.
            Sua conta <span className="text-[#D4AF37]">{user.email}</span> não possui permissão.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-6 text-sm text-[#64748b] hover:text-white border border-[#1e293b] px-4 py-2 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
}
