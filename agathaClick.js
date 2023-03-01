import { createWorker, PSM } from 'tesseract.js'
import GrabImage from './grabImage.js'
import mouseBrain from './mouseBrain.js'
import rng from './rng.js'

const worker = await createWorker()

function delay (time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

async function performOCR(buffer) {
    const { data: { text } } = await worker.recognize(buffer)
    console.log("text =", text)
    mouseBrain(text, 960, 870)
}

void (async function () {
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    await worker.setParameters({
        user_defined_dpi: '300'
    })
    while (true) {
        let processedImage = await (GrabImage(960, 865))
        let buffer = await processedImage.getBufferAsync('image/png')
        await delay(3000 + rng(4000))
        await performOCR(buffer)
    }
    await worker.terminate()
})()


