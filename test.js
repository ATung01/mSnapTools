import Robot from 'robotjs'
import Jimp from 'jimp'
import GrabImage from './grabImage.js'
import mouseBrain from './mouseBrain.js'
import { createWorker, PSM } from 'tesseract.js'


function captureImage({ x, y, w, h }) {
    const pic = Robot.screen.capture(x, y, w, h)
    const width = pic.byteWidth / pic.bytesPerPixel // pic.width is sometimes wrong!
    const height = pic.height
    const image = new Jimp(width, height)
    let red, green, blue
    pic.image.forEach((byte, i) => {
      switch (i % 4) {
        case 0: return blue = byte
        case 1: return green = byte
        case 2: return red = byte
        case 3: 
          image.bitmap.data[i - 3] = red
          image.bitmap.data[i - 2] = green
          image.bitmap.data[i - 1] = blue
          image.bitmap.data[i] = 255
      }
    })
    return image
  }


  console.log(Robot.getMousePos())
  // captureImage({ x: 840, y: 350, w: 100, h: 50 }).write('buffer_data.png')

  let size = Robot.getScreenSize()
  console.log("size =", size)
  // captureImage({ x: 0, y: 0, w: size.width, h: size.height }).write('buffer_data.png')

const worker = await createWorker()
let rectangles = [
    {
        left: 960,
        top: 855,
        width: 200,
        height: 140
    },
    {
        left: 660,
        top: 740,
        width: 300,
        height: 100
    }
]

function delay (time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

function binary(result, threshold = 100) {
  // const threshold = 95;
  // Iterate over all pixels in the image
  result.scan(0, 0, result.bitmap.width, result.bitmap.height, function(x, y, idx) {
    // Get the brightness value of the pixel (average of R, G, B values)
    const brightness = (result.bitmap.data[idx] + result.bitmap.data[idx + 1] + result.bitmap.data[idx + 2]) / 3;
    
    // Set the pixel to black (0) or white (255) based on the brightness threshold
    if (brightness > threshold) {
      result.bitmap.data[idx] = 255;
      result.bitmap.data[idx + 1] = 255;
      result.bitmap.data[idx + 2] = 255;
    } else {
      result.bitmap.data[idx] = 0;
      result.bitmap.data[idx + 1] = 0;
      result.bitmap.data[idx + 2] = 0;
    }
  })
} 


async function performOCR() {
  let values = []
  let processedImage = await (captureImage({ x: 0, y: 0, w: size.width, h: size.height }))
  processedImage.write('test_buffer.png')
  let widthOffset = processedImage.bitmap.width / size.width
  let heightOffset = processedImage.bitmap.height / size.height
  // offsets needed due to Mac screen density, both are around 2x
  console.log("processed image = ", widthOffset, heightOffset)
  // let buffer = await processedImage.getBufferAsync('image/png')
  for (let i = 0; i < rectangles.length; i++) {

    const croppedImage = processedImage.clone().crop(rectangles[i].left * widthOffset, rectangles[i].top * heightOffset, rectangles[i].width, rectangles[i].height);
    croppedImage.invert().greyscale().scale(5)
    binary(croppedImage)
    let buffer = await croppedImage.getBufferAsync('image/png')


    const { data: { text } } = await worker.recognize(buffer)
    values.push(text)
    // const imageWithRectangle = processedImage.clone().crop(rectangles[i].left * widthOffset, rectangles[i].top * heightOffset, rectangles[i].width, rectangles[i].height)

    await croppedImage.writeAsync(`image_${i}.png`)
  }
  console.log("values =", values, values[1].length)
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