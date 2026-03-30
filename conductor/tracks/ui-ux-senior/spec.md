# Specification: UI/UX for Seniors (Mobile-First)

## Overview
Design a mobile-first user interface that caters to users aged 50+, focusing on portrait smartphone usage, visual clarity, large touch targets, and intuitive single-column navigation.

## Goals
- Establish a "Mobile-First" design system (large fonts, large buttons).
- Implement PWA features for an "App-like" feel on mobile phones.
- Use a single-column layout to avoid horizontal scrolling.
- **Supplier Management**: Dedicated interface to maintain a list of active suppliers.
- **Minimized Data Entry**: Replace manual text input with dropdown menus and large +/- buttons for quantities.
- **Interactive Price Trends**: Provide a line chart that is dynamically filterable by rebar size (#3, #4, etc.) to show historical cost trends.
- **Cost-Centric Forms**: High-visibility input fields for "Cost per Ton" during restock entry.

## Acceptance Criteria
- App is fully functional and legible on a standard smartphone screen.
- Minimum tap target size is 48x48 pixels (optimized for 52px+).
- **History View**: Divided into "Inbound" and "Outbound" tabs for clarity.
- **Size-Sync Chart**: Tapping a rebar size button instantly updates the price trend graph.
- **Grouped Records**: Restock history is grouped by English rebar sizes (#3, #4).
- **Monthly Summarization**: Provide a summary view of total inbound/outbound tons and costs per month.
- **One-Click Export**: Implement an export feature to generate PDF or Excel reports for accounting and sharing via mobile (e.g., LINE).
- Bottom navigation is used for primary app sections (Home, Restock, Ship, History, Specs, Suppliers).
