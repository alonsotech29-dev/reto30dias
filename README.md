# 🔥 Reto 30 Días — App

App PWA para tracking de reto de reducción de grasa.

## Funcionalidades
- 📸 Análisis de fotos de comida con IA (Claude)
- 📊 Gráficos de peso y calorías
- ✅ Checklist diario (pasos, gym, peso)
- 📱 Instalable como app en iOS/Android

## Instalación

### 1. Clona el repo
```bash
git clone https://github.com/TU_USUARIO/reto30dias
cd reto30dias
npm install
```

### 2. Configura la API key
Crea un archivo `.env.local` con:
```
ANTHROPIC_API_KEY=tu_api_key_aqui
```

### 3. Ejecuta en desarrollo
```bash
npm run dev
```

## Deploy en Vercel

1. Sube el código a GitHub
2. Ve a vercel.com → New Project → importa el repo
3. En "Environment Variables" añade: `ANTHROPIC_API_KEY = tu_api_key`
4. Deploy → ¡listo!

## Instalar en iPhone como app
1. Abre la URL de Vercel en Safari
2. Pulsa compartir 📤 → "Añadir a pantalla de inicio"
3. ¡Ya tienes la app instalada!
