import Tesseract from 'tesseract.js';

Tesseract.recognize(
  'images/textTest.png',
  'eng',
  { logger: m => console.log(m) }
).then(({ data: { text } }) => {
  console.log(text);
})