import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { MetricsCards } from '@/components/MetricsCards';
import { FiltersBar } from '@/components/FiltersBar';
import { LicencasTable } from '@/components/LicencasTable';
import { LicencaModal } from '@/components/LicencaModal';
import { SoftwareModal } from '@/components/SoftwareModal';
import { RelatoriosTab } from '@/components/RelatoriosTab';
import { ImportCSV } from '@/components/ImportCSV';
import { AccessManagement } from '@/components/AccessManagement';
import { LayoutDashboard, Upload, Shield, RefreshCw, Settings, BarChart2 } from 'lucide-react';
import type { LicencaUsuario, ConfiguracaoLicenca } from '@/types';

type Tab = 'dashboard' | 'relatorios' | 'import' | 'access';

export function Dashboard() {
  const { user } = useAuth();
  const [licencas, setLicencas] = useState<LicencaUsuario[]>([]);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoLicenca[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [search, setSearch] = useState('');
  const [depRaiz, setDepRaiz] = useState('');
  const [subDep, setSubDep] = useState('');
  
  // Modais
  const [modalItem, setModalItem] = useState<Partial<LicencaUsuario> | null | undefined>(undefined);
  const [isSoftwareModalOpen, setIsSoftwareModalOpen] = useState(false);

  const canWrite = user?.role === 'editor' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  async function fetchAllData() {
    setLoading(true);
    
    // 1. Busca os registros da tabela de usuários
    const { data: licencasData, error: licencasError } = await supabase
      .from('licencas_usuarios')
      .select('*')
      .order('nome');
    
    if (!licencasError && licencasData) {
      setLicencas(licencasData as LicencaUsuario[]);
    }

    // 2. Busca as configurações de softwares e quantidades totais
    const { data: configData, error: configError } = await supabase
      .from('configuracao_licencas')
      .select('*')
      .order('nome_software');

    if (!configError && configData) {
      setConfiguracoes(configData as ConfiguracaoLicenca[]);
    }

    setLoading(false);
  }

  useEffect(() => { fetchAllData(); }, []);

  const depRaizOptions = useMemo(() =>
    [...new Set(licencas.map((l) => l.departamento_raiz).filter(Boolean) as string[])].sort(),
    [licencas]
  );

  const subDepOptions = useMemo(() => {
    if (!depRaiz) return [];
    return [...new Set(
      licencas
        .filter((l) => l.departamento_raiz === depRaiz)
        .map((l) => l.sub_departamento)
        .filter(Boolean) as string[]
    )].sort();
  }, [licencas, depRaiz]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return licencas.filter((l) => {
      const matchSearch = !q || [l.nome, l.email, l.matricula, l.tipo_licenca].some((v) => v?.toLowerCase().includes(q));
      const matchDep = !depRaiz || l.departamento_raiz === depRaiz;
      const matchSub = !subDep || l.sub_departamento === subDep;
      return matchSearch && matchDep && matchSub;
    });
  }, [licencas, search, depRaiz, subDep]);

  // Salvar usuário (Novo ou Edição)
  async function handleSave(data: Partial<LicencaUsuario>) {
    const payload = {
      ...data,
      atualizado_por: user?.email,
      atualizado_em: new Date().toISOString(),
    };
    if (data.id) {
      const { error } = await supabase.from('licencas_usuarios').update(payload).eq('id', data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from('licencas_usuarios').insert(payload);
      if (error) throw new Error(error.message);
    }
    setModalItem(undefined);
    await fetchAllData();
  }

  // Deletar usuário
  async function handleDelete(id: string) {
    if (!window.confirm('Confirmar exclusão deste registro?')) return;
    const { error } = await supabase.from('licencas_usuarios').delete().eq('id', id);
    if (!error) await fetchAllData();
  }

  // Salvar ou atualizar Software na configuração por ID
  async function handleSaveSoftware(nome_software: string, total_licencas: number, id?: string) {
    let error;
    if (id) {
      const res = await supabase
        .from('configuracao_licencas')
        .update({ nome_software, total_licencas })
        .eq('id', id);
      error = res.error;
    } else {
      const res = await supabase
        .from('configuracao_licencas')
        .insert({ nome_software, total_licencas });
      error = res.error;
    }

    if (error) {
      alert('Erro ao salvar software: ' + error.message);
    } else {
      await fetchAllData();
    }
  }

  // Deletar software da configuração
  async function handleDeleteSoftware(id: string) {
    if (!window.confirm('Deseja realmente excluir este software do cadastro?')) return;
    const { error } = await supabase.from('configuracao_licencas').delete().eq('id', id);
    if (error) {
      alert('Erro ao excluir software: ' + error.message);
    } else {
      await fetchAllData();
    }
  }

  async function handleImport(rows: Partial<LicencaUsuario>[]) {
    let success = 0;
    const errors: string[] = [];
    for (const row of rows) {
      if (!row.email) { errors.push('Linha sem e-mail ignorada.'); continue; }
      const { error } = await supabase
        .from('licencas_usuarios')
        .upsert({ ...row, atualizado_por: user?.email, atualizado_em: new Date().toISOString() }, { onConflict: 'email' });
      if (error) errors.push(`${row.email}: ${error.message}`);
      else success++;
    }
    await fetchAllData();
    return { success, errors };
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType; show: boolean }[] = [
    { key: 'dashboard', label: 'Licenças', icon: LayoutDashboard, show: true },
    { key: 'relatorios', label: 'Relatórios & Filtros', icon: BarChart2, show: true },
    { key: 'import', label: 'Importar Planilha', icon: Upload, show: canWrite },
    { key: 'access', label: 'Gestão de Acessos', icon: Shield, show: isSuperAdmin },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-[#0c1526] border border-[#1e293b] rounded-xl p-1 w-fit flex-wrap">
          {tabs.filter((t) => t.show).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-[#002B49] text-[#D4AF37] border border-[#D4AF37]/20 shadow-sm'
                  : 'text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {canWrite && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSoftwareModalOpen(true)}
              className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1e293b] text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <Settings className="w-4 h-4" />
              Gerenciar Softwares
            </button>
          </div>
        )}
      </div>

      {tab === 'dashboard' && (
        <>
          <MetricsCards configuracoes={configuracoes} data={licencas} />

          <div className="flex flex-col xl:flex-row xl:items-center gap-3">
            <div className="flex-1">
              <FiltersBar
                search={search} onSearch={setSearch}
                depRaiz={depRaiz} onDepRaiz={setDepRaiz}
                subDep={subDep} onSubDep={setSubDep}
                depRaizOptions={depRaizOptions}
                subDepOptions={subDepOptions}
              />
            </div>
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-[#64748b] hover:text-[#94a3b8] bg-[#0F172A] border border-[#1e293b] px-3 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
            </div>
          ) : (
            <LicencasTable
              data={filtered}
              role={user!.role}
              onEdit={(item) => setModalItem(item)}
              onDelete={handleDelete}
              onAdd={() => setModalItem({})}
            />
          )}
        </>
      )}

      {tab === 'relatorios' && (
        <RelatoriosTab licencas={licencas} configuracoes={configuracoes} />
      )}

      {tab === 'import' && canWrite && (
        <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl p-6">
          <ImportCSV onImport={handleImport} />
        </div>
      )}

      {tab === 'access' && isSuperAdmin && (
        <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl p-6">
          <AccessManagement currentEmail={user!.email} />
        </div>
      )}

      {modalItem !== undefined && (
        <LicencaModal
          item={modalItem}
          softwares={configuracoes}
          onClose={() => setModalItem(undefined)}
          onSave={handleSave}
        />
      )}

      {isSoftwareModalOpen && (
        <SoftwareModal
          softwares={configuracoes}
          onClose={() => setIsSoftwareModalOpen(false)}
          onSave={handleSaveSoftware}
          onDelete={handleDeleteSoftware}
        />
      )}
    </div>
  );
}
