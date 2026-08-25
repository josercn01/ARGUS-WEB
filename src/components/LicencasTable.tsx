import { useState } from 'react';
import { Pencil, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { StatusBadge, LicencaBadge } from '@/components/Badges';
import type { LicencaUsuario, Role } from '@/types';

interface LicencasTableProps {
  data: LicencaUsuario[];
  role: Role;
  onEdit: (item: LicencaUsuario) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

type SortKey = keyof LicencaUsuario;

export function LicencasTable({ data, role, onEdit, onDelete, onAdd }: LicencasTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('nome');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const canWrite = role === 'editor' || role === 'super_admin';

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...data].sort((a, b) => {
    const va = String(a[sortKey] ?? '').toLowerCase();
    const vb = String(b[sortKey] ?? '').toLowerCase();
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 text-[#334155]" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-[#D4AF37]" />
      : <ChevronDown className="w-3 h-3 text-[#D4AF37]" />;
  }

  function Th({ label, col }: { label: string; col: SortKey }) {
    return (
      <th
        className="text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-[#D4AF37] transition-colors select-none whitespace-nowrap"
        onClick={() => handleSort(col)}
      >
        <span className="flex items-center gap-1">
          {label}
          <SortIcon col={col} />
        </span>
      </th>
    );
  }

  return (
    <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl overflow-hidden">
      {/* Table toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
        <p className="text-[#94a3b8] text-sm">
          <span className="text-white font-medium">{data.length}</span> registro{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}
        </p>
        {canWrite && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 text-sm bg-[#D4AF37] hover:bg-[#c9a227] text-[#002B49] font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Registro
          </button>
        )}
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0c1526] border-b border-[#1e293b]">
            <tr>
              <Th label="Nome" col="nome" />
              <Th label="E-mail" col="email" />
              <Th label="Matrícula" col="matricula" />
              <Th label="Departamento" col="departamento_raiz" />
              <Th label="Subdepartamento" col="sub_departamento" />
              <Th label="Licença" col="tipo_licenca" />
              <Th label="Status" col="status" />
              <Th label="Atualizado por" col="atualizado_por" />
              {canWrite && <th className="w-20 px-4 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={canWrite ? 9 : 8} className="text-center text-[#475569] py-12 text-sm">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
            {sorted.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#1e293b]/40 transition-colors"
              >
                <td className="px-4 py-3 text-white text-sm font-medium whitespace-nowrap">
                  {item.nome ?? '—'}
                </td>
                <td className="px-4 py-3 text-[#94a3b8] text-sm">{item.email}</td>
                <td className="px-4 py-3 text-[#94a3b8] text-sm">{item.matricula ?? '—'}</td>
                <td className="px-4 py-3 text-[#94a3b8] text-sm whitespace-nowrap">{item.departamento_raiz ?? '—'}</td>
                <td className="px-4 py-3 text-[#94a3b8] text-sm whitespace-nowrap">{item.sub_departamento ?? '—'}</td>
                <td className="px-4 py-3">
                  <LicencaBadge possui={item.possui_licenca} tipo={item.tipo_licenca} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-[#64748b] text-xs">{item.atualizado_por ?? '—'}</td>
                {canWrite && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-[#64748b] hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-[#64748b] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
