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
        sensitivity: 0.5
    }
}
