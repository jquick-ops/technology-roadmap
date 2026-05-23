import { useState, useEffect, useCallback } from 'react';
import { db } from './supabase';

// ── Constants ─────────────────────────────────────────────────
const NAV = [
  { id: 'strategy',    label: 'Strategy' },
  { id: 'digitool',    label: 'Digitool' },
  { id: 'components',  label: 'Components' },
  { id: 'functions',   label: 'Functions' },
  { id: 'initiatives', label: 'Initiatives' },
  { id: 'roadmap',     label: 'Roadmap' },
];

const GATE_LABELS = {
  1: 'Deploy reliably',
  2: 'Onboard without visit',
  3: 'AI configures',
  4: 'Prove it',
  5: 'Repeat it',
};

const STATUS_COLORS = {
  'idea':            '#3A4A5E',
  'scoping':         '#7B61FF',
  'in-development':  '#00D4FF',
  'lab-validated':   '#FFB830',
  'field-validated': '#00E5A0',
  'shipped':         '#00E5A0',
  'complete':        '#00E5A0',
  'in-progress':     '#00D4FF',
  'planned':         '#7B61FF',
};

const SCORE_LABELS = ['', 'Low', 'Below avg', 'Average', 'Above avg', 'High'];

// ── Helpers ───────────────────────────────────────────────────
function ScoreDots({ value, max = 5, color = '#00D4FF' }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i < value ? color : '#1E2A3A',
        }} />
      ))}
    </div>
  );
}

function Badge({ text, color = '#3A4A5E' }) {
  return (
    <span style={{
      fontSize: 10, padding: '2px 8px', borderRadius: 10,
      background: color + '22', color, border: `1px solid ${color}44`,
      fontFamily: "'DM Mono', monospace", letterSpacing: 0.4,
      whiteSpace: 'nowrap',
    }}>{text}</span>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#3A5A7A', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{eyebrow}</div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#F0F6FF', letterSpacing: -0.3 }}>{title}</h2>
      {subtitle && <p style={{ margin: '8px 0 0', fontSize: 13, color: '#5A7090', lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#080F18', border: '1px solid #0E1825',
      borderRadius: 8, padding: '16px 20px',
      ...style
    }}>{children}</div>
  );
}

function Loading() {
  return <div style={{ color: '#3A5068', fontSize: 12, fontFamily: "'DM Mono', monospace", padding: '20px 0' }}>Loading...</div>;
}

function ErrorMsg({ msg }) {
  return <div style={{ color: '#FF6B35', fontSize: 12, fontFamily: "'DM Mono', monospace", padding: '12px 0' }}>Error: {msg}</div>;
}

// ── Comments ──────────────────────────────────────────────────
function Comments({ tableName, recordId }) {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    db.query('comments', `?table_name=eq.${tableName}&record_id=eq.${recordId}&order=created_at.asc`)
      .then(setComments).catch(() => {});
  }, [open, tableName, recordId]);

  async function addComment() {
    if (!author.trim() || !body.trim()) return;
    setSaving(true);
    try {
      const [c] = await db.insert('comments', { table_name: tableName, record_id: recordId, author: author.trim(), body: body.trim() });
      setComments(prev => [...prev, c]);
      setBody('');
    } catch (e) {}
    setSaving(false);
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontSize: 10, color: '#3A5068', fontFamily: "'DM Mono', monospace",
        padding: 0, letterSpacing: 0.5,
      }}>
        {open ? '▾' : '▸'} {comments.length || ''} comments
      </button>
      {open && (
        <div style={{ marginTop: 10 }}>
          {comments.map(c => (
            <div key={c.id} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: '2px solid #0E1825' }}>
              <div style={{ fontSize: 10, color: '#3A5068', fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>
                {c.author} · {new Date(c.created_at).toLocaleDateString()}
              </div>
              <div style={{ fontSize: 12, color: '#7A8FA8', lineHeight: 1.5 }}>{c.body}</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name"
              style={{ width: 100, fontSize: 11, padding: '4px 8px', background: '#04080F', border: '1px solid #1E2A3A', borderRadius: 4, color: '#C8D8F0', fontFamily: "'DM Mono', monospace" }} />
            <input value={body} onChange={e => setBody(e.target.value)} placeholder="Add a comment..." onKeyDown={e => e.key === 'Enter' && addComment()}
              style={{ flex: 1, fontSize: 11, padding: '4px 8px', background: '#04080F', border: '1px solid #1E2A3A', borderRadius: 4, color: '#C8D8F0', fontFamily: "'DM Mono', monospace" }} />
            <button onClick={addComment} disabled={saving}
              style={{ fontSize: 11, padding: '4px 10px', background: '#0A1A2E', border: '1px solid #00D4FF44', borderRadius: 4, color: '#00D4FF', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>
              {saving ? '...' : 'Post'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STRATEGY SECTION ──────────────────────────────────────────
function StrategySection() {
  return (
    <div>
      <SectionHeader eyebrow="01 — Strategy" title="Automation exists. Nobody deploys it. We fix that."
        subtitle="Manufacturing automation has been technically possible for decades. The deployment rate is dismal — not because factories don't want it, but because the cost and complexity of implementation has been prohibitive. Launchpad removes that barrier with AI." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'The problem', text: 'System integrators charge by the hour to configure and deploy automation. Projects run into hundreds of thousands before a robot turns a screw. The economics don\'t work for most manufacturers.' },
          { label: 'Our answer', text: 'Use AI to replace the system integrator. The machine configures itself. Every deployment teaches the system — cost amortizes across hundreds of installations while individual project cost approaches zero.' },
          { label: 'The flywheel', text: 'Launchpad absorbs configuration cost internally, deploys faster and cheaper than any SI, and passes savings to the customer. First deployment is expensive. Hundredth is nearly free.' },
          { label: 'The moat', text: 'Every deployment generates data — configurations, outcomes, edge cases. That dataset is impossible to replicate. The more we deploy, the smarter the system, the wider the gap.' },
        ].map(c => (
          <Card key={c.label}>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#3A5068', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 13, color: '#8BAAC8', lineHeight: 1.65 }}>{c.text}</div>
          </Card>
        ))}
      </div>

      <SectionHeader eyebrow="Cost thesis" title="Two cost curves. Both going down." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
        {[
          { phase: 'Near-term', config: 120, bom: 65 },
          { phase: 'Mid-term (12–18 mo)', config: 45, bom: 55 },
          { phase: 'Long-term (24 mo+)', config: 10, bom: 30 },
        ].map(p => (
          <Card key={p.phase}>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#3A5068', marginBottom: 12 }}>{p.phase}</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#5A7090' }}>Configuration</span>
                <span style={{ fontSize: 11, color: '#00D4FF', fontFamily: "'DM Mono', monospace' "}}>${p.config}K</span>
              </div>
              <div style={{ height: 6, background: '#0E1825', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(p.config / 120) * 100}%`, background: '#00D4FF', borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#5A7090' }}>BOM cost</span>
                <span style={{ fontSize: 11, color: '#7B61FF', fontFamily: "'DM Mono', monospace'" }}>${p.bom}K</span>
              </div>
              <div style={{ height: 6, background: '#0E1825', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(p.bom / 65) * 100}%`, background: '#7B61FF', borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: '#F0F6FF', fontFamily: "'DM Mono', monospace'" }}>
              ${p.config + p.bom}K total
            </div>
          </Card>
        ))}
      </div>

      <SectionHeader eyebrow="Where we win" title="Four layers. Two are ours." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { num: '01', title: 'Components', desc: 'Bowl feeders, tray feeders, actuators. Fully commoditized. Our edge is procurement strategy.', magic: false },
          { num: '02', title: 'Actions', desc: 'Pick and place, screwing, gluing. Also commoditized. We execute these well.', magic: false },
          { num: '03', title: 'Vision', desc: 'Computer vision enabling self-configuration. The machine sees the product, understands geometry, executes without hard-coding.', magic: true },
          { num: '04', title: 'Vision-based planning', desc: 'Given a project brief: select components, design the line, sequence actions, plan paths, configure itself. This is the MLM + DigiSolv destination.', magic: true },
        ].map(b => (
          <Card key={b.num} style={{ border: b.magic ? '1px solid #00D4FF33' : '1px solid #0E1825' }}>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#3A5068', marginBottom: 6 }}>Layer {b.num}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F0F6FF', marginBottom: 6 }}>{b.title}</div>
            <div style={{ fontSize: 12, color: '#5A7090', lineHeight: 1.6, marginBottom: 10 }}>{b.desc}</div>
            <Badge text={b.magic ? 'Our differentiator' : 'Commodity'} color={b.magic ? '#00D4FF' : '#3A5068'} />
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── DIGITOOL SECTION ──────────────────────────────────────────
function DigitoolSection() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    db.query('digitool_versions', '?order=version.asc')
      .then(setVersions).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const v = versions[active];

  return (
    <div>
      <SectionHeader eyebrow="02 — Digitool platform" title="V0 to V3 — the north star"
        subtitle="The customer relationship transforms across four versions. Bespoke effort per deployment drops from ~95% to under 20%." />

      <div style={{ display: 'flex', gap: 0, marginBottom: 24, border: '1px solid #0E1825', borderRadius: 8, overflow: 'hidden' }}>
        {versions.map((ver, i) => (
          <button key={ver.id} onClick={() => setActive(i)} style={{
            flex: 1, padding: '14px 12px', cursor: 'pointer', textAlign: 'left',
            background: active === i ? '#0A1A2E' : '#04080F',
            border: 'none', borderRight: i < versions.length - 1 ? '1px solid #0E1825' : 'none',
            transition: 'background 0.15s',
          }}>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: active === i ? '#00D4FF' : '#3A5068', marginBottom: 4 }}>{ver.version.toUpperCase()}</div>
            <div style={{ fontSize: 12, color: active === i ? '#F0F6FF' : '#5A7090', fontWeight: 600, marginBottom: 4 }}>{ver.bespoke_pct}%</div>
            <div style={{ fontSize: 10, color: '#3A5068' }}>bespoke</div>
          </button>
        ))}
      </div>

      {v && (
        <Card style={{ border: '1px solid #00D4FF22' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#00D4FF', marginBottom: 4 }}>{v.version.toUpperCase()} · {new Date(v.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#F0F6FF' }}>{v.title}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#00D4FF', fontFamily: "'DM Mono', monospace" }}>~{v.bespoke_pct}%</div>
              <div style={{ fontSize: 10, color: '#3A5068' }}>bespoke per deployment</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#5A7090', lineHeight: 1.6, marginBottom: 16 }}>{v.description}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(v.capabilities || []).map((cap, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00D4FF', marginTop: 6, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: '#7A8FA8', lineHeight: 1.5 }}>{cap}</div>
              </div>
            ))}
          </div>
          <Comments tableName="digitool_versions" recordId={v.id} />
        </Card>
      )}

      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#3A5068', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Progress</div>
        <div style={{ position: 'relative', height: 6, background: '#0E1825', borderRadius: 3, marginBottom: 6 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${active * 33.3}%`, background: 'linear-gradient(90deg, #00D4FF, #7B61FF)', borderRadius: 3, transition: 'width 0.4s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {versions.map((ver, i) => (
            <div key={ver.id} style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: i <= active ? '#00D4FF' : '#3A5068' }}>{ver.version.toUpperCase()}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTS SECTION ────────────────────────────────────────
function ComponentsSection() {
  const [components, setComponents] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [addingSupplier, setAddingSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', country: '', region: 'foreign', status: 'prospective', unit_cost_usd: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      db.query('components', '?order=strategic_importance.desc'),
      db.query('suppliers', '?order=created_at.asc'),
    ]).then(([c, s]) => { setComponents(c); setSuppliers(s); setSelected(c[0]?.id || null); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function saveSupplier() {
    if (!newSupplier.name.trim() || !selected) return;
    setSaving(true);
    try {
      const [s] = await db.insert('suppliers', { ...newSupplier, component_id: selected, unit_cost_usd: newSupplier.unit_cost_usd ? parseFloat(newSupplier.unit_cost_usd) : null });
      setSuppliers(prev => [...prev, s]);
      setNewSupplier({ name: '', country: '', region: 'foreign', status: 'prospective', unit_cost_usd: '', notes: '' });
      setAddingSupplier(false);
    } catch (e) {}
    setSaving(false);
  }

  if (loading) return <Loading />;

  const comp = components.find(c => c.id === selected);
  const compSuppliers = suppliers.filter(s => s.component_id === selected);

  return (
    <div>
      <SectionHeader eyebrow="03 — Components" title="Supplier intelligence"
        subtitle="For each component: how differentiated can we make it, what's the cost gap, how strategically important is it. Make vs. buy decision driven by these scores." />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {components.map(c => (
            <button key={c.id} onClick={() => setSelected(c.id)} style={{
              padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
              background: selected === c.id ? '#0A1A2E' : 'transparent',
              border: `1px solid ${selected === c.id ? '#00D4FF44' : '#0E1825'}`,
              borderRadius: 6, transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 12, color: selected === c.id ? '#F0F6FF' : '#7A8FA8', fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Badge text={c.make_or_buy || 'tbd'} color={c.make_or_buy === 'make' ? '#00E5A0' : c.make_or_buy === 'buy' ? '#7B61FF' : '#FF6B35'} />
                <ScoreDots value={c.strategic_importance || 0} color="#00D4FF" />
              </div>
            </button>
          ))}
        </div>

        {comp && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F0F6FF', marginBottom: 6 }}>{comp.name}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Badge text={comp.category || 'uncategorized'} color="#3A5068" />
                    <Badge text={comp.make_or_buy || 'tbd'} color={comp.make_or_buy === 'make' ? '#00E5A0' : comp.make_or_buy === 'buy' ? '#7B61FF' : '#FF6B35'} />
                  </div>
                </div>
                {comp.current_cost_usd && comp.target_cost_usd && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#3A5068', fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>Cost</div>
                    <div style={{ fontSize: 13, color: '#5A7090', fontFamily: "'DM Mono', monospace" }}>${comp.current_cost_usd.toLocaleString()} → <span style={{ color: '#00D4FF' }}>${comp.target_cost_usd.toLocaleString()}</span></div>
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Strategic importance', value: comp.strategic_importance, color: '#00D4FF' },
                  { label: 'Differentiation potential', value: comp.differentiation_score, color: '#7B61FF' },
                  { label: 'Cost gap', value: comp.cost_gap_score, color: '#FF6B35' },
                ].map(m => (
                  <div key={m.label} style={{ background: '#04080F', borderRadius: 6, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: '#3A5068', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>{m.label}</div>
                    <ScoreDots value={m.value || 0} color={m.color} />
                    <div style={{ fontSize: 11, color: m.color, marginTop: 4 }}>{SCORE_LABELS[m.value || 0]}</div>
                  </div>
                ))}
              </div>
              {comp.notes && <div style={{ marginTop: 12, fontSize: 12, color: '#5A7090', lineHeight: 1.6 }}>{comp.notes}</div>}
              <Comments tableName="components" recordId={comp.id} />
            </Card>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#3A5068', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', letterSpacing: 0.8 }}>Suppliers ({compSuppliers.length})</div>
              <button onClick={() => setAddingSupplier(!addingSupplier)} style={{
                fontSize: 11, padding: '4px 12px', background: 'transparent',
                border: '1px solid #1E2A3A', borderRadius: 4, cursor: 'pointer',
                color: '#3A5068', fontFamily: "'DM Mono', monospace",
              }}>+ Add supplier</button>
            </div>

            {addingSupplier && (
              <Card style={{ marginBottom: 12, border: '1px solid #1E2A3A' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  {[
                    { key: 'name', placeholder: 'Supplier name *', full: true },
                    { key: 'country', placeholder: 'Country' },
                    { key: 'unit_cost_usd', placeholder: 'Unit cost (USD)' },
                    { key: 'contact_name', placeholder: 'Contact name' },
                    { key: 'website', placeholder: 'Website' },
                  ].map(f => (
                    <input key={f.key} value={newSupplier[f.key] || ''} onChange={e => setNewSupplier(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ gridColumn: f.full ? '1 / -1' : undefined, fontSize: 11, padding: '6px 10px', background: '#04080F', border: '1px solid #1E2A3A', borderRadius: 4, color: '#C8D8F0', fontFamily: "'DM Mono', monospace" }} />
                  ))}
                  <select value={newSupplier.region} onChange={e => setNewSupplier(p => ({ ...p, region: e.target.value }))}
                    style={{ fontSize: 11, padding: '6px 10px', background: '#04080F', border: '1px solid #1E2A3A', borderRadius: 4, color: '#C8D8F0', fontFamily: "'DM Mono', monospace" }}>
                    <option value="domestic">Domestic</option>
                    <option value="foreign">Foreign</option>
                    <option value="tbd">TBD</option>
                  </select>
                  <select value={newSupplier.status} onChange={e => setNewSupplier(p => ({ ...p, status: e.target.value }))}
                    style={{ fontSize: 11, padding: '6px 10px', background: '#04080F', border: '1px solid #1E2A3A', borderRadius: 4, color: '#C8D8F0', fontFamily: "'DM Mono', monospace" }}>
                    <option value="current">Current</option>
                    <option value="prospective">Prospective</option>
                    <option value="vetted">Vetted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <textarea value={newSupplier.notes} onChange={e => setNewSupplier(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Notes" rows={2}
                    style={{ gridColumn: '1 / -1', fontSize: 11, padding: '6px 10px', background: '#04080F', border: '1px solid #1E2A3A', borderRadius: 4, color: '#C8D8F0', fontFamily: "'DM Mono', monospace", resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={saveSupplier} disabled={saving}
                    style={{ fontSize: 11, padding: '6px 14px', background: '#0A1A2E', border: '1px solid #00D4FF44', borderRadius: 4, color: '#00D4FF', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>
                    {saving ? 'Saving...' : 'Save supplier'}
                  </button>
                  <button onClick={() => setAddingSupplier(false)}
                    style={{ fontSize: 11, padding: '6px 14px', background: 'transparent', border: '1px solid #1E2A3A', borderRadius: 4, color: '#3A5068', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>
                    Cancel
                  </button>
                </div>
              </Card>
            )}

            {compSuppliers.length === 0 ? (
              <div style={{ fontSize: 12, color: '#3A5068', fontFamily: "'DM Mono', monospace", padding: '12px 0' }}>No suppliers added yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {compSuppliers.map(s => (
                  <Card key={s.id} style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 4 }}>{s.name}</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {s.country && <Badge text={s.country} color="#3A5068" />}
                          <Badge text={s.region || 'tbd'} color={s.region === 'domestic' ? '#00E5A0' : '#7B61FF'} />
                          <Badge text={s.status || 'tbd'} color={STATUS_COLORS[s.status] || '#3A5068'} />
                        </div>
                      </div>
                      {s.unit_cost_usd && (
                        <div style={{ fontSize: 13, color: '#00D4FF', fontFamily: "'DM Mono', monospace" }}>${s.unit_cost_usd.toLocaleString()}</div>
                      )}
                    </div>
                    {s.notes && <div style={{ marginTop: 8, fontSize: 12, color: '#5A7090' }}>{s.notes}</div>}
                    <Comments tableName="suppliers" recordId={s.id} />
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── FUNCTIONS SECTION ─────────────────────────────────────────
function FunctionsSection() {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    db.query('functions', '?order=core_to_offering.desc')
      .then(d => { setFunctions(d); setSelected(d[0]?.id || null); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  const fn = functions.find(f => f.id === selected);

  return (
    <div>
      <SectionHeader eyebrow="04 — Functions" title="What we do — and what we could do"
        subtitle="Each assembly function scored by market size, how core it is to our offering, customer overlap, and technical delta from current capabilities." />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {functions.map(f => (
            <button key={f.id} onClick={() => setSelected(f.id)} style={{
              padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
              background: selected === f.id ? '#0A1A2E' : 'transparent',
              border: `1px solid ${selected === f.id ? '#00D4FF44' : '#0E1825'}`,
              borderRadius: 6, transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 12, color: selected === f.id ? '#F0F6FF' : '#7A8FA8', fontWeight: 600, marginBottom: 4 }}>{f.name}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Badge text={f.current_capability || 'none'} color={f.current_capability === 'full' ? '#00E5A0' : f.current_capability === 'partial' ? '#FFB830' : '#3A5068'} />
              </div>
            </button>
          ))}
        </div>

        {fn && (
          <Card style={{ border: '1px solid #0E1825' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F0F6FF', marginBottom: 6 }}>{fn.name}</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              <Badge text={`capability: ${fn.current_capability || 'none'}`} color={fn.current_capability === 'full' ? '#00E5A0' : fn.current_capability === 'partial' ? '#FFB830' : '#3A5068'} />
              {fn.priority_score && <Badge text={`priority score: ${parseFloat(fn.priority_score).toFixed(1)}`} color="#00D4FF" />}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Market size', value: fn.market_size_score, color: '#00D4FF' },
                { label: 'Core to offering', value: fn.core_to_offering, color: '#00E5A0' },
                { label: 'Customer overlap', value: fn.customer_overlap, color: '#7B61FF' },
                { label: 'Technical delta', value: fn.technical_delta, color: '#FF6B35', invert: true },
              ].map(m => (
                <div key={m.label} style={{ background: '#04080F', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, color: '#3A5068', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>
                    {m.label} {m.invert ? '(lower = easier)' : ''}
                  </div>
                  <ScoreDots value={m.value || 0} color={m.color} />
                  <div style={{ fontSize: 11, color: m.color, marginTop: 4 }}>{SCORE_LABELS[m.value || 0]}</div>
                </div>
              ))}
            </div>

            {fn.hardware_requirements && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: '#3A5068', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Hardware required</div>
                <div style={{ fontSize: 12, color: '#5A7090', lineHeight: 1.6 }}>{fn.hardware_requirements}</div>
              </div>
            )}
            {fn.software_requirements && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: '#3A5068', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Software required</div>
                <div style={{ fontSize: 12, color: '#5A7090', lineHeight: 1.6 }}>{fn.software_requirements}</div>
              </div>
            )}
            <Comments tableName="functions" recordId={fn.id} />
          </Card>
        )}
      </div>
    </div>
  );
}

// ── INITIATIVES SECTION ───────────────────────────────────────
function InitiativesSection() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGate, setActiveGate] = useState(1);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    db.query('planning_initiatives', '?order=gate.asc,priority.desc')
      .then(setInitiatives).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    setUpdating(id);
    try {
      await db.update('planning_initiatives', id, { status });
      setInitiatives(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch (e) {}
    setUpdating(null);
  }

  if (loading) return <Loading />;

  const gateInitiatives = initiatives.filter(i => i.gate === activeGate);
  const gates = [1, 2, 3, 4, 5];

  return (
    <div>
      <SectionHeader eyebrow="05 — Initiatives" title="Critical path to scalable sales"
        subtitle="Five gates. Everything maps to a gate. If it doesn't move a gate forward, it doesn't get resourced." />

      <div style={{ display: 'flex', gap: 0, marginBottom: 24, border: '1px solid #0E1825', borderRadius: 8, overflow: 'hidden' }}>
        {gates.map(g => {
          const gInits = initiatives.filter(i => i.gate === g);
          const done = gInits.filter(i => i.status === 'field-validated' || i.status === 'shipped').length;
          return (
            <button key={g} onClick={() => setActiveGate(g)} style={{
              flex: 1, padding: '12px 8px', cursor: 'pointer', textAlign: 'left',
              background: activeGate === g ? '#0A1A2E' : '#04080F',
              border: 'none', borderRight: g < 5 ? '1px solid #0E1825' : 'none',
            }}>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: activeGate === g ? '#00D4FF' : '#3A5068', marginBottom: 4 }}>Gate {g}</div>
              <div style={{ fontSize: 11, color: activeGate === g ? '#F0F6FF' : '#5A7090', lineHeight: 1.4, marginBottom: 6 }}>{GATE_LABELS[g]}</div>
              <div style={{ fontSize: 10, color: '#3A5068', fontFamily: "'DM Mono', monospace" }}>{done}/{gInits.length} done</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {gateInitiatives.length === 0 && (
          <div style={{ fontSize: 12, color: '#3A5068', fontFamily: "'DM Mono', monospace" }}>No initiatives for this gate yet.</div>
        )}
        {gateInitiatives.map(init => (
          <Card key={init.id} style={{ border: `1px solid ${STATUS_COLORS[init.status] || '#0E1825'}22` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F0F6FF', marginBottom: 6 }}>{init.name}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Badge text={init.status || 'idea'} color={STATUS_COLORS[init.status] || '#3A5068'} />
                  {init.scope && <Badge text={init.scope} color="#3A5068" />}
                  {init.owner && <Badge text={init.owner} color="#5A7090" />}
                  {init.vision_dependency && init.vision_dependency !== 'none' && <Badge text={`vision: ${init.vision_dependency}`} color="#7B61FF" />}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#3A5068', fontFamily: "'DM Mono', monospace", marginBottom: 4, textAlign: 'right' }}>Priority</div>
                  <ScoreDots value={init.priority || 0} color="#FF6B35" />
                </div>
              </div>
            </div>
            {init.description && <div style={{ fontSize: 12, color: '#5A7090', lineHeight: 1.6, marginBottom: 10 }}>{init.description}</div>}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {['idea','scoping','in-development','lab-validated','field-validated'].map(s => (
                <button key={s} onClick={() => updateStatus(init.id, s)} disabled={updating === init.id}
                  style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                    background: init.status === s ? STATUS_COLORS[s] + '33' : 'transparent',
                    border: `1px solid ${init.status === s ? STATUS_COLORS[s] : '#1E2A3A'}`,
                    color: init.status === s ? STATUS_COLORS[s] : '#3A5068',
                    fontFamily: "'DM Mono', monospace",
                    transition: 'all 0.15s',
                  }}>
                  {s}
                </button>
              ))}
            </div>
            <Comments tableName="planning_initiatives" recordId={init.id} />
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── ROADMAP SECTION ───────────────────────────────────────────
function RoadmapSection() {
  const TRACKS = [
    { id: 'hardware', label: 'Hardware', sub: 'Digitool', color: '#00D4FF' },
    { id: 'software', label: 'Software', sub: 'DigiSolvAI', color: '#7B61FF' },
    { id: 'platform', label: 'Platform', sub: 'Infra', color: '#00E5A0' },
    { id: 'gtm', label: 'Go-to-Market', sub: '', color: '#FF6B35' },
  ];

  const ITEMS = [
    { track: 'hardware', label: 'Digitool Gen 1 GA', start: 0, dur: 4, status: 'complete' },
    { track: 'hardware', label: 'Multi-axis upgrade', start: 4, dur: 5, status: 'in-progress' },
    { track: 'hardware', label: 'Digitool Gen 2', start: 10, dur: 6, status: 'planned' },
    { track: 'hardware', label: 'Modular end-effector', start: 16, dur: 6, status: 'planned' },
    { track: 'software', label: 'DigiSolvAI v1 — Audit', start: 0, dur: 5, status: 'complete' },
    { track: 'software', label: 'Predictive maintenance', start: 5, dur: 5, status: 'in-progress' },
    { track: 'software', label: 'DigiSolvAI v2 — Vision QC', start: 10, dur: 6, status: 'planned' },
    { track: 'software', label: 'Autonomous orchestration', start: 17, dur: 5, status: 'exploring' },
    { track: 'platform', label: 'Operator Dashboard v1', start: 1, dur: 4, status: 'complete' },
    { track: 'platform', label: 'Cloud telemetry pipeline', start: 5, dur: 4, status: 'in-progress' },
    { track: 'platform', label: 'Digital twin', start: 9, dur: 6, status: 'planned' },
    { track: 'platform', label: 'Enterprise API', start: 15, dur: 6, status: 'planned' },
    { track: 'gtm', label: 'Lockheed expansion', start: 0, dur: 6, status: 'in-progress' },
    { track: 'gtm', label: 'Yamaha pilot → contract', start: 3, dur: 5, status: 'in-progress' },
    { track: 'gtm', label: 'Aerospace vertical', start: 7, dur: 5, status: 'planned' },
    { track: 'gtm', label: 'Series B fundraise', start: 10, dur: 4, status: 'planned' },
    { track: 'gtm', label: 'EU/UK expansion', start: 15, dur: 7, status: 'exploring' },
  ];

  const STATUS_META = {
    complete:    { border: '#00E5A0', bg: '#0A2218', dot: '#00E5A0' },
    'in-progress': { border: '#00D4FF', bg: '#0A1A2E', dot: '#00D4FF' },
    planned:     { border: '#7B61FF', bg: '#12102A', dot: '#7B61FF' },
    exploring:   { border: '#FF6B35', bg: '#1A120A', dot: '#FF6B35' },
  };

  const TOTAL = 24;
  const COL = 36;
  const today = new Date();
  const START = new Date(2025, 5, 1);
  const todayOff = Math.max(0, Math.min((today.getFullYear() - START.getFullYear()) * 12 + (today.getMonth() - START.getMonth()), TOTAL - 1));

  function monthLabel(m) {
    const d = new Date(START); d.setMonth(d.getMonth() + m);
    return d.toLocaleString('default', { month: 'short', year: '2-digit' });
  }

  return (
    <div>
      <SectionHeader eyebrow="06 — Roadmap" title="24-month execution plan"
        subtitle="Four tracks. Every item tied to strategy. Hover for detail." />
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 160 + TOTAL * COL }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #0E1825', marginBottom: 0 }}>
            <div style={{ width: 160, flexShrink: 0, position: 'sticky', left: 0, background: '#04080F', zIndex: 10, borderRight: '1px solid #0E1825' }} />
            <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
              {Array.from({ length: TOTAL }, (_, i) => (
                <div key={i} style={{ width: COL, flexShrink: 0, height: 32, borderLeft: i % 3 === 0 ? '1px solid #1E2A3A' : 'none', display: 'flex', alignItems: 'center', paddingLeft: 4 }}>
                  {i % 3 === 0 && <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: i % 12 === 0 ? '#4A7A9A' : '#2A3A4E', whiteSpace: 'nowrap' }}>{monthLabel(i)}</span>}
                </div>
              ))}
              <div style={{ position: 'absolute', left: todayOff * COL + COL / 2, top: 0, bottom: 0, width: 1, background: '#FF6B35', opacity: 0.8 }}>
                <div style={{ position: 'absolute', top: 2, left: -14, fontSize: 8, fontFamily: "'DM Mono', monospace", color: '#FF6B35' }}>TODAY</div>
              </div>
            </div>
          </div>

          {TRACKS.map(track => (
            <div key={track.id} style={{ display: 'flex', borderBottom: '1px solid #0E1825' }}>
              <div style={{ width: 160, flexShrink: 0, position: 'sticky', left: 0, background: '#04080F', zIndex: 10, borderRight: `2px solid ${track.color}22`, padding: '0 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 64 }}>
                <div style={{ width: 3, height: 20, background: track.color, borderRadius: 2, marginBottom: 3 }} />
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.6, color: track.color, textTransform: 'uppercase' }}>{track.label}</div>
                {track.sub && <div style={{ fontSize: 9, color: '#3A4A5E', fontFamily: "'DM Mono', monospace" }}>{track.sub}</div>}
              </div>
              <div style={{ position: 'relative', flex: 1, height: 64 }}>
                {ITEMS.filter(i => i.track === track.id).map((item, idx) => {
                  const sm = STATUS_META[item.status] || STATUS_META.planned;
                  return (
                    <div key={idx} title={item.label} style={{
                      position: 'absolute',
                      left: item.start * COL, top: '20%',
                      width: Math.max(item.dur * COL - 4, 20), height: '55%',
                      background: sm.bg, border: `1px solid ${sm.border}`,
                      borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 8,
                      overflow: 'hidden', cursor: 'default',
                    }}>
                      <span style={{ fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 600, color: '#C8D8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        {Object.entries({ complete: '#00E5A0', 'in-progress': '#00D4FF', planned: '#7B61FF', exploring: '#FF6B35' }).map(([k, c]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
            <span style={{ fontSize: 10, color: '#4A6078', fontFamily: "'DM Mono', monospace" }}>{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState('strategy');

  const sections = {
    strategy:    <StrategySection />,
    digitool:    <DigitoolSection />,
    components:  <ComponentsSection />,
    functions:   <FunctionsSection />,
    initiatives: <InitiativesSection />,
    roadmap:     <RoadmapSection />,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#04080F' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#04080F', borderBottom: '1px solid #0E1825' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 5, background: '#00D4FF22', border: '1px solid #00D4FF44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: '#00D4FF' }} />
            </div>
            <span style={{ fontSize: 11, letterSpacing: 2, color: '#3A5A7A', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase' }}>Launchpad.build</span>
            <span style={{ fontSize: 11, color: '#1E2A3A', margin: '0 4px' }}>·</span>
            <span style={{ fontSize: 11, color: '#3A5068', fontFamily: "'DM Mono', monospace" }}>Technology Platform</span>
          </div>
          <nav style={{ display: 'flex', gap: 2 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setActive(n.id)} style={{
                padding: '6px 14px', fontSize: 11, cursor: 'pointer',
                background: active === n.id ? '#0A1A2E' : 'transparent',
                border: `1px solid ${active === n.id ? '#00D4FF44' : 'transparent'}`,
                borderRadius: 6, color: active === n.id ? '#00D4FF' : '#4A6078',
                fontFamily: "'DM Mono', monospace", transition: 'all 0.15s',
              }}>{n.label}</button>
            ))}
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 80px' }}>
        {sections[active]}
      </div>

      <div style={{ borderTop: '1px solid #0E1825', padding: '16px 32px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: '#2A3A4E', fontFamily: "'DM Mono', monospace" }}>Launchpad.build · Confidential · {new Date().getFullYear()}</span>
        <span style={{ fontSize: 10, color: '#2A3A4E', fontFamily: "'DM Mono', monospace" }}>El Segundo, CA · Edinburgh, Scotland</span>
      </div>
    </div>
  );
}
