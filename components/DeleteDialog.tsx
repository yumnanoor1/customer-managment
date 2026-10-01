import { AlertTriangle } from "lucide-react";
import type { Customer } from "@/types/customer";

interface Props { customer: Customer; deleting: boolean; onConfirm: () => void; onCancel: () => void }

export default function DeleteDialog({ customer, deleting, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/70 p-4" role="alertdialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl bg-palladian p-6 shadow-xl">
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-truffle text-palladian">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h2 className="text-lg font-semibold">Delete {customer.name}?</h2>
        <p className="mt-1 text-sm text-fantastic/80">Are you sure you want to delete this customer?</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="h-11 rounded-xl border border-oatmeal px-5 text-sm font-medium hover:bg-oatmeal">Cancel</button>
          <button onClick={onConfirm} disabled={deleting}
            className="h-11 rounded-xl bg-truffle px-5 text-sm font-semibold text-palladian hover:brightness-110 disabled:opacity-60">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
