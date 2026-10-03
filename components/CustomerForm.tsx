"use client";
import { useState } from "react";
import { X } from "lucide-react";
import type { Customer, CustomerInput } from "@/types/customer";
import { validate, normalize, type Errors } from "@/lib/validation";

interface Props {
  customer?: Customer | null;
  saving: boolean;
  serverError?: string | null;
  onSubmit: (v: CustomerInput) => void;
  onCancel: () => void;
}

const fields: { key: keyof CustomerInput; label: string; type: string; placeholder: string }[] = [
  { key: "name", label: "Customer Name", type: "text", placeholder: "Ayesha Khan" },
  { key: "phone", label: "Phone", type: "tel", placeholder: "+92 300 1234567" },
  { key: "email", label: "Email", type: "email", placeholder: "ayesha@example.com" },
  { key: "city", label: "City", type: "text", placeholder: "Islamabad" },
];

export default function CustomerForm({ customer, saving, serverError, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<CustomerInput>({
    name: customer?.name ?? "", phone: customer?.phone ?? "", email: customer?.email ?? "", city: customer?.city ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0)
      onSubmit(normalize(values));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-abyss/70 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <form onSubmit={handle} noValidate className="max-h-full w-full max-w-md overflow-y-auto rounded-t-2xl bg-palladian p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{customer ? "Edit Customer" : "Add Customer"}</h2>
          <button type="button" onClick={onCancel} aria-label="Close" className="rounded-lg p-1.5 hover:bg-oatmeal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={f.key} className="mb-1 block text-sm font-medium">{f.label}</label>
              <input
                id={f.key} type={f.type} value={values[f.key]} placeholder={f.placeholder}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                aria-invalid={!!errors[f.key]}
                className={`h-11 w-full rounded-xl border bg-white px-3 text-sm placeholder:text-fantastic/40 ${
                  errors[f.key] ? "border-truffle" : "border-oatmeal focus:border-flame"
                }`}
              />
              {errors[f.key] && <p className="mt-1 text-xs font-medium text-truffle">{errors[f.key]}</p>}
            </div>
          ))}
        </div>
        {serverError && <p role="alert" className="mt-4 rounded-xl bg-truffle px-3 py-2 text-sm font-medium text-palladian">{serverError}</p>}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel}
            className="h-11 rounded-xl border border-oatmeal px-5 text-sm font-medium hover:bg-oatmeal">Cancel</button>
          <button type="submit" disabled={saving}
            className="h-11 rounded-xl bg-flame px-5 text-sm font-semibold text-abyss hover:brightness-95 disabled:opacity-60">
            {saving ? "Saving…" : customer ? "Save Changes" : "Add Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}
