/* Magic Mirror
 * Module: MMM-ChatGPT
 *
 * By Claude
 * MIT Licensed.
 */

Module.register("MMM-ChatGPT", {
    defaults: {
        apiKey: "",
        wakeWord: "hey mirror",
        model: "gpt-3.5-turbo",
        maxTokens: 150,
        temperature: 0.7,
        language: "nl-NL",
        voiceEnabled: true,
        autoSpeak: true,
        displayDuration: 30000, // 30 seconds
        microphoneDevice: null,
        sensitivity: 0.5,
        showTranscript: true,
        showResponse: true,
        animateText: true
    },

    requiresVersion: "2.1.0",

    start: function() {
        this.listening = false;
        this.processing = false;
        this.currentTranscript = "";
        this.currentResponse = "";
        this.conversationHistory = [];
        this.recognition = null;
        this.hideTimer = null;
        Log.info("Starting module: " + this.name);

        // Send config to node_helper
        this.sendSocketNotification("CONFIG", this.config);
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "chatgpt-wrapper";

        // Status indicator
        const statusDiv = document.createElement("div");
        statusDiv.className = "chatgpt-status";

        if (this.listening) {
            statusDiv.innerHTML = '<i class="fa fa-microphone"></i> Listening...';
            statusDiv.className += " listening";
        } else if (this.processing) {
            statusDiv.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';
            statusDiv.className += " processing";
        } else {
            statusDiv.innerHTML = '<i class="fa fa-microphone-slash"></i> Say "' + this.config.wakeWord + '"';
            statusDiv.className += " idle";
        }
        wrapper.appendChild(statusDiv);

        // Transcript display
        if (this.config.showTranscript && this.currentTranscript) {
            const transcriptDiv = document.createElement("div");
            transcriptDiv.className = "chatgpt-transcript";
            transcriptDiv.innerHTML = '<strong>You:</strong> ' + this.currentTranscript;
            wrapper.appendChild(transcriptDiv);
        }

        // Response display
        if (this.config.showResponse && this.currentResponse) {
            const responseDiv = document.createElement("div");
            responseDiv.className = "chatgpt-response";
            if (this.config.animateText) {
                responseDiv.className += " animate";
            }
            responseDiv.innerHTML = '<strong>Mirror:</strong> ' + this.currentResponse;
            wrapper.appendChild(responseDiv);
        }

        return wrapper;
    },

    getScripts: function() {
        return [];
    },

    getStyles: function() {
        return [
            "MMM-ChatGPT.css",
            "font-awesome.css"
        ];
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            this.initializeSpeechRecognition();
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CHATGPT_RESPONSE") {
            this.currentResponse = payload.response;
            this.processing = false;
            this.listening = false;
            this.updateDom(300);

            if (this.config.autoSpeak) {
                this.speak(payload.response);
            }

            // Auto-hide after duration
            if (this.config.displayDuration > 0) {
                if (this.hideTimer) {
                    clearTimeout(this.hideTimer);
                }
                this.hideTimer = setTimeout(() => {
                    this.currentTranscript = "";
                    this.currentResponse = "";
                    this.updateDom(300);
                }, this.config.displayDuration);
            }
        } else if (notification === "CHATGPT_ERROR") {
            this.currentResponse = "Error: " + payload.error;
            this.processing = false;
            this.listening = false;
            this.updateDom(300);
            Log.error("ChatGPT Error: " + payload.error);
        }
    },

    initializeSpeechRecognition: function() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            Log.error("Speech recognition not supported");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.config.language;

        this.recognition.onstart = () => {
            Log.info("Speech recognition started");
        };

        this.recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                }
            }

            if (transcript) {
                transcript = transcript.trim().toLowerCase();
                Log.info("Recognized: " + transcript);

                if (!this.listening && transcript.includes(this.config.wakeWord.toLowerCase())) {
                    // Wake word detected
                    this.listening = true;
                    this.currentTranscript = "";
                    this.currentResponse = "";
                    this.updateDom(300);
                    this.speak("Ja?");
                } else if (this.listening) {
                    // Capture the command
                    this.currentTranscript = transcript;
                    this.listening = false;
                    this.processing = true;
                    this.updateDom(300);

                    // Send to ChatGPT
                    this.sendSocketNotification("SEND_TO_CHATGPT", {
                        message: transcript,
                        conversationHistory: this.conversationHistory
                    });
                }
            }
        };

        this.recognition.onerror = (event) => {
            Log.error("Speech recognition error: " + event.error);
            if (event.error === 'no-speech') {
                // Restart recognition
                setTimeout(() => {
                    if (this.recognition) {
                        this.recognition.start();
                    }
                }, 1000);
            }
        };

        this.recognition.onend = () => {
            // Restart recognition automatically
            if (!this.processing) {
                setTimeout(() => {
                    if (this.recognition) {
                        try {
                            this.recognition.start();
                        } catch (e) {
                            Log.error("Error restarting recognition: " + e);
                        }
                    }
                }, 1000);
            }
        };

        // Start recognition
        try {
            this.recognition.start();
        } catch (e) {
            Log.error("Error starting recognition: " + e);
        }
    },

    speak: function(text) {
        if (!this.config.voiceEnabled) {
            return;
        }

        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.config.language;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onend = () => {
                // Restart recognition after speaking
                if (this.recognition && !this.processing) {
                    setTimeout(() => {
                        try {
                            this.recognition.start();
                        } catch (e) {
                            // Already started
                        }
                    }, 500);
                }
            };

            window.speechSynthesis.speak(utterance);
        }
    },

    suspend: function() {
        if (this.recognition) {
            this.recognition.stop();
        }
    },

    resume: function() {
        if (this.recognition) {
            try {
                this.recognition.start();
            } catch (e) {
                // Already started
            }
        }
    }
});
