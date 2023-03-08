import Robot from 'robotjs'
import Jimp from 'jimp'
import { createWorker } from 'tesseract.js'
import rng from './rng.js'

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

let size = Robot.getScreenSize()
console.log("size =", size)

const worker = await createWorker()
let rectangles = [
  {
    left: 960,
    top: 855,
    width: 200,
    height: 140,
    subject: 'right corner bright',
    threshold: 100
  },
  {
    left: 960,
    top: 855,
    width: 200,
    height: 140,
    subject: 'right corner dark',
    threshold: 150
  },
  {
    left: 660,
    top: 740,
    width: 300,
    height: 100,
    subject: 'center play',
    threshold: 100
  }
]

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

function binary(result, threshold = 100) {
  result.scan(0, 0, result.bitmap.width, result.bitmap.height, function(x, y, idx) {
    const brightness = (result.bitmap.data[idx] + result.bitmap.data[idx + 1] + result.bitmap.data[idx + 2]) / 3;
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
  let textResults = []
  let fullscreen = await (captureImage({ x: 0, y: 0, w: size.width, h: size.height }))
  fullscreen.write('test_buffer.png')

  let widthOffset = fullscreen.bitmap.width / size.width
  let heightOffset = fullscreen.bitmap.height / size.height
  console.log("processed image = ", widthOffset, heightOffset) // offsets needed due to Mac screen density, both are around 2x
 
  for (let i = 0; i < rectangles.length; i++) {
    const croppedImage = fullscreen.clone().crop(rectangles[i].left * widthOffset, rectangles[i].top * heightOffset, rectangles[i].width, rectangles[i].height)
    croppedImage.invert().greyscale().scale(5)
    binary(croppedImage, rectangles[i].threshold)

    let buffer = await croppedImage.getBufferAsync('image/png')
    const { data: { text } } = await worker.recognize(buffer)
    textResults.push ({
      [rectangles[i].subject] : `${text.replace(/\n/g, '')}`
    })
    await croppedImage.writeAsync(`image_${i}.png`)
  }

  textResults.forEach((obj) => {
    for (let key in obj) {
      updatedMouseBrain(key, obj[key])
      console.log(`interpreted text = ${key}: ${obj[key]}`)
    }
  })
}

void (async function() {
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

function updatedMouseBrain(key, obj) {
  // console.log("object =", obj, typeof obj)
  switch (key) {
    case key.includes('right corner'):
      if (obj.includes('END')) {
        console.log('right click')
      }
      break
  
    default:
      break
  }
}