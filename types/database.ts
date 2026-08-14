export type DbItem = {
  id: string;
  sku: string;
  manufacturer: string | null;
  part_number: string | null;
  description: string;
  category: string | null;
  subcategory: string | null;
  model: string | null;
  unit: string | null;
  source_reference: string | null;
  active?: boolean;
  public_name: string | null;
  image_url: string | null;
  is_public: boolean;
  public_position: number | null;
  created_at: string;
  updated_at: string;
};

export type DbWarehouse = {
  id: string;
  code: string;
  name: string;
};

export type DbInventory = {
  item_id: string;
  warehouse_id?: string | null;
  warehouse_name?: string | null;
  warehouse_code?: string | null;
  location_code?: string | null;
  on_hand?: number | string | null;
  reserved?: number | string | null;
  available?: number | string | null;
};

export type StockMovementHistory = {
  id: string;
  item_id: string;
  sku: string;
  item_description: string;
  warehouse_id: string;
  warehouse_code: string;
  warehouse_name: string;
  movement_type: string;
  quantity: number | string;
  created_at: string;
};

export type Supplier = {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  brands: string[];
  categories: string[];
  notes: string | null;
  active: boolean;
  created_at: string;
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

export type Rfq = {
  id: string;
  rfq_number: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  delivery_location: string | null;
  required_date: string | null;
  status: RfqStatus;
  notes: string | null;
  received_at: string;
};

export type RfqItem = {
  id: string;
  rfq_id: string;
  line_number: number;
  manufacturer: string | null;
  part_number: string | null;
  description: string;
  quantity: number | string;
  unit: string | null;
};

export type SourcingRecord = {
  id: string;
  rfq_item_id: string;
  supplier_id: string;
  status: string;
  supplier_quote_reference: string | null;
  price: number | string | null;
  currency: string | null;
  lead_time_days: number | null;
  validity_date: string | null;
  notes: string | null;
  created_at: string;
};
