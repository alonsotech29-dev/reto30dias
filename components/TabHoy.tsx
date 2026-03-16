import { DayData, RetoData } from '@/lib/store';

interface Props { data: RetoData; currentDay: number; }

export default function TabHoy({ data, currentDay }: Props) {
  const day = data.dias[currentDay - 1];
  const totalKcal = day.comidas.reduce((s, c) => s + c.kcal, 0);
  const deficit = data.objetivoKcal - totalKcal;
  const completedDays = data.dias.filter(d => d.completo).length;
  const weekDays = ['L','M','X','J','V','S','D'];
  const week1 = data.dias.slice(0, 7);

  return (
    <div style={{ padding: '16px 14px 80px' }}>

      {/* Banner */}
      <div style={{
        background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.25)',
        borderRadius: 14, padding: '12px 14px', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <span style={{ fontSize: 22 }}>🎯</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#00e676' }}>DÍA {currentDay} EN CURSO</div>
          <div style={{ fontSize: 11, color: '#4a4a6a', marginTop: 2 }}>
            {day.pasos !== null ? '🚶 Pasos ✅' : '🚶 Pasos ⏳'} · {day.gym ? '🏋️ Gym ✅' : '🏋️ Gym ⏳'} · {deficit >= 0 ? `⚡ Déficit ${deficit.toLocaleString('es')} kcal` : `⚠️ Superávit ${Math.abs(deficit).toLocaleString('es')} kcal`}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { label: 'Pasos', val: day.pasos !== null ? (day.pasos >= 10000 ? '10K+' : `${(day.pasos/1000).toFixed(1)}K`) : '—', unit: day.pasos !== null && day.pasos >= 10000 ? '✅' : 'de 10K', color: day.pasos !== null && day.pasos >= 10000 ? '#00e676' : '#ff5c00' },
          { label: 'Kcal', val: totalKcal.toString(), unit: `de ${data.objetivoKcal}`, color: deficit >= 0 ? '#00e676' : '#ff3d57' },
          { label: 'Gym', val: day.gym === true ? '✓' : day.gym === false ? '✗' : '?', unit: day.gym === true ? 'hecho' : day.gym === false ? 'no hoy' : 'pendiente', color: day.gym === true ? '#00e676' : '#ff5c00' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#181828', border: `1px solid ${s.color === '#00e676' ? 'rgba(0,230,118,0.4)' : '#1e1e35'}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 9, color: '#4a4a6a', marginTop: 2 }}>{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Week */}
      <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 12 }}>Semana actual</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
          {weekDays.map((d, i) => {
            const dayData = week1[i];
            const isToday = (i + 1) === currentDay;
            const isDone = dayData?.completo;
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#4a4a6a', fontWeight: 700, marginBottom: 6 }}>{d}</div>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', margin: '0 auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                  background: isDone ? 'rgba(0,230,118,0.15)' : isToday ? 'rgba(255,92,0,0.1)' : '#252540',
                  border: `1px solid ${isDone ? 'rgba(0,230,118,0.4)' : isToday ? '#ff5c00' : '#1e1e35'}`,
                  boxShadow: isToday ? '0 0 0 2px rgba(255,92,0,0.3)' : 'none'
                }}>
                  {isDone ? '✅' : isToday ? '🔥' : '·'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reto progress */}
      <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 12 }}>Progreso del reto</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 52, color: '#ff5c00', letterSpacing: 2, lineHeight: 1 }}>{currentDay}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#4a4a6a', marginBottom: 8 }}>días de 30 · {completedDays} completados</div>
            <div style={{ background: '#252540', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max((currentDay / 30) * 100, 2)}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#ff5c00,#ff8533)', boxShadow: '0 0 8px rgba(255,92,0,0.4)' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#00e676', marginTop: 10 }}>
          ⚡ Déficit acumulado: +{data.dias.slice(0, currentDay).reduce((s, d) => s + (data.objetivoKcal - d.comidas.reduce((ss, c) => ss + c.kcal, 0)), 0).toLocaleString('es')} kcal
        </div>
      </div>

      {/* Tip */}
      <div style={{ background: 'rgba(255,92,0,0.06)', border: '1px solid rgba(255,92,0,0.2)', borderRadius: 14, padding: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#ff5c00', textTransform: 'uppercase', marginBottom: 8 }}>📋 Para reportar</div>
        <div style={{ fontSize: 12, color: '#4a4a6a' }}>Ve a la pestaña <strong style={{ color: '#ff5c00' }}>REPORTE</strong> cuando quieras registrar pasos, peso o una comida. Puedes hacerlo varias veces al día.</div>
      </div>
    </div>
  );
}
