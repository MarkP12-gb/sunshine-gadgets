import { supabase } from "./supabaseClient.js";

// order_ref must be a real UUID v4 — it doubles as MarzPay's collection
// reference, which requires that format. crypto.randomUUID() is built into
// every modern browser, no library needed.
function makeOrderRef() {
  return crypto.randomUUID();
}

/** Creates a pending order + its line items. Returns the order row (with order_ref, id, total). */
export async function createOrder({ receiptName, phone, location, network, transportFee, subtotal, total, cart }) {
  const order_ref = makeOrderRef();

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_ref,
      receipt_name: receiptName,
      phone,
      location,
      network,
      transport_fee: transportFee,
      subtotal,
      total,
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;

  const itemRows = cart.map((c) => ({
    order_id: order.id,
    product_id: c.product.id,
    product_name: c.product.name,
    variant: c.variant,
    color: c.color,
    unit_price: c.product.price,
    qty: c.qty,
  }));
  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
  if (itemsError) throw itemsError;

  return order;
}

/** Admin-only (requires an authenticated session — see auth.js). */
export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export function subscribeToOrders(callback) {
  const channel = supabase
    .channel("orders-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
      fetchOrders().then(callback).catch(() => {});
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}
