const outputDiv = document.getElementById('output');
const toggleButton = document.getElementById('toggleButton');
let isRecording = false;
let recognition = null;
const apiKey = 'AIzaSyCIzpJWz_EMduRu17qLAUgVHSbX7V0M77g'; // Replace with your own API key

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.interimResults = true;
} else {
  console.log("Speech recognition not supported by this browser.");
}

toggleButton.addEventListener('click', function() {
  if (isRecording) {
    recognition.stop();
    toggleButton.classList.remove('recording');
    toggleButton.innerText = 'Let\'s talk! 🗣️';
  } else {
    recognition.start();
    toggleButton.classList.add('recording');
    toggleButton.innerText = 'Stop talking 🤫';
  }
  isRecording = !isRecording;

  if (!isRecording) {
    outputDiv.style.display = 'none';
  } else {
    outputDiv.style.display = 'block';
  }
});

recognition.onresult = function(event) {
  let audioBlob = null;
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      audioBlob = new Blob([event.results[i][0].transcript], {type: 'audio/wav'});
    }
  }
  if (audioBlob !== null) {
    transcribeAudio(audioBlob, apiKey);
  }
};

function transcribeAudio(audioBlob, apiKey) {
  const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;
  const headers = new Headers({
    'Content-Type': 'application/json'
  });
  const body = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US'
    },
    audio: {
      content: audioBlob
    }
  };
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };
  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      const transcript = data.results[0].alternatives[0].transcript;
      outputDiv.innerHTML = transcript;
      saveTranscript(transcript);
    })
    .catch(error => console.error(error));
}

function saveTranscript(transcript) {
  const element = document.createElement('a');
  const file = new Blob([transcript], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = 'transcript.txt';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
