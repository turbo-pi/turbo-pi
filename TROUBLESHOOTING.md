# MMM-ChatGPT Troubleshooting Gids

Als je geen geluid hoort of de microfoon niet reageert, volg dan deze stappen:

## 🔍 Quick Diagnostic Test

**Stap 1: Open de test pagina**

Open `test-audio.html` in je browser (bij voorkeur Chrome/Chromium):

```bash
# Als je Magic Mirror op dezelfde machine draait:
chromium-browser /home/user/turbo-pi/test-audio.html

# Of kopieer het naar de Magic Mirror en open het via:
chromium-browser ~/MagicMirror/modules/MMM-ChatGPT/test-audio.html
```

De test pagina controleert automatisch:
- ✅ Browser compatibiliteit
- ✅ Microfoon toegang
- ✅ Speaker functionaliteit
- ✅ Spraakherkenning
- ✅ Text-to-speech
- ✅ Wake word detectie

## 🎯 Veelvoorkomende Problemen

### 1. Geen Microfoon Toegang

**Symptomen:**
- Module start maar reageert niet op spraak
- Console toont "permission denied" errors

**Oplossingen:**

a) **Browser Permissions:**
```bash
# Chrome/Chromium: Open de browser en:
# 1. Klik op het slot-icoon in de adresbalk
# 2. Zet "Microphone" op "Allow"
# 3. Herlaad de pagina
```

b) **Controleer of microfoon werkt:**
```bash
# Test opname op Linux:
arecord -d 3 test.wav && aplay test.wav

# Lijst audio devices:
arecord -l
aplay -l
```

c) **Magic Mirror moet draaien op localhost of HTTPS:**
- Web Speech API werkt alleen op secure contexts
- Gebruik `http://localhost` of `https://`

### 2. Geen Geluid Output

**Symptomen:**
- Module werkt, maar je hoort geen spraak
- Tekst verschijnt wel op scherm

**Oplossingen:**

a) **Test systeem audio:**
```bash
# Test speaker op Linux:
speaker-test -t wav -c 2

# Of speel een test bestand:
aplay /usr/share/sounds/alsa/Front_Center.wav
```

b) **Controleer volume:**
```bash
# Verhoog volume met amixer:
amixer set Master 100%
amixer set Master unmute

# Of met alsamixer (interactief):
alsamixer
```

c) **Check PulseAudio (als je dat gebruikt):**
```bash
# Herstart PulseAudio:
pulseaudio --kill
pulseaudio --start

# Controleer output devices:
pactl list short sinks

# Stel default sink in:
pactl set-default-sink <sink-name>
```

d) **Configureer `voiceEnabled` in config:**
```javascript
config: {
    voiceEnabled: true,  // Moet true zijn
    autoSpeak: true,     // Moet true zijn voor automatisch spreken
}
```

### 3. Wake Word Wordt Niet Gedetecteerd

**Symptomen:**
- Microfoon werkt, maar wake word wordt niet herkend
- Module blijft in "idle" status

**Oplossingen:**

a) **Spreek duidelijk en niet te snel:**
```
✅ GOED: "Hey... mirror" (met kleine pauze)
❌ FOUT: "Heymirror" (te snel)
```

b) **Probeer verschillende wake words:**
```javascript
config: {
    wakeWord: "hey mirror",     // Standaard
    // Of probeer:
    // wakeWord: "hallo spiegel",
    // wakeWord: "ok mirror",
}
```

c) **Check de taal instelling:**
```javascript
config: {
    language: "nl-NL",  // Voor Nederlands
    // Of:
    // language: "en-US",  // Voor Engels
}
```

d) **Verhoog microfoon gevoeligheid:**
```javascript
config: {
    sensitivity: 0.8,  // Verhoog van 0.5 naar 0.8
}
```

e) **Test met de diagnostische tool:**
- Open `test-audio.html`
- Klik op "Start Luisteren" bij test 4
- Zeg "hey mirror" en kijk of het wordt gedetecteerd

### 4. Browser Compatibiliteit

**Web Speech API Ondersteuning:**

✅ **Werkt goed:**
- Google Chrome / Chromium
- Microsoft Edge (Chromium-based)

⚠️ **Beperkte ondersteuning:**
- Safari (alleen op macOS/iOS)

❌ **Werkt NIET:**
- Firefox (geen Speech Recognition)
- Oude browsers

**Installeer Chromium op Raspberry Pi:**
```bash
sudo apt-get update
sudo apt-get install chromium-browser
```

**Magic Mirror configureren voor Chromium:**
```bash
# In je Magic Mirror start script, gebruik:
DISPLAY=:0 chromium-browser --kiosk --no-sandbox \
    --disable-infobars \
    --use-fake-ui-for-media-stream \  # AUTO-accept microfoon
    http://localhost:8080
```

### 5. Console Errors Checken

**Open de Developer Console:**
```
1. Druk op F12 in de browser
2. Ga naar "Console" tab
3. Zoek naar rode foutmeldingen
```

**Veelvoorkomende errors:**

| Error | Oorzaak | Oplossing |
|-------|---------|-----------|
| `NotAllowedError` | Geen microfoon permissions | Geef browser toegang tot microfoon |
| `NotFoundError` | Geen microfoon gevonden | Sluit microfoon aan, test met `arecord -l` |
| `network error` | Geen internet | Check internetverbinding |
| `401 Unauthorized` | Verkeerde API key | Controleer OpenAI API key |
| `aborted` | Microfoon in gebruik | Sluit andere apps die microfoon gebruiken |

### 6. Specifieke Microfoon/Speaker Selecteren

Als je meerdere audio devices hebt:

**Methode 1: Via config (beperkt effectief):**
```javascript
config: {
    audioInputDeviceId: "your-device-id",  // Microfoon
    voiceName: "Google Nederlands",         // Stem
    debugAudioDevices: true,                // Toon devices in console
}
```

**Methode 2: Systeem level (AANBEVOLEN):**

```bash
# Linux - PulseAudio:
pavucontrol  # Grafische audio mixer

# Of via command line:
pactl set-default-source <microfoon-name>
pactl set-default-sink <speaker-name>

# Linux - ALSA (in ~/.asoundrc):
pcm.!default {
    type hw
    card 1
    device 0
}
```

### 7. Magic Mirror Specifieke Issues

**Module laadt niet:**
```bash
# Check logs:
pm2 logs MagicMirror

# Controleer of node_modules zijn geïnstalleerd:
cd ~/MagicMirror/modules/MMM-ChatGPT
npm install
```

**Module crasht:**
```javascript
// Check je config.js syntax:
node ~/MagicMirror/config/config.js

// Controleer of API key is ingesteld:
config: {
    apiKey: "sk-...",  // Mag NIET leeg zijn
}
```

## 🔧 Complete Test Procedure

Volg deze stappen in volgorde:

### Stap 1: Systeem Audio
```bash
# Test microfoon:
arecord -d 3 test.wav
aplay test.wav

# Test speaker:
speaker-test -t wav -c 2
```

### Stap 2: Browser Test
```bash
# Open test pagina:
chromium-browser test-audio.html

# Volg alle 6 tests en noteer waar het fout gaat
```

### Stap 3: Magic Mirror Config
```javascript
// Minimale werkende config:
{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        apiKey: "sk-your-key-here",
        wakeWord: "hey mirror",
        language: "nl-NL",
        voiceEnabled: true,
        autoSpeak: true,
        debugAudioDevices: true
    }
}
```

### Stap 4: Start Magic Mirror met Debug
```bash
cd ~/MagicMirror
npm start dev

# Of met pm2:
pm2 restart MagicMirror
pm2 logs MagicMirror
```

### Stap 5: Check Console (F12)
- Kijk naar rode errors
- Check "Available Audio Devices" log (als debugAudioDevices: true)
- Test wake word door "hey mirror" te zeggen

## 📋 Checklist

Ga deze lijst af om te zorgen dat alles correct is:

- [ ] Microfoon is aangesloten en werkt (test met `arecord`)
- [ ] Speaker werkt (test met `aplay`)
- [ ] Browser is Chrome/Chromium (NIET Firefox)
- [ ] Browser heeft microfoon permissions
- [ ] Magic Mirror draait op localhost of HTTPS
- [ ] OpenAI API key is correct ingesteld
- [ ] `voiceEnabled: true` in config
- [ ] `autoSpeak: true` in config
- [ ] Geen andere apps gebruiken de microfoon
- [ ] Internet connectie werkt
- [ ] npm dependencies zijn geïnstalleerd

## 🆘 Hulp Nodig?

Als bovenstaande stappen niet helpen:

1. **Verzamel diagnostische info:**
```bash
# Run dit en stuur de output:
echo "=== SYSTEM INFO ===" > debug-info.txt
uname -a >> debug-info.txt
echo "\n=== AUDIO DEVICES ===" >> debug-info.txt
arecord -l >> debug-info.txt
aplay -l >> debug-info.txt
echo "\n=== PULSEAUDIO ===" >> debug-info.txt
pactl list short sinks >> debug-info.txt
pactl list short sources >> debug-info.txt
```

2. **Test met test-audio.html en maak screenshots**

3. **Console errors (F12) kopiëren**

4. **Je config.js delen (zonder API key!)**

## 🎬 Video Tutorial Stappen

Volg deze stappen visueel:

1. Open Chrome Dev Tools (F12)
2. Ga naar Console tab
3. Toets geeft voor microfoon permissions
4. Zie logs verschijnen bij "hey mirror"
5. Zie ChatGPT response verschijnen
6. Hoor de response uitgesproken worden

Als één van deze stappen niet werkt, kijk dan naar het specifieke probleem hierboven.

## ⚡ Quick Fixes

**Werkt plots niet meer?**
```bash
# Reset browser permissions:
# Chrome → Settings → Privacy → Site Settings → Microphone → Reset

# Herstart audio systeem:
pulseaudio --kill && pulseaudio --start

# Herstart Magic Mirror:
pm2 restart MagicMirror
```

**Microfoon volume te laag?**
```bash
amixer set Capture 100%
amixer set Capture cap
```

**Audio output te zacht?**
```bash
amixer set Master 100%
amixer set Master unmute
```

## 📱 Platform Specifieke Tips

### Raspberry Pi
```bash
# Installeer audio tools:
sudo apt-get install alsa-utils pulseaudio

# Test audio output:
speaker-test -t wav -c 2

# USB microfoon vaak beter dan 3.5mm
```

### Linux Desktop
```bash
# Gebruik pavucontrol voor grafische control:
sudo apt-get install pavucontrol
pavucontrol
```

### macOS
- System Preferences → Security & Privacy → Microphone
- Geef Chrome toegang
- Test met Quicktime audio recording eerst

### Windows
- Instellingen → Privacy → Microfoon
- Sta app toegang toe
- Test met Voice Recorder app eerst
