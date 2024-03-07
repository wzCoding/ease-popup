import { rootWidth, rootHeight, verticals, horizontals } from "./option"

function getDirByIndex(direction, index) {
    const result = direction.split('-')[index]
    return result ? (index > 0 ? '-' + result : result) : ''
}

function getxAxis(targeRect, popupWidth, options) {

    const { direction, gap, arrowSize, offset } = options
    const { left: targetLeft, width: targetWidth } = targeRect
    const result = { popupX: 0, arrowX: 0 }

    if (verticals.includes(direction)) {  //计算垂直方向（上下）的x坐标

        result.popupX = targetLeft + targetWidth / 2 - popupWidth / 2
        result.arrowX = popupWidth / 2 - arrowSize / 2

        if (direction.includes('start')) {
            result.popupX = targetLeft
            result.arrowX = targetWidth / 2 - arrowSize / 2
        }
        else if (direction.includes('end')) {
            result.popupX = targetLeft + targetWidth - popupWidth
            result.arrowX = popupWidth - targetWidth / 2 - arrowSize / 2
        }

        if (result.popupX < offset[0]) {
            result.popupX = offset[0]
            result.arrowX = targetLeft - offset[0] + targetWidth / 2 - arrowSize / 2
        }

        if (result.popupX + popupWidth > rootWidth - offset[0]) {
            result.popupX = rootWidth - popupWidth - offset[0]
            result.arrowX = targetLeft - result.popupX + targetWidth / 2 - arrowSize / 2
        }
    }

    if (horizontals.includes(direction)) { //计算水平方向（左右）的x坐标

        if (direction.includes('left')) {
            result.popupX = targetLeft - popupWidth - gap - arrowSize
            result.arrowX = popupWidth - arrowSize / 2
        }
        else if (direction.includes('right')) {
            result.popupX = targetLeft + targetWidth + gap + arrowSize
            result.arrowX = - arrowSize / 2
        }
    }

    return result
}

function getyAxis(targetRect, popupHeight, options) {
    const { direction, gap, arrowSize, offset } = options
    const result = { popupY: 0, arrowY: 0 }
    let top = targetRect.top
    let targetHeight = targetRect.height

    if (verticals.includes(direction)) {  //计算垂直方向（上下）的y坐标

        if (direction.includes('top')) {
            result.popupY = top - popupHeight - gap - arrowSize
            result.arrowY = popupHeight - arrowSize / 2
        }
        else if (direction.includes('bottom')) {
            result.popupY = top + targetHeight + gap + arrowSize
            result.arrowY = - arrowSize / 2
        }
    }

    if (horizontals.includes(direction)) { //计算水平方向（左右）的y坐标

        if (targetRect.top < offset[1]) {
            top = offset[1]
        }
        if (targetRect.bottom < offset[1]) {
            top = top - offset[1]
        }

        result.popupY = top + targetHeight / 2 - popupHeight / 2
        result.arrowY = top - result.popupY + targetHeight / 2 - arrowSize / 2

        if (direction.includes('start')) {
            result.popupY = top
            result.arrowY = targetHeight / 2 - arrowSize / 2
        }
        else if (direction.includes('end')) {
            result.popupY = top + targetHeight - popupHeight
            result.arrowY = popupHeight - targetHeight / 2 - arrowSize / 2
        }

        if (result.popupY < offset[1]) {
            result.popupY = offset[1]
            result.arrowY = top - result.popupY + targetHeight / 2 - arrowSize / 2
        }

        if (result.popupY + popupHeight > rootHeight - offset[1]) {
            result.popupY = rootHeight - offset[1] - popupHeight
            result.arrowY = top - result.popupY + targetHeight / 2 - arrowSize / 2
        }
    }

    return result
}

function getDirection(target, popup, options, state = 0) {

    const { direction, arrowSize, gap, offset } = options

    if (!verticals.concat(horizontals).includes(direction)) {
        throw new Error('direction is invalid!')
    }

    if (state >= 4) {
        throw new Error('not enough space!')
    }

    let result = direction

    const isVertical = verticals.includes(direction)
    const mainDir = getDirByIndex(direction, 0)
    const subDir = getDirByIndex(direction, 1)
    const configs = [
        {
            dirs: ['left', 'right'],
            reset: 'top' + subDir,
            popupSpace: result.safeWidth + gap + arrowSize / 2 + offset[0]
        },
        {
            dirs: ['top', 'bottom'],
            reset: 'left' + subDir,
            popupSpace: popup.height + gap + arrowSize / 2 + offset[1]
        }
    ]
console.log(popup)
    state++  //增加一次计数
    console.log(mainDir)
    console.log(isVertical)
    console.log(configs[Number(isVertical)])
    const { dirs, reset, popupSpace } = configs[Number(isVertical)]
    const sameDir = dirs.filter(item => mainDir === item)[0]  //计算当前方向
    const reserveDir = dirs.filter(item => mainDir !== item)[0]  //计算当前方向反向

    console.log('sameDir', sameDir)
    console.log('reserveDir', reserveDir)
    console.log('popupSpace', popupSpace)
    console.log('target[sameDir]', target[sameDir])
    console.log('target[reserveDir]', target[reserveDir])

    if (target[sameDir] < popupSpace) { //如果同向空间不足，则改变方向
        state++  //增加一次计数

        if (target[reserveDir] >= popupSpace) {
            result = direction.replace(sameDir, reserveDir) // 如果反向空间满足，方向替换为反向
        } else {
            state++  //增加一次计数
            options.direction = reset // 如果反向空间不满足，则进行横纵方位替换
            result = getDirection(target, popup, options, state = 0)  // 如果反向空间不满足，则进行横纵方位替换
        }
    }
    console.log(result)
    return result
}


export {
    getxAxis,
    getyAxis,
    getDirection,
}