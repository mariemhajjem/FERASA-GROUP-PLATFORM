"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type ActionState = { success: boolean; message: string };
export type MovementState = ActionState;

const ok = (message: string): ActionState => ({ success: true, message });
const fail = (message: string): ActionState => ({ success: false, message });

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

function textValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function nullable(value: string) {
  return value || null;
}

function refreshOperations() {
  revalidatePath("/operations");
}

export async function recordStockMovement(
  _previousState: MovementState,
  formData: FormData,
): Promise<MovementState> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return fail("Your session expired. Please log in again.");

  const itemId = textValue(formData, "item_id");
  const warehouseId = textValue(formData, "warehouse_id");
  const movementType = textValue(formData, "movement_type");
  const quantity = Number(formData.get("quantity"));
  const location = textValue(formData, "location");
  const reference = textValue(formData, "reference");
  const notes = textValue(formData, "notes");

  if (!itemId || !warehouseId || !movementType || quantity <= 0) {
    return fail("Complete the item, warehouse, movement and quantity fields.");
  }

  const { error } = await supabase.rpc("record_stock_movement", {
    p_item_id: itemId,
    p_warehouse_id: warehouseId,
    p_movement_type: movementType,
    p_quantity: quantity,
    p_location: nullable(location),
    p_reference: nullable(reference),
    p_notes: nullable(notes),
  });

  if (error) return fail(error.message);
  refreshOperations();
  return ok("Stock movement recorded successfully.");
}

export async function saveItem(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return fail("Your session expired. Please log in again.");

  const id = textValue(formData, "id");
  const sku = textValue(formData, "sku").toUpperCase();
  const description = textValue(formData, "description");
  if (!sku || !description) return fail("SKU and description are required.");

  const payload = {
    sku,
    manufacturer: nullable(textValue(formData, "manufacturer")),
    part_number: nullable(textValue(formData, "part_number")),
    description,
    category: nullable(textValue(formData, "category")),
    subcategory: nullable(textValue(formData, "subcategory")),
    model: nullable(textValue(formData, "model")),
    unit: nullable(textValue(formData, "unit")),
    source_reference: nullable(textValue(formData, "source_reference")),
    public_name: nullable(textValue(formData, "public_name")),
    image_url: nullable(textValue(formData, "image_url")),
    updated_at: new Date().toISOString(),
  };

  const query = id
    ? supabase.from("items").update(payload).eq("id", id)
    : supabase.from("items").insert(payload);
  const { error } = await query;

  if (error) return fail(error.message);
  refreshOperations();
  revalidatePath("/");
  return ok(id ? "Item updated successfully." : "Item created successfully.");
}

export async function setPublicProduct(itemId: string, makePublic: boolean): Promise<ActionState> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return fail("Your session expired. Please log in again.");

  const { error } = await supabase.rpc("set_item_public", {
    p_item_id: itemId,
    p_is_public: makePublic,
  });

  if (error) return fail(error.message);
  refreshOperations();
  revalidatePath("/");
  return ok(makePublic ? "Product published online." : "Product removed from the public website.");
}

export async function saveSupplier(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return fail("Your session expired. Please log in again.");

  const name = textValue(formData, "name");
  if (!name) return fail("Supplier name is required.");
  const splitList = (value: string) => value.split(",").map((entry) => entry.trim()).filter(Boolean);

  const { error } = await supabase.from("suppliers").insert({
    name,
    country: nullable(textValue(formData, "country")),
    city: nullable(textValue(formData, "city")),
    website: nullable(textValue(formData, "website")),
    email: nullable(textValue(formData, "email")),
    phone: nullable(textValue(formData, "phone")),
    brands: splitList(textValue(formData, "brands")),
    categories: splitList(textValue(formData, "categories")),
    notes: nullable(textValue(formData, "notes")),
  });

  if (error) return fail(error.message);
  refreshOperations();
  return ok("Supplier added successfully.");
}

export async function updateRfqStatus(rfqId: string, status: string): Promise<ActionState> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return fail("Your session expired. Please log in again.");

  const { error } = await supabase
    .from("rfqs")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", rfqId);

  if (error) return fail(error.message);
  refreshOperations();
  return ok("RFQ status updated.");
}

export async function saveSourcingRecord(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return fail("Your session expired. Please log in again.");

  const rfqItemId = textValue(formData, "rfq_item_id");
  const supplierId = textValue(formData, "supplier_id");
  if (!rfqItemId || !supplierId) return fail("RFQ item and supplier are required.");

  const rawPrice = textValue(formData, "price");
  const rawLeadTime = textValue(formData, "lead_time_days");
  const { error } = await supabase.from("sourcing_records").insert({
    rfq_item_id: rfqItemId,
    supplier_id: supplierId,
    status: textValue(formData, "status") || "identified",
    supplier_quote_reference: nullable(textValue(formData, "supplier_quote_reference")),
    price: rawPrice ? Number(rawPrice) : null,
    currency: nullable(textValue(formData, "currency").toUpperCase()),
    lead_time_days: rawLeadTime ? Number(rawLeadTime) : null,
    validity_date: nullable(textValue(formData, "validity_date")),
    notes: nullable(textValue(formData, "notes")),
  });

  if (error) return fail(error.message);
  refreshOperations();
  return ok("Sourcing record saved.");
}
