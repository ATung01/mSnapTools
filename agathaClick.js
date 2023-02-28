import { createWorker, PSM } from 'tesseract.js'
import GrabImage from './grabImage.js'
import mouseBrain from './mouseBrain.js'

const worker = await createWorker()
let processedImage = await (GrabImage(1100, 720))
let buffer = await processedImage.getBufferAsync('image/png')

function getRandomInt(max) {
    // integer 0 to max, inclusive
    return Math.floor(Math.random() * max);
}

function delay (time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

async function performOCR(buffer) {
    const { data: { text } } = await worker.recognize(buffer)
    console.log("text =", text)
    mouseBrain(text, 1100, 720)
    console.log("performOCR")
}


void (async function () {
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    await worker.setParameters({
        user_defined_dpi: '300'
    })
    for (let i = 0; i < 3; i++) {
        await delay(3000)
        await performOCR(buffer)
    }
    await worker.terminate()
})()


