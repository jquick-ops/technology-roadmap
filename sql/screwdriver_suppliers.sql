-- ============================================================
-- Digitool cell — screwdriver component selection
--
-- 1. Extends the suppliers table with the key detail columns the
--    screwdriver comparison needs (tier, torque, verification, mounting,
--    separate controller, price text + price source). These are nullable,
--    so other components are unaffected. Keep in sync with
--    SUPPLIER_DETAIL_FIELDS in src/App.js.
-- 2. Adds the four screwdriver tiers as rows in the suppliers sub-table
--    under the "screwdriver" component (Components section of the app).
--
-- Architecture assumption: fixed actuator on a moveable gantry —
--   inline driver + SEPARATE controller (no cobot quick-change bundle).
--
-- Price source legend:
--   verified      = vendor/reseller-published
--   user-provided = supplied by Jon
--   quote-only    = no published list price (requires RFQ; blank != no data)
--
-- Cannot be applied from the Claude Code web sandbox (Supabase host is
-- outside the network allowlist). Run from the desktop session or paste
-- into the Supabase SQL editor. RLS must permit the insert (the app's
-- "+ Add supplier" button writes to the same table).
-- ============================================================

-- 1. Schema: add key columns (no-op if already present) ------------------
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS tier         text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS torque       text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS verification text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS mounting     text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS controller   text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS price_note   text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS price_source text;

-- 2. Data: the four screwdriver tiers ------------------------------------
-- component_id resolved by name lookup so no hard-coded UUID is needed.
-- Adjust the ILIKE pattern if the screwdriver component is named differently.
INSERT INTO suppliers
  (component_id, name, country, region, status, unit_cost_usd,
   tier, torque, verification, mounting, controller, price_note, price_source, notes)
SELECT c.id, v.name, v.country, v.region, v.status, v.unit_cost_usd,
       v.tier, v.torque, v.verification, v.mounting, v.controller, v.price_note, v.price_source, v.notes
FROM (SELECT id FROM components WHERE name ILIKE '%screwdriver%' LIMIT 1) c
CROSS JOIN (VALUES
  (
    'Delta Regis ESL-XTE', 'USA — Fort Pierce, FL', 'domestic', 'vetted', 4000,
    'Base',
    '0.05–25 Nm (0.44–221 in-lb), 8 models',
    'Transducer, torque-only, closed-loop',
    'Inline body, fixture-clamp',
    'DR-XTC1',
    '~$4,000 (driver)',
    'user-provided',
    'Standard fastening + torque-spec traceability. Transducerized verification, under the $5k/driver target. Price is driver-only — controller (DR-XTC1) is a separate line item.'
  ),
  (
    'Kolver KDS CA (K-Ducer)', 'Italy (US: NH)', 'foreign', 'vetted', 9500,
    'Premium',
    '~0.05–50 Nm (0.4–442.5 in-lb), full series',
    'Transducer, torque + angle, closed-loop',
    'Flange + telescopic spindle (FN), purpose-built',
    'KDU-NT / KDU-1A',
    '~$9,500 (driver)',
    'user-provided',
    'Flight-critical joints OR torque-AND-angle signature logging. The angle channel (catches cross-thread / missing-thread) is the justification, not the brand. Price is driver-only — controller is a separate line item.'
  ),
  (
    'Kilews BSD/SK or Sumake EA-BN', 'Taiwan', 'foreign', 'prospective', NULL,
    'Budget',
    '0.02–4.9 Nm (model-dependent)',
    'Clutch shut-off + optional traceability',
    'Fixtured spindle',
    'Vendor PSU + signal controller',
    '~$1.5–4k (driver+ctrl); MOQ ~10',
    'quote-only',
    'Lowest cost; MOQ ~10. No transducerized verification by default — traceability optional.'
  ),
  (
    'DEPRAG fixtured spindle', 'Germany (US: TX)', 'foreign', 'prospective', NULL,
    'Wide-range',
    '0.008–500 Nm (full line)',
    'Process-controlled, AST sequence',
    'Fixtured / multi-spindle',
    'DEPRAG controller',
    '—',
    'quote-only',
    'Widest torque range; multi-spindle capable. RFQ for pricing.'
  )
) AS v(name, country, region, status, unit_cost_usd,
       tier, torque, verification, mounting, controller, price_note, price_source, notes);

-- Open items to close (require RFQ / spec), not inserted as rows:
--   * Controller pricing for Delta Regis (DR-XTC1) and Kolver (KDU) for true per-station totals.
--   * Digitool drive spec per cell: target torque (Nm), screw sizes, drive points per gantry head.
