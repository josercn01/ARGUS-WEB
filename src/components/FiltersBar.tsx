import { Search, ChevronDown } from 'lucide-react';

interface FiltersBarProps {
  search: string;
  onSearch: (v: string) => void;
  depRaiz: string;
  onDepRaiz: (v: string) => void;
  subDep: string;
  onSubDep: (v: string) => void;
  depRaizOptions: string[];
  subDepOptions: string[];
}

export function FiltersBar({
  search, onSearch,
  depRaiz, onDepRaiz,
  subDep, onSubDep,
  depRaizOptions, subDepOptions,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou matrícula..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-[#0F172A] border border-[#1e293b] text-white placeholder-[#475569] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors"
        />
      </div>

      {/* Departamento Raiz */}
      <div className="relative">
        <select
          value={depRaiz}
          onChange={(e) => { onDepRaiz(e.target.value); onSubDep(''); }}
          className="appearance-none bg-[#0F172A] border border-[#1e293b] text-white rounded-lg pl-3 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors min-w-[180px] cursor-pointer"
        >
          <option value="">Todos os Departamentos</option>
          {depRaizOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
      </div>

      {/* Sub-departamento */}
      <div className="relative">
        <select
          value={subDep}
          onChange={(e) => onSubDep(e.target.value)}
          disabled={!depRaiz}
          className="appearance-none bg-[#0F172A] border border-[#1e293b] text-white rounded-lg pl-3 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors min-w-[180px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Todos os Subdepartamentos</option>
          {subDepOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
      </div>
    </div>
  );
}
