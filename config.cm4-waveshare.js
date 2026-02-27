/* CM4 Waveshare Magic Mirror Optimized Configuration
 *
 * Hardware-specific configuration for Waveshare CM4 Magic Mirror
 * This configuration is optimized for the Raspberry Pi CM4 module with
 * Waveshare Magic Mirror display and integrated audio
 *
 * Copy this to your MagicMirror config/config.js
 */

{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        // ========================================
        // AI PROVIDER CONFIGURATION
        // ========================================

        // Choose your AI provider: "openai", "ollama", or "localai"
        aiProvider: "openai",

        // === OPENAI CONFIGURATION ===
        // Get API key from: https://platform.openai.com/api-keys
        apiKey: "YOUR_OPENAI_API_KEY_HERE",

        // OpenAI Models:
        // - "gpt-4" (smartest, most expensive)
        // - "gpt-4-turbo-preview" (fast GPT-4)
        // - "gpt-3.5-turbo" (fast, cheap, recommended)
        // - "gpt-3.5-turbo-16k" (larger context window)
        model: "gpt-3.5-turbo",

        // Optional: Custom OpenAI API endpoint (for Azure OpenAI, etc.)
        // apiEndpoint: "https://api.openai.com/v1/chat/completions",

        // === OLLAMA CONFIGURATION (Local LLM) ===
        // Uncomment to use Ollama instead of OpenAI
        // aiProvider: "ollama",
        // ollamaUrl: "http://localhost:11434",
        // model: "llama2",  // or "mistral", "codellama", "neural-chat", etc.

        // === LOCALAI CONFIGURATION (Local OpenAI-compatible) ===
        // Uncomment to use LocalAI
        // aiProvider: "localai",
        // localAIUrl: "http://localhost:8080",
        // model: "gpt-3.5-turbo",  // Model name configured in LocalAI

        // ========================================
        // WAKE WORD & SPEECH CONFIGURATION
        // ========================================

        // Wake word to activate the mirror
        wakeWord: "hey mirror",

        // Language for speech recognition
        // nl-NL = Dutch, en-US = English, de-DE = German, fr-FR = French
        language: "nl-NL",

        // Voice output settings
        voiceEnabled: true,
        autoSpeak: true,

        // ========================================
        // CM4 WAVESHARE AUDIO CONFIGURATION
        // ========================================

        // The Waveshare CM4 Magic Mirror typically uses:
        // - USB audio device for microphone
        // - HDMI audio or 3.5mm jack for output

        // Microphone device ID (null = default)
        // To find your device ID, run: node list-audio-devices.js
        // Or set debugAudioDevices: true and check browser console
        audioInputDeviceId: null,

        // Speaker device ID (limited browser support)
        audioOutputDeviceId: null,

        // Voice name for text-to-speech
        // Good Dutch voices: "Google Nederlands", "Microsoft David - Dutch"
        // Good English voices: "Google US English", "Google UK English Female"
        voiceName: "Google Nederlands",

        // Microphone sensitivity (0.0-1.0)
        // CM4 with USB mic: 0.6-0.7 usually works well
        sensitivity: 0.6,

        // ========================================
        // AI MODEL PARAMETERS
        // ========================================

        // Maximum tokens in response (higher = longer answers = slower/more expensive)
        // For CM4: Keep it low for faster responses
        maxTokens: 150,

        // Temperature (0.0-1.0): higher = more creative, lower = more focused
        temperature: 0.7,

        // Top P (0.0-1.0): nucleus sampling, alternative to temperature
        topP: 1.0,

        // Frequency penalty (-2.0 to 2.0): reduce repetition
        frequencyPenalty: 0,

        // Presence penalty (-2.0 to 2.0): encourage new topics
        presencePenalty: 0,

        // Custom system prompt (optional)
        systemPrompt: "Je bent een behulpzame assistent voor een Magic Mirror. Geef korte, heldere antwoorden. Je kunt informatie geven over het weer, tijd, nieuws en algemene vragen beantwoorden.",

        // Number of conversation exchanges to remember
        historyLimit: 5,

        // API timeout (milliseconds)
        // For local AI (Ollama/LocalAI): use 60000 (60 seconds)
        // For OpenAI: use 30000 (30 seconds)
        timeout: 30000,

        // ========================================
        // DISPLAY CONFIGURATION
        // ========================================

        // How long to display response (milliseconds, 0 = forever)
        // For CM4: 30 seconds is good for visibility
        displayDuration: 30000,

        // Show your spoken question on screen
        showTranscript: true,

        // Show AI response on screen
        showResponse: true,

        // Animate the response text
        animateText: true,

        // ========================================
        // DEBUGGING & DEVELOPMENT
        // ========================================

        // Show available audio devices and voices in browser console
        // Set to true when first setting up to find device IDs
        debugAudioDevices: false
    }
}

/*
 * CM4 WAVESHARE HARDWARE NOTES:
 *
 * 1. AUDIO SETUP:
 *    - The Waveshare display usually has HDMI audio
 *    - For better mic quality, use USB microphone
 *    - Check available devices: arecord -l && aplay -l
 *
 * 2. PERFORMANCE:
 *    - CM4 with 4GB+ RAM recommended for Ollama
 *    - For best performance, use OpenAI cloud API
 *    - Keep maxTokens low (100-150) for faster responses
 *
 * 3. BROWSER:
 *    - MUST use Chromium (not Firefox)
 *    - Install: sudo apt-get install chromium-browser
 *
 * 4. AUTO-START CHROMIUM:
 *    Add to Magic Mirror start script:
 *    DISPLAY=:0 chromium-browser --kiosk --no-sandbox \
 *        --use-fake-ui-for-media-stream \
 *        http://localhost:8080
 *
 * 5. OLLAMA ON CM4 (Optional - for local AI):
 *    - Install: curl https://ollama.ai/install.sh | sh
 *    - Download model: ollama pull llama2
 *    - Start service: ollama serve
 *    - Change config: aiProvider: "ollama"
 *
 * 6. RECOMMENDED MODELS FOR CM4:
 *    - OpenAI: gpt-3.5-turbo (fastest, cheapest)
 *    - Ollama: phi, llama2 (7B models work on 4GB+ RAM)
 *
 * 7. TROUBLESHOOTING:
 *    - Run: ./test-system-audio.sh
 *    - Open: chromium-browser test-audio.html
 *    - Read: TROUBLESHOOTING.md
 */
