export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  created_at: string;
}
export type CustomerInput = Pick<Customer, "name" | "phone" | "email" | "city">;
