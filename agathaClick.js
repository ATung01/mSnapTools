import { createWorker } from 'tesseract.js'
import GrabImage from './grabImage.js'
import Jimp from 'jimp'
import Fs from 'fs'

// let mousePos = robot.getMousePos()

// console.log(mousePos)



// function preprocessImage(canvas) {
//     const level = 0.4
//     const radius = 1
//     const ctx = canvas.getContext('2d')
//     const image = ctx.getImageData(0,0,canvas.width, canvas.height)
//     blurARGB(image.data, canvas, radius)
//     dilate(image.data, canvas)
//     invertColors(image.data)
//     thresholdFilter(image.data, level)
//     return image
//     }


const worker = await createWorker()

let processedImage = await (GrabImage())

    // Fs.writeFile('error_check.png', processedImage, err => {
    //     if (err) {
    //         console.error(err)
    //     }
    // })

// let processedImg = preprocessImage('images/textTest.png')
console.log("processed image = ", processedImage);

(async function () {
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    const { data: { text } } = await worker.recognize(processedImage)
    console.log(text)
    await worker.terminate()
})()


