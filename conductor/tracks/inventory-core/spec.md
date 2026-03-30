# Specification: Inventory Core (FIFO)

## Overview
Implement the core logic for tracking restocks and shipments. The system must ensure that shipments deduct stock from the oldest available batches first (FIFO).

## Goals
- Design a database schema that supports batch-level tracking.
- Implement a service layer for recording restocks.
- Implement a service layer for recording shipments with FIFO deduction logic.
- Ensure data integrity (no negative stock).

## Key Components
- **Batches Table**: Records individual incoming restock batches with original and remaining quantity.
- **Shipments Table**: Records outgoing items.
- **Deduction Logic**: A function that finds the oldest batches with remaining stock and reduces their balance.

## Acceptance Criteria
- Successfully record restocks and see them in the database.
- Successfully record shipments and verify that `remaining_quantity` in `Batches` is updated correctly according to FIFO.
- Attempting to ship more than available stock should return an error.
