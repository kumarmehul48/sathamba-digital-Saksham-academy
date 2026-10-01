import { ReactNode } from 'react';
import { classNames } from '../lib/utils';

// ---------- Buttons ----------
type BtnVariant = 'primary' | 'accent' | 'outline' | 'danger' | 'ghost';
export function Button({ variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const styles: Record<BtnVariant, string> = {
    primary: 'bg-primary text-white hover:bg-primary-light',
    accent: 'bg-accent-dark text-primary-dark hover:bg-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-danger text-white hover:opacity-90',
    ghost: 'text-primary hover:bg-primary-50',
  };
  return <button className={classNames('inline-flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-lg text-sm transition disabled:opacity-50', styles[variant], className)} {...props} />;
}

// ---------- Cards / Badges / Alerts ----------
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={classNames('card-sdsa p-5', className)}>{children}</div>;
}
type BadgeTone = 'primary' | 'accent' | 'success' | 'danger' | 'gray';
export function Badge({ tone = 'gray', children }: { tone?: BadgeTone; children: ReactNode }) {
  const tones: Record<BadgeTone, string> = {
    primary: 'bg-primary-50 text-primary', accent: 'bg-accent-light text-yellow-800',
    success: 'bg-green-50 text-success', danger: 'bg-red-50 text-danger', gray: 'bg-gray-100 text-gray-700',
  };
  return <span className={classNames('inline-block text-xs font-bold px-2.5 py-1 rounded-full', tones[tone])}>{children}</span>;
}
export function Alert({ tone = 'info', children }: { tone?: 'info' | 'success' | 'error' | 'warning'; children: ReactNode }) {
  const tones = {
    info: 'bg-primary-50 border-primary text-primary',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-danger',
  };
  return <div className={classNames('border rounded-lg p-3 text-sm', tones[tone])}>{children}</div>;
}

// ---------- Progress ----------
export function Progress({ value }: { value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
        <span>Progress</span><span>{Math.round(value)}%</span>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-accent-dark rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

// ---------- Table ----------
export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase text-gray-500 border-b-2 border-gray-200">
          <tr>{head.map((h) => <th key={h} className="px-3 py-3 whitespace-nowrap">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}
export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={classNames('px-3 py-2.5', className)}>{children}</td>;
}

// ---------- Modal ----------
export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-primary">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700 text-xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---------- Empty state ----------
export function Empty({ text }: { text: string }) {
  return <div className="text-center py-10 text-gray-500 text-sm">{text}</div>;
}

// ---------- Stat card (dashboards) ----------
export function Stat({ label, value, hint, tone = 'primary' }: { label: string; value: ReactNode; hint?: string; tone?: BadgeTone }) {
  return (
    <Card className="hover:shadow-md transition">
      <p className="text-xs font-bold uppercase text-gray-500 tracking-wide">{label}</p>
      <p className="text-3xl font-extrabold mt-1">{value}</p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </Card>
  );
}
