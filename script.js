const svg = document.getElementById('audio-waves');
const waves = svg.querySelectorAll('.wave');
const colors = ['#FFDD00', '#FF0000', '#00BFFF', '#00FF00'];
let colorIndex = 0;

function changeColor() {
    waves.forEach(wave => {
        wave.setAttribute('stroke', colors[colorIndex]);
    });
    colorIndex = (colorIndex + 1) % colors.length;
}

setInterval(changeColor, 1000);

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

const liveTranscriptElement = document.getElementById('live-transcript');

let isRecording = false;

recognition.onresult = function(event) {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript.trim();
    liveTranscriptElement.innerText = transcript;

    // Adjust waveform based on speech
    let amplitude = 1.15 + (transcript.length % 10) / 10;
    waves.forEach(wave => {
        wave.style.transform = `scaleY(${amplitude})`;
    });
};

recognition.onstart = function() {
    isRecording = true;
    liveTranscriptElement.style.display = 'block';
    waves.forEach(wave => {
        wave.style.animationDuration = '0.5s'; // Accelerate animation
    });
};

recognition.onend = function() {
    isRecording = false;
    liveTranscriptElement.style.display = 'none';
    waves.forEach(wave => {
        wave.style.animationDuration = '2s'; // Reset animation
    });

    // Reduce waveform amplitude when no speech is detected
    waves.forEach(wave => {
        wave.style.transform = 'scaleY(1)';
    });
};

recognition.start();
