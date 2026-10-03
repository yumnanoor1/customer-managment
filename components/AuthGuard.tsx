"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Redirects to /login when there is no session. The /login page itself is public.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/login";

  useEffect(() => {
    const check = (hasSession: boolean) => {
      if (!hasSession && !isLogin) router.replace("/login");
      else setReady(true);
    };
    supabase.auth.getSession().then(({ data }) => check(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => check(!!session));
    return () => data.subscription.unsubscribe();
  }, [isLogin, router]);

  if (!ready) return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  return <>{children}</>;
}
