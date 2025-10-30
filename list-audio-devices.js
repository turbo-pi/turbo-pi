#!/usr/bin/env node

/**
 * Audio Device Lister for MMM-ChatGPT
 *
 * This helper script lists all available audio devices
 * Run this to find the device IDs for your microphone and speakers
 *
 * Usage:
 *   node list-audio-devices.js
 *
 * Or on Linux/macOS:
 *   ./list-audio-devices.js
 */

const { exec } = require('child_process');

console.log('='.repeat(60));
console.log('MMM-ChatGPT Audio Device Lister');
console.log('='.repeat(60));
console.log('');

// Detect platform
const platform = process.platform;

if (platform === 'linux') {
    console.log('Platform: Linux');
    console.log('');

    // List ALSA devices
    console.log('--- ALSA Audio Devices ---');
    exec('aplay -l', (error, stdout, stderr) => {
        if (error) {
            console.log('Could not list playback devices (install alsa-utils)');
        } else {
            console.log('Playback Devices (Speakers):');
            console.log(stdout);
        }
    });

    exec('arecord -l', (error, stdout, stderr) => {
        if (error) {
            console.log('Could not list recording devices (install alsa-utils)');
        } else {
            console.log('Recording Devices (Microphones):');
            console.log(stdout);
        }
    });

    // List PulseAudio devices if available
    setTimeout(() => {
        console.log('--- PulseAudio Devices ---');
        exec('pactl list short sinks', (error, stdout, stderr) => {
            if (!error && stdout) {
                console.log('Output Devices (Speakers):');
                console.log(stdout);
            }
        });

        exec('pactl list short sources', (error, stdout, stderr) => {
            if (!error && stdout) {
                console.log('Input Devices (Microphones):');
                console.log(stdout);
            }
        });

        printInstructions();
    }, 1000);

} else if (platform === 'darwin') {
    console.log('Platform: macOS');
    console.log('');

    exec('system_profiler SPAudioDataType', (error, stdout, stderr) => {
        if (error) {
            console.log('Could not list audio devices');
        } else {
            console.log(stdout);
        }
        printInstructions();
    });

} else if (platform === 'win32') {
    console.log('Platform: Windows');
    console.log('');

    exec('powershell "Get-PnpDevice -Class AudioEndpoint | Select-Object FriendlyName, Status"', (error, stdout, stderr) => {
        if (error) {
            console.log('Could not list audio devices');
        } else {
            console.log(stdout);
        }
        printInstructions();
    });

} else {
    console.log('Platform: ' + platform);
    console.log('Unsupported platform for automatic device listing');
    printInstructions();
}

function printInstructions() {
    console.log('');
    console.log('='.repeat(60));
    console.log('How to use this information:');
    console.log('='.repeat(60));
    console.log('');
    console.log('1. For WEB BROWSER device selection:');
    console.log('   - Open Chrome/Chromium developer console (F12)');
    console.log('   - Paste this code:');
    console.log('');
    console.log('   navigator.mediaDevices.enumerateDevices().then(devices => {');
    console.log('     devices.filter(d => d.kind === "audioinput").forEach(d => {');
    console.log('       console.log("MIC:", d.label, "\\nID:", d.deviceId);');
    console.log('     });');
    console.log('     devices.filter(d => d.kind === "audiooutput").forEach(d => {');
    console.log('       console.log("SPEAKER:", d.label, "\\nID:", d.deviceId);');
    console.log('     });');
    console.log('     speechSynthesis.getVoices().forEach(v => {');
    console.log('       console.log("VOICE:", v.name, "(" + v.lang + ")");');
    console.log('     });');
    console.log('   });');
    console.log('');
    console.log('2. Copy the Device ID and add to config.js:');
    console.log('');
    console.log('   config: {');
    console.log('     audioInputDeviceId: "device-id-here",');
    console.log('     voiceName: "Google Nederlands",');
    console.log('     debugAudioDevices: true  // Shows devices in console');
    console.log('   }');
    console.log('');
    console.log('3. Or set debugAudioDevices to true in config and check logs');
    console.log('');
    console.log('='.repeat(60));
}
