# MMM-ChatGPT

Een Magic Mirror² module voor spraakinteractie met ChatGPT, inclusief wake word detectie.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.1.0-green.svg)

## Overzicht / Overview

**Nederlands:**
Deze module maakt het mogelijk om met je Magic Mirror te praten via een wake word (bijv. "hey mirror"). De mirror luistert continu naar het wake word en als het gedetecteerd wordt, kun je een vraag stellen die naar ChatGPT wordt gestuurd. Het antwoord wordt zowel getoond op het scherm als uitgesproken.

**English:**
This module enables voice interaction with your Magic Mirror using a wake word (e.g., "hey mirror"). The mirror continuously listens for the wake word, and when detected, you can ask a question that will be sent to ChatGPT. The response is both displayed on screen and spoken aloud.

## Features / Functies

- 🎤 **Wake Word Detection** - Continuous listening for customizable wake word
- 🤖 **ChatGPT Integration** - Powered by OpenAI's ChatGPT API
- 🗣️ **Voice Response** - Text-to-speech for ChatGPT responses
- 💬 **Conversation History** - Maintains context across multiple exchanges
- 🎨 **Customizable UI** - Configurable display with animations
- 🌍 **Multi-language Support** - Works with any language supported by Web Speech API
- ⚙️ **Highly Configurable** - Many options to customize behavior

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

### Stap 3: Verkrijg een OpenAI API Key

1. Ga naar [OpenAI Platform](https://platform.openai.com/)
2. Maak een account aan of log in
3. Ga naar API Keys sectie
4. Genereer een nieuwe API key
5. Bewaar deze key veilig

### Stap 4: Configureer de Module

Voeg de module toe aan je `config/config.js`:

```javascript
{
    module: "MMM-ChatGPT",
    position: "top_center", // Of elke andere positie
    config: {
        apiKey: "YOUR_OPENAI_API_KEY_HERE",
        wakeWord: "hey mirror",
        model: "gpt-3.5-turbo",
        language: "nl-NL", // nl-NL voor Nederlands, en-US voor Engels
        voiceEnabled: true,
        autoSpeak: true,
        displayDuration: 30000,
        maxTokens: 150,
        temperature: 0.7
    }
}
```

## Configuration Options / Configuratie Opties

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | String | **Required** | Your OpenAI API key |
| `wakeWord` | String | "hey mirror" | The wake word to activate the module |
| `model` | String | "gpt-3.5-turbo" | ChatGPT model to use (gpt-3.5-turbo, gpt-4, etc.) |
| `language` | String | "nl-NL" | Language for speech recognition (nl-NL, en-US, de-DE, etc.) |
| `voiceEnabled` | Boolean | true | Enable/disable voice output |
| `autoSpeak` | Boolean | true | Automatically speak ChatGPT responses |
| `displayDuration` | Number | 30000 | How long to display response (milliseconds, 0 = forever) |
| `maxTokens` | Number | 150 | Maximum tokens in ChatGPT response |
| `temperature` | Number | 0.7 | ChatGPT temperature (0.0-1.0, higher = more creative) |
| `showTranscript` | Boolean | true | Show your spoken question on screen |
| `showResponse` | Boolean | true | Show ChatGPT response on screen |
| `animateText` | Boolean | true | Animate the response text |
| `sensitivity` | Number | 0.5 | Microphone sensitivity (0.0-1.0) |
| `microphoneDeviceId` | String | null | Specific microphone device ID (optional) |
| `audioOutputDeviceId` | String | null | Specific audio output device ID (optional) |
| `listDevices` | Boolean | false | Log available devices to console on startup |

## Device Configuration / Apparaat Configuratie

### Nederlands

Als je een specifieke microfoon of audio output wilt gebruiken, kun je de device IDs configureren.

#### Methode 1: Browser Helper (Eenvoudigste)

1. Open `list-devices.html` in je browser
2. Klik op "Refresh Devices" en geef microfoon toegang
3. Kopieer de gewenste device IDs
4. Plak ze in je config:

```javascript
config: {
    microphoneDeviceId: "jouw-microfoon-id-hier",
    audioOutputDeviceId: "jouw-output-id-hier"
}
```

#### Methode 2: In MagicMirror

1. Schakel device listing in:
```javascript
config: {
    listDevices: true
}
```

2. Herstart MagicMirror
3. Open browser console (F12) of bekijk de terminal logs
4. Kopieer de device IDs uit de logs
5. Voeg ze toe aan je config en zet `listDevices` weer op `false`

#### Belangrijke Notitie

De Web Speech API heeft beperkte ondersteuning voor custom device selectie. Deze configuratie-opties zijn toegevoegd voor:
- Toekomstige compatibiliteit
- Alternatieve implementaties
- Documentatie van je preferred devices

### English

If you want to use a specific microphone or audio output, you can configure the device IDs.

#### Method 1: Browser Helper (Easiest)

1. Open `list-devices.html` in your browser
2. Click "Refresh Devices" and grant microphone access
3. Copy the desired device IDs
4. Paste them in your config:

```javascript
config: {
    microphoneDeviceId: "your-microphone-id-here",
    audioOutputDeviceId: "your-output-id-here"
}
```

#### Method 2: In MagicMirror

1. Enable device listing:
```javascript
config: {
    listDevices: true
}
```

2. Restart MagicMirror
3. Open browser console (F12) or check terminal logs
4. Copy the device IDs from the logs
5. Add them to your config and set `listDevices` back to `false`

#### Important Note

The Web Speech API has limited support for custom device selection. These configuration options are added for:
- Future compatibility
- Alternative implementations
- Documentation of your preferred devices

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

### Version 1.1.0 (2025-10-30)
- Added device ID configuration for microphone and audio output
- Added device enumeration function to list available devices
- Added standalone browser tool (list-devices.html) for finding device IDs
- Updated configuration documentation

### Version 1.0.0 (2024-10-30)
- Initial release
- Wake word detection
- ChatGPT integration
- Voice output
- Conversation history
- Multi-language support

## Roadmap / Toekomstige Features

- [ ] Offline wake word detection (Porcupine/Snowboy)
- [ ] Multiple wake words
- [ ] Custom voice selection
- [ ] Integration with Magic Mirror modules (weather, calendar)
- [ ] Emotion detection
- [ ] Context awareness (time, location)
- [ ] Voice command shortcuts
- [ ] Multiple conversation contexts

---

Made with ❤️ for Magic Mirror²
