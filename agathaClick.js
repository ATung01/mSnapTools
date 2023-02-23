import { createWorker, PSM } from 'tesseract.js'
import GrabImage from './grabImage.js'
import Jimp from 'jimp'
import Fs from 'fs'



const worker = await createWorker()


let processedImage = await (GrabImage())
// const rectangle = { left: 1286, top: 825, width: 500, height: 300 };
let buffer = await processedImage.getBufferAsync('image/png');


(async function () {
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    await worker.setParameters({
        user_defined_dpi: '300'
    })
    const { data: { text } } = await worker.recognize(buffer)
    console.log(text)
    await worker.terminate()
})()


