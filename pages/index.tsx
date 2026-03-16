import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getRetoData, saveRetoData, getDiaActual, updateDia, addComidaToDia, RetoData, DiaDatos, Comida } from '../lib/store'

const C = {
  bg: '#080810', surface: '#11111f', s2: '#181828', border: '#1e1e35',
  orange: '#ff5c00', green: '#00e676', red: '#ff3d57', text: '#f0f0ff',
  muted: '#4a4a6a', dim: '#252540'
}

const card = (highlight?: boolean): object => ({ background: C.surface, border: `1px solid ${highlight ? 'rgba(255,92,0,0.4)' : C.border}`, borderRadius: 16, padding: 16, marginBottom: 12 })
const cardTitle: object = { fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: C.muted, textTransform: 'uppercase' as const, marginBottom: 12 }
const statCard = (type?: string): object => ({ background: type === 'success' ? 'rgba(0,230,118,0.06)' : type === 'warn' ? 'rgba(255,92,0,0.06)' : C.s2, border: `1px solid ${type === 'success' ? 'rgba(0,230,118,0.4)' : type === 'warn' ? C.orange : C.border}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center' as const })
const bigNum = (color?: string): object => ({ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1, color: color === 'green' ? C.green : color === 'orange' ? C.orange : C.text })
const badge = (type?: string): object => ({ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase' as const, letterSpacing: 1, background: type === 'done' ? 'rgba(0,230,118,0.15)' : type === 'gym' ? 'rgba(255,92,0,0.15)' : C.dim, color: type === 'done' ? C.green : type === 'gym' ? C.orange : C.muted, border: `1px solid ${type === 'done' ? 'rgba(0,230,118,0.3)' : type === 'gym' ? 'rgba(255,92,0,0.3)' : C.border}`, display: 'inline-block' })
const btnStyle = (primary?: boolean): object => ({ padding: '14px 0', borderRadius: 14, border: primary ? 'none' : `1.5px solid ${C.border}`, background: primary ? `linear-gradient(135deg, ${C.orange}, #ff8533)` : C.dim, color: primary ? 'white' : C.muted, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%', boxShadow: primary ? '0 4px 20px rgba(255,92,0,0.35)' : 'none' })
const inputStyle: object = { width: '100%', background: C.dim, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '10px 12px', color: C.text, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }

export default function App() {
  const [tab, setTab] = useState<'hoy'|'kcal'|'peso'|'reto'|'reporte'>('hoy')
  const [data, setData] = useState<RetoData | null>(null)
  const [diaActual, setDiaActual] = useState(1)

  useEffect(() => {
    setData(getRetoData())
    setDiaActual(getDiaActual())
  }, [])

  if (!data) return <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.orange, fontFamily: "'Bebas Neue', sans-serif", fontSize: 28 }}>CARGANDO...</div>

  const dia = data.dias[diaActual - 1]
  const totalKcalHoy = dia.comidas.reduce((s: number, c: Comida) => s + c.kcal, 0)
  const deficit = data.objetivoKcal - totalKcalHoy
  const deficitAcumulado = data.dias.slice(0, diaActual).reduce((s: number, d: DiaDatos) => s + (data.objetivoKcal - d.comidas.reduce((sc: number, c: Comida) => sc + c.kcal, 0)), 0)
  const diasCompletos = data.dias.filter((d: DiaDatos) => d.completo).length
  const pesoData = data.dias.filter((d: DiaDatos) => d.peso !== null).map((d: DiaDatos) => ({ dia: `D${d.dia}`, peso: d.peso }))
  const pesoActual = pesoData.length > 0 ? (pesoData[pesoData.length - 1].peso ?? data.pesoInicial) : data.pesoInicial
  const cambio = (pesoActual as number) - data.pesoInicial

  function refresh() { setData({ ...getRetoData() }) }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      <div style={{ maxWidth: 430, margin: '0 auto', paddingBottom: 90 }}>
        <div style={{ padding: '44px 18px 20px', background: 'linear-gradient(180deg,rgba(255,92,0,0.12) 0%,transparent 100%)', borderBottom: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -10, top: 8, fontFamily: "'Bebas Neue',sans-serif", fontSize: 88, color: 'rgba(255,92,0,0.05)', letterSpacing: 4, pointerEvents: 'none' }}>RETO</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.orange, textTransform: 'uppercase', marginBottom: 4 }}>⚡ En progreso</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, letterSpacing: 2, lineHeight: 1 }}>RETO 30 DÍAS</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>16 Mar → 14 Abr 2026 · Reducción de grasa</div>
            </div>
            <div style={{ background: dia.completo ? C.green : C.orange, color: dia.completo ? '#080810' : 'white', fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 2, padding: '6px 12px', borderRadius: 20, fontWeight: 900, marginTop: 4, whiteSpace: 'nowrap' }}>
              DÍA {diaActual} {dia.completo ? '✅' : ''}
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 4, padding: '10px 14px', background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
          {(['hoy','kcal','peso','reto','reporte'] as const).map((id) => {
            const icons: Record<string, string> = { hoy: '🔥', kcal: '🍽️', peso: '⚖️', reto: '✅', reporte: '📋' }
            const labels: Record<string, string> = { hoy: 'HOY', kcal: 'KCAL', peso: 'PESO', reto: 'RETO', reporte: 'REPORTAR' }
            return (
              <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: '8px 2px', border: 'none', borderRadius: 10, background: tab === id ? C.dim : 'transparent', color: tab === id ? C.orange : C.muted, fontFamily: 'inherit', fontSize: 9, fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 15 }}>{icons[id]}</span>{labels[id]}
              </button>
            )
          })}
        </nav>

        {tab === 'hoy' && <TabHoy dia={dia} totalKcal={totalKcalHoy} deficit={deficit} deficitAcumulado={deficitAcumulado} diasCompletos={diasCompletos} objetivo={data.objetivoKcal} diaActual={diaActual} onReporte={() => setTab('reporte')} />}
        {tab === 'kcal' && <TabKcal dia={dia} totalKcal={totalKcalHoy} deficit={deficit} objetivo={data.objetivoKcal} tdee={data.tdee} />}
        {tab === 'peso' && <TabPeso pesoData={pesoData} pesoInicial={data.pesoInicial} pesoActual={pesoActual as number} cambio={cambio} diaActual={diaActual} />}
        {tab === 'reto' && <TabReto dias={data.dias} diasCompletos={diasCompletos} diaActual={diaActual} />}
        {tab === 'reporte' && <TabReporte diaActual={diaActual} dia={dia} objetivo={data.objetivoKcal} onUpdate={refresh} />}
      </div>
    </div>
  )
}

function TabHoy({ dia, totalKcal, deficit, deficitAcumulado, diasCompletos, objetivo, diaActual, onReporte }: { dia: DiaDatos, totalKcal: number, deficit: number, deficitAcumulado: number, diasCompletos: number, objetivo: number, diaActual: number, onReporte: () => void }) {
  return (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ background: dia.completo ? 'rgba(0,230,118,0.08)' : 'rgba(255,92,0,0.08)', border: `1px solid ${dia.completo ? 'rgba(0,230,118,0.3)' : 'rgba(255,92,0,0.3)'}`, borderRadius: 14, padding: '12px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>{dia.completo ? '🎉' : '💪'}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: dia.completo ? C.green : C.orange }}>{dia.completo ? `¡DÍA ${diaActual} COMPLETADO!` : `DÍA ${diaActual} EN PROGRESO`}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
            {dia.pasos !== null ? `Pasos: ${dia.pasos >= 10000 ? '✅' : '⚠️'} ` : ''}
            {dia.gym !== null ? `Gym: ${dia.gym ? '✅' : '❌'} ` : ''}
            {dia.peso !== null ? `Peso: ${dia.peso}kg` : ''}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
        <div style={statCard(dia.pasos !== null && dia.pasos >= 10000 ? 'success' : undefined)}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Pasos</div>
          <div style={bigNum(dia.pasos !== null && dia.pasos >= 10000 ? 'green' : undefined)}>{dia.pasos !== null ? (dia.pasos >= 10000 ? '10K+' : `${(dia.pasos/1000).toFixed(1)}K`) : '—'}</div>
          <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{dia.pasos !== null && dia.pasos >= 10000 ? '✅ meta' : 'de 10k'}</div>
        </div>
        <div style={statCard(deficit >= 0 ? 'success' : undefined)}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Kcal</div>
          <div style={bigNum(deficit >= 0 ? 'green' : 'orange')}>{totalKcal}</div>
          <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>de {objetivo.toLocaleString('es')}</div>
        </div>
        <div style={statCard(dia.gym === true ? 'success' : undefined)}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Gym</div>
          <div style={bigNum(dia.gym === true ? 'green' : undefined)}>{dia.gym === true ? '✓' : dia.gym === false ? '✗' : '—'}</div>
          <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{dia.gym === true ? 'hecho' : dia.gym === false ? 'no hoy' : 'pend.'}</div>
        </div>
      </div>

      <div style={card()}>
        <div style={cardTitle}>Semana actual</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
          {['L','M','X','J','V','S','D'].map((d, i) => {
            const diaIdx = Math.floor((diaActual - 1) / 7) * 7 + i
            const esHoy = diaIdx === diaActual - 1
            const esPasado = diaIdx < diaActual - 1
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, marginBottom: 5, textTransform: 'uppercase' }}>{d}</div>
                <div style={{ width: 30, height: 30, borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, background: esPasado ? 'rgba(0,230,118,0.15)' : esHoy ? 'rgba(255,92,0,0.1)' : C.dim, border: `1px solid ${esPasado ? 'rgba(0,230,118,0.4)' : esHoy ? C.orange : C.border}`, boxShadow: esHoy ? `0 0 0 2px rgba(255,92,0,0.3)` : 'none' }}>
                  {esPasado ? '✅' : esHoy ? '🔥' : '·'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={card()}>
        <div style={cardTitle}>Progreso del reto</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, color: C.orange, letterSpacing: 2, lineHeight: 1 }}>{diasCompletos}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>días completados de 30</div>
            <div style={{ background: C.dim, borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max((diasCompletos / 30) * 100, 2)}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#ff5c00,#ff8533)', boxShadow: '0 0 8px rgba(255,92,0,0.4)' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: C.green, marginTop: 10 }}>
          ⚡ Déficit acumulado: +{deficitAcumulado.toLocaleString('es')} kcal
        </div>
      </div>

      <button onClick={onReporte} style={{ ...btnStyle(true) as object, fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 2 }}>
        📋 HACER REPORTE
      </button>
    </div>
  )
}

function TabKcal({ dia, totalKcal, deficit, objetivo, tdee }: { dia: DiaDatos, totalKcal: number, deficit: number, objetivo: number, tdee: number }) {
  const pct = Math.min((totalKcal / objetivo) * 100, 100)
  return (
    <div style={{ padding: '16px 14px' }}>
      <div style={card()}>
        <div style={cardTitle}>Calorías hoy</div>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, color: deficit >= 0 ? C.green : C.red, letterSpacing: 2, lineHeight: 1 }}>{totalKcal}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>kcal de {objetivo.toLocaleString('es')}</div>
        </div>
        <div style={{ background: C.dim, borderRadius: 99, height: 8, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ width: `${Math.max(pct, 2)}%`, height: '100%', borderRadius: 99, background: deficit >= 0 ? 'linear-gradient(90deg,#00e676,#00c853)' : 'linear-gradient(90deg,#ff3d57,#ff6b6b)' }} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: deficit >= 0 ? C.green : C.red, textAlign: 'center' }}>
          {deficit >= 0 ? `✅ Déficit: ${deficit.toLocaleString('es')} kcal` : `⚠️ Superávit: ${Math.abs(deficit).toLocaleString('es')} kcal`}
        </div>
      </div>

      <div style={card()}>
        <div style={cardTitle}>Comidas del día</div>
        {dia.comidas.length === 0 && <div style={{ textAlign: 'center', padding: 16, color: C.muted, fontSize: 13 }}>Sin comidas registradas</div>}
        {dia.comidas.map((c: Comida, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < dia.comidas.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 18, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.dim, borderRadius: 9 }}>
                {c.momento === 'Desayuno' ? '🌅' : c.momento === 'Cena' ? '🌙' : c.momento === 'Merienda' ? '🥪' : '🍽️'}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.momento} · {c.hora}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{c.nombre}</div>
                {c.notas && <div style={{ fontSize: 10, color: C.muted, fontStyle: 'italic' }}>"{c.notas}"</div>}
              </div>
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: C.orange }}>{c.kcal}</div>
          </div>
        ))}
      </div>

      <div style={card()}>
        <div style={cardTitle}>Metabolismo</div>
        {[
          { icon: '🔥', name: 'TDEE estimado', sub: 'Lo que quemas al día', val: tdee.toLocaleString('es'), color: C.orange },
          { icon: '🎯', name: 'Objetivo diario', sub: 'Déficit 20%', val: objetivo.toLocaleString('es'), color: C.orange },
          { icon: '📉', name: 'Déficit hoy', sub: '~0.5kg grasa/semana', val: `${deficit >= 0 ? '+' : ''}${deficit.toLocaleString('es')}`, color: deficit >= 0 ? C.green : C.red }
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 18, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.dim, borderRadius: 9 }}>{r.icon}</div>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: C.muted }}>{r.sub}</div></div>
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: r.color }}>{r.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabPeso({ pesoData, pesoInicial, pesoActual, cambio, diaActual }: { pesoData: any[], pesoInicial: number, pesoActual: number, cambio: number, diaActual: number }) {
  return (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
        <div style={statCard()}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Inicio</div><div style={bigNum()}>{pesoInicial}</div><div style={{ fontSize: 9, color: C.muted }}>kg</div></div>
        <div style={statCard('warn')}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Actual</div><div style={bigNum('orange')}>{pesoActual}</div><div style={{ fontSize: 9, color: C.muted }}>kg</div></div>
        <div style={statCard(cambio < 0 ? 'success' : undefined)}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Cambio</div><div style={bigNum(cambio < 0 ? 'green' : cambio > 0 ? 'orange' : undefined)}>{cambio > 0 ? `+${cambio.toFixed(1)}` : cambio === 0 ? '—' : cambio.toFixed(1)}</div><div style={{ fontSize: 9, color: C.muted }}>kg</div></div>
      </div>
      <div style={card()}>
        <div style={cardTitle}>Evolución del peso</div>
        {pesoData.length < 2 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.muted, fontSize: 13 }}><div style={{ fontSize: 32, marginBottom: 8 }}>⚖️</div>Registra más días para ver la evolución</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pesoData} margin={{ top: 5, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: C.muted, fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: C.muted, fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.orange}`, borderRadius: 8 }} labelStyle={{ color: C.orange }} itemStyle={{ color: C.text }} formatter={(v: number) => [`${v} kg`]} />
              <Line type="monotone" dataKey="peso" stroke={C.orange} strokeWidth={3} dot={{ fill: C.orange, r: 5, strokeWidth: 0 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

function TabReto({ dias, diasCompletos, diaActual }: { dias: DiaDatos[], diasCompletos: number, diaActual: number }) {
  const sesionesGym = dias.filter((d: DiaDatos) => d.gym === true).length
  const racha = (() => { let r = 0; for (let i = diaActual - 1; i >= 0; i--) { if (dias[i].completo) r++; else break; } return r; })()
  const semanas = [0,1,2,3].map(s => dias.slice(s*7, s*7+7))
  const semanaActual = Math.floor((diaActual - 1) / 7)

  return (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
        <div style={statCard(diasCompletos > 0 ? 'success' : undefined)}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Días ✅</div><div style={bigNum('green')}>{diasCompletos}</div><div style={{ fontSize: 9, color: C.muted }}>de 30</div></div>
        <div style={statCard()}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Gym 💪</div><div style={bigNum('orange')}>{sesionesGym}</div><div style={{ fontSize: 9, color: C.muted }}>sesiones</div></div>
        <div style={statCard(racha > 0 ? 'success' : undefined)}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Racha 🔥</div><div style={bigNum('orange')}>{racha}</div><div style={{ fontSize: 9, color: C.muted }}>días</div></div>
      </div>
      {semanas.map((semana: DiaDatos[], si: number) => {
        if (si > semanaActual) return (
          <div key={si} style={{ ...card() as object, opacity: 0.4 }}>
            <div style={cardTitle}>Semana {si + 1} — 🔒</div>
            <div style={{ textAlign: 'center', padding: '12px 0', color: C.muted, fontSize: 13 }}>Completa la semana anterior</div>
          </div>
        )
        return (
          <div key={si} style={card()}>
            <div style={cardTitle}>Semana {si + 1}</div>
            {semana.map((d: DiaDatos, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < semana.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: d.completo ? C.green : d.dia === diaActual ? C.orange : C.muted, width: 32 }}>{d.dia}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{d.fecha}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{d.completo ? 'Completado' : d.dia === diaActual ? 'Hoy' : d.dia < diaActual ? 'Sin completar' : ''}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {d.dia <= diaActual ? (<>
                    <span style={badge(d.pasos !== null && d.pasos >= 10000 ? 'done' : undefined)}>{d.pasos !== null && d.pasos >= 10000 ? '10k ✅' : 'Pasos'}</span>
                    <span style={badge(d.gym === true ? 'gym' : undefined)}>{d.gym === true ? 'Gym ✅' : 'Gym'}</span>
                    {d.peso && <span style={badge('done')}>{d.peso}kg</span>}
                  </>) : (<><span style={badge()}>Pasos</span><span style={badge()}>Gym</span></>)}
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function TabReporte({ diaActual, dia, objetivo, onUpdate }: { diaActual: number, dia: DiaDatos, objetivo: number, onUpdate: () => void }) {
  const [subtab, setSubtab] = useState<'actividad'|'peso'|'comida'>('actividad')
  const [pasos, setPasos] = useState<number>(dia.pasos ?? 0)
  const [gym, setGym] = useState<boolean|null>(dia.gym)
  const [peso, setPeso] = useState<number>(dia.peso ?? 95.0)
  const [analizando, setAnalizando] = useState(false)
  const [fotoPreview, setFotoPreview] = useState<string|null>(null)
  const [analisisResult, setAnalisisResult] = useState<any>(null)
  const [guardando, setGuardando] = useState(false)
  const [mealForm, setMealForm] = useState({ momento: 'Comida', nombre: '', kcal: '', notas: '', hora: '' })
  const [savedMsg, setSavedMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const hora = () => { const n = new Date(); return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}` }

  function guardarActividad() {
    updateDia(diaActual, { pasos, gym })
    onUpdate()
    setSavedMsg('✅ Actividad guardada')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  function guardarPeso() {
    updateDia(diaActual, { peso })
    onUpdate()
    setSavedMsg('✅ Peso guardado')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAnalizando(true)
    setAnalisisResult(null)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string
      setFotoPreview(dataUrl)
      const base64 = dataUrl.split(',')[1]
      try {
        const res = await fetch('/api/analizar-foto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
        })
        const result = await res.json()
        setAnalisisResult(result)
        setMealForm({ momento: result.momento || 'Comida', nombre: result.nombre || '', kcal: String(result.kcal || ''), notas: result.notas || '', hora: hora() })
      } catch {
        setSavedMsg('❌ Error al analizar la foto')
      }
      setAnalizando(false)
    }
    reader.readAsDataURL(file)
  }

  function guardarComida() {
    if (!mealForm.nombre) return
    setGuardando(true)
    const comida: Comida = {
      id: Date.now().toString(),
      momento: mealForm.momento,
      nombre: mealForm.nombre,
      kcal: parseInt(mealForm.kcal) || 0,
      notas: mealForm.notas,
      hora: mealForm.hora || hora(),
      fotoUrl: fotoPreview || undefined
    }
    addComidaToDia(diaActual, comida)
    onUpdate()
    setFotoPreview(null)
    setAnalisisResult(null)
    setMealForm({ momento: 'Comida', nombre: '', kcal: '', notas: '', hora: '' })
    setSavedMsg('✅ Comida guardada')
    setTimeout(() => setSavedMsg(''), 2000)
    setGuardando(false)
  }

  return (
    <div style={{ padding: '16px 14px' }}>
      {savedMsg && <div style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 12, fontSize: 14, fontWeight: 700, color: C.green, textAlign: 'center' }}>{savedMsg}</div>}
      <div style={{ background: 'rgba(255,92,0,0.07)', border: '1px solid rgba(255,92,0,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: C.muted }}>
        💡 Reporta solo lo que tengas ahora. Puedes volver cuando quieras.
      </div>
      <div style={{ display: 'flex', marginBottom: 14 }}>
        {(['actividad','peso','comida'] as const).map((t, i) => (
          <button key={t} onClick={() => setSubtab(t)} style={{ flex: 1, padding: '10px 4px', border: `1.5px solid ${subtab === t ? C.orange : C.border}`, background: subtab === t ? C.orange : C.dim, color: subtab === t ? 'white' : C.muted, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: i === 0 ? '10px 0 0 10px' : i === 2 ? '0 10px 10px 0' : 0 }}>
            {t === 'actividad' ? '💪 Actividad' : t === 'peso' ? '⚖️ Peso' : '📸 Comida'}
          </button>
        ))}
      </div>

      {subtab === 'actividad' && (
        <>
          <div style={card(pasos > 0)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>🚶 Pasos</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: pasos >= 10000 ? C.green : pasos > 0 ? C.orange : C.muted }}>{pasos >= 10000 ? '✅ META' : pasos > 0 ? pasos.toLocaleString('es') : '—'}</div>
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: C.orange, marginBottom: 8 }}>{pasos.toLocaleString('es')}</div>
            <input type="range" min={0} max={20000} step={500} value={pasos} onChange={e => setPasos(parseInt(e.target.value))} style={{ width: '100%', accentColor: C.orange }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: C.muted, marginTop: 4 }}>
              <span>0</span><span>5k</span><span style={{ color: C.orange }}>10k ✓</span><span>20k</span>
            </div>
          </div>
          <div style={card(gym !== null)}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🏋️ Gimnasio</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {([['true','💪','SÍ'],['false','🛋️','NO'],['null','⏳','LUEGO']] as const).map(([val, icon, label]) => {
                const isActive = gym === (val === 'true' ? true : val === 'false' ? false : null)
                return (
                  <button key={val} onClick={() => setGym(val === 'true' ? true : val === 'false' ? false : null)} style={{ flex: 1, padding: '10px 4px', borderRadius: 10, border: `1.5px solid ${isActive ? (val === 'false' ? 'rgba(255,61,87,0.4)' : 'rgba(0,230,118,0.5)') : C.border}`, background: isActive ? (val === 'false' ? 'rgba(255,61,87,0.1)' : 'rgba(0,230,118,0.1)') : C.dim, color: isActive ? (val === 'false' ? C.red : C.green) : C.muted, fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>{label}
                  </button>
                )
              })}
            </div>
          </div>
          <button onClick={guardarActividad} disabled={guardando} style={btnStyle(true)}>GUARDAR ACTIVIDAD ✓</button>
        </>
      )}

      {subtab === 'peso' && (
        <>
          <div style={card(true)}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>⚖️ Tu peso hoy</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setPeso((p: number) => Math.max(30, Math.round((p - 0.1) * 10) / 10))} style={{ width: 48, height: 48, borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.dim, color: C.text, fontSize: 26, cursor: 'pointer' }}>−</button>
              <div style={{ flex: 1, textAlign: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: C.orange, background: C.dim, borderRadius: 12, padding: '8px 0', border: `1.5px solid ${C.border}` }}>{peso.toFixed(1)}</div>
              <button onClick={() => setPeso((p: number) => Math.round((p + 0.1) * 10) / 10)} style={{ width: 48, height: 48, borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.dim, color: C.text, fontSize: 26, cursor: 'pointer' }}>+</button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
              {[-1, -0.5, 0.5, 1].map((d: number) => (
                <button key={d} onClick={() => setPeso((p: number) => Math.max(30, Math.round((p + d) * 10) / 10))} style={{ background: C.dim, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{d > 0 ? `+${d}` : d}</button>
              ))}
            </div>
          </div>
          <button onClick={guardarPeso} disabled={guardando} style={btnStyle(true)}>GUARDAR PESO ✓</button>
        </>
      )}

      {subtab === 'comida' && (
        <>
          <div style={card()}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📸 Foto de la comida</div>
            <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${C.border}`, borderRadius: 14, overflow: 'hidden', background: C.dim, cursor: 'pointer' }}>
              {fotoPreview ? (
                <img src={fotoPreview} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} alt="preview" />
              ) : (
                <div style={{ padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>Toca para añadir foto</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 3, opacity: 0.6 }}>IA analizará las calorías automáticamente</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFoto} style={{ display: 'none' }} />
          </div>

          {analizando && (
            <div style={{ ...card() as object, textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.orange }}>Analizando con IA...</div>
            </div>
          )}

          {analisisResult && !analizando && (
            <div style={{ ...card(true) as object, background: 'rgba(0,230,118,0.04)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.green, textTransform: 'uppercase', marginBottom: 10 }}>✅ Análisis IA</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 10 }}>
                {[['Kcal', analisisResult.kcal, C.orange],['Prot.', `${analisisResult.proteinas}g`, C.green],['Carbs', `${analisisResult.carbohidratos}g`, '#64b5f6'],['Grasas', `${analisisResult.grasas}g`, '#ffb74d']].map(([l,v,c]: [string, string|number, string]) => (
                  <div key={l} style={{ textAlign: 'center', background: C.dim, borderRadius: 10, padding: '8px 4px' }}>
                    <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{l}</div>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: c }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={card()}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Detalles</div>
            {[
              ['Momento', <select key="m" value={mealForm.momento} onChange={e => setMealForm({...mealForm, momento: e.target.value})} style={{ ...inputStyle as object, color: C.text }}>{['Desayuno','Almuerzo','Comida','Merienda','Cena','Snack'].map(m => <option key={m} style={{ background: C.surface }}>{m}</option>)}</select>],
              ['¿Qué comiste?', <input key="n" value={mealForm.nombre} onChange={e => setMealForm({...mealForm, nombre: e.target.value})} placeholder="Ej: Pollo con arroz" style={inputStyle} />],
              ['Kcal', <input key="k" type="number" value={mealForm.kcal} onChange={e => setMealForm({...mealForm, kcal: e.target.value})} placeholder="Se rellena con la foto" style={inputStyle} />],
              ['Notas', <input key="t" value={mealForm.notas} onChange={e => setMealForm({...mealForm, notas: e.target.value})} placeholder="Detalles extra..." style={inputStyle} />],
            ].map(([label, input]: [string, React.ReactNode], i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                {input}
              </div>
            ))}
          </div>
          <button onClick={guardarComida} disabled={guardando || !mealForm.nombre} style={{ ...btnStyle(true) as object, opacity: !mealForm.nombre ? 0.5 : 1 }}>
            GUARDAR COMIDA ✓
          </button>
        </>
      )}
    </div>
  )
}
