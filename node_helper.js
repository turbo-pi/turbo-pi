/* Magic Mirror
 * Node Helper: MMM-ChatGPT
 *
 * By Claude
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
        this.config = null;
        this.conversationHistory = [];
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
            console.log("Received config for " + this.name);
            console.log("AI Provider:", this.config.aiProvider || "openai");
            console.log("Model:", this.config.model);
        } else if (notification === "SEND_TO_CHATGPT") {
            this.sendToAI(payload.message, payload.conversationHistory);
        }
    },

    /**
     * Main AI request handler - routes to appropriate provider
     */
    sendToAI: async function(message, conversationHistory) {
        const provider = this.config.aiProvider || "openai";

        switch (provider.toLowerCase()) {
            case "openai":
                await this.sendToOpenAI(message, conversationHistory);
                break;
            case "ollama":
                await this.sendToOllama(message, conversationHistory);
                break;
            case "localai":
                await this.sendToLocalAI(message, conversationHistory);
                break;
            default:
                this.sendSocketNotification("CHATGPT_ERROR", {
                    error: `Unknown AI provider: ${provider}`
                });
        }
    },

    /**
     * OpenAI API (ChatGPT, GPT-4, etc.)
     */
    sendToOpenAI: async function(message, conversationHistory) {
        if (!this.config || !this.config.apiKey) {
            this.sendSocketNotification("CHATGPT_ERROR", {
                error: "OpenAI API key not configured"
            });
            return;
        }

        try {
            const messages = this.buildMessageArray(message, conversationHistory);

            console.log("Sending to OpenAI:", message);
            console.log("Model:", this.config.model || "gpt-3.5-turbo");

            const apiUrl = this.config.apiEndpoint || "https://api.openai.com/v1/chat/completions";

            const response = await axios.post(
                apiUrl,
                {
                    model: this.config.model || "gpt-3.5-turbo",
                    messages: messages,
                    max_tokens: this.config.maxTokens || 150,
                    temperature: this.config.temperature || 0.7,
                    top_p: this.config.topP || 1.0,
                    frequency_penalty: this.config.frequencyPenalty || 0,
                    presence_penalty: this.config.presencePenalty || 0,
                    n: 1
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.config.apiKey}`
                    },
                    timeout: this.config.timeout || 30000
                }
            );

            this.handleAIResponse(response.data, conversationHistory, message);
        } catch (error) {
            this.handleAIError(error, "OpenAI");
        }
    },

    /**
     * Ollama (Local LLM - Llama, Mistral, etc.)
     */
    sendToOllama: async function(message, conversationHistory) {
        try {
            const messages = this.buildMessageArray(message, conversationHistory);

            console.log("Sending to Ollama:", message);
            console.log("Model:", this.config.model || "llama2");

            const ollamaUrl = this.config.ollamaUrl || "http://localhost:11434";

            const response = await axios.post(
                `${ollamaUrl}/api/chat`,
                {
                    model: this.config.model || "llama2",
                    messages: messages,
                    stream: false,
                    options: {
                        temperature: this.config.temperature || 0.7,
                        top_p: this.config.topP || 1.0,
                        num_predict: this.config.maxTokens || 150
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: this.config.timeout || 60000 // Longer timeout for local processing
                }
            );

            // Ollama returns a different format
            if (response.data && response.data.message) {
                const formattedResponse = {
                    choices: [{
                        message: {
                            content: response.data.message.content
                        }
                    }]
                };
                this.handleAIResponse(formattedResponse, conversationHistory, message);
            } else {
                throw new Error("Invalid response from Ollama");
            }
        } catch (error) {
            this.handleAIError(error, "Ollama");
        }
    },

    /**
     * LocalAI (OpenAI-compatible local API)
     */
    sendToLocalAI: async function(message, conversationHistory) {
        try {
            const messages = this.buildMessageArray(message, conversationHistory);

            console.log("Sending to LocalAI:", message);
            console.log("Model:", this.config.model || "gpt-3.5-turbo");

            const localAIUrl = this.config.localAIUrl || "http://localhost:8080";

            const response = await axios.post(
                `${localAIUrl}/v1/chat/completions`,
                {
                    model: this.config.model || "gpt-3.5-turbo",
                    messages: messages,
                    max_tokens: this.config.maxTokens || 150,
                    temperature: this.config.temperature || 0.7,
                    top_p: this.config.topP || 1.0
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: this.config.timeout || 60000
                }
            );

            this.handleAIResponse(response.data, conversationHistory, message);
        } catch (error) {
            this.handleAIError(error, "LocalAI");
        }
    },

    /**
     * Build messages array with system prompt and history
     */
    buildMessageArray: function(message, conversationHistory) {
        const systemPrompt = this.config.systemPrompt ||
            "Je bent een behulpzame assistent voor een Magic Mirror. Geef korte, heldere antwoorden. " +
            "Je kunt informatie geven over het weer, tijd, nieuws en algemene vragen beantwoorden.";

        const messages = [
            {
                role: "system",
                content: systemPrompt
            }
        ];

        // Add conversation history (limit to last 5 exchanges to save tokens)
        const historyLimit = this.config.historyLimit || 5;
        const recentHistory = conversationHistory.slice(-historyLimit);
        messages.push(...recentHistory);

        // Add current message
        messages.push({
            role: "user",
            content: message
        });

        return messages;
    },

    /**
     * Handle successful AI response
     */
    handleAIResponse: function(data, conversationHistory, userMessage) {
        if (data && data.choices && data.choices.length > 0) {
            const assistantMessage = data.choices[0].message.content.trim();

            // Update conversation history
            conversationHistory.push({
                role: "user",
                content: userMessage
            });
            conversationHistory.push({
                role: "assistant",
                content: assistantMessage
            });

            // Keep only last N messages
            const maxHistory = (this.config.historyLimit || 5) * 2;
            if (conversationHistory.length > maxHistory) {
                conversationHistory = conversationHistory.slice(-maxHistory);
            }

            console.log("AI response:", assistantMessage);

            this.sendSocketNotification("CHATGPT_RESPONSE", {
                response: assistantMessage,
                conversationHistory: conversationHistory
            });
        } else {
            throw new Error("Invalid response from AI provider");
        }
    },

    /**
     * Handle AI errors
     */
    handleAIError: function(error, providerName) {
        console.error(`${providerName} API Error:`, error.message);
        let errorMessage = `Failed to get response from ${providerName}`;

        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = "Invalid API key";
            } else if (error.response.status === 429) {
                errorMessage = "Rate limit exceeded";
            } else if (error.response.status === 404) {
                errorMessage = `${providerName} endpoint not found. Check your configuration.`;
            } else if (error.response.data && error.response.data.error) {
                if (typeof error.response.data.error === 'string') {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = error.response.data.error.message || errorMessage;
                }
            }
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = "Request timeout";
        } else if (error.code === 'ECONNREFUSED') {
            errorMessage = `Cannot connect to ${providerName}. Is the service running?`;
        }

        this.sendSocketNotification("CHATGPT_ERROR", {
            error: errorMessage
        });
    },

    /**
     * Backwards compatibility - keep old function name
     */
    sendToChatGPT: async function(message, conversationHistory) {
        await this.sendToAI(message, conversationHistory);
    }
});
