import type { Role } from '@/types';

const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  editor: 'Editor',
  consulta: 'Leitor',
};

const ROLE_COLORS: Record<Role, string> = {
  super_admin: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30',
  editor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  consulta: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}

const STATUS_COLORS: Record<string, string> = {
  'Ativo': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Inativo': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Pendente': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? 'Pendente';
  const color = STATUS_COLORS[s] ?? 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {s}
    </span>
  );
}

export function LicencaBadge({ possui, tipo }: { possui: boolean; tipo: string | null }) {
  if (!possui) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-slate-500/20 text-slate-400 border-slate-500/30">
        Sem Licença
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
      {tipo ?? 'Licenciado'}
    </span>
  );
}
