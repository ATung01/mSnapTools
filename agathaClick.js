import { createWorker } from 'tesseract.js'
import GrabImage from './grabImage.js'
import Jimp from 'jimp'
import Fs from 'fs'



const worker = await createWorker()

let processedImage = await (GrabImage())
let buffer = await processedImage.getBufferAsync('image/png');


(async function () {
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    const { data: { text } } = await worker.recognize(buffer)
    console.log(text)
    await worker.terminate()
})()


