/* Sample Configuration for MMM-ChatGPT
 *
 * Copy this to your MagicMirror config/config.js
 * and replace YOUR_OPENAI_API_KEY_HERE with your actual API key
 *
 * For CM4 Waveshare hardware, see config.cm4-waveshare.js
 */

{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        // ===== AI PROVIDER =====
        // Choose your AI provider: "openai", "ollama", or "localai"
        aiProvider: "openai",  // Default: OpenAI cloud API

        // ===== OPENAI CONFIGURATION =====
        // Required for OpenAI: Your OpenAI API Key
        // Get it from: https://platform.openai.com/api-keys
        apiKey: "YOUR_OPENAI_API_KEY_HERE",

        // ChatGPT model to use
        // Options: "gpt-4", "gpt-4-turbo-preview", "gpt-3.5-turbo" (recommended)
        model: "gpt-3.5-turbo",

        // Optional: Custom OpenAI API endpoint (for Azure OpenAI, etc.)
        // apiEndpoint: "https://api.openai.com/v1/chat/completions",

        // ===== OLLAMA CONFIGURATION (Local LLM Alternative) =====
        // Uncomment these lines to use Ollama instead of OpenAI
        // aiProvider: "ollama",
        // ollamaUrl: "http://localhost:11434",
        // model: "llama2",  // or "mistral", "codellama", "phi", "neural-chat"

        // ===== LOCALAI CONFIGURATION (Local OpenAI-compatible API) =====
        // Uncomment these lines to use LocalAI
        // aiProvider: "localai",
        // localAIUrl: "http://localhost:8080",
        // model: "gpt-3.5-turbo",  // Model name configured in LocalAI

        // ===== WAKE WORD & SPEECH =====
        // The wake word to activate the module
        wakeWord: "hey mirror",

        // Language for speech recognition
        // nl-NL = Dutch, en-US = English, de-DE = German, fr-FR = French, es-ES = Spanish
        language: "nl-NL",

        // Enable voice output
        voiceEnabled: true,

        // Automatically speak responses
        autoSpeak: true,

        // ===== AI MODEL PARAMETERS =====
        // Maximum tokens in response (higher = longer responses = more cost/time)
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
        // systemPrompt: "Je bent een behulpzame assistent...",

        // Number of conversation exchanges to remember
        historyLimit: 5,

        // API timeout (milliseconds)
        // Use 60000 for local AI (Ollama/LocalAI), 30000 for OpenAI
        timeout: 30000,

        // ===== DISPLAY CONFIGURATION =====
        // How long to display the response (milliseconds, 0 = forever)
        displayDuration: 30000,

        // Show your spoken question on screen
        showTranscript: true,

        // Show ChatGPT response on screen
        showResponse: true,

        // Animate the response text
        animateText: true,

        // Microphone sensitivity (0.0-1.0)
        sensitivity: 0.5,

        // ===== AUDIO DEVICE SELECTION =====
        // To find device IDs:
        // 1. Set debugAudioDevices to true and check browser console
        // 2. Or run: node list-audio-devices.js
        // 3. Or open Chrome DevTools and run: navigator.mediaDevices.enumerateDevices()

        // Specific microphone device ID (null = use default)
        // Example: "default" or "0abc123def456..."
        audioInputDeviceId: null,

        // Specific speaker device ID (null = use default)
        // Note: Browser support for output device selection is limited
        audioOutputDeviceId: null,

        // Specific voice name for text-to-speech (null = use default)
        // Examples: "Google Nederlands", "Microsoft David", "Samantha"
        // To see available voices, set debugAudioDevices to true
        voiceName: null,

        // Show available audio devices and voices in browser console log
        // Set to true to discover your device IDs and voice names
        debugAudioDevices: false
    }
}

/*
 * QUICK START GUIDE:
 *
 * 1. USING OPENAI (Cloud API):
 *    - Get API key from https://platform.openai.com/api-keys
 *    - Set apiKey above
 *    - aiProvider: "openai" (default)
 *    - model: "gpt-3.5-turbo" (recommended)
 *
 * 2. USING OLLAMA (Local LLM - No API costs):
 *    - Install: curl https://ollama.ai/install.sh | sh
 *    - Download model: ollama pull llama2
 *    - Start: ollama serve
 *    - Set: aiProvider: "ollama", ollamaUrl: "http://localhost:11434"
 *    - No API key needed!
 *
 * 3. USING LOCALAI (OpenAI-compatible Local):
 *    - Install LocalAI: https://localai.io/basics/getting_started/
 *    - Configure models in LocalAI
 *    - Set: aiProvider: "localai", localAIUrl: "http://localhost:8080"
 *    - No API key needed!
 *
 * 4. CM4 WAVESHARE HARDWARE:
 *    - See config.cm4-waveshare.js for optimized settings
 *
 * 5. TROUBLESHOOTING:
 *    - Run: ./test-system-audio.sh
 *    - Open: chromium-browser test-audio.html
 *    - Read: TROUBLESHOOTING.md
 */
