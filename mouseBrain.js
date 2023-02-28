import Robot from 'robotjs'

export default function mouseBrain(text, x, y) {
    // let mouse = Robot.getMousePos()
    // console.log('This is hit', mouse)
    let rightButton = { x: x, y: y}
    let centerButton = { x: rightButton.x - 300, y: rightButton.y - 120}
    if (text.toLowerCase().includes('e') ||
        text.toLowerCase().includes('c') ||
        text.toLowerCase().includes('n')) {         
            Robot.moveMouseSmooth(...Object.values(rightButton))
            Robot.mouseClick()
            console.log('clicked rightside')
    }
    else {
            Robot.moveMouseSmooth(...Object.values(centerButton))
            Robot.mouseClick()
            console.log('clicked center')
    }
}
