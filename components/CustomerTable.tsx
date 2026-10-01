import { Pencil, Trash2, Mail, Phone, MapPin } from "lucide-react";
import type { Customer } from "@/types/customer";

interface Props {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
}

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fantastic text-sm font-semibold text-flame">
      {initials(name)}
    </span>
  );
}

function Actions({ c, onEdit, onDelete }: { c: Customer } & Pick<Props, "onEdit" | "onDelete">) {
  return (
    <div className="flex gap-2">
      <button onClick={() => onEdit(c)} aria-label={`Edit ${c.name}`}
        className="rounded-lg border border-oatmeal p-2 text-fantastic hover:bg-flame">
        <Pencil className="h-4 w-4" />
      </button>
      <button onClick={() => onDelete(c)} aria-label={`Delete ${c.name}`}
        className="rounded-lg border border-truffle p-2 text-truffle hover:bg-truffle hover:text-palladian">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CustomerTable({ customers, onEdit, onDelete }: Props) {
  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-hidden rounded-2xl border border-oatmeal bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-fantastic text-palladian">
            <tr>
              {["Customer", "Phone", "Email", "City", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-oatmeal">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-palladian/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} />
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3">{c.phone}</td>
                <td className="px-5 py-3">{c.email}</td>
                <td className="px-5 py-3">{c.city}</td>
                <td className="px-5 py-3"><Actions c={c} onEdit={onEdit} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {customers.map((c) => (
          <li key={c.id} className="rounded-2xl border border-oatmeal bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={c.name} />
                <span className="truncate font-medium">{c.name}</span>
              </div>
              <Actions c={c} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <dl className="mt-3 space-y-1.5 text-sm text-fantastic/80">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-truffle" />{c.phone}</div>
              <div className="flex items-center gap-2 break-all"><Mail className="h-4 w-4 text-truffle" />{c.email}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-truffle" />{c.city}</div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
