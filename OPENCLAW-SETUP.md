# OpenClaw Setup Guide voor Magic Mirror

Complete installatie en configuratie guide voor OpenClaw AI agent runtime op je Magic Mirror.

## 📋 Overzicht

**OpenClaw** is een open-source AI agent runtime die fungeert als een router tussen je Magic Mirror en verschillende LLM backends zoals Claude, GPT-4, DeepSeek, en meer. Perfect voor CM4 Waveshare hardware!

### Waarom OpenClaw voor Magic Mirror?

- 🔄 **Flexibel**: Switch tussen AI providers zonder Magic Mirror config te wijzigen
- 🎛️ **Centraal beheer**: Configureer alle LLM backends op één plek
- 🔒 **Privacy**: Self-hosted op je eigen machine
- 🚀 **Toekomstbestendig**: Voeg nieuwe LLMs toe zonder module updates
- 💰 **Kostenefficiënt**: Gebruik goedkopere APIs via centrale configuratie

## 🚀 Quick Start (5 minuten)

Voor wie snel wil beginnen:

```bash
# 1. Clone OpenClaw
git clone https://github.com/openclaw/openclaw
cd openclaw

# 2. Install dependencies
npm install

# 3. Configure .env (zie hieronder)
cp .env.example .env
nano .env

# 4. Start OpenClaw
npm start

# 5. Configure Magic Mirror (zie config voorbeelden)
```

## 📦 Stap 1: Installatie

### Vereisten

- Node.js 18+ (check met `node --version`)
- npm 9+
- Git
- Een Magic Mirror installatie met MMM-ChatGPT module

### 1.1 Installeer Node.js (indien nodig)

**Voor Raspberry Pi CM4:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

### 1.2 Clone OpenClaw Repository

```bash
# Clone naar je home directory
cd ~
git clone https://github.com/openclaw/openclaw
cd openclaw

# Check de release
git branch
git tag  # Zie beschikbare versies
```

### 1.3 Installeer Dependencies

```bash
# Install alle dependencies
npm install

# Voor CM4: dit kan 10-15 minuten duren
# Wees geduldig!
```

## ⚙️ Stap 2: Configuratie

### 2.1 Basis .env Setup

OpenClaw gebruikt een `.env` file voor configuratie:

```bash
# Copy example config
cp .env.example .env

# Edit config
nano .env
```

**Minimale .env voor Magic Mirror:**

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Authentication (optioneel voor lokaal gebruik)
# API_KEY=your-secret-key-here

# LLM Provider: OpenAI
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Logging
LOG_LEVEL=info
```

### 2.2 Advanced .env met Meerdere Providers

Voor maximale flexibiliteit:

```env
# ========================================
# SERVER CONFIG
# ========================================
PORT=3000
NODE_ENV=production
HOST=0.0.0.0

# ========================================
# AUTHENTICATION
# ========================================
# Optioneel: Enable als je beveiliging wilt
# API_KEY=your-magic-mirror-secret-key

# ========================================
# OPENAI PROVIDER
# ========================================
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=150
OPENAI_TEMPERATURE=0.7

# ========================================
# ANTHROPIC CLAUDE PROVIDER
# ========================================
ANTHROPIC_API_KEY=sk-ant-your-claude-key
ANTHROPIC_MODEL=claude-3-sonnet-20240229
ANTHROPIC_MAX_TOKENS=150

# ========================================
# DEEPSEEK PROVIDER
# ========================================
DEEPSEEK_API_KEY=sk-your-deepseek-key
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com

# ========================================
# OLLAMA PROVIDER (Local)
# ========================================
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# ========================================
# DEFAULT PROVIDER
# ========================================
DEFAULT_PROVIDER=openai
# Opties: openai, anthropic, deepseek, ollama

# ========================================
# LOGGING & MONITORING
# ========================================
LOG_LEVEL=info
LOG_FILE=./logs/openclaw.log

# ========================================
# RATE LIMITING
# ========================================
RATE_LIMIT_ENABLED=false
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### 2.3 Provider-Specifieke Setup

#### OpenAI (GPT-3.5/GPT-4)

```bash
# Get API key from:
# https://platform.openai.com/api-keys

# Add to .env:
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-3.5-turbo  # of gpt-4
```

**Kosten:**
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens

#### Anthropic Claude

```bash
# Get API key from:
# https://console.anthropic.com/

# Add to .env:
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-3-sonnet-20240229
# Of: claude-3-opus-20240229 (duurder, beter)
# Of: claude-3-haiku-20240307 (goedkoper, sneller)
```

**Kosten:**
- Claude 3 Haiku: ~$0.25 per 1M input tokens
- Claude 3 Sonnet: ~$3 per 1M input tokens
- Claude 3 Opus: ~$15 per 1M input tokens

#### DeepSeek (Goedkoop alternatief!)

```bash
# Get API key from:
# https://platform.deepseek.com/

# Add to .env:
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

**Kosten:**
- DeepSeek Chat: ~$0.14 per 1M tokens (ZEER GOEDKOOP!)

#### Ollama (Gratis, Lokaal)

```bash
# Install Ollama first:
curl https://ollama.ai/install.sh | sh

# Download model:
ollama pull llama2

# Start Ollama:
ollama serve

# Add to .env:
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2  # of phi, mistral, etc.
```

**Kosten:**
- Gratis! Alleen elektricity en hardware

## 🎯 Stap 3: OpenClaw Starten

### 3.1 Test Run

```bash
cd ~/openclaw

# Start in development mode:
npm run dev

# Je zou moeten zien:
# ✓ OpenClaw started on port 3000
# ✓ Available providers: openai, anthropic, ollama
# ✓ Default provider: openai
```

### 3.2 Test de API

```bash
# In een nieuwe terminal:
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, test!"}
    ],
    "model": "gpt-3.5-turbo"
  }'

# Verwachte response:
# {
#   "choices": [{
#     "message": {
#       "content": "Hello! How can I help you today?"
#     }
#   }]
# }
```

### 3.3 Productie Mode

Voor continuous operation:

```bash
# Install PM2 (process manager)
sudo npm install -g pm2

# Start OpenClaw met PM2:
cd ~/openclaw
pm2 start npm --name "openclaw" -- start

# Auto-start bij boot:
pm2 startup
pm2 save

# Check status:
pm2 status
pm2 logs openclaw

# Stop/Restart:
pm2 stop openclaw
pm2 restart openclaw
```

## 🖥️ Stap 4: Magic Mirror Configuratie

### 4.1 Basic Setup

Edit je Magic Mirror `config/config.js`:

```javascript
{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        // OpenClaw provider
        aiProvider: "openclaw",
        openClawUrl: "http://localhost:3000",

        // Model (configured in OpenClaw .env)
        model: "gpt-3.5-turbo",

        // Magic Mirror settings
        wakeWord: "hey mirror",
        language: "nl-NL",
        voiceEnabled: true,
        autoSpeak: true,

        // Longer timeout for processing
        timeout: 30000,

        // Display
        displayDuration: 30000,
        showTranscript: true,
        showResponse: true,

        // Audio (voor CM4)
        voiceName: "Google Nederlands",
        sensitivity: 0.6
    }
}
```

### 4.2 Met Authentication

Als je `API_KEY` hebt ingesteld in OpenClaw `.env`:

```javascript
{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        aiProvider: "openclaw",
        openClawUrl: "http://localhost:3000",
        openClawApiKey: "your-magic-mirror-secret-key",  // Matches .env
        model: "gpt-3.5-turbo",
        // ... rest van config
    }
}
```

### 4.3 Switch Tussen Providers

Het mooie van OpenClaw: je kunt switchen zonder Magic Mirror te herstarten!

**In OpenClaw .env:**
```env
DEFAULT_PROVIDER=anthropic  # Switch naar Claude
# Of: openai, deepseek, ollama
```

Herstart OpenClaw:
```bash
pm2 restart openclaw
```

Magic Mirror blijft werken - nu met Claude! 🎉

## 🔧 Stap 5: Advanced Configuration

### 5.1 Provider Routing per Model

OpenClaw kan automatisch de juiste provider kiezen:

**Magic Mirror config:**
```javascript
config: {
    aiProvider: "openclaw",
    openClawUrl: "http://localhost:3000",

    // OpenClaw routes automatisch:
    // - "gpt-3.5-turbo" -> OpenAI
    // - "claude-3-sonnet" -> Anthropic
    // - "deepseek-chat" -> DeepSeek
    // - "llama2" -> Ollama
    model: "claude-3-sonnet-20240229",  // Switch naar Claude!
}
```

### 5.2 Fallback Configuration

Als één provider down is, gebruik een andere:

**OpenClaw config (in code/env):**
```env
PRIMARY_PROVIDER=openai
FALLBACK_PROVIDER=deepseek
FALLBACK_ENABLED=true
```

### 5.3 Custom System Prompts per Provider

**Magic Mirror config:**
```javascript
config: {
    aiProvider: "openclaw",
    model: "claude-3-sonnet-20240229",

    // Custom prompt voor Magic Mirror gebruik
    systemPrompt: "Je bent een behulpzame Nederlandse assistent voor een Magic Mirror. " +
                  "Geef korte, heldere antwoorden van maximaal 2-3 zinnen. " +
                  "Je kunt informatie geven over weer, tijd, nieuws en algemene vragen."
}
```

## 📊 Stap 6: Monitoring & Debugging

### 6.1 Logs Bekijken

```bash
# PM2 logs (real-time):
pm2 logs openclaw

# Log file (als geconfigureerd):
tail -f ~/openclaw/logs/openclaw.log

# Magic Mirror logs:
pm2 logs MagicMirror
```

### 6.2 Health Check

```bash
# Check of OpenClaw draait:
curl http://localhost:3000/health

# Verwachte response:
# {"status":"ok","uptime":1234,"providers":["openai","anthropic"]}
```

### 6.3 Debug Mode

**Enable debug logging in .env:**
```env
LOG_LEVEL=debug
```

```bash
pm2 restart openclaw
pm2 logs openclaw --lines 100
```

## 🐛 Troubleshooting

### Probleem 1: OpenClaw Start Niet

**Symptomen:**
```
Error: Cannot find module 'xyz'
```

**Oplossing:**
```bash
cd ~/openclaw
rm -rf node_modules package-lock.json
npm install
npm start
```

### Probleem 2: Magic Mirror Kan Niet Connecten

**Symptomen:**
```
Cannot connect to OpenClaw. Is the service running?
```

**Oplossing:**
```bash
# Check of OpenClaw draait:
pm2 status

# Als niet running:
pm2 start openclaw

# Check poort:
netstat -tlnp | grep 3000

# Test lokaal:
curl http://localhost:3000/health
```

### Probleem 3: Provider Errors

**Symptomen:**
```
Failed to get response from OpenClaw
Invalid API key
```

**Oplossing:**
```bash
# Check .env configuratie:
cd ~/openclaw
cat .env | grep API_KEY

# Verify API keys werken:
# Voor OpenAI:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Voor Anthropic:
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

### Probleem 4: Timeout Errors

**Symptomen:**
```
Request timeout
```

**Oplossing in Magic Mirror config:**
```javascript
config: {
    timeout: 60000,  // Verhoog naar 60 seconden
}
```

**Of in OpenClaw .env:**
```env
REQUEST_TIMEOUT=60000
```

### Probleem 5: High Memory Usage

**Voor CM4 met beperkt RAM:**

```bash
# Limiteer Node.js memory:
pm2 delete openclaw
pm2 start npm --name "openclaw" --node-args="--max-old-space-size=512" -- start

# Of in .env:
NODE_OPTIONS=--max-old-space-size=512
```

## 🎛️ Stap 7: CM4 Waveshare Optimalisatie

### 7.1 Memory Management

```bash
# OpenClaw met memory limit:
pm2 start npm --name "openclaw" \
  --node-args="--max-old-space-size=512" \
  -- start

# Check memory usage:
pm2 monit
```

### 7.2 Aanbevolen Provider voor CM4

**4GB RAM CM4:**
- ✅ OpenAI (cloud, geen lokale resources)
- ✅ DeepSeek (cloud, zeer goedkoop)
- ⚠️ Ollama (werkt, maar langzaam)
- ❌ Multiple providers tegelijk (te zwaar)

**8GB RAM CM4:**
- ✅ Alle cloud providers
- ✅ Ollama met kleine modellen (phi, llama2)
- ✅ Multiple providers tegelijk

### 7.3 Network Optimalisatie

**Gebruik lokale Ollama als fallback voor cloud:**

```env
PRIMARY_PROVIDER=openai
FALLBACK_PROVIDER=ollama
FALLBACK_ON_NETWORK_ERROR=true
```

### 7.4 Auto-start bij Boot

```bash
# OpenClaw auto-start:
pm2 startup
pm2 save

# Verify:
sudo reboot
# Wacht 2 minuten...
pm2 list  # OpenClaw zou running moeten zijn
```

## 📈 Stap 8: Performance Tips

### 8.1 Response Caching

OpenClaw kan responses cachen voor snellere antwoorden:

**In .env:**
```env
CACHE_ENABLED=true
CACHE_TTL=3600  # 1 uur
CACHE_MAX_SIZE=100  # 100 entries
```

### 8.2 Rate Limiting

Voor kosten-optimalisatie:

```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=60  # Max 60 requests
RATE_LIMIT_WINDOW=60000  # Per minuut
```

### 8.3 Token Optimalisatie

**In Magic Mirror config:**
```javascript
config: {
    maxTokens: 100,  // Kortere responses = sneller + goedkoper
    historyLimit: 3,  // Minder context = minder tokens
    temperature: 0.7
}
```

## 💰 Kosten Overzicht

Bij gebruik van ~50 vragen per dag:

| Provider | Maandelijkse Kosten | Response Tijd | Kwaliteit |
|----------|---------------------|---------------|-----------|
| **DeepSeek** | ~€0.05 | 1-3 sec | ⭐⭐⭐⭐ |
| **GPT-3.5** | ~€0.30 | 1-2 sec | ⭐⭐⭐⭐ |
| **Claude Haiku** | ~€0.15 | 1-2 sec | ⭐⭐⭐⭐ |
| **GPT-4** | ~€4.50 | 2-4 sec | ⭐⭐⭐⭐⭐ |
| **Claude Sonnet** | ~€2.00 | 2-3 sec | ⭐⭐⭐⭐⭐ |
| **Ollama (Local)** | €0.00 | 10-30 sec | ⭐⭐⭐ |

**Aanbeveling voor Magic Mirror:**
- **Budget**: DeepSeek (~€0.05/maand) ⭐ BESTE WAARDE
- **Balans**: GPT-3.5-turbo (~€0.30/maand)
- **Kwaliteit**: Claude Sonnet (~€2.00/maand)
- **Gratis**: Ollama op CM4 (langzaam maar werkt)

## 🔄 Stap 9: Provider Switch Guide

### Quick Switch Between Providers

**Via OpenClaw .env:**
```bash
cd ~/openclaw
nano .env
```

**Change:**
```env
# Was:
DEFAULT_PROVIDER=openai

# Nu:
DEFAULT_PROVIDER=deepseek  # Of anthropic, ollama
```

**Restart:**
```bash
pm2 restart openclaw
```

**Magic Mirror blijft gewoon werken!** 🎉

### Via Magic Mirror Config

**Magic Mirror config.js:**
```javascript
// Change model, OpenClaw routes automatisch:
model: "deepseek-chat",  // Switch naar DeepSeek
// model: "gpt-3.5-turbo",  // Back to OpenAI
// model: "claude-3-haiku-20240307",  // Switch naar Claude
// model: "llama2",  // Switch naar Ollama
```

## 📚 Complete Voorbeeld Setup

### Voor CM4 Waveshare met DeepSeek (Goedkoopst!)

**OpenClaw .env:**
```env
PORT=3000
NODE_ENV=production

DEEPSEEK_API_KEY=sk-your-deepseek-key
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com

DEFAULT_PROVIDER=deepseek
LOG_LEVEL=info
```

**Magic Mirror config.js:**
```javascript
{
    module: "MMM-ChatGPT",
    position: "top_center",
    config: {
        aiProvider: "openclaw",
        openClawUrl: "http://localhost:3000",
        model: "deepseek-chat",

        wakeWord: "hey mirror",
        language: "nl-NL",
        voiceEnabled: true,
        autoSpeak: true,
        voiceName: "Google Nederlands",

        maxTokens: 100,
        timeout: 30000,
        sensitivity: 0.6,

        systemPrompt: "Je bent een behulpzame assistent voor een Magic Mirror. Geef korte, heldere antwoorden."
    }
}
```

**Start commands:**
```bash
# Start OpenClaw:
cd ~/openclaw
pm2 start npm --name "openclaw" -- start

# Start Magic Mirror:
cd ~/MagicMirror
npm start
```

**Kosten: ~€0.05/maand! 🎉**

## ✅ Checklist

- [ ] Node.js 18+ geïnstalleerd
- [ ] OpenClaw gecloned en dependencies geïnstalleerd
- [ ] `.env` file geconfigureerd met API keys
- [ ] OpenClaw start succesvol (`npm start` of `pm2 start`)
- [ ] Health check werkt (`curl localhost:3000/health`)
- [ ] Magic Mirror config updated met OpenClaw settings
- [ ] Test: Zeg "hey mirror" en stel een vraag
- [ ] PM2 auto-start geconfigureerd
- [ ] Logs worden gemonitord
- [ ] Backup van `.env` file gemaakt

## 🆘 Support

**Als je vast loopt:**

1. Check OpenClaw logs: `pm2 logs openclaw`
2. Check Magic Mirror logs: `pm2 logs MagicMirror`
3. Check browser console (F12)
4. Test OpenClaw direct: `curl localhost:3000/health`
5. Verify API keys in `.env`

**Resources:**
- OpenClaw GitHub: https://github.com/openclaw/openclaw
- Magic Mirror Forum: https://forum.magicmirror.builders/
- Module Issues: https://github.com/yourusername/MMM-ChatGPT/issues

## 🎉 Klaar!

Je Magic Mirror is nu verbonden met OpenClaw en kan gebruikmaken van meerdere AI providers!

**Volgende stappen:**
- Experimenteer met verschillende providers
- Optimaliseer voor je use case
- Monitor kosten via provider dashboards
- Geniet van je AI-powered Magic Mirror! ✨

---

**Gemaakt met ❤️ voor Magic Mirror² + OpenClaw**
