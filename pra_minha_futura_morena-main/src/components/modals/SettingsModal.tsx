import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Settings, Download, Upload, RotateCcw, Trash2, Check, Database, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { resetToDemoData, clearAllData, exportDataJson, importDataJson, pixKey, setPixKey } = useStore();
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentPix, setCurrentPix] = useState(pixKey);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rl-market-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Backup JSON baixado com sucesso!');
  };

  const handleSavePix = (e: React.FormEvent) => {
    e.preventDefault();
    setPixKey(currentPix);
    showNotice('Chave Pix salva com sucesso!');
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = importDataJson(importText);
    if (ok) {
      showNotice('Dados importados com sucesso!');
      setShowImport(false);
      setImportText('');
    } else {
      alert('Formato de dados JSON inválido.');
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Deseja recarregar os dados de demonstração com os exemplos de Parafusadeira, Fones, Vendas e Tarefas?')) {
      resetToDemoData();
      showNotice('Dados de demonstração restaurados!');
    }
  };

  const handleClear = () => {
    if (
      window.confirm(
        'ATENÇÃO: Deseja apagar TODOS os produtos, vendas, tarefas e zerar o capital para começar do zero absoluto?'
      )
    ) {
      clearAllData();
      showNotice('Todos os dados foram resetados com sucesso.');
    }
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Configurações & Backup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chave Pix, dados e integração com Supabase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {notification && (
            <div className="p-3 text-sm bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Configuração da Chave Pix */}
          <form onSubmit={handleSavePix} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-500" />
              Chave Pix da Loja (para os Comprovantes)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: CPF, Telefone ou E-mail da loja"
                value={currentPix}
                onChange={(e) => setCurrentPix(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
              >
                Salvar
              </button>
            </div>
          </form>

          {/* Informação sobre Supabase */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold">
              <Database className="w-4 h-4" />
              <span>Pronto para Conectar ao Supabase</span>
            </div>
            <p className="text-blue-700 dark:text-blue-400 text-[11px] leading-relaxed">
              O modelo de dados já foi construído exatamente compatível com o Supabase. O script <code className="bg-white/80 dark:bg-slate-900 px-1 py-0.5 rounded">supabase_schema.sql</code> já está salvo na raiz do projeto com todas as tabelas prontas para rodar no seu banco!
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Download Backup */}
            <button
              onClick={handleDownloadBackup}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Exportar Backup Completo (JSON)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gera um arquivo com todos os produtos, estoque, vendas e finanças
                  </p>
                </div>
              </div>
            </button>

            {/* Importar */}
            <button
              onClick={() => setShowImport(!showImport)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Importar ou Restaurar Backup
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Carregar dados salvos anteriormente via arquivo ou texto JSON
                  </p>
                </div>
              </div>
            </button>

            {showImport && (
              <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
                <textarea
                  rows={3}
                  placeholder="Cole aqui o conteúdo JSON do backup..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
                <button
                  onClick={handleImportSubmit}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-500"
                >
                  Confirmar Importação
                </button>
              </div>
            )}

            {/* Resetar Demo */}
            <button
              onClick={handleResetDemo}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 hover:border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100/60 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                    Restaurar Dados de Exemplo
                  </h4>
                  <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                    Recarrega dados completos (Parafusadeira R$ 80, Fone, Vendas e Checklist)
                  </p>
                </div>
              </div>
            </button>

            {/* Limpar Tudo */}
            <button
              onClick={handleClear}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:border-rose-300 bg-rose-50/60 dark:bg-rose-950/20 hover:bg-rose-100/60 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300">
                    Zerar Todos os Dados
                  </h4>
                  <p className="text-xs text-rose-700/80 dark:text-rose-400/80">
                    Limpar produtos, vendas e caixa para começar sua loja do zero absoluto
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
