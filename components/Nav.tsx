type Tab = 'hoy' | 'kcal' | 'peso' | 'reto' | 'reporte';

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'hoy', icon: '🔥', label: 'HOY' },
  { id: 'kcal', icon: '🍽️', label: 'KCAL' },
  { id: 'peso', icon: '⚖️', label: 'PESO' },
  { id: 'reto', icon: '✅', label: 'RETO' },
  { id: 'reporte', icon: '📋', label: 'REPORTE' },
];

export default function Nav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav style={{
      display: 'flex', gap: 4, padding: '10px 12px',
      background: '#11111f', borderBottom: '1px solid #1e1e35',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, padding: '8px 2px', border: 'none', borderRadius: 10,
          background: active === t.id ? '#252540' : 'transparent',
          color: active === t.id ? '#ff5c00' : '#4a4a6a',
          fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 700,
          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          transition: 'all 0.2s'
        }}>
          <span style={{ fontSize: 15 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
