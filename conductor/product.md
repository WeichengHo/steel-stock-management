# Product Definition: IronStore

## Core Vision
IronStore is a mobile-first, streamlined inventory management system specifically tailored for users aged 50+ in the steel industry. Its primary goal is to record and track incoming rebar inventory with precise **Cost per Ton** (每噸成本) tracking and outgoing shipments using FIFO logic, providing interactive, size-grouped visual price trends for better purchasing decisions.

## Key Features
- **Mobile-Optimized Interface**: Large touch targets, simplified navigation, and high-contrast visuals for smartphone-centric usage.
- **Supplier Management**: Dedicated interface to maintain a list of active steel suppliers for selection during restock.
- **Rebar Specification Management**: Preloaded with CNS 560 standards using "Fen" (分) nomenclature (e.g., 4分筋 #4 D13).
- **Restock with Cost Tracking**: Detailed record-keeping of incoming inventory including supplier, quantity (tons), and **Cost per Ton** (元/噸).
- **FIFO Inventory Deduction**: Automatic stock deduction starting from the oldest batches to ensure accurate inventory valuation.
- **Advanced Analytical History**: 
    - Separate tabs for Inbound (Restock) and Outbound (Shipment) logs.
    - Automatic grouping of restock records by English rebar sizes (#3, #4, etc.).
    - Interactive **Price Trend Charts** that sync with rebar size selections.
    - **One-Click Export**: Ability to export monthly summaries to PDF/Excel for easy sharing and accounting.

## Example Use Case
### Restock (Incoming)
- 2025-02-26: A 鋼鐵廠 delivered 4分筋 (#4 D13) - Qty: 20 Tons at NT$ 21,500/Ton.

### Shipment (Outgoing)
- **Action**: Ship 4分筋 (Qty: 12 Tons).
- **Logic**: Deduct from the oldest available batch first.

## Target Audience
Small to medium-sized businesses or warehouse managers who need a simple way to track their incoming and outgoing stock with accurate FIFO-based valuation and tracking.
