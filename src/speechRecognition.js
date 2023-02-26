window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'ko-KR';
recognition.maxAlternatives = 1;

const startSpeech = (event) => {
  const selectedInput = event.target.parentNode.nextElementSibling;

  selectedInput.focus();
  recognition.start();

  recognition.addEventListener('result', (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');

    if (document.activeElement === selectedInput) {
      selectedInput.value = '';
      selectedInput.value = transcript;
      if (event.results[0].isFinal) {
        recognition.stop();
        selectedInput.blur();
      }
    } else {
      return;
    }
  });
};

export default startSpeech;
