import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RetoData } from '@/lib/store';

export default function TabPeso({ data }: { data: RetoData }) {
  const pesoData = data.dias.filter(d => d.peso !== null).map(d => ({ dia: `D${d.dia}`, peso: d.peso, fecha: d.fecha }));
  const pesos = pesoData.map(d => d.peso as number);
  const pesoActual = pesos.length > 0 ? pesos[pesos.length - 1] : data.pesoInicial;
  const cambio = pesoActual - data.pesoInicial;
  const minY = pesos.length > 0 ? Math.floor(Math.min(...pesos)) - 2 : data.pesoInicial - 5;
  const maxY = pesos.length > 0 ? Math.ceil(Math.max(...pesos)) + 2 : data.pesoInicial + 2;

  return (
    <div style={{ padding: '16px 14px 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { label: 'Inicio', val: `${data.pesoInicial}`, unit: 'kg', color: '#f0f0ff' },
          { label: 'Actual', val: `${pesoActual}`, unit: 'kg', color: '#ff5c00', hl: true },
          { label: 'Cambio', val: cambio === 0 ? '—' : `${cambio > 0 ? '+' : ''}${cambio.toFixed(1)}`, unit: 'kg', color: cambio < 0 ? '#00e676' : cambio > 0 ? '#ff3d57' : '#4a4a6a' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#181828', border: `1px solid ${s.hl ? '#ff5c00' : '#1e1e35'}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 9, color: '#4a4a6a', marginTop: 2 }}>{s.unit}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 14 }}>Evolución del peso (kg)</div>
        {pesoData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#4a4a6a', fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>⚖️</div>
            Sin datos aún
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pesoData} margin={{ top: 5, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e35" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: '#4a4a6a', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis domain={[minY, maxY]} tick={{ fill: '#4a4a6a', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#11111f', border: '1px solid #ff5c00', borderRadius: 8 }}
                labelStyle={{ color: '#ff5c00', fontSize: 12 }}
                itemStyle={{ color: '#f0f0ff' }}
                formatter={(v: any) => [`${v} kg`, 'Peso']}
              />
              <Line type="monotone" dataKey="peso" stroke="#ff5c00" strokeWidth={3}
                dot={{ fill: '#ff5c00', r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: '#ff8533' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 12 }}>Historial de peso</div>
        {data.dias.filter(d => d.peso !== null).map((d, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e1e35' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Día {d.dia}</div>
              <div style={{ fontSize: 11, color: '#4a4a6a' }}>{d.fecha}</div>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#ff5c00' }}>{d.peso} kg</div>
          </div>
        ))}
        {data.dias.filter(d => d.peso !== null).length === 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: '#4a4a6a', fontSize: 13 }}>Sin registros de peso aún</div>
        )}
      </div>
    </div>
  );
}
