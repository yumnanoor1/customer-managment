"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      return setError("Enter a valid email address.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    setBusy(true);
    const creds = { email: email.trim(), password };
    const { data, error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword(creds)
        : await supabase.auth.signUp(creds);
    setBusy(false);
    if (error) return setError(error.message);
    if (data.session) router.replace("/");
    else setInfo("Account created. Check your email to confirm it, then log in.");
  };

  const input =
    "h-11 w-full rounded-xl border border-oatmeal bg-white px-3 text-sm focus:border-flame";

  return (
    <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-oatmeal bg-white p-6 shadow-sm">
      <h1 className="text-center text-2xl font-bold">
        {mode === "in" ? "Log in" : "Create account"}
      </h1>
      <p className="mt-1 text-center text-sm text-fantastic/70">
        Sign in to manage your customers.
      </p>

      <form onSubmit={submit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-truffle px-3 py-2 text-sm font-medium text-palladian">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="rounded-xl bg-fantastic px-3 py-2 text-sm text-palladian">
            {info}
          </p>
        )}

        <button
          disabled={busy}
          className="h-11 w-full rounded-xl bg-flame text-sm font-semibold text-abyss hover:brightness-95 disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "in" ? "Log in" : "Sign up"}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "in" ? "up" : "in");
          setError(null);
          setInfo(null);
        }}
        className="mx-auto mt-4 block text-sm font-medium underline"
      >
        {mode === "in" ? "No account? Sign up" : "Have an account? Log in"}
      </button>
    </div>
  );
}