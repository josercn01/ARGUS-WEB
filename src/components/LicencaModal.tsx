import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { LicencaUsuario, ConfiguracaoLicenca } from '@/types';

interface LicencaModalProps {
  item?: Partial<LicencaUsuario> | null;
  softwares: ConfiguracaoLicenca[];
  onClose: () => void;
  onSave: (data: Partial<LicencaUsuario>) => Promise<void>;
}

export function LicencaModal({ item, softwares, onClose, onSave }: LicencaModalProps) {
  const [formData, setFormData] = useState<Partial<LicencaUsuario>>({
    email: '',
    nome: '',
    matricula: '',
    departamento_raiz: '',
    sub_departamento: '',
    possui_licenca: true,
    tipo_licenca: '',
    status: 'Ativo',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <h2 className="text-white font-bold text-lg">
            {formData.id ? 'Editar Colaborador / Licenças' : 'Novo Colaborador'}
          </h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#94a3b8] block mb-1">Nome Completo</label>
              <input
                type="text"
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#94a3b8] block mb-1">E-mail institucional</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#94a3b8] block mb-1">Matrícula</label>
              <input
                type="text"
                value={formData.matricula || ''}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-xs text-[#94a3b8] block mb-1">Status</label>
              <select
                value={formData.status || 'Ativo'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Ativo">Ativo</option>
                <option value="Pendente">Pendente</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#94a3b8] block mb-1">Departamento Raíz (Ex: PRODASEN)</label>
              <input
                type="text"
                value={formData.departamento_raiz || ''}
                onChange={(e) => setFormData({ ...formData, departamento_raiz: e.target.value })}
                className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-xs text-[#94a3b8] block mb-1">Sub-departamento (Ex: COINTI)</label>
              <input
                type="text"
                value={formData.sub_departamento || ''}
                onChange={(e) => setFormData({ ...formData, sub_departamento: e.target.value })}
                className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#1e293b]">
            <label className="text-xs text-[#D4AF37] font-semibold block">Softwares / Licenças Atribuídas</label>
            <p className="text-xs text-[#64748b]">Digite os softwares separados por vírgula ou selecione:</p>
            <input
              type="text"
              value={formData.tipo_licenca || ''}
              onChange={(e) => setFormData({ ...formData, tipo_licenca: e.target.value })}
              placeholder="Ex: Adobe Acrobat Pro, PDF Gear"
              className="w-full bg-[#0c1526] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {softwares.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    const atual = formData.tipo_licenca ? formData.tipo_licenca.split(',').map(i => i.trim()).filter(Boolean) : [];
                    if (!atual.includes(s.nome_software)) {
                      atual.push(s.nome_software);
                      setFormData({ ...formData, tipo_licenca: atual.join(', '), possui_licenca: true });
                    }
                  }}
                  className="text-xs bg-[#002B49] text-[#D4AF37] border border-[#D4AF37]/20 px-2.5 py-1 rounded-md hover:bg-[#003366] transition-colors"
                >
                  + {s.nome_software}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#64748b] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-[#002B49] hover:bg-[#003366] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
