"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/customers", label: "Customers" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);

  const logout = async () => { await supabase.auth.signOut(); router.replace("/login"); };

  return (
    <header className="bg-fantastic">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-palladian">
          <Users className="h-5 w-5 text-flame" aria-hidden /> CustomerHub
        </Link>
        {signedIn && (
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`rounded-lg px-3 py-2 text-sm font-medium hover:text-flame ${pathname === l.href ? "bg-abyss text-flame" : "text-palladian"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button onClick={logout} aria-label="Log out" className="ml-1 rounded-lg p-2 text-palladian hover:text-flame">
                <LogOut className="h-4 w-4" />
              </button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
