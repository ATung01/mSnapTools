import Robot from 'robotjs'
import Jimp from 'jimp'


export default async function GrabImage(mousePosX, mousePosY) {
    // play button should be 300 pixels left and 120 higher
    let mouse = Robot.getMousePos()
    let size = Robot.getScreenSize()
    console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y)

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

    // let result = captureImage({ x: mousePosX, y: mousePosY, w: 100, h: 35})
    let result = captureImage({ x: 0, y: 0, w: size.width, h: size.height})

    // result.invert().greyscale().scale(5)

    const threshold = 100;

    // // Iterate over all pixels in the image
    // result.scan(0, 0, result.bitmap.width, result.bitmap.height, function(x, y, idx) {
    //   // Get the brightness value of the pixel (average of R, G, B values)
    //   const brightness = (result.bitmap.data[idx] + result.bitmap.data[idx + 1] + result.bitmap.data[idx + 2]) / 3;
      
    //   // Set the pixel to black (0) or white (255) based on the brightness threshold
    //   if (brightness > threshold) {
    //     result.bitmap.data[idx] = 255;
    //     result.bitmap.data[idx + 1] = 255;
    //     result.bitmap.data[idx + 2] = 255;
    //   } else {
    //     result.bitmap.data[idx] = 0;
    //     result.bitmap.data[idx + 1] = 0;
    //     result.bitmap.data[idx + 2] = 0;
    //   }
    // })

    result.write('buffer_data.png')


    return result
}