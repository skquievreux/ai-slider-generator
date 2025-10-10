# Changelog

Alle wichtigen Änderungen an AI Slides Generator werden hier dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-10

### ✨ Added

- **Enhanced Template System**: Verbesserte Template-Verarbeitung mit robusterer Platzhalter-Erkennung
- **Improved Error Handling**: Bessere Fehlerbehandlung in Präsentationserstellung
- **Code Quality Improvements**: Automatische Code-Formatierung und Linting

### 🔄 Changed

- **Next.js Security Update**: Aktualisierung auf Next.js 14.2.33 für kritische Sicherheitslücken
- **Dependency Updates**: Aktualisierung veralteter Pakete für bessere Kompatibilität
- **TypeScript Improvements**: Strengere Typisierung und Fehlerbehebung

### 🐛 Fixed

- **TypeScript Errors**: Behebung impliziter 'any' Typen in API-Routen
- **Test Compatibility**: Aktualisierung von Tests für neue Version
- **Code Formatting**: Konsistente Formatierung aller Dateien

### 🔧 Technical Improvements

- **Build Process**: Optimierter Build-Prozess mit verbesserter Fehlerbehandlung
- **Code Quality**: Integration von Prettier und ESLint für konsistenten Code-Stil
- **Performance**: Verbesserte Build-Zeiten und Optimierungen

## [1.0.4] - 2025-10-09

### ✨ Added

- **Template System Integration**: Präsentationen verwenden jetzt ausgewählte Templates
- **Placeholder Replacement**: Templates mit Platzhaltern werden durch echten Content ersetzt
- **Template vs Blank Mode**: Automatische Erkennung von Template- oder Blank-Präsentationen

### 🔄 Changed

- **Presentation Creation**: Template-Kopien mit anschließender Content-Ersetzung
- **Dual Mode Support**: Templates werden kopiert, Blank-Präsentationen werden erstellt
- **Content Replacement**: Intelligente Platzhalter-Erkennung ({{TITLE}}, {{CONTENT}}, etc.)

### 🏗️ Technical

- **Template Processing**: replaceTemplatePlaceholders() für Template-basierte Präsentationen
- **Fallback Creation**: createBlankPresentationContent() für Template-lose Präsentationen
- **Content Mapping**: Automatische Zuordnung von Slides zu Template-Platzhaltern

## [1.0.5] - 2025-10-10

### 🐛 Fixed

- Kleine Bugfixes und Verbesserungen

## [1.0.1] - 2025-10-09

### 🐛 Fixed

- **Code Quality**: ESLint und Prettier Konfiguration hinzugefügt
- **Code Formatting**: Alle Dateien mit Prettier formatiert
- **TypeScript**: Linting-Regeln für bessere Code-Qualität
- **Documentation**: Markdown-Dateien konsistent formatiert

### 📚 Documentation

- **Code Standards**: Prettier und ESLint Regeln dokumentiert
- **Development Setup**: Code-Qualität-Tools hinzugefügt

## [1.0.0] - 2025-10-09

### ✨ Added

- **Google OAuth 2.0 Integration**: Sichere User-Authentifizierung mit Google
- **Template-basierte Präsentationserstellung**: Kopieren vorhandener Templates statt Neuerstellung
- **Website-basierte Template-Generierung**: Automatische Branding-Extraktion aus Websites
- **Live-Vorschau**: Echtzeit-Vorschau generierter Präsentationen
- **Responsive Design**: Mobile-optimierte Benutzeroberfläche
- **Comprehensive Error Handling**: Detaillierte Fehlermeldungen und Debugging
- **Version Display**: Versionsanzeige in der Benutzeroberfläche

### 🔄 Changed

- **Authentifizierung**: Vollständiger Wechsel von Service Account zu User OAuth
- **API-Architektur**: Neue OAuth-Endpunkte (/api/auth/\*)
- **Template-System**: Verbesserte Template-Verwaltung und -Generierung
- **User Experience**: Optimierte Benutzeroberfläche mit besserem Feedback

### 🐛 Fixed

- **Google Slides API Integration**: Korrekte Parameter und Authentifizierung
- **Template-Kopieren**: Zuverlässiges Kopieren in User Drive
- **Text-Manipulation**: Robuste Text-Element-Erkennung und -Bearbeitung
- **Error Recovery**: Automatische Bereinigung fehlgeschlagener Operationen

### 🔧 Technical Improvements

- **TypeScript**: Strenge Typisierung und bessere Code-Qualität
- **API Documentation**: Umfassende Dokumentation aller Endpunkte
- **Security**: Verbesserte Sicherheit durch OAuth 2.0
- **Performance**: Optimierte API-Calls und Caching
- **Testing**: Erweiterte Testabdeckung für APIs

### 📚 Documentation

- **README.md**: Vollständige Überarbeitung für v1.0.0
- **Setup Guide**: Detaillierte Google Cloud Konfiguration
- **API Reference**: Vollständige Endpunkt-Dokumentation
- **Troubleshooting**: Häufige Probleme und Lösungen

### 🏗️ Architecture

- **Modular Design**: Klare Trennung von Authentifizierung und Business Logic
- **Error Boundaries**: Robuste Fehlerbehandlung auf allen Ebenen
- **Scalable API**: Erweiterbare Architektur für zukünftige Features
- **Clean Code**: Konsistente Code-Standards und Best Practices

## [0.1.0] - 2025-10-01

### ✨ Added

- Initiale Implementierung von AI Slides Generator
- OpenAI GPT-4 Integration für Präsentationsgenerierung
- Grundlegende Google Slides API Integration
- Basis-UI mit Next.js und Tailwind CSS
- Einfache Template-Unterstützung

### 🔧 Technical

- Next.js 14 App Router Setup
- TypeScript Konfiguration
- Zustand State Management
- Grundlegende API-Routen Struktur
