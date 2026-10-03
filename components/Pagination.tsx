import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props { page: number; total: number; pageSize: number; onChange: (p: number) => void }

export default function Pagination({ page, total, pageSize, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const btn = "flex h-10 items-center gap-1 rounded-xl border border-oatmeal bg-white px-3 text-sm font-medium hover:bg-flame disabled:opacity-40 disabled:hover:bg-white";
  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <p className="text-sm text-fantastic/70">Page {page} of {pages}</p>
      <div className="flex gap-2">
        <button className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)}><ChevronLeft className="h-4 w-4" />Prev</button>
        <button className={btn} disabled={page >= pages} onClick={() => onChange(page + 1)}>Next<ChevronRight className="h-4 w-4" /></button>
      </div>
    </nav>
  );
}
