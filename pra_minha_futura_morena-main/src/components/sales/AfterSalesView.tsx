import React, { useState } from 'react';
import { CalendarClock, CheckCircle2, MessageCircle, PackageCheck, Save, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AfterSaleStatus, Sale } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

const statusLabels: Record<AfterSaleStatus, string> = {
  open: 'Acompanhar',
  contacted: 'Cliente contatado',
  returned: 'Retorno registrado',
  resolved: 'Resolvido',
};

const FollowUpCard: React.FC<{ sale: Sale }> = ({ sale }) => {
  const { updateSale } = useStore();
  const [notes, setNotes] = useState(sale.afterSaleNotes || '');
  const [saved, setSaved] = useState(false);
  const warrantyEnd = new Date(new Date(sale.soldAt).getTime() + (sale.warrantyDays || 0) * 24 * 60 * 60 * 1000);
  const isWarrantyActive = warrantyEnd.getTime() >= Date.now();
  const phoneDigits = sale.customerPhone?.replace(/\D/g, '');
  const phone = phoneDigits && !phoneDigits.startsWith('55') ? `55${phoneDigits}` : phoneDigits;

  const saveNotes = () => {
    updateSale(sale.id, { afterSaleNotes: notes });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{sale.productName}</h3>
            <span className="text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300">#{sale.code}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{sale.customerName || 'Cliente sem nome'} · venda em {formatDate(sale.soldAt)} · {formatCurrency(sale.totalReceived)}</p>
        </div>
        {phone && (
          <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="text-[11px] font-semibold text-slate-500">
          Acompanhamento
          <select value={sale.afterSaleStatus || 'open'} onChange={(event) => updateSale(sale.id, { afterSaleStatus: event.target.value as AfterSaleStatus })} className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-900 dark:text-white">
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-[11px] font-semibold text-slate-500">
          Lembrete de contato
          <input type="date" value={sale.followUpDate?.slice(0, 10) || ''} onChange={(event) => updateSale(sale.id, { followUpDate: event.target.value ? new Date(`${event.target.value}T12:00:00`).toISOString() : undefined })} className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-900 dark:text-white" />
        </label>
        {sale.itemKind === 'servico' ? (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <CalendarClock className="h-4 w-4 shrink-0" />
            <span>Acompanhamento de serviço</span>
          </div>
        ) : (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${isWarrantyActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-slate-50 text-slate-500 dark:bg-slate-800'}`}>
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{sale.warrantyDays || 0} dias de garantia · {isWarrantyActive ? `até ${formatDate(warrantyEnd.toISOString())}` : 'garantia encerrada'}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Anotações de contato, garantia ou devolução" rows={2} className="min-h-12 flex-1 resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400" />
        <button onClick={saveNotes} className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
          {saved ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Save className="h-3.5 w-3.5" />}
          {saved ? 'Salvo' : 'Salvar nota'}
        </button>
      </div>
    </article>
  );
};

export const AfterSalesView: React.FC = () => {
  const { sales } = useStore();
  const [showResolved, setShowResolved] = useState(false);
  const now = Date.now();
  const trackedSales = sales.filter((sale) => {
    const warrantyEnd = new Date(sale.soldAt).getTime() + (sale.warrantyDays || 0) * 24 * 60 * 60 * 1000;
    const recentSale = now - new Date(sale.soldAt).getTime() <= 90 * 24 * 60 * 60 * 1000;
    const upcomingReminder = sale.followUpDate && new Date(sale.followUpDate).getTime() <= now + 30 * 24 * 60 * 60 * 1000;
    const activeWarranty = warrantyEnd >= now;
    return (showResolved ? sale.afterSaleStatus === 'resolved' : sale.afterSaleStatus !== 'resolved') && (recentSale || activeWarranty || upcomingReminder);
  }).sort((a, b) => {
    const aReminder = a.followUpDate ? new Date(a.followUpDate).getTime() : Infinity;
    const bReminder = b.followUpDate ? new Date(b.followUpDate).getTime() : Infinity;
    return aReminder - bReminder || new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime();
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Pós-venda & Garantias</h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Acompanhe clientes, lembretes, garantias e retornos registrados.</p>
        </div>
        <button onClick={() => setShowResolved((current) => !current)} className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
          {showResolved ? <CalendarClock className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />}
          {showResolved ? 'Ver acompanhamentos abertos' : 'Ver resolvidos'}
        </button>
      </header>
      {trackedSales.length ? <div className="space-y-3">{trackedSales.map((sale) => <FollowUpCard key={sale.id} sale={sale} />)}</div> : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h2 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">Nenhum acompanhamento nesta lista</h2>
          <p className="mt-1 text-xs text-slate-500">Vendas recentes e garantias ativas aparecerão aqui.</p>
        </div>
      )}
    </div>
  );
};