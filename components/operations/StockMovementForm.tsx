"use client";
import { useActionState } from "react";
import {
    recordStockMovement,
    type MovementState,
} from "@/app/operations/actions";

type Item = {
    id: string;
    sku: string;
    description: string;
};

type Warehouse = {
    id: string;
    code: string;
    name: string;
};

export function StockMovementForm({
    items,
    warehouses,
}: {
    items: Item[];
    warehouses: Warehouse[];
}) {
    const initialState: MovementState = {
        success: false,
        message: "",
    };

    const [state, formAction, pending] = useActionState(
        recordStockMovement,
        initialState,
    );
    return (
        <section className="movement-card">
            <div className="movement-header">
                <div>
                    <p>STOCK MOVEMENT</p>
                    <h2>Record inventory movement</h2>
                </div>
                <span>Required fields *</span>
            </div>

            <form action={formAction}>
                <label className="item-field">
                    <span>Item *</span>
                    <select name="item_id" required defaultValue="">
                        <option value="" disabled>Select item</option>
                        {items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.sku} — {item.description}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Warehouse *</span>
                    <select name="warehouse_id" required defaultValue="">
                        <option value="" disabled>Select warehouse</option>
                        {warehouses.map((warehouse) => (
                            <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.code} — {warehouse.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Movement *</span>
                    <select name="movement_type" defaultValue="RECEIPT">
                        <option value="RECEIPT">Receipt</option>
                        <option value="DELIVERY">Delivery</option>
                        <option value="RESERVATION">Reservation</option>
                        <option value="RELEASE">Release</option>
                        <option value="RETURN">Return</option>
                    </select>
                </label>

                <label>
                    <span>Quantity *</span>
                    <input
                        name="quantity"
                        type="number"
                        min="1"
                        step="1"
                        defaultValue="1"
                        required
                    />
                </label>

                <label>
                    <span>Location</span>
                    <input name="location" placeholder="TEST-01" />
                </label>

                <label>
                    <span>Reference</span>
                    <input name="reference" placeholder="MR or PO reference" />
                </label>

                <label className="notes-field">
                    <span>Notes</span>
                    <textarea name="notes" rows={2} placeholder="Optional notes" />
                </label>

                <button type="submit" disabled={pending}>
                    {pending ? "Recording..." : "Record movement"}
                </button>

                {state.message && (
                    <p
                        style={{
                            gridColumn: "1 / -1",
                            margin: 0,
                            padding: "12px",
                            background: state.success ? "#e8f7ed" : "#fff0f0",
                            color: state.success ? "#176b35" : "#a71928",
                            fontSize: "12px",
                            fontWeight: 700,
                        }}
                    >
                        {state.message}
                    </p>
                )}
            </form>

            <style jsx>{`
        .movement-card {
          margin-bottom: 20px;
          padding: 24px;
          border: 1px solid #d7dfe3;
          background: white;
        }

        .movement-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .movement-header p {
          margin: 0 0 6px;
          color: #0875a5;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .movement-header h2 {
          margin: 0;
          color: #073a59;
          font-family: Georgia, serif;
          font-size: 28px;
          font-weight: 400;
        }

        .movement-header > span {
          color: #71838d;
          font-size: 10px;
        }

        form {
          display: grid;
          grid-template-columns: 2fr 1.4fr 1fr 0.7fr 1fr 1.3fr;
          gap: 16px;
          align-items: end;
        }

        label {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 7px;
        }

        label > span {
          color: #607580;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #ccd7dc;
          border-radius: 4px;
          outline: none;
          background: #f9fbfb;
          color: #162f3e;
          font: inherit;
        }

        input,
        select {
          height: 42px;
          padding: 0 11px;
        }

        textarea {
          padding: 10px 11px;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #0875a5;
          background: white;
        }

        .notes-field {
          grid-column: 1 / 6;
        }

        button {
          min-height: 42px;
          padding: 11px 18px;
          border: 0;
          border-radius: 4px;
          background: #c72132;
          color: white;
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        button:hover {
          background: #a71928;
        }

        @media (max-width: 1100px) {
          form {
            grid-template-columns: 1fr 1fr;
          }

          .notes-field {
            grid-column: 1 / -1;
          }
        }
      `}</style>
        </section>
    );
}
