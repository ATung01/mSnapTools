import Robot from 'robotjs'
import Jimp from 'jimp'
import Fs from 'fs'


export default async function GrabImage(mousePosX = 840, mousePosY = 350) {

    const bitmap = Robot.screen.capture(mousePosX, mousePosY, 100, 50).image

    console.log(Buffer.from(bitmap))

    let nBitmap = new Jimp(100, 50)
    
    nBitmap.bitmap.data = Buffer.from(bitmap)
    
    console.log(nBitmap.bitmap.data)

    return nBitmap
}