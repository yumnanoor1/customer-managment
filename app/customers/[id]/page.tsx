"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Phone, Mail, MapPin, CalendarDays, Loader2, UserX } from "lucide-react";
import { getCustomer } from "@/lib/customers";
import type { Customer } from "@/types/customer";

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCustomer(id).then(setCustomer).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const back = <Link href="/customers" className="inline-flex items-center gap-2 text-sm font-medium hover:underline"><ArrowLeft className="h-4 w-4" />Back to customers</Link>;

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (error || !customer)
    return (
      <div className="space-y-4">{back}
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-oatmeal bg-white py-16 text-center">
          <UserX className="h-8 w-8 text-oatmeal" />
          <p className="font-medium">{error ?? "Customer not found"}</p>
        </div>
      </div>
    );

  const rows = [
    { icon: Phone, label: "Phone", value: customer.phone },
    { icon: Mail, label: "Email", value: customer.email },
    { icon: MapPin, label: "City", value: customer.city },
    { icon: CalendarDays, label: "Added on", value: new Date(customer.created_at).toLocaleDateString(undefined, { dateStyle: "long" }) },
  ];
  return (
    <div className="space-y-6">{back}
      <div className="rounded-2xl border border-oatmeal bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-fantastic text-lg font-semibold text-flame">
            {customer.name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")}
          </span>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 rounded-xl bg-palladian p-4">
              <Icon className="mt-0.5 h-5 w-5 text-truffle" aria-hidden />
              <div className="min-w-0"><dt className="text-xs uppercase tracking-wide text-fantastic/60">{label}</dt>
                <dd className="break-words font-medium">{value}</dd></div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
