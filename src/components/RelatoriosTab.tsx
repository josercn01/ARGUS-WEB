import { useState, useMemo } from 'react';
import { BarChart3, Filter, Search } from 'lucide-react';
import type { LicencaUsuario, ConfiguracaoLicenca } from '@/types';

interface RelatoriosTabProps {
  licencas: LicencaUsuario[];
  configuracoes: ConfiguracaoLicenca[];
}

export function RelatoriosTab({ licencas, configuracoes }: RelatoriosTabProps) {
  const [filtroDep, setFiltroDep] = useState('');
  const [filtroSubDep, setFiltroSubDep] = useState('');
  const [filtroSoftware, setFiltroSoftware] = useState('');

  const departamentos = useMemo(() => [...new Set(licencas.map(l => l.departamento_raiz).filter(Boolean))], [licencas]);
  const subDepartamentos = useMemo(() => [...new Set(licencas.filter(l => !filtroDep || l.departamento_raiz === filtroDep).map(l => l.sub_departamento).filter(Boolean))], [licencas, filtroDep]);
  const softwaresDisponiveis = useMemo(() => configuracoes.map(c => c.nome_software), [configuracoes]);

  const dadosFiltrados = useMemo(() => {
    return licencas.filter(l => {
      const matchDep = !filtroDep || l.departamento_raiz === filtroDep;
      const matchSubDep = !filtroSubDep || l.sub_departamento === filtroSubDep;
      const matchSoft = !filtroSoftware || l.tipo_licenca?.toLowerCase().includes(filtroSoftware.toLowerCase());
      return matchDep && matchSubDep && matchSoft;
    });
  }, [licencas, filtroDep, filtroSubDep, filtroSoftware]);

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2 text-base">
          <Filter className="w-5 h-5 text-[#D4AF37]" />
          Filtros Analíticos de Relatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-[#94a3b8] block mb-1">Departamento Raíz</label>
            <select
              value={filtroDep}
              onChange={(e) => { setFiltroDep(e.target.value); setFiltroSubDep(''); }}
              className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Todos os Departamentos</option>
              {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#94a3b8] block mb-1">Sub-departamento (Subsetor)</label>
            <select
              value={filtroSubDep}
              onChange={(e) => setFiltroSubDep(e.target.value)}
              className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Todos os Subsetores</option>
              {subDepartamentos.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#94a3b8] block mb-1">Software / Licença</label>
            <select
              value={filtroSoftware}
              onChange={(e) => setFiltroSoftware(e.target.value)}
              className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Todos os Softwares</option>
              {softwaresDisponiveis.map(sw => <option key={sw} value={sw}>{sw}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl p-5">
          <p className="text-[#94a3b8] text-xs font-medium">Colaboradores Filtrados</p>
          <p className="text-white text-3xl font-bold mt-1">{dadosFiltrados.length}</p>
        </div>
        <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl p-5">
          <p className="text-[#94a3b8] text-xs font-medium">Licenças Ativas no Filtro</p>
          <p className="text-emerald-400 text-3xl font-bold mt-1">
            {dadosFiltrados.filter(l => l.possui_licenca && l.status === 'Ativo').length}
          </p>
        </div>
        <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl p-5">
          <p className="text-[#94a3b8] text-xs font-medium">Pendências</p>
          <p className="text-amber-400 text-3xl font-bold mt-1">
            {dadosFiltrados.filter(l => l.status === 'Pendente').length}
          </p>
        </div>
      </div>

      <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
          Lista Consolidada do Relatório
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#94a3b8]">
            <thead className="bg-[#0c1526] text-xs uppercase text-[#64748b] border-b border-[#1e293b]">
              <tr>
                <th className="p-3">Nome</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Departamento</th>
                <th className="p-3">Subsetor</th>
                <th className="p-3">Softwares Atribuídos</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {dadosFiltrados.map((item) => (
                <tr key={item.id} className="hover:bg-black/20">
                  <td className="p-3 text-white font-medium">{item.nome}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.departamento_raiz}</td>
                  <td className="p-3">{item.sub_departamento || '—'}</td>
                  <td className="p-3 text-[#D4AF37]">{item.tipo_licenca || '—'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${item.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
