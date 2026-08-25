import { useAuth } from '@/contexts/AuthContext';
import { Shield, LogIn, Eye } from 'lucide-react';

export function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#002B49]/30 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#003366]/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002B49] to-[#003366] flex items-center justify-center border border-[#D4AF37]/30 shadow-lg">
                <Eye className="w-9 h-9 text-[#D4AF37]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <Shield className="w-3 h-3 text-[#0F172A]" />
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              ARGUS
            </h1>
            <p className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase mt-1">
              Sistema Integrado de Gestão de Licenças
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
            <span className="text-[#64748b] text-xs tracking-widest uppercase">Acesso Restrito</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
          </div>

          <p className="text-center text-[#94a3b8] text-sm mb-8 leading-relaxed">
            Este sistema é de uso exclusivo para colaboradores autorizados.
            Utilize sua conta corporativa para autenticar.
          </p>

          {/* Sign In Button */}
          <button
            onClick={signIn}
            className="w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-[#002B49] to-[#003366] hover:from-[#003366] hover:to-[#004080] text-white font-semibold py-4 px-6 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/10 hover:shadow-xl"
          >
            <LogIn className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform duration-200" />
            <span>Entrar com Conta Corporativa</span>
            <span className="text-[#D4AF37] text-sm font-normal">(@senado.leg.br)</span>
          </button>

          <p className="text-center text-[#475569] text-xs mt-6">
            Autenticação segura via Microsoft Entra ID
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[#334155] text-xs mt-6">
          ARGUS &copy; {new Date().getFullYear()} — Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
