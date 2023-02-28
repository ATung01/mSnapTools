import Robot from 'robotjs'
import rng from './rng.js'

export default function mouseBrain(text, x, y) {
    // let mouse = Robot.getMousePos()
    // console.log('This is hit', mouse)

    
    let rightButton = { x: x + rng(80), y: y + rng(40)}
    let centerButton = { x: rightButton.x - 300 + rng(60), y: rightButton.y - 120 + rng(40)}
    if ((text.toLowerCase().includes('e') ||
        text.toLowerCase().includes('c') ||
        text.toLowerCase().includes('n')) && !text.includes('Ed')) {         
            Robot.moveMouseSmooth(...Object.values(rightButton))
            Robot.mouseClick()
            console.log('clicked rightside at', {...Object.values(rightButton)})
    }
    else {
            Robot.moveMouseSmooth(...Object.values(centerButton))
            Robot.mouseClick()
            console.log('clicked center at', {...Object.values(centerButton)})
    }
}
