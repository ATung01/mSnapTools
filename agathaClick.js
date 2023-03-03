import { createWorker, PSM } from 'tesseract.js'
import GrabImage from './grabImage.js'
import mouseBrain from './mouseBrain.js'
import rng from './rng.js'

const worker = await createWorker()
let rectangles = [
    {
        left: 960,
        top: 870,
        width: 100,
        height: 35
    },
    {
        left: 960,
        top: 896,
        width: 100,
        height: 35
    }
]

function delay (time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

async function performOCR() {
    let processedImage = await (GrabImage(960, 865))
    let buffer = await processedImage.getBufferAsync('image/png')
    const { data: { text } } = await worker.recognize(buffer)
    console.log("text =", text)
    await mouseBrain(text, 960, 870)
}

void (async function () {
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    await worker.setParameters({
        user_defined_dpi: '300'
    })
    while (true) {
        await performOCR()
        await delay(4000 + rng(4000))
    }
    await worker.terminate()
})()


