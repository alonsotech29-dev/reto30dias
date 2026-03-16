import { useState, useRef } from 'react';
import { Meal, addMealToDay, updateDay, getCurrentDay, getRetoData } from '@/lib/store';

interface AnalysisResult {
  nombre: string;
  momento: string;
  kcal: number;
  desglose: { ingrediente: string; cantidad: string; kcal: number }[];
  confianza: string;
  notas: string;
}

interface Props { onUpdate: () => void; currentDay: number; }

export default function TabReporte({ onUpdate, currentDay }: Props) {
  const [subTab, setSubTab] = useState<'actividad'|'peso'|'comida'>('actividad');
  const [pasos, setPasos] = useState(0);
  const [gym, setGym] = useState<boolean|null>(null);
  const [peso, setPeso] = useState(95.0);
  const [saved, setSaved] = useState(false);

  // Comida state
  const [photo, setPhoto] = useState<string|null>(null);
  const [photoMime, setPhotoMime] = useState('image/jpeg');
  const [notas, setNotas] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult|null>(null);
  const [mealSaved, setMealSaved] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const btn = (label: string, active: boolean, onClick: () => void, color?: string) => (
    <button onClick={onClick} style={{
      flex: 1, padding: '9px 4px', border: `1.5px solid ${active ? (color || '#ff5c00') : '#1e1e35'}`,
      background: active ? (color === '#00e676' ? 'rgba(0,230,118,0.12)' : color === '#ff3d57' ? 'rgba(255,61,87,0.1)' : 'rgba(255,92,0,0.12)') : '#252540',
      color: active ? (color || '#ff5c00') : '#4a4a6a',
      fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700,
      borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s'
    }}>{label}</button>
  );

  function saveActividad() {
    updateDay(currentDay, { pasos: pasos > 0 ? pasos : undefined as any, gym: gym !== null ? gym : undefined as any });
    onUpdate(); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function savePeso() {
    updateDay(currentDay, { peso });
    onUpdate(); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function analyzePhoto() {
    if (!photo) return;
    setAnalyzing(true); setError(''); setAnalysis(null);
    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: photo.split(',')[1], mimeType: photoMime, notes: notas })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data);
    } catch (e: any) {
      setError(e.message || 'Error al analizar la imagen');
    } finally {
      setAnalyzing(false);
    }
  }

  function saveMeal() {
    if (!analysis) return;
    const meal: Meal = {
      id: Date.now().toString(),
      momento: analysis.momento,
      nombre: analysis.nombre,
      kcal: analysis.kcal,
      notas: notas || analysis.notas,
      hora: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
      foto: photo || undefined
    };
    addMealToDay(currentDay, meal);
    onUpdate();
    setPhoto(null); setAnalysis(null); setNotas(''); setMealSaved(true);
    setTimeout(() => setMealSaved(false), 2000);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = ev => { setPhoto(ev.target?.result as string); setAnalysis(null); };
    reader.readAsDataURL(file);
  }

  const inp = { width: '100%', background: '#252540', border: '1.5px solid #1e1e35', borderRadius: 10, padding: '10px 12px', color: '#f0f0ff', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none' };

  return (
    <div style={{ padding: '16px 14px 80px' }}>
      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 14 }}>
        {(['actividad','peso','comida'] as const).map((t, i) => (
          <button key={t} onClick={() => setSubTab(t)} style={{
            flex: 1, padding: '10px 4px', border: `1.5px solid ${subTab === t ? '#ff5c00' : '#1e1e35'}`,
            background: subTab === t ? '#ff5c00' : '#252540', color: subTab === t ? 'white' : '#4a4a6a',
            fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            borderRadius: i === 0 ? '10px 0 0 10px' : i === 2 ? '0 10px 10px 0' : 0, letterSpacing: 0.5
          }}>
            {t === 'actividad' ? '💪 Actividad' : t === 'peso' ? '⚖️ Peso' : '📸 Comida'}
          </button>
        ))}
      </div>

      {/* ACTIVIDAD */}
      {subTab === 'actividad' && (
        <>
          <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🚶 Pasos hoy</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, color: pasos >= 10000 ? '#00e676' : '#ff5c00', marginBottom: 8 }}>
              {pasos.toLocaleString('es')}
            </div>
            <input type="range" min={0} max={20000} step={500} value={pasos}
              onChange={e => setPasos(parseInt(e.target.value))}
              style={{ accentColor: '#ff5c00' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#4a4a6a', marginTop: 4 }}>
              <span>0</span><span>5.000</span><span style={{ color: '#ff5c00' }}>10.000 ✓</span><span>20.000</span>
            </div>
          </div>

          <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🏋️ Gimnasio hoy</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {btn('💪 SÍ FUI', gym === true, () => setGym(true), '#00e676')}
              {btn('🛋️ NO FUI', gym === false, () => setGym(false), '#ff3d57')}
              {btn('⏳ LUEGO', gym === null, () => setGym(null))}
            </div>
          </div>

          <button onClick={saveActividad} style={{ width: '100%', padding: 16, borderRadius: 14, border: 'none', background: saved ? '#00e676' : 'linear-gradient(135deg,#ff5c00,#ff8533)', color: saved ? '#080810' : 'white', fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, letterSpacing: 2, cursor: 'pointer', transition: 'all 0.3s' }}>
            {saved ? '✅ GUARDADO' : 'GUARDAR ACTIVIDAD'}
          </button>
        </>
      )}

      {/* PESO */}
      {subTab === 'peso' && (
        <>
          <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>⚖️ Tu peso hoy</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setPeso(p => Math.max(30, Math.round((p - 0.1) * 10) / 10))} style={{ width: 48, height: 48, borderRadius: 12, border: '1.5px solid #1e1e35', background: '#252540', color: '#f0f0ff', fontSize: 26, cursor: 'pointer' }}>−</button>
              <div style={{ flex: 1, textAlign: 'center', fontFamily: 'Bebas Neue, sans-serif', fontSize: 44, color: '#ff5c00', background: '#252540', borderRadius: 12, padding: '8px 0', border: '1.5px solid #1e1e35' }}>{peso.toFixed(1)}</div>
              <button onClick={() => setPeso(p => Math.round((p + 0.1) * 10) / 10)} style={{ width: 48, height: 48, borderRadius: 12, border: '1.5px solid #1e1e35', background: '#252540', color: '#f0f0ff', fontSize: 26, cursor: 'pointer' }}>+</button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#4a4a6a', marginTop: 8 }}>kg · usa los botones para ajustar</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
              {[-1, -0.5, 0.5, 1].map(d => (
                <button key={d} onClick={() => setPeso(p => Math.max(30, Math.round((p + d) * 10) / 10))} style={{ background: '#252540', border: '1px solid #1e1e35', color: '#4a4a6a', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>{d > 0 ? `+${d}` : d}</button>
              ))}
            </div>
          </div>
          <button onClick={savePeso} style={{ width: '100%', padding: 16, borderRadius: 14, border: 'none', background: saved ? '#00e676' : 'linear-gradient(135deg,#ff5c00,#ff8533)', color: saved ? '#080810' : 'white', fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, letterSpacing: 2, cursor: 'pointer', transition: 'all 0.3s' }}>
            {saved ? '✅ GUARDADO' : 'GUARDAR PESO'}
          </button>
        </>
      )}

      {/* COMIDA */}
      {subTab === 'comida' && (
        <>
          <div style={{ background: 'rgba(255,92,0,0.06)', border: '1px solid rgba(255,92,0,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#4a4a6a' }}>
            📸 Saca una foto de tu comida y la IA calculará las calorías automáticamente.
          </div>

          {/* Photo */}
          <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
            {photo ? (
              <>
                <img src={photo} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '10px 14px', display: 'flex', gap: 8 }}>
                  <button onClick={() => { setPhoto(null); setAnalysis(null); }} style={{ flex: 1, padding: '8px', borderRadius: 10, border: '1.5px solid #1e1e35', background: '#252540', color: '#4a4a6a', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>🔄 Cambiar foto</button>
                  {!analysis && <button onClick={analyzePhoto} disabled={analyzing} style={{ flex: 2, padding: '8px', borderRadius: 10, border: 'none', background: analyzing ? '#252540' : '#ff5c00', color: analyzing ? '#4a4a6a' : 'white', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, cursor: analyzing ? 'not-allowed' : 'pointer' }}>{analyzing ? '⏳ Analizando...' : '🔍 Analizar con IA'}</button>}
                </div>
              </>
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ padding: 32, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f0ff', marginBottom: 4 }}>Toca para añadir foto</div>
                <div style={{ fontSize: 11, color: '#4a4a6a' }}>Cámara o galería</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
          </div>

          {/* Notes */}
          <div style={{ background: '#11111f', border: '1px solid #1e1e35', borderRadius: 16, padding: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#4a4a6a', textTransform: 'uppercase', marginBottom: 8 }}>📝 Anotación (opcional)</div>
            <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Ej: con aceite de oliva, sin sal, ración grande..." style={{ ...inp, resize: 'none', height: 70 } as any} />
          </div>

          {/* Error */}
          {error && <div style={{ background: 'rgba(255,61,87,0.1)', border: '1px solid rgba(255,61,87,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 12, color: '#ff3d57', fontSize: 13 }}>⚠️ {error}</div>}

          {/* Analysis result */}
          {analysis && (
            <div style={{ background: '#11111f', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', color: '#00e676', textTransform: 'uppercase', marginBottom: 12 }}>✅ Análisis completado</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{analysis.nombre}</div>
                  <div style={{ fontSize: 11, color: '#4a4a6a', marginTop: 2 }}>{analysis.momento} · Confianza: {analysis.confianza}</div>
                  {analysis.notas && <div style={{ fontSize: 11, color: '#4a4a6a', fontStyle: 'italic', marginTop: 4 }}>"{analysis.notas}"</div>}
                </div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#ff5c00', letterSpacing: 1 }}>{analysis.kcal}</div>
              </div>
              {analysis.desglose && analysis.desglose.length > 0 && (
                <div style={{ borderTop: '1px solid #1e1e35', paddingTop: 10 }}>
                  {analysis.desglose.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#4a4a6a', padding: '3px 0' }}>
                      <span>{d.ingrediente} ({d.cantidad})</span>
                      <span style={{ color: '#ff5c00' }}>{d.kcal} kcal</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={saveMeal} style={{ width: '100%', marginTop: 14, padding: 14, borderRadius: 12, border: 'none', background: mealSaved ? '#00e676' : '#ff5c00', color: mealSaved ? '#080810' : 'white', fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 2, cursor: 'pointer', transition: 'all 0.3s' }}>
                {mealSaved ? '✅ GUARDADO' : '💾 GUARDAR COMIDA'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
