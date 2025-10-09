# AI Slides Generator v1.0.0

Eine Next.js-basierte Webanwendung zur automatischen Generierung professioneller, gebrandeter Präsentationen aus Themenvorgaben mittels KI.

## ✨ Features

- 🤖 **KI-gestützte Präsentationsgenerierung** mit OpenAI GPT-4
- 🎨 **Corporate Design Templates** (z.B. Techeroes Modern)
- 📊 **Automatische Folienstrukturierung** mit 5 optimierten Folien
- ☁️ **Nahtlose Google Slides Integration** mit User OAuth
- 📄 **Direkter Export** zu Google Slides
- 🎯 **Responsive Web-Interface** mit Live-Vorschau
- 🔐 **Sichere Authentifizierung** mit Google OAuth 2.0
- 📱 **Mobile-optimierte Benutzeroberfläche**

## Technologie-Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Zustand
- **Backend**: Next.js API Routes
- **APIs**: OpenAI GPT-4, Google Slides API, Google Drive API
- **Styling**: Tailwind CSS mit custom Components

## Installation

1. **Repository klonen**

   ```bash
   git clone <repository-url>
   cd ai-slides-generator
   ```

2. **Dependencies installieren**

   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**

   Kopiere `.env.local` und fülle die folgenden Werte:

   ```env
   # OpenAI API
   OPENAI_API_KEY=sk-your-openai-api-key

   # Google APIs (optional für Entwicklung)
   GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
   GOOGLE_PROJECT_ID=your-google-project-id

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Entwicklungsserver starten**

   ```bash
   npm run dev
   ```

   Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## 🔧 Google APIs Setup (für Produktion)

### OAuth 2.0 Konfiguration

1. **Google Cloud Project erstellen**
   - Gehe zu [Google Cloud Console](https://console.cloud.google.com/)
   - Erstelle ein neues Projekt oder verwende ein bestehendes

2. **APIs aktivieren**
   - Gehe zu "APIs & Services" > "Library"
   - Aktiviere: **Google Slides API** und **Google Drive API**

3. **OAuth 2.0 Credentials erstellen**
   - Gehe zu "APIs & Services" > "Credentials"
   - Klicke "Create Credentials" > "OAuth 2.0 Client IDs"
   - Wähle "Web application" als Application type
   - Füge Authorized redirect URIs hinzu:
     - `http://localhost:3000/api/auth/callback` (für Entwicklung)
     - `https://yourdomain.com/api/auth/callback` (für Produktion)

4. **Environment Variables setzen**

   ```env
   # Google OAuth (für User-Authentifizierung)
   GOOGLE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-oauth-client-secret

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Template Setup

1. **Google Slides Template erstellen**
   - Erstelle eine neue Präsentation in Google Slides
   - Füge Platzhalter-Text hinzu (wird durch KI-Inhalte ersetzt)
   - Notiere die Presentation ID aus der URL

2. **Template ID konfigurieren**
   - Aktualisiere `src/app/api/create-presentation/route.ts`
   - Setze die korrekte `templateId` für dein Template

## 🎯 Verwendung

### Schnellstart

1. **App starten**

   ```bash
   npm run dev
   ```

   Öffne [http://localhost:3000](http://localhost:3000)

2. **Google Login**
   - Klicke "Mit Google anmelden"
   - Erlaube Zugriff auf Google Drive und Slides

3. **Präsentation erstellen**
   - Gib dein Thema ein (z.B. "KI in der Bildung")
   - Wähle Business-Stil
   - Klicke "Präsentation generieren"

4. **Google Slides erstellen**
   - Überprüfe die Vorschau
   - Klicke "Google Slides erstellen"
   - Bearbeite die Präsentation direkt in Google Slides

### Erweiterte Features

- **Template-Generierung**: Erstelle Templates aus Websites
- **Live-Vorschau**: Siehe deine Präsentation vor dem Export
- **Responsive Design**: Funktioniert auf Desktop und Mobile

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── generate-json/ # Präsentationsgenerierung
│   │   ├── create-presentation/ # Google Slides Erstellung
│   │   ├── export/        # PDF/PPTX Export
│   │   └── templates/     # Template-Verwaltung
│   ├── globals.css        # Global Styles
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Hauptseite
├── components/            # React Components
│   ├── PresentationForm.tsx
│   ├── SlidePreview.tsx
│   ├── ExportButtons.tsx
│   └── LoadingIndicator.tsx
├── lib/                   # Utilities
│   └── store.ts           # Zustand Store
└── types/                 # TypeScript Types
    └── index.ts
```

## 🚀 API Endpoints

### Authentifizierung

- `GET /api/auth/login` - OAuth Login initiieren
- `GET /api/auth/callback` - OAuth Token austauschen
- `GET /api/auth/logout` - User ausloggen
- `GET /api/auth/status` - Login-Status prüfen

### Präsentationsgenerierung

- `POST /api/generate-json` - KI-generierte Präsentation erstellen
- `POST /api/create-presentation` - Google Slides Präsentation erstellen
- `POST /api/generate-template` - Website-basierte Templates generieren

### Verwaltung

- `GET /api/templates` - Verfügbare Templates abrufen
- `GET /api/export/:id/:format` - Export als PDF/PPTX

### Test-Endpunkte

- `GET /api/test-slides` - Google Slides API testen
- `GET /api/test-presentation-access` - Präsentationszugriff testen
- `GET /api/analyze-template` - Template-Struktur analysieren

## Entwicklung

### Scripts

- `npm run dev` - Entwicklungsserver
- `npm run build` - Produktionsbuild
- `npm run start` - Produktionsserver
- `npm run lint` - ESLint Code-Qualitätsprüfung
- `npx playwright test` - E2E Tests ausführen
- `npx playwright show-report` - Test-Report anzeigen

### Code Quality

- **TypeScript**: Strict Type Checking
- **ESLint**: Code Linting mit Next.js Standards
- **Prettier**: Automatische Code-Formatierung
- **Playwright**: End-to-End Testing Suite

## Deployment

### Vercel (empfohlen)

1. **Vercel Account erstellen**
2. **Repository verbinden**
3. **Environment Variables setzen**
4. **Deploy**

### Andere Platformen

Die App kann auf jeder Node.js-kompatiblen Platform deployed werden.

## Sicherheit

- API Keys werden nur serverseitig verwendet
- Keine Speicherung sensibler Nutzerdaten
- Rate Limiting für API-Endpoints
- Input Validation mit Zod (zukünftig)

## Lizenz

[MIT License](LICENSE)

## Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch
3. Commit deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## Support

Bei Fragen oder Problemen:

- Öffne ein Issue im Repository
- Kontaktiere das Entwicklungsteam
