# CM4 Waveshare Magic Mirror Setup Guide

Complete setup guide voor MMM-ChatGPT op Waveshare CM4 Magic Mirror hardware.

## 📦 Hardware Overzicht

**Waveshare CM4 Magic Mirror specificaties:**
- Raspberry Pi Compute Module 4
- 10.1" of 13.3" display (afhankelijk van model)
- Capacitieve touchscreen
- HDMI audio output
- USB poorten voor audio devices
- Recommended: 4GB+ RAM voor optimale prestaties

## 🚀 Stap 1: Basis Installatie

### 1.1 Installeer Magic Mirror²

```bash
cd ~
git clone https://github.com/MichMich/MagicMirror
cd MagicMirror
npm install
```

### 1.2 Installeer MMM-ChatGPT Module

```bash
cd ~/MagicMirror/modules
git clone https://github.com/yourusername/MMM-ChatGPT.git
cd MMM-ChatGPT
npm install
```

### 1.3 Installeer Audio Tools

```bash
sudo apt-get update
sudo apt-get install -y alsa-utils pulseaudio chromium-browser
```

## 🎤 Stap 2: Audio Setup

### 2.1 Test Ingebouwde Audio

De Waveshare CM4 heeft HDMI audio en USB audio support:

```bash
# Toon beschikbare audio devices:
arecord -l    # Microfoons
aplay -l      # Speakers

# Test speaker (HDMI audio):
speaker-test -t wav -c 2

# Test microfoon (USB of ingebouwd):
arecord -d 3 test.wav
aplay test.wav
```

### 2.2 Aanbevolen: USB Microfoon

Voor beste kwaliteit, gebruik een USB microfoon:

**Aanbevolen USB microfoons:**
- USB desktop microfoon (€10-20)
- USB webcam met ingebouwde mic
- USB audio adapter met 3.5mm mic input

**Test USB microfoon:**
```bash
# Sluit USB microfoon aan
# Check of het gedetecteerd is:
lsusb | grep -i audio

# Test opname:
arecord -D hw:1,0 -d 3 test.wav
aplay test.wav
```

### 2.3 Configureer Default Audio

**Optie A: Via PulseAudio (Aanbevolen)**
```bash
# Start PulseAudio:
pulseaudio --start

# Grafische mixer:
sudo apt-get install pavucontrol
pavucontrol  # Stel defaults in via GUI

# Of via commandline:
pactl list short sources  # Toon microfoons
pactl list short sinks    # Toon speakers

# Stel default in:
pactl set-default-source <source-name>
pactl set-default-sink <sink-name>
```

**Optie B: Via ALSA**

Maak `~/.asoundrc`:
```
pcm.!default {
    type hw
    card 1
    device 0
}

ctl.!default {
    type hw
    card 1
}
```

### 2.4 Volume Configuratie

```bash
# Verhoog volume:
amixer set Master 100%
amixer set Master unmute
amixer set Capture 80%
amixer set Capture cap

# Maak permanent:
sudo alsactl store
```

## 🤖 Stap 3: AI Provider Setup

Je hebt 3 opties voor de AI backend:

### Optie A: OpenAI (Cloud - Aanbevolen voor beginners)

**Voordelen:**
- ✅ Beste AI kwaliteit
- ✅ Geen lokale resources nodig
- ✅ Werkt altijd snel

**Nadelen:**
- ❌ Kosten per gebruik (~€0.20-0.30/maand bij normaal gebruik)
- ❌ Internetverbinding vereist

**Setup:**
1. Ga naar https://platform.openai.com/api-keys
2. Maak een API key aan
3. Kopieer de key

**Config:**
```javascript
config: {
    aiProvider: "openai",
    apiKey: "sk-your-key-here",
    model: "gpt-3.5-turbo"
}
```

### Optie B: Ollama (Lokaal - Gratis!)

**Voordelen:**
- ✅ Volledig gratis
- ✅ Werkt offline
- ✅ Privacy (alles lokaal)

**Nadelen:**
- ❌ Langzamere responses (10-30 seconden)
- ❌ Vereist 4GB+ RAM
- ❌ Kwaliteit iets lager dan GPT-4

**Setup:**
```bash
# Installeer Ollama:
curl https://ollama.ai/install.sh | sh

# Download een model:
# Voor CM4 met 4GB RAM:
ollama pull phi              # Klein model (~2GB, snel)
# Of:
ollama pull llama2           # Groter model (~4GB, beter)

# Voor CM4 met 8GB RAM:
ollama pull mistral          # Nog beter (~4GB)
ollama pull neural-chat      # Specialistische conversatie (~4GB)

# Start Ollama server:
ollama serve

# Test:
ollama run phi "Hello, how are you?"
```

**Config:**
```javascript
config: {
    aiProvider: "ollama",
    ollamaUrl: "http://localhost:11434",
    model: "phi",  // of "llama2", "mistral"
    timeout: 60000  // Langer timeout voor lokale processing
}
```

**Ollama als systemd service:**
```bash
# Maak service file:
sudo nano /etc/systemd/system/ollama.service
```

```ini
[Unit]
Description=Ollama Service
After=network.target

[Service]
Type=simple
User=pi
ExecStart=/usr/local/bin/ollama serve
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable en start:
sudo systemctl enable ollama
sudo systemctl start ollama
sudo systemctl status ollama
```

### Optie C: LocalAI (Lokaal OpenAI-compatible)

**Voordelen:**
- ✅ Volledig gratis
- ✅ OpenAI API compatible
- ✅ Meerdere modellen

**Nadelen:**
- ❌ Complex om te installeren
- ❌ Vereist meer resources

**Setup:**
```bash
# Met Docker:
docker run -p 8080:8080 \
  -v $PWD/models:/models \
  localai/localai:latest

# Download models via LocalAI UI:
# http://localhost:8080
```

**Config:**
```javascript
config: {
    aiProvider: "localai",
    localAIUrl: "http://localhost:8080",
    model: "gpt-3.5-turbo",
    timeout: 60000
}
```

## ⚙️ Stap 4: Module Configuratie

### 4.1 Kopieer Sample Config

```bash
# Voor CM4 Waveshare:
cp ~/MagicMirror/modules/MMM-ChatGPT/config.cm4-waveshare.js ~/config-reference.js

# Of algemene config:
cp ~/MagicMirror/modules/MMM-ChatGPT/config.sample.js ~/config-reference.js
```

### 4.2 Edit Magic Mirror Config

```bash
nano ~/MagicMirror/config/config.js
```

Voeg toe aan modules array:

```javascript
{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        // Kies je AI provider:
        aiProvider: "openai",  // of "ollama", "localai"

        // OpenAI config:
        apiKey: "sk-your-key-here",
        model: "gpt-3.5-turbo",

        // Spraak config:
        wakeWord: "hey mirror",
        language: "nl-NL",
        voiceEnabled: true,
        autoSpeak: true,

        // Audio devices (optioneel):
        voiceName: "Google Nederlands",
        sensitivity: 0.6,  // CM4 met USB mic

        // Display:
        displayDuration: 30000,
        showTranscript: true,
        showResponse: true,

        // Debug mode (tijdelijk aanzetten):
        debugAudioDevices: true
    }
}
```

## 🌐 Stap 5: Browser Setup

**BELANGRIJK:** Web Speech API werkt ALLEEN in Chromium!

### 5.1 Auto-start Chromium in Kiosk Mode

Maak start script:

```bash
nano ~/start-magic-mirror.sh
```

```bash
#!/bin/bash

# Start Magic Mirror server
cd ~/MagicMirror
DISPLAY=:0 npm start &

# Wait for server to start
sleep 10

# Start Chromium in kiosk mode met auto-accept voor microfoon
DISPLAY=:0 chromium-browser \
    --kiosk \
    --no-sandbox \
    --disable-infobars \
    --disable-session-crashed-bubble \
    --disable-restore-session-state \
    --use-fake-ui-for-media-stream \
    --autoplay-policy=no-user-gesture-required \
    http://localhost:8080
```

```bash
chmod +x ~/start-magic-mirror.sh
```

### 5.2 Auto-start bij Boot

```bash
# Edit autostart:
mkdir -p ~/.config/lxsession/LXDE-pi
nano ~/.config/lxsession/LXDE-pi/autostart
```

Voeg toe:
```
@/home/pi/start-magic-mirror.sh
```

## 🧪 Stap 6: Testing

### 6.1 Test Systeem Audio

```bash
cd ~/MagicMirror/modules/MMM-ChatGPT
./test-system-audio.sh
```

### 6.2 Test Web Speech API

```bash
chromium-browser ~/MagicMirror/modules/MMM-ChatGPT/test-audio.html
```

**Checklist:**
- [ ] Browser compatibility ✅
- [ ] Microfoon toegang ✅
- [ ] Speaker output ✅
- [ ] Spraakherkenning ✅
- [ ] Wake word detectie ✅
- [ ] Text-to-speech ✅

### 6.3 Test Magic Mirror Module

```bash
cd ~/MagicMirror
npm start
```

1. Wacht tot module geladen is
2. Open browser console (F12)
3. Kijk naar "Available Audio Devices" log
4. Zeg "hey mirror"
5. Wacht op "Ja?"
6. Stel een vraag: "Hoe laat is het?"

## 🔧 Optimalisatie voor CM4

### Performance Tuning

**Voor OpenAI:**
```javascript
config: {
    maxTokens: 100,        // Korte responses
    temperature: 0.7,
    timeout: 20000         // 20 seconden
}
```

**Voor Ollama op CM4:**
```javascript
config: {
    model: "phi",          // Snelste model voor CM4
    maxTokens: 100,        // Kortere responses = sneller
    timeout: 60000,        // Langer timeout
    historyLimit: 3        // Minder context = sneller
}
```

### Memory Management

Voor CM4 met 4GB RAM bij gebruik van Ollama:

```bash
# Configureer swap:
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Set CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### Audio Latency Optimalisatie

```bash
# Reduce audio latency:
sudo nano /boot/config.txt
```

Voeg toe:
```
# Audio optimization
dtparam=audio=on
audio_pwm_mode=2
```

## 🐛 Troubleshooting CM4-Specifiek

### Probleem: Geen Audio Output via HDMI

**Oplossing:**
```bash
# Force HDMI audio:
sudo nano /boot/config.txt

# Voeg toe:
hdmi_drive=2  # Force HDMI met audio

# Reboot:
sudo reboot

# Test:
speaker-test -t wav -c 2 -D plughw:0,0
```

### Probleem: USB Microfoon niet gedetecteerd

**Oplossing:**
```bash
# Check USB devices:
lsusb

# Check audio devices:
arecord -l

# Probeer andere USB poort
# CM4 heeft soms problemen met USB3 (blauwe poorten)
# Gebruik USB2 poort (zwart)

# Force USB device reload:
sudo rmmod snd_usb_audio
sudo modprobe snd_usb_audio
```

### Probleem: Ollama te langzaam

**Oplossingen:**
1. Gebruik kleiner model: `phi` in plaats van `llama2`
2. Verhoog swap space
3. Overweeg OpenAI API voor snellere responses
4. Reduce `maxTokens` naar 50-80

### Probleem: Spraakherkenning werkt niet

**Oplossing:**
```bash
# Zorg dat Chromium flags correct zijn:
chromium-browser \
    --use-fake-ui-for-media-stream \  # AUTO-accept microfoon!
    --autoplay-policy=no-user-gesture-required \
    http://localhost:8080

# Check console voor errors (F12)
# Moet zien: "Microphone access granted"
```

## 📊 Hardware Resource Gebruik

### Met OpenAI (Cloud):
- RAM: ~200MB voor module
- CPU: Laag (alleen spraakherkenning)
- Netwerk: ~10KB per vraag

### Met Ollama (Lokaal):
| Model | RAM Gebruik | Response Tijd | Kwaliteit |
|-------|-------------|---------------|-----------|
| phi | ~2GB | 5-15 sec | Goed |
| llama2 | ~4GB | 10-30 sec | Zeer goed |
| mistral | ~4GB | 10-25 sec | Uitstekend |

**Aanbeveling voor CM4:**
- 4GB RAM: Gebruik `phi` of OpenAI
- 8GB RAM: Gebruik `llama2` of `mistral`

## 🎯 Recommended CM4 Configuration

Voor beste balans tussen kwaliteit en prestaties:

```javascript
{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        // OPTION 1: Cloud (Fast, High Quality)
        aiProvider: "openai",
        apiKey: "sk-...",
        model: "gpt-3.5-turbo",
        maxTokens: 100,
        timeout: 20000,

        // OPTION 2: Local (Free, Slower)
        // aiProvider: "ollama",
        // ollamaUrl: "http://localhost:11434",
        // model: "phi",
        // maxTokens: 80,
        // timeout: 60000,

        wakeWord: "hey mirror",
        language: "nl-NL",
        voiceEnabled: true,
        autoSpeak: true,
        voiceName: "Google Nederlands",
        sensitivity: 0.6,
        displayDuration: 30000,
        historyLimit: 3  // Minder history = sneller
    }
}
```

## 📚 Extra Resources

- [Waveshare CM4 Wiki](https://www.waveshare.com/wiki/CM4-IO-BASE-B)
- [Ollama Models](https://ollama.ai/library)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Magic Mirror² Forum](https://forum.magicmirror.builders/)

## ✅ Final Checklist

- [ ] Magic Mirror geïnstalleerd
- [ ] MMM-ChatGPT module geïnstalleerd
- [ ] Audio devices werken (test met `./test-system-audio.sh`)
- [ ] AI provider geconfigureerd (OpenAI of Ollama)
- [ ] Browser test geslaagd (`test-audio.html`)
- [ ] Wake word detectie werkt
- [ ] Text-to-speech werkt
- [ ] Module start automatisch bij boot
- [ ] Performance is acceptabel

🎉 **Klaar! Je CM4 Waveshare Magic Mirror met ChatGPT is nu operationeel!**

Voor problemen, zie `TROUBLESHOOTING.md`.
