# Google Cloud Setup für AI Slides Generator

## 📋 Übersicht

Dieser Leitfaden führt dich durch die Einrichtung von Google Cloud für die echte Integration von Google Slides und Google Drive in deiner AI Slides Generator App.

## 🔧 Schritt-für-Schritt Anleitung

### 1. Google Cloud Project erstellen

1. **Gehe zu Google Cloud Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Erstelle ein neues Projekt**:
   - Klicke auf "Projekt auswählen" (oben links)
   - Klicke auf "Neues Projekt"
   - Gib einen Namen ein (z.B. "ai-slides-generator")
   - Wähle deine Organisation/Billing Account
   - Klicke "Erstellen"

### 2. APIs aktivieren

1. **Gehe zu APIs & Services**:
   - Im linken Menü: "APIs & Services" > "Library"
2. **Aktiviere Google Slides API**:
   - Suche nach "Google Slides API"
   - Klicke "Aktivieren"
3. **Aktiviere Google Drive API**:
   - Suche nach "Google Drive API"
   - Klicke "Aktivieren"

### 3. Service Account erstellen

1. **Gehe zu IAM & Admin**:
   - Im linken Menü: "IAM & Admin" > "Service Accounts"
2. **Erstelle Service Account**:
   - Klicke "Service Account erstellen"
   - **Name**: `ai-slides-service`
   - **Beschreibung**: `Service Account für AI Slides Generator`
   - Klicke "Erstellen und fortfahren"
3. **Rollen zuweisen**:
   - Rolle: "Editor" (für vollen Zugriff auf Drive und Slides)
   - Oder spezifische Rollen:
     - `roles/drive.file` (für Drive-Dateien)
     - `roles/slides.presentations` (für Slides)
4. **Schlüssel erstellen**:
   - Bei deinem Service Account: "Schlüssel" > "Schlüssel hinzufügen" > "Neuen Schlüssel erstellen"
   - **Schlüsseltyp**: JSON
   - **Download**: Die JSON-Datei wird automatisch heruntergeladen

### 4. Credentials konfigurieren

1. **Öffne die heruntergeladene JSON-Datei**
2. **Aktualisiere `.env.local`**:

```env
# Google APIs
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GOOGLE_PROJECT_ID=your-google-project-id
```

**Wichtig**: Ersetze `\n` durch echte Zeilenumbrüche im Private Key!

### 5. Template-Dateien hochladen

1. **Gehe zu Google Drive**: [https://drive.google.com/](https://drive.google.com/)
2. **Erstelle einen Ordner**: "AI Slides Templates"
3. **Lade Template-Dateien hoch**:
   - Erstelle eine Google Slides Präsentation als Template
   - Füge Platzhalter für Inhalte hinzu
   - Teile die Datei mit dem Service Account (Editor-Zugriff)
4. **Notiere die Template-IDs**:
   - Öffne die Template-Datei
   - Kopiere die ID aus der URL: `https://docs.google.com/presentation/d/TEMPLATE_ID/edit`

### 6. Template-Konfiguration aktualisieren

Aktualisiere `src/app/api/templates/route.ts` mit echten Template-IDs:

```typescript
const templates: TemplateConfig[] = [
  {
    id: 'techeroes-modern-2025',
    name: 'Techeroes Modern',
    // ... andere Konfiguration
    googleSlidesTemplateId: '1ABC...XYZ' // Deine echte Template-ID
  }
]
```

## 🧪 Test der Integration

1. **Starte die App**: `npm run dev`
2. **Teste Präsentationserstellung**:
   - Gehe zu `http://localhost:3000`
   - Erstelle eine Präsentation
   - Klicke "Google Slides erstellen"
   - Überprüfe die Logs auf Fehler

## 🔍 Fehlerbehebung

### Häufige Fehler:

1. **"Invalid credentials"**:
   - Überprüfe GOOGLE_PRIVATE_KEY Formatierung
   - Stelle sicher, dass der Key korrekt kopiert wurde

2. **"Access denied"**:
   - Überprüfe Service Account Berechtigungen
   - Stelle sicher, dass Template-Dateien geteilt wurden

3. **"API not enabled"**:
   - Überprüfe in Google Cloud Console, ob APIs aktiviert sind

### Logs überprüfen:

Die App loggt detaillierte Fehler. Schaue in der Konsole nach:
- OpenAI Request/Response
- Google API Calls
- Template-IDs

## 📞 Support

Bei Problemen:
1. Überprüfe die Logs in der Browser-Konsole
2. Stelle sicher, dass alle Environment Variables gesetzt sind
3. Teste mit Google Cloud API Explorer

## 🎯 Nächste Schritte

Nach erfolgreichem Setup:
- Template-System erweitern
- Mehr Layouts hinzufügen
- Performance optimieren
- Deployment vorbereiten