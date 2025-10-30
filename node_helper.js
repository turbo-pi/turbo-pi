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
        } else if (notification === "SEND_TO_CHATGPT") {
            this.sendToChatGPT(payload.message, payload.conversationHistory);
        }
    },

    sendToChatGPT: async function(message, conversationHistory) {
        if (!this.config || !this.config.apiKey) {
            this.sendSocketNotification("CHATGPT_ERROR", {
                error: "API key not configured"
            });
            return;
        }

        try {
            // Build messages array for ChatGPT
            const messages = [
                {
                    role: "system",
                    content: "Je bent een behulpzame assistent voor een Magic Mirror. Geef korte, heldere antwoorden. Je kunt informatie geven over het weer, tijd, nieuws en algemene vragen beantwoorden."
                }
            ];

            // Add conversation history (limit to last 5 exchanges)
            const recentHistory = conversationHistory.slice(-5);
            messages.push(...recentHistory);

            // Add current message
            messages.push({
                role: "user",
                content: message
            });

            console.log("Sending to ChatGPT:", message);

            // Call OpenAI API
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: this.config.model || "gpt-3.5-turbo",
                    messages: messages,
                    max_tokens: this.config.maxTokens || 150,
                    temperature: this.config.temperature || 0.7,
                    n: 1
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.config.apiKey}`
                    },
                    timeout: 30000
                }
            );

            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const assistantMessage = response.data.choices[0].message.content.trim();

                // Update conversation history
                conversationHistory.push({
                    role: "user",
                    content: message
                });
                conversationHistory.push({
                    role: "assistant",
                    content: assistantMessage
                });

                // Keep only last 10 messages
                if (conversationHistory.length > 10) {
                    conversationHistory = conversationHistory.slice(-10);
                }

                console.log("ChatGPT response:", assistantMessage);

                this.sendSocketNotification("CHATGPT_RESPONSE", {
                    response: assistantMessage,
                    conversationHistory: conversationHistory
                });
            } else {
                throw new Error("Invalid response from ChatGPT API");
            }
        } catch (error) {
            console.error("ChatGPT API Error:", error.message);
            let errorMessage = "Failed to get response from ChatGPT";

            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "Invalid API key";
                } else if (error.response.status === 429) {
                    errorMessage = "Rate limit exceeded";
                } else if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error.message || errorMessage;
                }
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timeout";
            }

            this.sendSocketNotification("CHATGPT_ERROR", {
                error: errorMessage
            });
        }
    }
});
