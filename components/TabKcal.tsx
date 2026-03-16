import { DayData, RetoData } from '@/lib/store';

export default function TabKcal({ data, currentDay }: { data: RetoData; currentDay: number }) {
  const day = data.dias[currentDay - 1];
  const totalKcal = day.comidas.reduce((s, c) => s + c.kcal, 0);
  const deficit = data.objetivoKcal - totalKcal;
  const pct = Math.min((totalKcal / data.objetivoKcal) * 100, 100);

  return (
    <div style={{ padding: '16px 14px 80px' }}>
      {/* Big number */}
      <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 20, marginBottom: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 12 }}>Calorías hoy — Día {currentDay}</div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, color: deficit >= 0 ? '#00e676' : '#ff3d57', letterSpacing: 2, lineHeight: 1 }}>{totalKcal}</div>
        <div style={{ fontSize: 13, color: '#4a4a6a', marginTop: 4 }}>kcal de {data.objetivoKcal.toLocaleString('es')}</div>
        <div style={{ background: '#252540', borderRadius: 99, height: 8, margin: '14px 0 8px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.max(pct, 2)}%`, height: '100%', borderRadius: 99, background: deficit >= 0 ? 'linear-gradient(90deg,#00e676,#00c853)' : 'linear-gradient(90deg,#ff3d57,#ff6b6b)', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: deficit >= 0 ? '#00e676' : '#ff3d57' }}>
          {deficit >= 0 ? `✅ Déficit de ${deficit.toLocaleString('es')} kcal` : `⚠️ Superávit de ${Math.abs(deficit).toLocaleString('es')} kcal`}
        </div>
      </div>

      {/* Meals */}
      <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 12 }}>Desglose por comida</div>
        {day.comidas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#4a4a6a', fontSize: 13 }}>Sin comidas registradas hoy</div>
        ) : day.comidas.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < day.comidas.length - 1 ? '1px solid #1e1e35' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, marginRight: 10 }}>
              <div style={{ fontSize: 18, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#252540', borderRadius: 9, flexShrink: 0 }}>🍽️</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.momento}</div>
                <div style={{ fontSize: 11, color: '#4a4a6a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</div>
                {c.notas && <div style={{ fontSize: 10, color: '#4a4a6a', fontStyle: 'italic', marginTop: 2 }}>"{c.notas}"</div>}
              </div>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#ff5c00', flexShrink: 0 }}>{c.kcal}</div>
          </div>
        ))}
      </div>

      {/* TDEE */}
      <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 12 }}>Tu metabolismo</div>
        {[
          { icon: '🔥', name: 'TDEE estimado', sub: 'Lo que quemas al día', val: data.tdee.toLocaleString('es'), color: '#ff5c00' },
          { icon: '🎯', name: 'Objetivo diario', sub: 'Déficit del 20%', val: data.objetivoKcal.toLocaleString('es'), color: '#ff5c00' },
          { icon: '📉', name: 'Déficit acumulado hoy', sub: '~0.5 kg grasa / semana', val: `+${deficit.toLocaleString('es')}`, color: '#00e676' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #1e1e35' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 18, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#252540', borderRadius: 9 }}>{r.icon}</div>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: '#4a4a6a' }}>{r.sub}</div></div>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: r.color }}>{r.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
