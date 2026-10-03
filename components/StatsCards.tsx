import { Users, MapPin, UserPlus } from "lucide-react";
import type { Stats } from "@/lib/customers";

export default function StatsCards({ stats }: { stats: Stats | null }) {
  const items = [
    { label: "Total Customers", value: stats?.total, icon: Users },
    { label: "Cities Covered", value: stats?.cities.length, icon: MapPin },
    { label: "Recent (7 days)", value: stats?.recent, icon: UserPlus },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Statistics">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-4 rounded-2xl border border-oatmeal bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame text-abyss"><Icon className="h-5 w-5" aria-hidden /></span>
          <div>
            <p className="text-2xl font-semibold">{value ?? "–"}</p>
            <p className="text-sm text-fantastic/70">{label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
