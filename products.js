import { supabase } from "./supabaseClient.js";

export async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addProduct(payload) {
  const { data, error } = await supabase.from("products").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, payload) {
  const { data, error } = await supabase.from("products").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

/** Fires callback(freshProductList) whenever any product changes anywhere — any device, any tab. */
export function subscribeToProducts(callback) {
  const channel = supabase
    .channel("products-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
      fetchProducts().then(callback).catch(() => {});
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}
