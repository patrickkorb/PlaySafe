# Video-Dateinamen Konvention für den Rechner

## ⚠️ WICHTIG: Videos werden auf Cloudinary gehostet!

Die Videos werden **NICHT** in diesem Ordner gespeichert, sondern auf **Cloudinary** gehostet.
Grund: Die Videos sind insgesamt ~3GB groß, was zu viel für GitHub ist.

## Übersicht

Die Videos werden dynamisch basierend auf der gewählten **Sportart** und dem berechneten **Tarif** von Cloudinary geladen.

## Dateinamen-Struktur

Format: `[sportart]-[tarif].mp4`

### Sportarten (lowercase)
- `fussball` - Fußball
- `tennis` - Tennis
- `ski` - Ski
- `fitness` - Fitness
- `radfahren` - Radfahren
- `sonstiges` - Sonstiges

### Tarife (lowercase)
- `small` - Small Tarif (10€/Monat)
- `medium` - Medium Tarif (15€/Monat)
- `large` - Large Tarif (20€/Monat)

## Vollständige Liste benötigter Videos

Du benötigst insgesamt **18 Videos** für alle Kombinationen:

### Fußball
1. `fussball-small.mp4`
2. `fussball-medium.mp4`
3. `fussball-large.mp4`

### Tennis
4. `tennis-small.mp4`
5. `tennis-medium.mp4`
6. `tennis-large.mp4`

### Ski
7. `ski-small.mp4`
8. `ski-medium.mp4`
9. `ski-large.mp4`

### Fitness
10. `fitness-small.mp4`
11. `fitness-medium.mp4`
12. `fitness-large.mp4`

### Radfahren
13. `radfahren-small.mp4`
14. `radfahren-medium.mp4`
15. `radfahren-large.mp4`

### Sonstiges
16. `sonstiges-small.mp4`
17. `sonstiges-medium.mp4`
18. `sonstiges-large.mp4`

## Technische Anforderungen

- **Format**: MP4 (H.264 Codec empfohlen)
- **Auflösung**: 1080x1920 (Hochformat) oder 720x1280
- **Seitenverhältnis**: 9:16 (Portrait/Hochformat - optimiert für Mobile)
- **Dateigröße**: Idealerweise unter 10 MB pro Video für schnelle Ladezeiten
- **Dauer**: 30-90 Sekunden empfohlen

## Responsive Verhalten

- **Mobile**: Video wird in voller Breite angezeigt (perfekt für 9:16 Format)
- **Desktop/Tablet**: Video wird zentriiert mit maximaler Breite, damit es nicht zu breit wirkt

## Optionales Poster-Bild

Falls du ein Vorschaubild (Thumbnail) für die Videos verwenden möchtest:
- Speicherort: `/public/images/video-placeholder.jpg`
- Wird angezeigt, bevor das Video geladen ist

## Implementierung

Die Video-Auswahl erfolgt automatisch in `app/rechner/page.tsx` durch die Funktion `getVideoPath()`:

```typescript
const getVideoPath = (sportName: string, tariffTitle: string): string => {
    const sportMap = {
        'Fußball': 'fussball',
        'Tennis': 'tennis',
        'Ski': 'ski',
        'Fitness': 'fitness',
        'Radfahren': 'radfahren',
        'Sonstiges': 'sonstiges'
    }

    const normalizedSport = sportMap[sportName] || 'sonstiges'
    const normalizedTariff = tariffTitle.toLowerCase()

    return `/videos/${normalizedSport}-${normalizedTariff}.mp4`
}
```

## 🚀 Cloudinary Setup & Upload Anleitung

### Schritt 1: Cloudinary Account erstellen
1. Gehe zu [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Erstelle einen kostenlosen Account (25GB Speicher inklusive)
3. Nach der Registrierung findest du deinen **Cloud Name** im Dashboard

### Schritt 2: Cloud Name konfigurieren
1. Öffne die Datei `.env.local` im Projekt-Root
2. Ersetze `your-cloud-name` mit deinem echten Cloudinary Cloud Name:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dein-cloud-name
   ```
3. **Wichtig für Vercel:** Gehe zu deinen Vercel Project Settings → Environment Variables
4. Füge die Variable hinzu:
   - Key: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - Value: `dein-cloud-name`
   - Für alle Environments (Production, Preview, Development)

### Schritt 3: Ordner in Cloudinary erstellen
1. Logge dich in Cloudinary ein: [https://cloudinary.com/console](https://cloudinary.com/console)
2. Gehe zu "Media Library" (links im Menü)
3. Erstelle einen neuen Ordner namens **`playsafe`**

### Schritt 4: Videos hochladen
Du kannst Videos auf zwei Arten hochladen:

#### Option A: Web Interface (Einfach)
1. Öffne die Media Library
2. Klicke in den `playsafe` Ordner
3. Klicke "Upload" → "Upload Files"
4. Wähle alle 18 Videos aus und lade sie hoch
5. **Wichtig:** Benenne die Videos beim Upload um, damit sie exakt den Dateinamen entsprechen:
   - `fussball-small.mp4`, `fussball-medium.mp4`, etc.

#### Option B: Bulk Upload Tool (Schneller für viele Videos)
1. Installiere das Cloudinary CLI: `npm install -g cloudinary-cli`
2. Konfiguriere: `cld config`
3. Gebe deine Cloudinary Credentials ein
4. Bulk Upload:
   ```bash
   cld uploader upload ./public/videos/*.mp4 --folder playsafe --use_filename true
   ```

### Schritt 5: Verifizierung
Nach dem Upload sollten alle Videos unter dieser URL erreichbar sein:
```
https://res.cloudinary.com/DEIN-CLOUD-NAME/video/upload/playsafe/fussball-small.mp4
```

Teste eine URL im Browser - das Video sollte direkt abgespielt werden.

### Schritt 6: Deployment
1. Committe deine Änderungen: `git add . && git commit -m "Add Cloudinary video hosting"`
2. Pushe zu GitHub: `git push`
3. Vercel deployed automatisch
4. Die Videos werden jetzt von Cloudinary geladen! 🎉

## Vorteile von Cloudinary

✅ **Automatische Optimierung**: Videos werden automatisch für verschiedene Geräte optimiert
✅ **CDN**: Schnelle Auslieferung weltweit
✅ **Kostenlos**: 25GB Speicher im Free Tier
✅ **Kein GitHub-Limit**: Videos sind nicht im Repo
✅ **Adaptive Bitrate**: Automatische Qualitätsanpassung je nach Internetgeschwindigkeit

## Hinweise

- Stelle sicher, dass alle 18 Videos auf Cloudinary hochgeladen sind
- Videos werden mit dem `preload="metadata"` Attribut geladen (schnellere Ladezeit)
- Der Video-Player enthält Standard-Browser-Controls (Play, Pause, Lautstärke, etc.)
- Fallback-Text wird angezeigt, falls der Browser keine Videos unterstützt
- Videos sind NICHT in Git committed (siehe `.gitignore`)
