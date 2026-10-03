import type { CustomerInput } from "@/types/customer";

export type Errors = Partial<Record<keyof CustomerInput, string>>;

export function normalize(v: CustomerInput): CustomerInput {
  return {
    name: v.name.trim().replace(/\s+/g, " "),
    phone: v.phone.trim().replace(/\s+/g, " "),
    email: v.email.trim().toLowerCase(),
    city: v.city.trim().replace(/\s+/g, " "),
  };
}

export function validate(input: CustomerInput): Errors {
  const v = normalize(input);
  const e: Errors = {};

  if (!v.name) e.name = "Customer name is required.";
  else if (!/^\p{L}[\p{L}\s.'-]{1,59}$/u.test(v.name)) e.name = "Use letters only (2–60 characters).";

  const digits = v.phone.replace(/\D/g, "");
  if (!v.phone) e.phone = "Phone is required.";
  else if (!/^\+?[\d\s\-()]+$/.test(v.phone) || digits.length < 7 || digits.length > 15)
    e.phone = "Enter 7–15 digits, e.g. +92 300 1234567.";

  if (!v.email) e.email = "Email is required.";
  else if (v.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email))
    e.email = "Enter a valid email address.";

  if (!v.city) e.city = "City is required.";
  else if (!/^\p{L}[\p{L}\s.'-]{1,49}$/u.test(v.city)) e.city = "Use letters only (2–50 characters).";

  return e;
}
