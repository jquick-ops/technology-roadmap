-- ============================================================
-- Digitool cell — screwdriver component selection
-- Adds the four screwdriver tiers to the suppliers sub-table under
-- the "screwdriver" component (Components section of the roadmap app).
--
-- Architecture assumption: fixed actuator on a moveable gantry —
--   inline driver + SEPARATE controller (no cobot quick-change bundle).
--
-- Price legend (carried in notes):
--   verified      = vendor/reseller-published
--   user-provided = supplied by Jon
--   quote-only    = no published list price (requires RFQ; blank != no data)
--
-- Cannot be applied from the Claude Code web sandbox (Supabase host is
-- outside the network allowlist). Run this from the desktop session or
-- paste it into the Supabase SQL editor. RLS must permit the insert
-- (the app's "+ Add supplier" button writes to the same table).
--
-- component_id is resolved by name lookup so no hard-coded UUID is needed.
-- Adjust the ILIKE pattern if the screwdriver component is named differently.
-- ============================================================

INSERT INTO suppliers (component_id, name, country, region, status, unit_cost_usd, notes)
SELECT c.id, v.name, v.country, v.region, v.status, v.unit_cost_usd, v.notes
FROM (SELECT id FROM components WHERE name ILIKE '%screwdriver%' LIMIT 1) c
CROSS JOIN (VALUES
  -- tier | name | country | region | status | unit_cost_usd | notes
  (
    'Delta Regis ESL-XTE',
    'USA — Fort Pierce, FL',
    'domestic',
    'vetted',
    4000,
    'BASE tier. Transducerized, torque-only, closed-loop verification. '
    || 'Torque 0.05-25 Nm (0.44-221 in-lb), 8 models. '
    || 'Mounting: inline body, fixture-clamp. '
    || 'Separate controller: DR-XTC1 (line item not included in driver price). '
    || 'Price ~$4,000 driver-only [user-provided]. '
    || 'Selection: standard fastening + torque-spec traceability; under the $5k/driver target.'
  ),
  (
    'Kolver KDS CA (K-Ducer)',
    'Italy (US: NH)',
    'foreign',
    'vetted',
    9500,
    'PREMIUM tier. Transducerized, TORQUE + ANGLE, closed-loop verification. '
    || 'Torque ~0.05-50 Nm (0.4-442.5 in-lb), full series. '
    || 'Mounting: flange + telescopic spindle (FN), purpose-built. '
    || 'Separate controller: KDU-NT / KDU-1A (line item not included in driver price). '
    || 'Price ~$9,500 driver-only [user-provided]. '
    || 'Selection: flight-critical joints or torque-AND-angle signature logging. '
    || 'The angle channel (catches cross-thread / missing-thread) is the justification, not the brand.'
  ),
  (
    'Kilews BSD/SK or Sumake EA-BN',
    'Taiwan',
    'foreign',
    'prospective',
    NULL,
    'BUDGET tier. Clutch shut-off + optional traceability. '
    || 'Torque 0.02-4.9 Nm (model-dependent). '
    || 'Mounting: fixtured spindle. '
    || 'Controller: vendor PSU + signal controller. '
    || 'Price ~$1.5-4k (driver+ctrl); MOQ ~10 [quote-only].'
  ),
  (
    'DEPRAG fixtured spindle',
    'Germany (US: TX)',
    'foreign',
    'prospective',
    NULL,
    'WIDE-RANGE tier. Process-controlled, AST sequence. '
    || 'Torque 0.008-500 Nm (full line). '
    || 'Mounting: fixtured / multi-spindle. '
    || 'Controller: DEPRAG controller. '
    || 'Price: RFQ [quote-only].'
  )
) AS v(name, country, region, status, unit_cost_usd, notes);

-- Open items to close (require RFQ / spec), not inserted as rows:
--   * Controller pricing for Delta Regis (DR-XTC1) and Kolver (KDU) for true per-station totals.
--   * Digitool drive spec per cell: target torque (Nm), screw sizes, drive points per gantry head.
