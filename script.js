M.AutoInit();

/**
 * Common
 */
const alphabet = {
  0: 'Zero',
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  '-': 'Dash',
  a: 'Alfa',
  b: 'Bravo',
  c: 'Charlie',
  d: 'Delta',
  e: 'Echo',
  f: 'Foxtrot',
  g: 'Golf',
  h: 'Hotel',
  i: 'India',
  j: 'Juliette',
  k: 'Kilo',
  l: 'Lima',
  m: 'Mike',
  n: 'November',
  o: 'Oscar',
  p: 'Papa',
  q: 'Quebec',
  r: 'Romeo',
  s: 'Sierra',
  t: 'Tango',
  u: 'Uniform',
  v: 'Victor',
  w: 'Whiskey',
  x: 'X-ray',
  y: 'Yankee',
  z: 'Zulu',
};

const say = (words, rate = 0.8) => {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(words);
  utterance.rate = rate; // [0.1, 10]
  speechSynthesis.speak(utterance);
}

const word2NATO = word => word
  .toLowerCase()
  .split('')
  .map(letter => alphabet[letter] || letter)
  .join(' ');

const text2NATO = sentence => sentence
  .trim()
  .split(/\s+/g)
  .map(word => word2NATO(word))
  .join('\n');

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const generateRandom = length => {
  let word = '';
  for (let i = 0; i < length; i++) {
    word += pickRandom(letters);
  }
  return word;
}

/**
 * Convert
 */
const outputText = document.getElementById('outputText');
const inputText = document.getElementById('inputText');

inputText.addEventListener('input', () => {
  outputText.textContent = text2NATO(inputText.value);
});

inputText.addEventListener('change', () => say(outputText.textContent));


/**
 * Codify
 */
// const showButton = document.getElementById('showButton');
// showButton.addEventListener('click', () => {
//   M.toast({ html: `<h1>${pickRandom(letters)}</h1>` });
// })

const codifyButton = document.getElementById('codifyButton');
const intro = document.getElementById('intro');
const letterDisplay = document.getElementById('letterDisplay');

codifyButton.addEventListener('click', () => {
  codifyButton.textContent = 'NEXT';
  intro.remove();
  letterDisplay.textContent = pickRandom(letters).toUpperCase();
  letterDisplay.classList.replace('scale-out', 'scale-in');
  codifyButton.addEventListener('click', () => {
    // M.Toast.dismissAll();
    // M.toast({ html: `<h1 class="right-align">${alphabet[letterDisplay.textContent.toLocaleLowerCase()]}</h1>` });
    codifyButton.classList.add('disabled');
    letterDisplay.textContent = alphabet[letterDisplay.textContent.toLocaleLowerCase()];
    setTimeout(() => {
      letterDisplay.classList.replace('scale-in', 'scale-out');
    }, 500);
    setTimeout(() => {
      codifyButton.classList.remove('disabled');
      letterDisplay.textContent = pickRandom(letters).toUpperCase();
      letterDisplay.classList.replace('scale-out', 'scale-in');
    }, 750)
  })
}, { once: true });


/**
 * Transcribe
 */
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

const updateSpeedLabel = () => {
  speedValue.textContent = (10 ** speedSlider.value).toFixed(1);
};

speedSlider.value = Math.log10(0.5);
updateSpeedLabel();
speedSlider.addEventListener('input', updateSpeedLabel);

const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');

lengthValue.textContent = lengthSlider.value = 5;
lengthSlider.addEventListener('input', () => lengthValue.textContent = lengthSlider.value);


const answerText = document.getElementById('answerText');
const readButton = document.getElementById('readButton');
readButton.addEventListener('click', () => {
  // clear answer/validation
  randomLetters.classList.replace('scale-in', 'scale-out');
  answerText.classList.remove('valid', 'invalid');
  answerText.classList.add('validate');
  answerText.value = '';
  answerText.focus();

  let length = +lengthValue.textContent;
  let speed = +speedValue.textContent;
  let word = generateRandom(length);
  say(text2NATO(word), speed);
  setTimeout(() => randomLetters.textContent = word, 250);
});

const randomLetters = document.getElementById('randomLetters');
const transcriptionResult = document.getElementById('transcriptionResult');


answerText.addEventListener('change', () => {
  answerText.classList.remove('invalid', 'valid');
  answerText.classList.add('validate');

  if (randomLetters.textContent.length) {
    // validate answer
    const correct = answerText.value === randomLetters.textContent;
    answerText.classList.replace('validate', `${correct ? '' : 'in'}valid`);
    transcriptionResult.setAttribute(`data-${correct ? 'success' : 'error'}`, `${correct ? 'C' : 'Inc'}orrect`);
    randomLetters.classList.replace('scale-out', 'scale-in');
  }
});