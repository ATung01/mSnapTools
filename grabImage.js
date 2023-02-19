import robot from 'robotjs'
import Jimp from 'jimp'
// need to grab image with robotjs, process it, and return a canvas object

export default function GrabImage(mousePosX = 840, mousePosY = 350) {

    let bitmap = robot.screen.capture(mousePosX, mousePosY, 100, 50).image

    console.log(bitmap)

    let nBitmap = Jimp.read(bitmap);
        // .then((image) => {
        //     return image.invert();
        // })
        // .catch((err) => {
        //     console.error(err)
        //     console.log("this was hit")
        // })

    // for (let i = 0; i < bitmap.length; i += 4) {
    //     // Invert the red, green, and blue components
    //     bitmap[i] = 255 - bitmap[i] // Red
    //     bitmap[i + 1] = 255 - bitmap[i + 1] // Green
    //     bitmap[i + 2] = 255 - bitmap[i + 2] // Blue
    // }
    console.log("new bitmap =", nBitmap)
    return nBitmap
}