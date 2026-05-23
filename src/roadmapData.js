// ============================================================
// LAUNCHPAD TECHNOLOGY ROADMAP DATA
// Edit this file to update the roadmap.
//
// startMonth: 0 = Jun 2025, 1 = Jul 2025, etc.
// duration: number of months the item spans
// status: "complete" | "in-progress" | "planned" | "exploring"
//
// KPI FIELDS (all optional — leave out if not applicable):
//   throughput:  units/hour output (Speed)
//   fpy:         first pass yield % (Quality)
//   mtbf:        mean time between failures in hours (Robustness)
//   buildCost:   $ cost to build a system (Price)
//   deployTime:  weeks from contract sign to deployment complete (Dev time)
//
// Use format: { current: "X", target: "Y" }
// OR just a string if only one value is relevant: "95%"
// ============================================================

export const START_DATE = new Date(2025, 5, 1); // June 2025
export const TOTAL_MONTHS = 24;

export const KPI_META = {
  throughput: { label: "Throughput",  unit: "units/hr", icon: "⚡" },
  fpy:        { label: "First Pass Yield", unit: "%",   icon: "✓"  },
  mtbf:       { label: "MTBF",        unit: "hrs",      icon: "◈"  },
  buildCost:  { label: "Build Cost",  unit: "$",        icon: "$"  },
  deployTime: { label: "Deploy Time", unit: "wks",      icon: "⧗"  },
};

export const TRACKS = [
  { id: "hardware", label: "Hardware · Digitool",    color: "#00D4FF" },
  { id: "software", label: "Software · DigiSolvAI",  color: "#7B61FF" },
  { id: "platform", label: "Platform & Infra",        color: "#00E5A0" },
  { id: "gtm",      label: "Go-to-Market",            color: "#FF6B35" },
];

export const MILESTONES = [
  { month: 4,  label: "Series A Close" },
  { month: 12, label: "Series B Raise" },
  { month: 18, label: "Scale Phase" },
];

// ── BOARD VIEW ────────────────────────────────────────────────
export const BOARD_ITEMS = [

  // HARDWARE
  {
    id: "hw-1", track: "hardware", label: "Digitool Gen 1 GA",
    startMonth: 0, duration: 4, status: "complete",
    summary: "General availability of first-gen assembly robot",
    kpis: {
      throughput:  { current: "42",  target: "60"   },
      fpy:         { current: "91",  target: "95"   },
      mtbf:        { current: "800", target: "1200" },
      buildCost:   { current: "185000" },
      deployTime:  { current: "14",  target: "10"  },
    },
  },
  {
    id: "hw-2", track: "hardware", label: "Multi-axis upgrade",
    startMonth: 4, duration: 5, status: "in-progress",
    summary: "Expanded range of motion for complex assembly tasks",
    kpis: {
      throughput:  { current: "42",  target: "58"   },
      fpy:         { current: "91",  target: "94"   },
      mtbf:        { current: "800", target: "1000" },
      buildCost:   { current: "185000", target: "195000" },
      deployTime:  { current: "14",  target: "12"  },
    },
  },
  {
    id: "hw-3", track: "hardware", label: "Digitool Gen 2",
    startMonth: 10, duration: 6, status: "planned",
    summary: "Next-gen hardware — faster, lighter, self-calibrating",
    kpis: {
      throughput:  { target: "80"    },
      fpy:         { target: "97"    },
      mtbf:        { target: "2000"  },
      buildCost:   { target: "160000" },
      deployTime:  { target: "8"     },
    },
  },
  {
    id: "hw-4", track: "hardware", label: "Modular end-effector platform",
    startMonth: 16, duration: 6, status: "planned",
    summary: "Hot-swappable toolheads for rapid line changeovers",
    kpis: {
      throughput:  { target: "90"    },
      deployTime:  { target: "6"     },
      buildCost:   { target: "170000" },
    },
  },

  // SOFTWARE
  {
    id: "sw-1", track: "software", label: "DigiSolvAI v1 — Factory Audit",
    startMonth: 0, duration: 5, status: "complete",
    summary: "AI-powered factory audit product — core GTM wedge at $15K",
    kpis: {
      fpy:         { current: "88",  target: "92"   },
      deployTime:  { current: "16",  target: "12"  },
      buildCost:   { current: "15000" },
    },
  },
  {
    id: "sw-2", track: "software", label: "Predictive maintenance engine",
    startMonth: 5, duration: 5, status: "in-progress",
    summary: "ML-driven failure prediction reducing unplanned downtime",
    kpis: {
      mtbf:        { current: "800", target: "1400" },
      fpy:         { current: "91",  target: "95"   },
    },
  },
  {
    id: "sw-3", track: "software", label: "DigiSolvAI v2 — Vision QC",
    startMonth: 10, duration: 6, status: "planned",
    summary: "Computer vision quality control integrated into robot loop",
    kpis: {
      fpy:         { target: "98"    },
      throughput:  { target: "80"    },
    },
  },
  {
    id: "sw-4", track: "software", label: "Autonomous line orchestration",
    startMonth: 17, duration: 5, status: "exploring",
    summary: "Multi-robot coordination and dynamic task reallocation",
    kpis: {
      throughput:  { target: "120"   },
      fpy:         { target: "98"    },
      deployTime:  { target: "4"     },
    },
  },

  // PLATFORM
  {
    id: "pl-1", track: "platform", label: "Operator Dashboard v1",
    startMonth: 1, duration: 4, status: "complete",
    summary: "iPad-native ROS2/MQTT control interface for Digitool",
    kpis: {
      deployTime:  { current: "8" },
    },
  },
  {
    id: "pl-2", track: "platform", label: "Cloud telemetry pipeline",
    startMonth: 5, duration: 4, status: "in-progress",
    summary: "Real-time fleet data ingestion, storage, and alerting",
    kpis: {
      mtbf:        { current: "800", target: "1400" },
    },
  },
  {
    id: "pl-3", track: "platform", label: "Digital twin (simulation)",
    startMonth: 9, duration: 6, status: "planned",
    summary: "NVIDIA Isaac / Duality Falcon integration for virtual commissioning",
    kpis: {
      deployTime:  { target: "6"  },
      mtbf:        { target: "2000" },
    },
  },
  {
    id: "pl-4", track: "platform", label: "Enterprise API & integrations",
    startMonth: 15, duration: 6, status: "planned",
    summary: "ERP/MES connectors — SAP, Oracle, Plex",
    kpis: {
      deployTime:  { target: "4" },
    },
  },

  // GTM
  {
    id: "gtm-1", track: "gtm", label: "Lockheed Martin expansion",
    startMonth: 0, duration: 6, status: "in-progress",
    summary: "Deepen relationship — new program wins within LM supply chain",
    kpis: {
      throughput:  { current: "42",  target: "60" },
      fpy:         { current: "91",  target: "96" },
      deployTime:  { current: "14",  target: "10" },
    },
  },
  {
    id: "gtm-2", track: "gtm", label: "Yamaha pilot → contract",
    startMonth: 3, duration: 5, status: "in-progress",
    summary: "Convert Yamaha pilot to multi-year production contract",
    kpis: {
      throughput:  { current: "42",  target: "60" },
      fpy:         { current: "88",  target: "95" },
      buildCost:   { current: "185000", target: "175000" },
    },
  },
  {
    id: "gtm-3", track: "gtm", label: "Aerospace vertical launch",
    startMonth: 7, duration: 5, status: "planned",
    summary: "3 new aerospace logos via SkillBridge-sourced talent network",
    kpis: {
      fpy:         { target: "97" },
      mtbf:        { target: "2000" },
      deployTime:  { target: "8"  },
    },
  },
  {
    id: "gtm-4", track: "gtm", label: "Series B fundraise",
    startMonth: 10, duration: 4, status: "planned",
    summary: "Target $25M Series B — B Capital, Squadra Ventures leads",
    kpis: {},
  },
  {
    id: "gtm-5", track: "gtm", label: "International — EU/UK expansion",
    startMonth: 15, duration: 7, status: "exploring",
    summary: "Edinburgh office as EU beachhead — BCG partnership for market entry",
    kpis: {
      deployTime:  { target: "10" },
      buildCost:   { target: "150000" },
    },
  },
];

// ── ENGINEERING VIEW (detail layer) ───────────────────────────
export const ENGINEERING_ITEMS = [

  // Hardware detail
  {
    id: "hw-e1", track: "hardware", label: "Force-torque sensor integration",
    startMonth: 2, duration: 3, status: "complete",
    owner: "Vlad", jira: "HW-142",
    detail: "ATI Axia80 FT sensor → ROS2 wrench topic. Calibration routine automated.",
    kpis: {
      fpy:  { current: "89", target: "93" },
      mtbf: { current: "900" },
    },
  },
  {
    id: "hw-e2", track: "hardware", label: "Collision detection overhaul",
    startMonth: 5, duration: 3, status: "in-progress",
    owner: "Vlad", jira: "HW-198",
    detail: "Replace threshold-based with learned contact model. Target: 2ms response.",
    kpis: {
      mtbf:       { current: "800", target: "1100" },
      throughput: { current: "42",  target: "55"   },
    },
  },
  {
    id: "hw-e3", track: "hardware", label: "Actuator thermal management",
    startMonth: 8, duration: 2, status: "planned",
    owner: "TBD", jira: "HW-220",
    detail: "Passive cooling redesign for sustained 8hr duty cycles.",
    kpis: {
      mtbf: { target: "1500" },
    },
  },

  // Software detail
  {
    id: "sw-e1", track: "software", label: "Audit ML model v2 retrain",
    startMonth: 3, duration: 2, status: "complete",
    owner: "Siobhan Duncan", jira: "SW-88",
    detail: "Retrained on Lockheed floor data. mAP improved 0.71→0.84.",
    kpis: {
      fpy: { current: "88", target: "92" },
    },
  },
  {
    id: "sw-e2", track: "software", label: "Anomaly detection — LSTM",
    startMonth: 5, duration: 4, status: "in-progress",
    owner: "Siobhan Duncan", jira: "SW-112",
    detail: "LSTM sequence model on torque/velocity streams. F1 target: >0.90.",
    kpis: {
      mtbf: { current: "800", target: "1400" },
      fpy:  { current: "91",  target: "95"   },
    },
  },
  {
    id: "sw-e3", track: "software", label: "YOLOv9 QC inference pipeline",
    startMonth: 10, duration: 3, status: "planned",
    owner: "Siobhan Duncan", jira: "SW-145",
    detail: "Edge deployment on Jetson Orin. <40ms latency per frame target.",
    kpis: {
      fpy:        { target: "98" },
      throughput: { target: "80" },
    },
  },

  // Platform detail
  {
    id: "pl-e1", track: "platform", label: "MQTT broker → AWS IoT Core",
    startMonth: 5, duration: 2, status: "in-progress",
    owner: "Dana", jira: "PL-44",
    detail: "Migrate self-hosted Mosquitto to managed AWS IoT. SLA 99.9%.",
    kpis: {
      mtbf: { current: "800", target: "1400" },
    },
  },
  {
    id: "pl-e2", track: "platform", label: "TimescaleDB telemetry store",
    startMonth: 7, duration: 3, status: "planned",
    owner: "Dana", jira: "PL-52",
    detail: "Hypertable schema for 50Hz sensor streams. Retention: 90 days hot.",
    kpis: {
      mtbf: { target: "2000" },
    },
  },
  {
    id: "pl-e3", track: "platform", label: "Isaac Sim environment build",
    startMonth: 9, duration: 4, status: "planned",
    owner: "Vlad", jira: "PL-61",
    detail: "USD-format factory floor scene. Physics validation vs real data.",
    kpis: {
      deployTime: { target: "6" },
    },
  },
];
