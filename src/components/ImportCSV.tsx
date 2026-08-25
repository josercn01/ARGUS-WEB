import { useState, useRef } from 'react';
import { Upload, Download, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { LicencaUsuario } from '@/types';

interface ImportCSVProps {
  onImport: (rows: Partial<LicencaUsuario>[]) => Promise<{ success: number; errors: string[] }>;
}

const COLUMNS = ['email', 'nome', 'matricula', 'departamento_raiz', 'sub_departamento', 'possui_licenca', 'tipo_licenca', 'status'];

export function ImportCSV({ onImport }: ImportCSVProps) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Partial<LicencaUsuario>[]>([]);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lê o arquivo (Excel ou CSV) usando a biblioteca XLSX
  function processFileBuffer(arrayBuffer: ArrayBuffer): Partial<LicencaUsuario>[] {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Converte a planilha em objetos JSON
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: null });
    
    return rawData.map((row) => {
      // Normaliza as chaves do objeto para minúsculas para evitar erros de case sensitivity
      const normalizedRow: Record<string, unknown> = {};
      Object.keys(row).forEach((key) => {
        const cleanKey = key.trim().toLowerCase();
        normalizedRow[cleanKey] = row[key];
      });

      const possuiLicencaVal = normalizedRow['possui_licenca'];
      const isPossuiLicenca = 
        possuiLicencaVal === true || 
        String(possuiLicencaVal).toLowerCase() === 'true' || 
        String(possuiLicencaVal) === '1' ||
        String(possuiLicencaVal).toLowerCase() === 'sim';

      return {
        email: normalizedRow['email'] ? String(normalizedRow['email']).trim() : null,
        nome: normalizedRow['nome'] ? String(normalizedRow['nome']).trim() : null,
        matricula: normalizedRow['matricula'] ? String(normalizedRow['matricula']).trim() : null,
        departamento_raiz: normalizedRow['departamento_raiz'] ? String(normalizedRow['departamento_raiz']).trim() : null,
        sub_departamento: normalizedRow['sub_departamento'] ? String(normalizedRow['sub_departamento']).trim() : null,
        possui_licenca: isPossuiLicenca,
        tipo_licenca: normalizedRow['tipo_licenca'] ? String(normalizedRow['tipo_licenca']).trim() : null,
        status: normalizedRow['status'] ? String(normalizedRow['status']).trim() : 'Ativo',
      };
    });
  }

  function handleFile(f: File) {
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (buffer) {
        const rows = processFileBuffer(buffer);
        setPreview(rows.slice(0, 5));
      }
    };
    reader.readAsArrayBuffer(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  // Gera e baixa um modelo de planilha Excel (.xlsx) padrão
  function downloadTemplate() {
    const sampleData = [
      {
        email: 'joao.silva@senado.leg.br',
        nome: 'João Silva',
        matricula: '12345',
        departamento_raiz: 'SECOM',
        sub_departamento: 'Redação',
        possui_licenca: true,
        tipo_licenca: 'PDF Gear',
        status: 'Ativo',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Licencas');
    
    XLSX.writeFile(workbook, 'modelo_argus_licencas.xlsx');
  }

  async function handleConfirmImport() {
    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (buffer) {
        const rows = processFileBuffer(buffer);
        const res = await onImport(rows);
        setResult(res);
        setImporting(false);
        if (res.errors.length === 0) {
          setFile(null);
          setPreview([]);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">Importação de Planilha</h2>
          <p className="text-[#64748b] text-sm mt-0.5">Importe em massa via arquivo Excel (.xlsx) ou CSV.</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 text-sm text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Baixar Modelo (.xlsx)
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragging
            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
            : 'border-[#1e293b] hover:border-[#D4AF37]/40 hover:bg-white/2'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx, .xls, .csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <Upload className={`w-10 h-10 mb-3 ${dragging ? 'text-[#D4AF37]' : 'text-[#334155]'}`} />
        <p className="text-[#94a3b8] text-sm font-medium">
          {file ? file.name : 'Arraste o arquivo Excel/CSV aqui ou clique para selecionar'}
        </p>
        <p className="text-[#475569] text-xs mt-1">Suporta .xlsx, .xls e .csv</p>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-[#0c1526] border border-[#1e293b] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
            <p className="text-[#94a3b8] text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              Pré-visualização (primeiras {preview.length} linhas)
            </p>
            <button onClick={() => { setFile(null); setPreview([]); setResult(null); }}
              className="text-[#475569] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-[#1e293b]">
                <tr>
                  {['E-mail', 'Nome', 'Matrícula', 'Departamento', 'Subdep.', 'Licença?', 'Tipo', 'Status'].map((h) => (
                    <th key={h} className="text-left text-[#64748b] px-3 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-white/2">
                    <td className="px-3 py-2 text-[#94a3b8]">{row.email ?? '—'}</td>
                    <td className="px-3 py-2 text-white">{row.nome ?? '—'}</td>
                    <td className="px-3 py-2 text-[#94a3b8]">{row.matricula ?? '—'}</td>
                    <td className="px-3 py-2 text-[#94a3b8]">{row.departamento_raiz ?? '—'}</td>
                    <td className="px-3 py-2 text-[#94a3b8]">{row.sub_departamento ?? '—'}</td>
                    <td className="px-3 py-2 text-[#94a3b8]">{String(row.possui_licenca ?? false)}</td>
                    <td className="px-3 py-2 text-[#94a3b8]">{row.tipo_licenca ?? '—'}</td>
                    <td className="px-3 py-2 text-[#94a3b8]">{row.status ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-xl border p-4 ${result.errors.length === 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.errors.length === 0
              ? <CheckCircle className="w-5 h-5 text-emerald-400" />
              : <AlertCircle className="w-5 h-5 text-amber-400" />}
            <p className="text-white text-sm font-medium">
              {result.success} registro(s) importado(s) com sucesso
              {result.errors.length > 0 ? `, ${result.errors.length} com erro` : ''}
            </p>
          </div>
          {result.errors.length > 0 && (
            <ul className="text-amber-300 text-xs space-y-0.5 mt-2 max-h-32 overflow-y-auto">
              {result.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Import button */}
      {file && !result && (
        <button
          onClick={handleConfirmImport}
          disabled={importing}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] hover:bg-[#c9a227] text-[#002B49] font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          <Upload className="w-4 h-4" />
          {importing ? 'Importando...' : 'Confirmar Importação'}
        </button>
      )}
    </div>
  );
}
