import Robot from 'robotjs'
import Jimp from 'jimp'

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