# Video-Dateinamen Konvention für den Rechner

## Übersicht

Dieses Verzeichnis enthält alle Videos, die auf der Rechner-Ergebnisseite angezeigt werden.
Die Videos werden dynamisch basierend auf der gewählten **Sportart** und dem berechneten **Tarif** geladen.

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

## Hinweise

- Stelle sicher, dass alle 18 Videos vorhanden sind, damit keine Fehler auftreten
- Videos werden mit dem `preload="metadata"` Attribut geladen (schnellere Ladezeit)
- Der Video-Player enthält Standard-Browser-Controls (Play, Pause, Lautstärke, etc.)
- Fallback-Text wird angezeigt, falls der Browser keine Videos unterstützt
