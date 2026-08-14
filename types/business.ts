export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "not_recorded";

export type InventoryRecord = {
  itemId: string;
  warehouse?: string;
  location?: string;
  onHand?: number;
  reserved?: number;
  available?: number;
  unit?: string;
  status: StockStatus;
};

export type RfqStatus =
  | "new"
  | "reviewing"
  | "sourcing"
  | "waiting_supplier"
  | "ready_to_quote"
  | "quotation_sent"
  | "won"
  | "lost"
  | "cancelled";

export type SupplierSummary = {
  id: string;
  name: string;
  country?: string;
  city?: string;
  email?: string;
  website?: string;
  brands?: string[];
  categories?: string[];
};
