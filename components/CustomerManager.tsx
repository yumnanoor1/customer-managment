"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Loader2, AlertCircle, UserX, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Customer, CustomerInput } from "@/types/customer";
import StatsCards from "./StatsCards";
import SearchBar from "./SearchBar";
import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";
import DeleteDialog from "./DeleteDialog";

export default function CustomerManager({ showStats = false }: { showStats?: boolean }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [toDelete, setToDelete] = useState<Customer | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setCustomers(data as Customer[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => [c.name, c.phone, c.email, c.city].some((f) => f.toLowerCase().includes(q)));
  }, [customers, query]);

  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const save = async (v: CustomerInput) => {
    setBusy(true);
    const { error } = editing
      ? await supabase.from("customers").update(v).eq("id", editing.id)
      : await supabase.from("customers").insert(v);
    setBusy(false);
    if (error) return notify(error.message, false);
    notify(editing ? "Customer updated successfully." : "Customer added successfully.");
    closeForm();
    load();
  };

  const remove = async () => {
    if (!toDelete) return;
    setBusy(true);
    const { error } = await supabase.from("customers").delete().eq("id", toDelete.id);
    setBusy(false);
    if (error) return notify(error.message, false);
    notify("Customer deleted successfully.");
    setToDelete(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="mt-1 text-fantastic/70">Add, search and manage your customers in one place.</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-flame px-5 text-sm font-semibold text-abyss shadow-sm hover:brightness-95">
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      {showStats && <StatsCards customers={customers} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={query} onChange={setQuery} />
        <p className="text-sm text-fantastic/70">
          Total: <span className="font-semibold text-fantastic">{customers.length}</span> customer{customers.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-oatmeal bg-white py-16">
          <Loader2 className="h-5 w-5 animate-spin text-fantastic" /> Loading customers…
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-truffle bg-white py-12 text-center">
          <AlertCircle className="h-8 w-8 text-truffle" />
          <p className="font-medium text-truffle">Couldn&apos;t load customers</p>
          <p className="max-w-md px-4 text-sm text-fantastic/70">{error}</p>
          <button onClick={load} className="h-10 rounded-xl bg-fantastic px-5 text-sm font-medium text-palladian hover:bg-abyss">Try again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-oatmeal bg-white py-16 text-center">
          <UserX className="h-8 w-8 text-oatmeal" />
          <p className="font-medium">{customers.length === 0 ? "No customers yet" : "No matching customers"}</p>
          <p className="text-sm text-fantastic/70">
            {customers.length === 0 ? "Click “Add Customer” to create your first one." : "Try a different search term."}
          </p>
        </div>
      ) : (
        <CustomerTable customers={filtered} onEdit={(c) => { setEditing(c); setFormOpen(true); }} onDelete={setToDelete} />
      )}

      {formOpen && <CustomerForm customer={editing} saving={busy} onSubmit={save} onCancel={closeForm} />}
      {toDelete && <DeleteDialog customer={toDelete} deleting={busy} onConfirm={remove} onCancel={() => setToDelete(null)} />}

      {toast && (
        <div role="status" className={`fixed bottom-6 right-4 z-[60] flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
          toast.ok ? "bg-fantastic text-palladian" : "bg-truffle text-palladian"}`}>
          {toast.ok ? <CheckCircle2 className="h-4 w-4 text-flame" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
