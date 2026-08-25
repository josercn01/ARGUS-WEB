import { Box, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ConfiguracaoLicenca, LicencaUsuario } from '@/types';

interface MetricsCardsProps {
  configuracoes: ConfiguracaoLicenca[];
  data: LicencaUsuario[];
}

export function MetricsCards({ configuracoes, data }: MetricsCardsProps) {
  // Se não houver softwares cadastrados, exibe um aviso amigável
  if (!configuracoes || configuracoes.length === 0) {
    for (const item of data) { console.log(item); } // Evita erro de variável não usada
    return (
      <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl p-6 text-center space-y-2">
        <p className="text-white font-medium">Nenhum software cadastrado no painel.</p>
        <p className="text-xs text-[#64748b]">Clique no botão "Gerenciar Softwares" no canto superior direito para cadastrar as ferramentas e definir as quantidades de licenças.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {configuracoes.map((config) => {
        // Calcula quantas pessoas possuem este software específico atribuído
        const emUso = data.filter((item) => {
          if (!item.tipo_licenca || !item.possui_licenca) return false;
          const softwaresUsuario = item.tipo_licenca.split(',').map((s) => s.trim().toLowerCase());
          return softwaresUsuario.includes(config.nome_software.toLowerCase());
        }).length;

        const disponiveis = Math.max(0, config.total_licencas - emUso);

        return (
          <div
            key={config.id}
            className="bg-[#0F172A] border border-[#1e293b] rounded-xl p-5 space-y-4 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#002B49] border border-[#D4AF37]/30 text-[#D4AF37]">
                  <Box className="w-5 h-5" />
                </div>
                <h3 className="text-white font-semibold text-base">{config.nome_software}</h3>
              </div>
              <span className="text-xs bg-[#0c1526] text-[#D4AF37] border border-[#1e293b] px-2.5 py-1 rounded-full font-medium">
                Total: {config.total_licencas}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#0c1526] border border-[#1e293b] rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Em Uso</span>
                </div>
                <p className="text-white text-xl font-bold">{emUso}</p>
              </div>

              <div className="bg-[#0c1526] border border-[#1e293b] rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>Disponíveis</span>
                </div>
                <p className="text-emerald-400 text-xl font-bold">{disponiveis}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
