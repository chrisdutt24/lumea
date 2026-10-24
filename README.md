# Lumea – einfache HTML/CSS/JavaScript-Version

Diese Version baut die sichtbaren Inhalte aus dem Lovable-Projekt als statische Website ohne React, TypeScript, Tailwind oder Build-Schritt nach.

## Dateien

- `index.html` – Landingpage
- `bestellen.html` – Bestellformular / Demo-Checkout
- `danke.html` – Bestätigungsseite
- `fachkreise.html` – Passwortabfrage und Fachinformation
- `datenschutz.html` – Datenschutz- und Tracking-Demo-Hinweise
- `css/style.css` – gesamtes Styling und responsive Layout
- `js/main.js` – Formular, Demo-Passwort und Cookie-Einstellungen
- `images/hero.jpg` – Original-Hero-Bild aus dem GitHub-Repository
- `vercel.json` – ermöglicht saubere URLs wie `/fachkreise` statt `/fachkreise.html`

## Passwort für die Demo

Aktuell lautet das Demo-Passwort `Lumea2026`. Du kannst es in `js/main.js` bei `FACHKREISE_DEMO_PASSWORD` ändern.

**Wichtig:** Das ist nur eine einfache Frontend-Abfrage, keine echte Sicherheit. Das Passwort ist im JavaScript sichtbar und die Fachinformationen sind in der HTML-Datei enthalten. Nutze das nicht, um vertrauliche Informationen zu schützen.

## Bestellformular

Das Formular ist ein Demo-Flow: Es prüft die Pflichtfelder im Browser und führt dann auf die Dankeseite. Es werden keine Formulardaten an einen Server gesendet, keine Bestell-E-Mails versandt und keine Zahlungen verarbeitet. Keine echten persönlichen Daten eingeben.

## Tracking

Es wird absichtlich kein echter Meta Pixel und kein Google Analytics geladen. Die Cookie-Einstellungen sind nur eine Demo. Für echtes Tracking braucht es eine gültige Pixel-ID, eine korrekt implementierte Einwilligungsverwaltung und Tests im Meta Events Manager.

## Lokal testen

Du kannst die Dateien direkt öffnen. Für ein lokales Hosting mit VS Code empfiehlt sich die Erweiterung Live Server.

## Auf Vercel veröffentlichen

1. Erstelle am besten ein neues GitHub-Repository für die statische Version oder sichere zuerst das bestehende React-Projekt in einem Branch.
2. Lade die Dateien aus diesem Ordner in das Repository-Hauptverzeichnis hoch.
3. Importiere das Repository in Vercel. Da die Website statisch ist, ist kein Build-Befehl nötig; als Output Directory kann `.` verwendet werden.
4. `vercel.json` aktiviert saubere URLs, sodass `/fachkreise`, `/bestellen` und `/danke` funktionieren.
