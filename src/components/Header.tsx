import { Eye, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBadge } from '@/components/Badges';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-[#002B49] border-b border-[#D4AF37]/20 sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#003366] to-[#004080] flex items-center justify-center border border-[#D4AF37]/30">
              <Eye className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <Shield className="w-1.5 h-1.5 text-[#002B49]" />
            </div>
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-wide">ARGUS</span>
            <p className="text-[#D4AF37]/70 text-xs tracking-wider hidden sm:block">
              Sistema Integrado de Gestão de Licenças
            </p>
          </div>
        </div>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-white text-sm font-medium">{user.name}</span>
              <span className="text-[#94a3b8] text-xs">{user.email}</span>
            </div>
            <RoleBadge role={user.role} />
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-[#94a3b8] hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
