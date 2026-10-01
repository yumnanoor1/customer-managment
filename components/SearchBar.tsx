import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fantastic/60" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search name, phone, email or city"
        aria-label="Search customers"
        className="h-11 w-full rounded-xl border border-oatmeal bg-white pl-10 pr-3 text-sm text-fantastic placeholder:text-fantastic/50 focus:border-flame"
      />
    </div>
  );
}
