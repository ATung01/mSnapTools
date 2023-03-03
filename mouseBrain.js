import Robot from 'robotjs'
import rng from './rng.js'

export default async function mouseBrain(text, x, y) {

    let rightButton = { x: x + rng(80), y: y + rng(40)}
    let centerButton = { x: x - 290 + rng(80), y: y - 120 + rng(40)}
    if ((text.toLowerCase().includes('e') ||
        text.toLowerCase().includes('c') ||
        text.toLowerCase().includes('o') ||
        text.toLowerCase().includes('ary') ||
        text.toLowerCase().includes('n')) && !text.includes('Ed') && !text.includes('I') && !text.includes('B') && !text.includes('3')) {         
        Robot.moveMouseSmooth(...Object.values(rightButton))
        Robot.mouseClick()
        console.log('clicked rightside at', {...Object.values(rightButton)})
        Robot.moveMouseSmooth(rightButton.x - (50 + rng(50)), rightButton.y - (100 + rng(100)))
    } else {
        Robot.moveMouseSmooth(...Object.values(centerButton))
        Robot.mouseClick()
        console.log('clicked center at', {...Object.values(centerButton)})
    }
}
