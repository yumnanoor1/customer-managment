import { Users, MapPin, UserPlus } from "lucide-react";
import type { Customer } from "@/types/customer";

export default function StatsCards({ customers }: { customers: Customer[] }) {
  const cities = new Set(customers.map((c) => c.city.trim().toLowerCase())).size;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = customers.filter((c) => new Date(c.created_at).getTime() >= weekAgo).length;

  const stats = [
    { label: "Total Customers", value: customers.length, icon: Users },
    { label: "Cities Covered", value: cities, icon: MapPin },
    { label: "Recent (7 days)", value: recent, icon: UserPlus },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Statistics">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-4 rounded-2xl border border-oatmeal bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame text-abyss">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-2xl font-semibold text-fantastic">{value}</p>
            <p className="text-sm text-fantastic/70">{label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
