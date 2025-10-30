#!/bin/bash

# MMM-ChatGPT System Audio Test Script
# Tests microphone and speaker at system level

echo "=========================================="
echo "MMM-ChatGPT System Audio Test"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if audio tools are installed
echo "Test 1: Checking audio tools..."
if command -v arecord &> /dev/null; then
    echo -e "${GREEN}✓${NC} arecord found"
else
    echo -e "${RED}✗${NC} arecord not found (install: sudo apt-get install alsa-utils)"
fi

if command -v aplay &> /dev/null; then
    echo -e "${GREEN}✓${NC} aplay found"
else
    echo -e "${RED}✗${NC} aplay not found (install: sudo apt-get install alsa-utils)"
fi

if command -v pactl &> /dev/null; then
    echo -e "${GREEN}✓${NC} PulseAudio found"
    PULSEAUDIO=true
else
    echo -e "${YELLOW}!${NC} PulseAudio not found (optional)"
    PULSEAUDIO=false
fi

echo ""

# Test 2: List audio devices
echo "Test 2: Available Audio Devices"
echo "--------------------------------"

if command -v arecord &> /dev/null; then
    echo "Recording devices (Microphones):"
    arecord -l
    echo ""
fi

if command -v aplay &> /dev/null; then
    echo "Playback devices (Speakers):"
    aplay -l
    echo ""
fi

if [ "$PULSEAUDIO" = true ]; then
    echo "PulseAudio Sources (Microphones):"
    pactl list short sources
    echo ""

    echo "PulseAudio Sinks (Speakers):"
    pactl list short sinks
    echo ""
fi

# Test 3: Check volumes
echo "Test 3: Audio Levels"
echo "--------------------"

if command -v amixer &> /dev/null; then
    echo "Master Volume:"
    amixer get Master | grep -E "(Front Left|Mono):" || echo "No Master volume found"
    echo ""

    echo "Capture Volume (Microphone):"
    amixer get Capture | grep -E "(Front Left|Mono):" || echo "No Capture volume found"
    echo ""
fi

# Test 4: Interactive tests
echo "Test 4: Interactive Audio Tests"
echo "--------------------------------"
echo ""

# Microphone test
if command -v arecord &> /dev/null; then
    echo -e "${YELLOW}Microphone Test:${NC}"
    read -p "Record 3 seconds of audio? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Recording... (speak now!)"
        arecord -d 3 -f cd test-recording.wav 2>&1

        if [ -f test-recording.wav ]; then
            echo -e "${GREEN}✓${NC} Recording saved to test-recording.wav"

            # Play back
            if command -v aplay &> /dev/null; then
                read -p "Play back the recording? (y/n): " -n 1 -r
                echo ""
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    echo "Playing back..."
                    aplay test-recording.wav
                    echo -e "${GREEN}✓${NC} Playback complete"

                    read -p "Delete test recording? (y/n): " -n 1 -r
                    echo ""
                    if [[ $REPLY =~ ^[Yy]$ ]]; then
                        rm test-recording.wav
                        echo "Test recording deleted"
                    fi
                fi
            fi
        else
            echo -e "${RED}✗${NC} Recording failed!"
        fi
    fi
    echo ""
fi

# Speaker test
if command -v speaker-test &> /dev/null; then
    echo -e "${YELLOW}Speaker Test:${NC}"
    read -p "Test speakers with tone? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Playing test tone for 3 seconds..."
        timeout 3 speaker-test -t sine -f 1000 2>&1 | head -n 10
        echo -e "${GREEN}✓${NC} Speaker test complete"
    fi
    echo ""
fi

# Test 5: Recommendations
echo "Test 5: Recommendations"
echo "-----------------------"

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}!${NC} Running as root - audio permissions might be different in browser"
fi

# Check for USB audio devices
USB_AUDIO=$(lsusb | grep -i audio | wc -l)
if [ $USB_AUDIO -gt 0 ]; then
    echo -e "${GREEN}✓${NC} USB audio device(s) detected"
fi

# Check if Chromium is installed
if command -v chromium-browser &> /dev/null; then
    echo -e "${GREEN}✓${NC} Chromium browser found (recommended for Web Speech API)"
elif command -v google-chrome &> /dev/null; then
    echo -e "${GREEN}✓${NC} Chrome browser found (recommended for Web Speech API)"
else
    echo -e "${YELLOW}!${NC} Chromium/Chrome not found (install: sudo apt-get install chromium-browser)"
fi

echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. If microphone/speaker tests work:"
echo "   → Open test-audio.html in Chromium browser"
echo "   → Test Web Speech API functionality"
echo ""
echo "2. If microphone test failed:"
echo "   → Check connections"
echo "   → Run: sudo apt-get install alsa-utils"
echo "   → Try: amixer set Capture cap"
echo ""
echo "3. If speaker test failed:"
echo "   → Check volume: amixer set Master 100%"
echo "   → Unmute: amixer set Master unmute"
echo "   → Check connections"
echo ""
echo "4. For troubleshooting guide:"
echo "   → Read TROUBLESHOOTING.md"
echo ""
echo "5. To test in browser:"
echo "   → chromium-browser test-audio.html"
echo ""
