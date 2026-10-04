# N best of vintage

Eine eigenständige Vintage-Shop-Frontend-Basis mit:
- responsivem Design
- Home / Drop / Shop / Kategorien / Über uns / FAQ
- Produktsuche
- Kategorien & Sortierung
- Produktdetail-Modal
- Warenkorb mit localStorage
- Demo-Checkout
- Early-Access-Form
- Drop-Countdown
- mobiler Navigation
- eigenen N best of vintage-Texten und Branding

## Start
Einfach `index.html` im Browser öffnen.

## Für einen echten Shop fehlen noch
1. Echte Produktbilder und Produktdaten.
2. Ein Backend/CMS für Produkte und Lagerbestand.
3. Ein echter Zahlungsanbieter (z. B. Stripe Checkout oder PayPal) über einen sicheren Server.
4. Versandlabel/Tracking-Anbindung.
5. Deine rechtlichen Texte: Impressum, Datenschutz, AGB, Widerrufsbelehrung.
6. Domain + Hosting.

Die UI ist bewusst eigenständig gestaltet und kopiert nicht die Markenauftritte der genannten Vorbilder.


## Echte Zahlungen vorbereiten
Das Projekt enthält jetzt einen Express-Server und einen Stripe-Checkout-Endpunkt.
1. Node.js installieren.
2. `npm install`
3. `.env.example` nach `.env` kopieren.
4. Einen Stripe-Testschlüssel eintragen.
5. `npm start`
6. `http://localhost:4242` öffnen.

Für Livezahlungen wird ein Live-Stripe-Key benötigt. Niemals Secret Keys in `index.html` oder `app.js` einbauen.

## Vor Livegang
- echte Produktfotos und Produktdaten eintragen
- Lagerbestand serverseitig verwalten
- Stripe-Webhooks für bestätigte Zahlungen/Bestellungen ergänzen
- Versanddienstleister und Tracking anbinden
- echte Händlerdaten in Impressum/Datenschutz/AGB/Widerruf eintragen
- rechtliche Texte prüfen lassen


## Produkte selbst verwalten
Öffne `admin.html`. Dort kannst du:
- neue Produkte anlegen
- Produktbilder direkt vom Computer auswählen
- Preise ändern
- Kategorie, Größe und Zustand ändern
- Beschreibung und Marke ändern
- Produkte auf „Ausverkauft“ setzen
- Produkte löschen
- Produktdaten als JSON exportieren/importieren

Die aktuelle einfache Version speichert die Produktdaten im Browser (`localStorage`). Für einen echten Mehrgeräte-/Produktionsbetrieb sollte daraus als nächster Schritt ein geschütztes Admin-Backend mit Datenbank und Bildspeicher werden.


## Produkte selbst verwalten
Öffne im laufenden Shop `/admin.html`.
Dort kannst du:
- Produkte erstellen
- Produktname ändern
- Preis ändern
- Kategorie und Größe ändern
- Zustand ändern
- Bestand ändern
- eigene Bilder hochladen
- Bild-URL setzen
- NEW/Drop-Markierung setzen
- Produkte bearbeiten oder löschen

Das Admin-Passwort kommt aus `ADMIN_PASSWORD` in `.env`. Vor dem Livegang ein langes, einzigartiges Passwort setzen. Für einen öffentlich erreichbaren Shop sollte zusätzlich ein richtiges Login-System mit gehashten Passwörtern, Sessions/CSRF-Schutz und Rate-Limiting eingerichtet werden.
