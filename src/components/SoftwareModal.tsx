import { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import type { ConfiguracaoLicenca } from '@/types';

interface SoftwareModalProps {
  softwares: ConfiguracaoLicenca[];
  onClose: () => void;
  onSave: (nome: string, total: number, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function SoftwareModal({ softwares, onClose, onSave, onDelete }: SoftwareModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nomeSoftware, setNomeSoftware] = useState('');
  const [totalLicencas, setTotalLicencas] = useState(100);
  const [loading, setLoading] = useState(false);

  function handleStartEdit(s: ConfiguracaoLicenca) {
    setEditingId(s.id);
    setNomeSoftware(s.nome_software);
    setTotalLicencas(s.total_licencas);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setNomeSoftware('');
    setTotalLicencas(100);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nomeSoftware.trim()) return;
    setLoading(true);
    try {
      await onSave(nomeSoftware.trim(), Number(totalLicencas), editingId || undefined);
      handleCancelEdit();
    } catch (err: any) {
      alert('Erro ao salvar: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0F172A] border border-[#1e293b] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <h2 className="text-white font-bold text-lg">Gerenciar Softwares e Licenças</h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[#0c1526] p-4 rounded-lg border border-[#1e293b]">
          <h3 className="text-sm font-semibold text-[#D4AF37]">
            {editingId ? 'Editar Software' : 'Adicionar Novo Software'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#94a3b8] block mb-1">Nome do Software</label>
              <input
                type="text"
                value={nomeSoftware}
                onChange={(e) => setNomeSoftware(e.target.value)}
                placeholder="Ex: Adobe Acrobat Pro"
                className="w-full bg-[#0F172A] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#94a3b8] block mb-1">Qtd. Total de Licenças</label>
              <input
                type="number"
                value={totalLicencas}
                onChange={(e) => setTotalLicencas(Number(e.target.value))}
                min={1}
                className="w-full bg-[#0F172A] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-1/3 bg-[#1e293b] hover:bg-[#334155] text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`${editingId ? 'w-2/3' : 'w-full'} bg-[#002B49] hover:bg-[#003366] text-[#D4AF37] border border-[#D4AF37]/30 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors`}
            >
              {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? 'Salvar Alterações' : 'Cadastrar Software'}
            </button>
          </div>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          <h3 className="text-sm font-medium text-[#94a3b8]">Softwares Cadastrados</h3>
          {softwares.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-[#0c1526] px-4 py-3 rounded-lg border border-[#1e293b]">
              <div>
                <p className="text-white text-sm font-semibold">{s.nome_software}</p>
                <p className="text-xs text-[#64748b]">Total: {s.total_licencas} licenças</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleStartEdit(s)}
                  className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(s.id)}
                  className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
