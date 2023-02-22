import Robot from 'robotjs'
import Jimp from 'jimp'
import Fs from 'fs'
import { ifError } from 'assert'


export default async function GrabImage(mousePosX = 840, mousePosY = 350) {

    const bitmap = Robot.screen.capture(mousePosX, mousePosY, 100, 100)
    let nBitmap = new Jimp(bitmap.width, bitmap.height)

    console.log("bitmap = ", bitmap)

    


    // let nBitmap = new Jimp(bitmap.width, bitmap.height)
    // console.log("nBitmap = ", nBitmap.bitmap)

    nBitmap.bitmap.data = bitmap.image

    // console.log("nBitmap =",nBitmap)
    // nBitmap.greyscale().invert()

    // Jimp.read(nBitmap)
    //     .then((image) => {
    //         image.greyscale().invert().getBufferAsync(Jimp.MIME_PNG)
    //     })
    //     .catch((err) => {
    //         console.error(err)
    //     })

    // const image = await nBitmap.getBufferAsync('image/png')

    console.log("nBitmap = ", nBitmap)
    nBitmap.writeAsync('error_check.png')

    // console.log("image = ", image)

    // Fs.writeFile('error_check.png', nBitmap, (err) => {
    //     if (err) {
    //         console.error(err)
    //     }
    // })

    // console.log("nBitmap = ", nBitmap.bitmap.data)

    return nBitmap
}