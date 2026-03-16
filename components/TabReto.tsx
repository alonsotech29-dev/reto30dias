import { RetoData } from '@/lib/store';

export default function TabReto({ data, currentDay }: { data: RetoData; currentDay: number }) {
  const completedDays = data.dias.filter(d => d.completo).length;
  const gymSessions = data.dias.filter(d => d.gym === true).length;
  const streak = (() => {
    let s = 0;
    for (let i = currentDay - 1; i >= 0; i--) {
      if (data.dias[i].completo) s++; else break;
    }
    return s;
  })();

  const weeks = [
    { label: 'Semana 1', dias: data.dias.slice(0, 7) },
    { label: 'Semana 2', dias: data.dias.slice(7, 14) },
    { label: 'Semana 3', dias: data.dias.slice(14, 21) },
    { label: 'Semana 4', dias: data.dias.slice(21, 28) },
    { label: 'Días finales', dias: data.dias.slice(28, 30) },
  ];

  return (
    <div style={{ padding: '16px 14px 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { label: 'Días ✅', val: completedDays.toString(), unit: 'de 30', color: completedDays > 0 ? '#00e676' : '#ff5c00' },
          { label: 'Gym 💪', val: gymSessions.toString(), unit: 'sesiones', color: '#ff5c00' },
          { label: 'Racha 🔥', val: streak.toString(), unit: 'días', color: streak > 0 ? '#00e676' : '#ff5c00' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#181828', border: `1px solid ${s.color === '#00e676' ? 'rgba(0,230,118,0.4)' : '#1e1e35'}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 9, color: '#4a4a6a', marginTop: 2 }}>{s.unit}</div>
          </div>
        ))}
      </div>

      {weeks.map((week, wi) => {
        const weekUnlocked = wi === 0 || data.dias[wi * 7 - 1]?.completo || currentDay > wi * 7;
        return (
          <div key={wi} style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 16, marginBottom: 12, opacity: weekUnlocked ? 1 : 0.4 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 12 }}>{week.label}</div>
            {!weekUnlocked ? (
              <div style={{ textAlign: 'center', padding: '12px 0', color: '#4a4a6a', fontSize: 13 }}>🔒 Se desbloquea al completar la semana anterior</div>
            ) : week.dias.map((d, i) => {
              const isToday = d.dia === currentDay;
              const isFuture = d.dia > currentDay;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < week.dias.length - 1 ? '1px solid #1e1e35' : 'none', opacity: isFuture ? 0.4 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: d.completo ? '#00e676' : isToday ? '#ff5c00' : '#4a4a6a', width: 32, letterSpacing: 1 }}>{d.dia}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{d.fecha}</div>
                      <div style={{ fontSize: 11, color: '#4a4a6a' }}>{d.completo ? 'Completado ✅' : isToday ? 'Hoy 🔥' : isFuture ? '' : 'Incompleto'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {d.pasos !== null ? (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1, background: 'rgba(0,230,118,0.15)', color: '#00e676', border: '1px solid rgba(0,230,118,0.3)' }}>{d.pasos >= 10000 ? '10K ✅' : `${d.pasos.toLocaleString('es')} ⚠️`}</span>
                    ) : !isFuture ? (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6, background: '#252540', color: '#4a4a6a', border: '1px solid #1e1e35' }}>Pasos</span>
                    ) : null}
                    {d.gym !== null ? (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1, background: d.gym ? 'rgba(255,92,0,0.15)' : 'rgba(255,61,87,0.1)', color: d.gym ? '#ff5c00' : '#ff3d57', border: `1px solid ${d.gym ? 'rgba(255,92,0,0.3)' : 'rgba(255,61,87,0.3)'}` }}>{d.gym ? 'Gym ✅' : 'Gym ❌'}</span>
                    ) : !isFuture ? (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6, background: '#252540', color: '#4a4a6a', border: '1px solid #1e1e35' }}>Gym</span>
                    ) : null}
                    {d.peso !== null && <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6, background: 'rgba(0,230,118,0.15)', color: '#00e676', border: '1px solid rgba(0,230,118,0.3)' }}>{d.peso}kg</span>}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
