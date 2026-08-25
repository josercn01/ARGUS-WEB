import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RoleBadge } from '@/components/Badges';
import { Shield, ChevronDown, Save, AlertCircle } from 'lucide-react';
import type { PerfilUsuario, Role } from '@/types';

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'consulta', label: 'Leitor' },
];

export function AccessManagement({ currentEmail }: { currentEmail: string }) {
  const [perfis, setPerfis] = useState<PerfilUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('consulta');
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('perfis_usuarios')
      .select('*')
      .order('email');
    if (!error && data) setPerfis(data as PerfilUsuario[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateRole(id: string, role: Role) {
    setSaving(id);
    setError(null);
    const { error } = await supabase
      .from('perfis_usuarios')
      .update({ role })
      .eq('id', id);
    if (error) setError(error.message);
    else await load();
    setSaving(null);
  }

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.endsWith('@senado.leg.br')) {
      setError('E-mail deve terminar em @senado.leg.br.');
      return;
    }
    setAdding(true);
    setError(null);
    const { error } = await supabase
      .from('perfis_usuarios')
      .upsert({ email: newEmail.trim().toLowerCase(), role: newRole }, { onConflict: 'email' });
    if (error) setError(error.message);
    else { setNewEmail(''); await load(); }
    setAdding(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#D4AF37]" />
          Gestão de Acessos
        </h2>
        <p className="text-[#64748b] text-sm mt-0.5">Controle os perfis de acesso dos usuários do sistema.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Add user */}
      <form onSubmit={addUser} className="bg-[#0c1526] border border-[#1e293b] rounded-xl p-5 space-y-4">
        <p className="text-[#94a3b8] text-sm font-medium">Adicionar ou atualizar acesso</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="usuario@senado.leg.br"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="flex-1 bg-[#0F172A] border border-[#1e293b] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors placeholder-[#334155]"
          />
          <div className="relative">
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as Role)}
              className="appearance-none bg-[#0F172A] border border-[#1e293b] text-white rounded-lg pl-3 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
            >
              {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c9a227] text-[#002B49] font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {adding ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0c1526] border-b border-[#1e293b]">
              <tr>
                <th className="text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider px-4 py-3">E-mail</th>
                <th className="text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider px-4 py-3">Perfil Atual</th>
                <th className="text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider px-4 py-3">Alterar Perfil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {loading && (
                <tr><td colSpan={3} className="text-center text-[#475569] py-10 text-sm">Carregando...</td></tr>
              )}
              {!loading && perfis.map((p) => (
                <tr key={p.id} className="hover:bg-[#1e293b]/40 transition-colors">
                  <td className="px-4 py-3 text-[#94a3b8] text-sm">
                    {p.email}
                    {p.email === currentEmail && (
                      <span className="ml-2 text-[#D4AF37] text-xs">(você)</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={p.role} /></td>
                  <td className="px-4 py-3">
                    {p.email === 'josercn@senado.leg.br' ? (
                      <span className="text-[#475569] text-xs italic">Protegido</span>
                    ) : (
                      <div className="relative inline-block">
                        <select
                          defaultValue={p.role}
                          disabled={saving === p.id}
                          onChange={(e) => updateRole(p.id, e.target.value as Role)}
                          className="appearance-none bg-[#0c1526] border border-[#1e293b] text-white rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569] pointer-events-none" />
                      </div>
                    )}
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
