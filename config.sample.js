/* Sample Configuration for MMM-ChatGPT
 *
 * Copy this to your MagicMirror config/config.js
 * and replace YOUR_OPENAI_API_KEY_HERE with your actual API key
 */

{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        // Required: Your OpenAI API Key
        // Get it from: https://platform.openai.com/api-keys
        apiKey: "YOUR_OPENAI_API_KEY_HERE",

        // The wake word to activate the module
        wakeWord: "hey mirror",

        // ChatGPT model to use
        // Options: "gpt-3.5-turbo" (faster, cheaper) or "gpt-4" (smarter, more expensive)
        model: "gpt-3.5-turbo",

        // Maximum tokens in response (higher = longer responses = more cost)
        maxTokens: 150,

        // Temperature (0.0-1.0): higher = more creative, lower = more focused
        temperature: 0.7,

        // Language for speech recognition
        // nl-NL = Dutch, en-US = English, de-DE = German, fr-FR = French, es-ES = Spanish
        language: "nl-NL",

        // Enable voice output
        voiceEnabled: true,

        // Automatically speak responses
        autoSpeak: true,

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
