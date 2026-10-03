// All database access lives here so components never talk to Supabase directly.
import { supabase } from "./supabase";
import type { Customer, CustomerInput } from "@/types/customer";

export const PAGE_SIZE = 8;

export interface ListParams { search: string; city: string; page: number }
export interface Stats { total: number; cities: string[]; recent: number }

function fail(error: { code?: string; message: string }): never {
  if (error.code === "23505") throw new Error("A customer with this email already exists.");
  throw new Error(error.message);
}

export async function listCustomers({ search, city, page }: ListParams) {
  let q = supabase.from("customers").select("*", { count: "exact" }).order("created_at", { ascending: false });
  const s = search.trim().replace(/[%,()_]/g, " ");
  if (s) q = q.or(`name.ilike.%${s}%,phone.ilike.%${s}%,email.ilike.%${s}%,city.ilike.%${s}%`);
  if (city) q = q.ilike("city", city);
  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await q.range(from, from + PAGE_SIZE - 1);
  if (error) fail(error);
  return { customers: (data ?? []) as Customer[], total: count ?? 0 };
}

export async function getStats(): Promise<Stats> {
  const { data, error } = await supabase.from("customers").select("city, created_at");
  if (error) fail(error);
  const rows = data ?? [];
  const seen = new Map<string, string>();
  rows.forEach((r) => { const k = r.city.trim().toLowerCase(); if (!seen.has(k)) seen.set(k, r.city.trim()); });
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return {
    total: rows.length,
    cities: [...seen.values()].sort((a, b) => a.localeCompare(b)),
    recent: rows.filter((r) => new Date(r.created_at).getTime() >= weekAgo).length,
  };
}

export async function getCustomer(id: string) {
  const { data, error } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();
  if (error) fail(error);
  return data as Customer | null;
}

export async function createCustomer(v: CustomerInput) {
  const { error } = await supabase.from("customers").insert(v);
  if (error) fail(error);
}

export async function updateCustomer(id: string, v: CustomerInput) {
  const { error } = await supabase.from("customers").update(v).eq("id", id);
  if (error) fail(error);
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) fail(error);
}
