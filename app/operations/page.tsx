import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OperationsDashboard } from "@/components/operations/OperationsDashboard";

export default async function OperationsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    itemsResult,
    inventoryResult,
    warehousesResult,
    movementsResult,
    suppliersResult,
    rfqsResult,
    rfqItemsResult,
    sourcingResult,
  ] = await Promise.all([
    supabase.from("items").select("*").order("created_at", { ascending: false }),
    supabase.from("inventory_status").select("*"),
    supabase.from("warehouses").select("id, code, name").eq("active", true).order("code"),
    supabase.from("stock_movement_history").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("suppliers").select("*").order("name"),
    supabase.from("rfqs").select("*").order("received_at", { ascending: false }).limit(100),
    supabase.from("rfq_items").select("*").order("line_number"),
    supabase.from("sourcing_records").select("*").order("created_at", { ascending: false }).limit(200),
  ]);

  const results = {
    items: itemsResult,
    inventory: inventoryResult,
    warehouses: warehousesResult,
    movements: movementsResult,
    suppliers: suppliersResult,
    rfqs: rfqsResult,
    rfqItems: rfqItemsResult,
    sourcing: sourcingResult,
  };

  Object.entries(results).forEach(([name, result]) => {
    if (result.error) console.error(`${name.toUpperCase()}:`, result.error);
  });

  return (
    <OperationsDashboard
      dbItems={itemsResult.data ?? []}
      dbInventory={inventoryResult.data ?? []}
      dbWarehouses={warehousesResult.data ?? []}
      dbMovements={movementsResult.data ?? []}
      dbSuppliers={suppliersResult.data ?? []}
      dbRfqs={rfqsResult.data ?? []}
      dbRfqItems={rfqItemsResult.data ?? []}
      dbSourcing={sourcingResult.data ?? []}
    />
  );
}
