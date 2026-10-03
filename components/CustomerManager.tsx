"use client";
import { useCallback, useEffect, useState } from "react";
import { Plus, Loader2, AlertCircle, UserX, CheckCircle2 } from "lucide-react";
import * as api from "@/lib/customers";
import type { Customer, CustomerInput } from "@/types/customer";
import StatsCards from "./StatsCards";
import SearchBar from "./SearchBar";
import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";
import DeleteDialog from "./DeleteDialog";
import Pagination from "./Pagination";

export default function CustomerManager({ showStats = false }: { showStats?: boolean }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<api.Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [toDelete, setToDelete] = useState<Customer | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const notify = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  // Debounce typing so we don't query on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => { setSearch(query); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [list, st] = await Promise.all([api.listCustomers({ search, city, page }), api.getStats()]);
      if (list.customers.length === 0 && page > 1) return setPage(page - 1);
      setCustomers(list.customers); setTotal(list.total); setStats(st);
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }, [search, city, page]);

  useEffect(() => { load(); }, [load]);

  const closeForm = () => { setFormOpen(false); setEditing(null); setFormError(null); };

  const save = async (v: CustomerInput) => {
    setBusy(true); setFormError(null);
    try {
      if (editing) await api.updateCustomer(editing.id, v); else await api.createCustomer(v);
      notify(editing ? "Customer updated successfully." : "Customer added successfully.");
      closeForm(); load();
    } catch (e) { setFormError((e as Error).message); }
    setBusy(false);
  };

  const remove = async () => {
    if (!toDelete) return;
    setBusy(true);
    try { await api.deleteCustomer(toDelete.id); notify("Customer deleted successfully."); setToDelete(null); load(); }
    catch (e) { notify((e as Error).message, false); }
    setBusy(false);
  };

  const filtering = !!(search || city);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="mt-1 text-fantastic/70">Add, search and manage your customers in one place.</p>
        </div>
        <button onClick={() => setFormOpen(true)} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-flame px-5 text-sm font-semibold text-abyss shadow-sm hover:brightness-95">
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      {showStats && <StatsCards stats={stats} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <SearchBar value={query} onChange={setQuery} />
          <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} aria-label="Filter by city"
            className="h-11 rounded-xl border border-oatmeal bg-white px-3 text-sm focus:border-flame">
            <option value="">All cities</option>
            {stats?.cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <p className="whitespace-nowrap text-sm text-fantastic/70">
          {filtering ? "Showing" : "Total"}: <span className="font-semibold text-fantastic">{total}</span> customer{total === 1 ? "" : "s"}
        </p>
      </div>

      {loading && customers.length === 0 ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-oatmeal bg-white py-16">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading customers…
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-truffle bg-white py-12 text-center">
          <AlertCircle className="h-8 w-8 text-truffle" />
          <p className="font-medium text-truffle">Couldn&apos;t load customers</p>
          <p className="max-w-md px-4 text-sm text-fantastic/70">{error}</p>
          <button onClick={load} className="h-10 rounded-xl bg-fantastic px-5 text-sm font-medium text-palladian hover:bg-abyss">Try again</button>
        </div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-oatmeal bg-white py-16 text-center">
          <UserX className="h-8 w-8 text-oatmeal" />
          <p className="font-medium">{filtering ? "No matching customers" : "No customers yet"}</p>
          <p className="text-sm text-fantastic/70">{filtering ? "Try a different search or filter." : "Click “Add Customer” to create your first one."}</p>
        </div>
      ) : (
        <div className={`space-y-4 transition-opacity ${loading ? "opacity-60" : ""}`}>
          <CustomerTable customers={customers} onEdit={(c) => { setEditing(c); setFormOpen(true); }} onDelete={setToDelete} />
          <Pagination page={page} total={total} pageSize={api.PAGE_SIZE} onChange={setPage} />
        </div>
      )}

      {formOpen && <CustomerForm customer={editing} saving={busy} serverError={formError} onSubmit={save} onCancel={closeForm} />}
      {toDelete && <DeleteDialog customer={toDelete} deleting={busy} onConfirm={remove} onCancel={() => setToDelete(null)} />}

      {toast && (
        <div role="status" className={`fixed bottom-6 right-4 z-[60] flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${toast.ok ? "bg-fantastic text-palladian" : "bg-truffle text-palladian"}`}>
          {toast.ok ? <CheckCircle2 className="h-4 w-4 text-flame" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
