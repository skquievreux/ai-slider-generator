# Changelog

Alle wichtigen Änderungen an AI Slides Generator werden hier dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-10-09

### 🐛 Fixed
- **Template System**: Templates werden jetzt mit Platzhalter-Text erstellt
- **Presentation Creation**: Direkte Erstellung statt Template-Kopieren
- **Text Elements**: Sicherstellung, dass Textelemente vorhanden sind
- **Error Prevention**: Vermeidung von "no text elements" Fehlern

### 🔄 Changed
- **Template Generation**: Erstellt jetzt explizite Text-Boxen mit Platzhaltern
- **Presentation Creation**: Verwendet direkte API-Calls statt Template-Kopien
- **Error Handling**: Besseres Debugging für Template-Probleme

### 🏗️ Technical
- **Google Slides API**: Optimierte Batch-Operationen
- **Template Structure**: Klare Trennung von Titel und Inhalt
- **Fallback Logic**: Robuste Fehlerbehandlung

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
