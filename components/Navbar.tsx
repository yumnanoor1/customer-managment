"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/customers", label: "Customers" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="bg-fantastic">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-palladian">
          <Users className="h-5 w-5 text-flame" aria-hidden /> CustomerHub
        </Link>
        <ul className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-flame ${
                    active ? "bg-abyss text-flame" : "text-palladian"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
