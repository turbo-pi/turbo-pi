# MMM-ChatGPT

Een Magic Mirror² module voor spraakinteractie met AI assistenten (ChatGPT, Ollama, LocalAI), inclusief wake word detectie.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.1.0-green.svg)

## Overzicht / Overview

**Nederlands:**
Deze module maakt het mogelijk om met je Magic Mirror te praten via een wake word (bijv. "hey mirror"). De mirror luistert continu naar het wake word en als het gedetecteerd wordt, kun je een vraag stellen die naar een AI assistant wordt gestuurd. Ondersteunt zowel cloud-based (OpenAI) als lokale AI modellen (Ollama, LocalAI). Het antwoord wordt zowel getoond op het scherm als uitgesproken.

**English:**
This module enables voice interaction with your Magic Mirror using a wake word (e.g., "hey mirror"). The mirror continuously listens for the wake word, and when detected, you can ask a question that will be sent to an AI assistant. Supports both cloud-based (OpenAI) and local AI models (Ollama, LocalAI). The response is both displayed on screen and spoken aloud.

## ✨ Features / Functies

- 🎤 **Wake Word Detection** - Continuous listening for customizable wake word
- 🤖 **Multiple AI Providers** - Support for OpenAI, OpenClaw, Ollama, and LocalAI
- ⭐ **OpenClaw Integration** - AI agent runtime with 50+ integrations (RECOMMENDED!)
- 🆓 **Free Option** - Use local AI models with Ollama (no API costs!)
- 🔒 **Privacy** - Run completely offline or self-hosted with OpenClaw/Ollama
- 🗣️ **Voice Response** - Text-to-speech for AI responses
- 💬 **Conversation History** - Maintains context across multiple exchanges
- 🎨 **Customizable UI** - Configurable display with animations
- 🌍 **Multi-language Support** - Works with any language supported by Web Speech API
- 🎙️ **Audio Device Selection** - Choose specific microphone and voice for optimal quality
- 🖥️ **CM4 Optimized** - Hardware profiles for Raspberry Pi CM4 Waveshare Magic Mirror
- ⚙️ **Highly Configurable** - Many options to customize behavior
- 🛠️ **Diagnostic Tools** - Built-in audio testing and troubleshooting tools

## 🆕 What's New in v2.1

- **OpenClaw Integration** ⭐: Support for OpenClaw AI agent runtime (recommended!)
- **Flexible AI Routing**: Use OpenClaw to switch between Claude, GPT, DeepSeek, and more
- **Enhanced Privacy**: Run fully self-hosted with OpenClaw or Ollama
- **Multi-Provider Support**: Choose between OpenAI, OpenClaw, Ollama, or LocalAI
- **Local AI Models**: Run completely free with Ollama (Llama 2, Mistral, Phi, etc.)
- **CM4 Hardware Profile**: Optimized configuration for Waveshare CM4 Magic Mirror
- **Enhanced API Support**: Better error handling and timeout management
- **Diagnostic Tools**: Audio testing webpage and system audio scripts
- **Comprehensive Documentation**: CM4 setup guide and troubleshooting manual

## 🤖 AI Provider Options

Kies de AI backend die bij jou past:

### Option 1: OpenAI (Cloud)

**Best for:** Beste kwaliteit, snelste responses, geen lokale setup

- ✅ GPT-4 en GPT-3.5-turbo modellen
- ✅ Altijd beschikbaar en snel
- ✅ Hoogste kwaliteit antwoorden
- ❌ Kosten: ~€0.20-0.30/maand bij normaal gebruik
- ❌ Internet vereist

```javascript
config: {
    aiProvider: "openai",
    apiKey: "sk-your-key-here",
    model: "gpt-3.5-turbo"
}
```

### Option 2: OpenClaw (AI Agent Runtime - RECOMMENDED!) ⭐

**Best for:** Flexibiliteit, multiple LLM backends, zelf-hosted

- ✅ Open-source AI agent runtime ([openclaw.ai](https://openclaw.ai))
- ✅ Routes naar meerdere LLM backends (Claude, GPT, DeepSeek, etc.)
- ✅ 50+ integraties (chat, smart home, productivity tools)
- ✅ Zelf-hosted op je eigen machine
- ✅ Privacy-vriendelijk en configureerbaar
- ✅ Ideaal voor CM4 Waveshare Magic Mirror
- ❌ Vereist initiële setup

```javascript
config: {
    aiProvider: "openclaw",
    openClawUrl: "http://localhost:3000",
    model: "claude"  // of "gpt-4", "deepseek", etc.
}
```

**Setup:**
```bash
# Clone OpenClaw repository
git clone https://github.com/openclaw/openclaw
cd openclaw

# Install dependencies
npm install

# Configure your LLM backends in .env
# Start OpenClaw server
npm start
```

**Complete Setup Guide:**
📖 **See [OPENCLAW-SETUP.md](OPENCLAW-SETUP.md) for detailed installation instructions!**

**Why OpenClaw?**
- 🔄 Switch between AI providers without changing your Magic Mirror config
- 🎛️ Central configuration for all your AI services
- 🔒 All data stays on your machine
- 🚀 One of the fastest-growing open-source AI projects (191k+ GitHub stars)

### Option 3: Ollama (Local - FREE!)

**Best for:** Volledig gratis, privacy, offline gebruik

- ✅ Volledig gratis
- ✅ Werkt offline
- ✅ Privacy - alles lokaal
- ✅ Modellen: Llama 2, Mistral, Phi, Neural Chat
- ❌ Langzamer (10-30 sec per vraag op CM4)
- ❌ Vereist 4GB+ RAM

```javascript
config: {
    aiProvider: "ollama",
    ollamaUrl: "http://localhost:11434",
    model: "phi"  // of "llama2", "mistral"
}
```

**Setup:**
```bash
curl https://ollama.ai/install.sh | sh
ollama pull phi
ollama serve
```

### Option 4: LocalAI (Local OpenAI-compatible)

**Best for:** Lokale OpenAI-compatible API

- ✅ OpenAI API compatible
- ✅ Meerdere model backends
- ✅ Gratis en privacy-vriendelijk
- ❌ Complex om in te stellen

```javascript
config: {
    aiProvider: "localai",
    localAIUrl: "http://localhost:8080",
    model: "gpt-3.5-turbo"
}
```

## Screenshots

![Module Screenshot](screenshot.png)

## Installation / Installatie

### Stap 1: Clone de Repository

Navigeer naar de Magic Mirror modules directory:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/yourusername/MMM-ChatGPT.git
cd MMM-ChatGPT
```

### Stap 2: Installeer Dependencies

```bash
npm install
```

### Stap 3: Kies en Setup je AI Provider

**Voor OpenAI (Cloud):**
1. Ga naar [OpenAI Platform](https://platform.openai.com/)
2. Maak een account aan of log in
3. Ga naar API Keys sectie
4. Genereer een nieuwe API key
5. Bewaar deze key veilig

**Voor Ollama (Lokaal - Gratis):**
```bash
# Installeer Ollama:
curl https://ollama.ai/install.sh | sh

# Download een model (kies één):
ollama pull phi         # Klein, snel (~2GB)
ollama pull llama2      # Groter, beter (~4GB)
ollama pull mistral     # Beste kwaliteit (~4GB)

# Start Ollama server:
ollama serve
```

**Voor LocalAI:**
Zie [LocalAI documentatie](https://localai.io/basics/getting_started/)

### Stap 4: Configureer de Module

**Basic configuratie (OpenAI):**

```javascript
{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        aiProvider: "openai",
        apiKey: "YOUR_OPENAI_API_KEY_HERE",
        model: "gpt-3.5-turbo",
        wakeWord: "hey mirror",
        language: "nl-NL",
        voiceEnabled: true,
        autoSpeak: true
    }
}
```

**Ollama configuratie (Gratis, lokaal):**

```javascript
{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        aiProvider: "ollama",
        ollamaUrl: "http://localhost:11434",
        model: "phi",
        wakeWord: "hey mirror",
        language: "nl-NL",
        voiceEnabled: true,
        timeout: 60000  // Langer timeout voor lokaal
    }
}
```

**Voor CM4 Waveshare hardware:**
Zie `config.cm4-waveshare.js` voor geoptimaliseerde settings en `CM4-SETUP.md` voor complete setup guide.

## Configuration Options / Configuratie Opties

### AI Provider Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `aiProvider` | String | "openai" | AI provider: "openai", "openclaw", "ollama", or "localai" |
| `apiKey` | String | **Required for OpenAI** | Your OpenAI API key |
| `model` | String | "gpt-3.5-turbo" | Model name (depends on provider) |
| `apiEndpoint` | String | OpenAI default | Custom API endpoint (for Azure OpenAI, etc.) |
| `openClawUrl` | String | "http://localhost:3000" | OpenClaw server URL |
| `openClawEndpoint` | String | "/api/chat" | OpenClaw API endpoint |
| `openClawApiKey` | String | null | Optional OpenClaw API key for authentication |
| `ollamaUrl` | String | "http://localhost:11434" | Ollama server URL |
| `localAIUrl` | String | "http://localhost:8080" | LocalAI server URL |
| `timeout` | Number | 30000 | API request timeout in ms (use 60000 for local AI) |

### Speech & Wake Word

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `wakeWord` | String | "hey mirror" | The wake word to activate the module |
| `language` | String | "nl-NL" | Language for speech recognition (nl-NL, en-US, de-DE, etc.) |
| `voiceEnabled` | Boolean | true | Enable/disable voice output |
| `autoSpeak` | Boolean | true | Automatically speak AI responses |
| `voiceName` | String | null | Specific voice name for TTS (e.g., "Google Nederlands") |
| `sensitivity` | Number | 0.5 | Microphone sensitivity (0.0-1.0) |

### AI Model Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxTokens` | Number | 150 | Maximum tokens in AI response |
| `temperature` | Number | 0.7 | AI temperature (0.0-1.0, higher = more creative) |
| `topP` | Number | 1.0 | Nucleus sampling parameter |
| `frequencyPenalty` | Number | 0 | Reduce repetition (-2.0 to 2.0) |
| `presencePenalty` | Number | 0 | Encourage new topics (-2.0 to 2.0) |
| `systemPrompt` | String | Default | Custom system prompt for AI |
| `historyLimit` | Number | 5 | Number of conversation exchanges to remember |

### Display Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `displayDuration` | Number | 30000 | How long to display response (ms, 0 = forever) |
| `showTranscript` | Boolean | true | Show your spoken question on screen |
| `showResponse` | Boolean | true | Show AI response on screen |
| `animateText` | Boolean | true | Animate the response text |

### Audio Device Selection

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `audioInputDeviceId` | String | null | Specific microphone device ID (null = default) |
| `audioOutputDeviceId` | String | null | Specific speaker device ID (null = default, limited support) |
| `debugAudioDevices` | Boolean | false | Log available audio devices in console |

## Usage / Gebruik

### Nederlands

1. Start je Magic Mirror
2. De module begint automatisch te luisteren
3. Zeg het wake word (standaard: "hey mirror")
4. Wacht op de bevestiging ("Ja?")
5. Stel je vraag
6. De module stuurt je vraag naar ChatGPT
7. Het antwoord wordt getoond en uitgesproken

### Voorbeelden

- "Hey mirror" → "Wat is het weer vandaag?"
- "Hey mirror" → "Vertel me een leuke feit"
- "Hey mirror" → "Wat is de hoofdstad van Frankrijk?"
- "Hey mirror" → "Hoe laat is het?"

### English

1. Start your Magic Mirror
2. The module automatically starts listening
3. Say the wake word (default: "hey mirror")
4. Wait for confirmation ("Yes?")
5. Ask your question
6. The module sends your question to ChatGPT
7. The response is displayed and spoken

### Examples

- "Hey mirror" → "What's the weather today?"
- "Hey mirror" → "Tell me an interesting fact"
- "Hey mirror" → "What is the capital of France?"
- "Hey mirror" → "What time is it?"

## Browser Compatibility / Browser Compatibiliteit

Deze module gebruikt de Web Speech API, die ondersteund wordt door:

- ✅ Google Chrome / Chromium (Aanbevolen)
- ✅ Microsoft Edge
- ✅ Safari (beperkte ondersteuning)
- ❌ Firefox (beperkte Speech Recognition ondersteuning)

**Aanbeveling:** Gebruik Chromium voor de beste ervaring.

## Audio Device Selection / Audio Apparaat Selectie

### Waarom specifieke audio devices selecteren?

Als je meerdere microfoons of speakers hebt (bijvoorbeeld een USB microfoon, webcam microfoon, ingebouwde microfoon, of externe speakers), wil je misschien een specifiek apparaat gebruiken voor de beste kwaliteit.

### Methode 1: Automatisch detecteren met debug mode

De eenvoudigste manier om beschikbare devices te vinden:

1. Zet `debugAudioDevices: true` in je config:

```javascript
config: {
    debugAudioDevices: true,
    // ... andere opties
}
```

2. Start Magic Mirror en open de browser console (F12)
3. Zoek in de console naar "Available Audio Devices" en "Available voices"
4. Kopieer de device ID of voice name die je wilt gebruiken

### Methode 2: Via browser console

Open de Chrome/Chromium developer console (F12) en voer uit:

```javascript
// Toon alle audio devices
navigator.mediaDevices.enumerateDevices().then(devices => {
  console.log("=== MICROPHONES ===");
  devices.filter(d => d.kind === "audioinput").forEach(d => {
    console.log(d.label);
    console.log("  ID:", d.deviceId);
  });

  console.log("\n=== SPEAKERS ===");
  devices.filter(d => d.kind === "audiooutput").forEach(d => {
    console.log(d.label);
    console.log("  ID:", d.deviceId);
  });

  console.log("\n=== VOICES ===");
  speechSynthesis.getVoices().forEach(v => {
    console.log(v.name, "(" + v.lang + ")");
  });
});
```

### Methode 3: Via helper script

Voer het helper script uit om systeem audio devices te zien:

```bash
cd ~/MagicMirror/modules/MMM-ChatGPT
node list-audio-devices.js
```

Dit toont alle beschikbare audio devices op je systeem.

### Configuratie voorbeeld met specifieke devices

```javascript
{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        apiKey: "your-api-key",

        // Gebruik een specifieke USB microfoon
        audioInputDeviceId: "abc123def456...",

        // Gebruik een specifieke stem voor text-to-speech
        voiceName: "Google Nederlands",

        // Of voor Engels:
        // voiceName: "Google US English",

        // Debug mode om devices te zien
        debugAudioDevices: true
    }
}
```

### Populaire voice namen

**Nederlands:**
- "Google Nederlands" (Chrome)
- "Microsoft David - Dutch (Netherlands)" (Edge)
- "Xander" (macOS)

**Engels:**
- "Google US English" (Chrome)
- "Google UK English Female" (Chrome)
- "Microsoft David Desktop" (Edge)
- "Samantha" (macOS)
- "Alex" (macOS)

### Belangrijke opmerkingen

⚠️ **Web Speech API beperkingen:**
- De Web Speech API heeft **geen directe ondersteuning** voor het selecteren van audio output (speaker) devices
- `audioOutputDeviceId` is toegevoegd voor toekomstige browser ondersteuning, maar werkt momenteel **niet** in de meeste browsers
- Voor microfoon selectie werkt het wel, maar de browser kan standaard devices overschrijven

📝 **Alternatieve oplossingen voor speaker selectie:**

1. **Systeem-level configuratie (Linux):**
   ```bash
   # Stel standaard output device in met PulseAudio
   pactl set-default-sink <sink-name>

   # Of via ALSA
   aplay -D plughw:1,0  # Gebruik card 1, device 0
   ```

2. **Browser-level:**
   - Chrome/Edge: Ga naar `chrome://settings/content/sound`
   - Selecteer de gewenste audio output device als standaard

3. **Desktop environment:**
   - GNOME: Sound Settings → Output
   - KDE: System Settings → Audio
   - macOS: System Preferences → Sound → Output

## Troubleshooting

### Microphone Access / Microfoon Toegang

Als de module niet luistert, zorg ervoor dat:

1. Je browser toegang heeft tot de microfoon
2. Je Magic Mirror draait met HTTPS of op localhost
3. De microfoon werkt en is ingeschakeld

### API Errors

- **401 Unauthorized**: Controleer je API key
- **429 Rate Limit**: Je hebt de rate limit bereikt, wacht even
- **Network Error**: Controleer je internetverbinding

### No Speech Recognition

Als spraakherkenning niet werkt:

1. Controleer of je Chromium/Chrome gebruikt
2. Verifieer dat je microfoon werkt: `arecord -l`
3. Test de microfoon: `arecord -d 3 test.wav && aplay test.wav`
4. Controleer browser console voor errors (F12)

### Wake Word Not Detected

Als het wake word niet gedetecteerd wordt:

1. Spreek duidelijk en niet te snel
2. Probeer een andere wake word
3. Verhoog de microfoon volume
4. Verlaag achtergrondgeluid

## Advanced Configuration

### Custom System Prompt

Je kunt de system prompt aanpassen door de node_helper.js te bewerken:

```javascript
const messages = [
    {
        role: "system",
        content: "Je eigen aangepaste instructies hier"
    }
];
```

### Multiple Languages

Voor meertalige ondersteuning, verander de `language` instelling:

```javascript
language: "en-US",  // English
language: "nl-NL",  // Nederlands
language: "de-DE",  // Deutsch
language: "fr-FR",  // Français
language: "es-ES",  // Español
```

## API Costs / API Kosten

Deze module gebruikt de OpenAI API, wat kosten met zich meebrengt:

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (zeer goedkoop)
- **GPT-4**: ~$0.03 per 1K tokens (duurder maar krachtiger)

Gemiddeld gebruik: ~100-200 tokens per interactie.

Geschatte kosten bij normaal gebruik (~50 vragen per dag):
- GPT-3.5: ~$0.20 - $0.30 per maand
- GPT-4: ~$3.00 - $4.50 per maand

Monitor je gebruik op [OpenAI Usage Dashboard](https://platform.openai.com/usage).

## Security / Beveiliging

⚠️ **Belangrijk:**

- Deel je API key **NOOIT** publiekelijk
- Voeg `config.js` toe aan `.gitignore`
- Gebruik environment variables voor productie
- Stel usage limits in op OpenAI dashboard

## Contributing

Contributions zijn welkom! Open een issue of pull request.

## License

MIT License - zie [LICENSE](LICENSE) voor details.

## Credits

- **ChatGPT API**: [OpenAI](https://openai.com/)
- **Magic Mirror²**: [MichMich](https://github.com/MichMich/MagicMirror)
- **Web Speech API**: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## Support

Voor vragen of problemen:

1. Controleer de [Troubleshooting sectie](#troubleshooting)
2. Open een [GitHub issue](https://github.com/yourusername/MMM-ChatGPT/issues)
3. Zie [Magic Mirror² Forum](https://forum.magicmirror.builders/)

## Changelog

### Version 2.1.0 (2026-02-27) ⭐ **OPENCLAW SUPPORT**
- 🤖 **OpenClaw Integration**: Support for OpenClaw AI agent runtime
- 🔄 **AI Router**: Use OpenClaw to route between Claude, GPT, DeepSeek, and more
- 🎛️ **Central Configuration**: Manage all LLM backends through OpenClaw
- 🔒 **Enhanced Privacy**: Self-hosted AI agent with 50+ integrations
- 📝 **Documentation**: Complete OpenClaw setup and configuration guide
- ⚙️ **New Config Options**: openClawUrl, openClawEndpoint, openClawApiKey
- 🖥️ **CM4 Optimized**: OpenClaw recommended for CM4 Waveshare Magic Mirror

### Version 2.0.0 (2026-02-27) 🎉 **MAJOR UPDATE**
- 🚀 **Multi-Provider Support**: Choose between OpenAI, Ollama, or LocalAI
- 🆓 **Local AI Option**: Run completely free with Ollama (Llama 2, Mistral, Phi, etc.)
- 🔒 **Privacy Mode**: Option to run completely offline with local models
- 🖥️ **CM4 Hardware Profile**: Optimized configuration for Waveshare CM4 Magic Mirror
- 📝 **CM4 Setup Guide**: Complete setup guide for CM4 hardware (CM4-SETUP.md)
- 🛠️ **Enhanced Diagnostics**: Improved troubleshooting tools and error handling
- ⚙️ **Advanced Configuration**: More AI model parameters (topP, penalties, systemPrompt)
- 📖 **Better Documentation**: Expanded configuration examples and use cases
- 🔧 **Improved Error Handling**: Better error messages and connection handling

### Version 1.2.0 (2026-02-27)
- 🛠️ **Diagnostic Tools**: Interactive audio test webpage (test-audio.html)
- 🐚 **System Audio Script**: Shell script for system-level audio testing
- 📖 **Troubleshooting Guide**: Comprehensive TROUBLESHOOTING.md with common issues
- 🔍 **Better Debugging**: Enhanced debug output and logging
- 📝 **Documentation Updates**: Improved README with more examples

### Version 1.1.0 (2024-10-30)
- ✨ Added audio device selection support
- ✨ Added custom voice selection for text-to-speech
- ✨ Added microphone device ID configuration
- ✨ Added debug mode to list available audio devices
- ✨ Created helper script `list-audio-devices.js`
- 📝 Comprehensive documentation for audio device configuration
- 🔧 Improved voice loading with async support

### Version 1.0.0 (2024-10-30)
- Initial release
- Wake word detection
- ChatGPT integration
- Voice output
- Conversation history
- Multi-language support

## Roadmap / Toekomstige Features

- [x] ~~Local AI support~~ ✅ Implemented in v2.0.0 (Ollama, LocalAI)
- [x] ~~CM4 Waveshare optimization~~ ✅ Implemented in v2.0.0
- [x] ~~Diagnostic tools~~ ✅ Implemented in v1.2.0
- [x] ~~Custom voice selection~~ ✅ Implemented in v1.1.0
- [ ] Offline wake word detection (Porcupine/Snowboy)
- [ ] Multiple wake words
- [ ] Integration with Magic Mirror modules (weather, calendar, news)
- [ ] Emotion detection
- [ ] Context awareness (time, location, Magic Mirror state)
- [ ] Voice command shortcuts (direct actions without AI)
- [ ] Multiple conversation contexts (separate history per topic)
- [ ] Whisper integration for better speech recognition
- [ ] Better speaker device selection (waiting for browser API support)

---

Made with ❤️ for Magic Mirror²
