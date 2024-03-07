import { rootWidth, rootHeight, verticals, horizontals } from "./option"

function getDirByIndex(direction, index) {
    const result = direction.split('-')[index]
    return result ? (index > 0 ? '-' + result : result) : ''
}

function getSpace(targetRect, direction, trends) {

    const mainDir = getDirByIndex(direction, 0)
    const sameDir = trends.filter(item => mainDir === item)[0]  //计算当前方向
    const reserveDir = trends.filter(item => mainDir !== item)[0]  //计算当前方向反向
    const sameSpace = targetRect[sameDir]  //计算target所在位置的空间
    const reserveSpace = targetRect[reserveDir]  //计算target所在位置的反向空间

    return { sameDir, reserveDir, sameSpace, reserveSpace }
}

function getxAxis(target, popup, direction, offsetOptions) {

    const { gap, arrowSize, offset } = offsetOptions
    const result = { popupX: 0, width: popup.width, arrowX: 0 }

    if (verticals.includes(direction)) {  //计算垂直方向（上下）的x坐标
        const blankSpace = offset[0] * 2 //计算空白
        result.width = rootWidth - popup.width >= blankSpace ? popup.width : rootWidth - blankSpace //计算popup宽度

        result.popupX = target.left + target.width / 2 - result.width / 2
        result.arrowX = result.width / 2 - arrowSize / 2

        if (direction.includes('start')) {
            result.popupX = target.left
            result.arrowX = target.width / 2 - arrowSize / 2
        }
        else if (direction.includes('end')) {
            result.popupX = target.left + target.width - result.width
            result.arrowX = result.width - target.width / 2 - arrowSize / 2
        }

        if (result.popupX < offset[0]) {
            result.popupX = offset[0]
            result.arrowX = target.left - offset[0] + target.width / 2 - arrowSize / 2
            if (result.arrowX < 0) result.arrowX = 2
        }

        if (result.popupX + result.width > rootWidth - offset[0]) {
            result.popupX = rootWidth - result.width - offset[0]
            result.arrowX = target.left - result.popupX + target.width / 2 - arrowSize / 2
            if (result.arrowX + arrowSize > result.width) result.arrowX = result.width - arrowSize - 2
        }

    }

    if (horizontals.includes(direction)) { //计算水平方向（左右）的x坐标
        const trend = getDirByIndex(direction, 0)
        const blankSpace = gap + offset[0]  //计算间隔
        const arrowSpace = gap + arrowSize
        result.width = target[trend] - blankSpace >= popup.width ? popup.width : target[trend] - blankSpace //计算popup宽度

        if (direction.includes('left')) {
            result.popupX = target.left - result.width - arrowSpace
            result.arrowX = result.width - arrowSize / 2
        }
        else if (direction.includes('right')) {
            result.popupX = target.left + target.width + arrowSpace
            result.arrowX = - arrowSize / 2
        }
    }

    return result
}

function getyAxis(target, popup, direction, offsetOptions) {
    const { gap, arrowSize, offset } = offsetOptions
    const result = { popupY: 0, height: popup.height, arrowY: 0 }
    let top = target.top

    if (target.top < offset[1]) {
        top = offset[1]
    }
    if (target.bottom < offset[1]) {
        top = rootHeight - offset[1] - popup.height
    }

    if (verticals.includes(direction)) {  //计算垂直方向（上下）的y坐标

        if (direction.includes('top')) {
            result.popupY = top - result.height - gap - arrowSize
            result.arrowY = result.height - arrowSize / 2
        }
        else if (direction.includes('bottom')) {
            result.popupY = top + target.height + gap + arrowSize
            result.arrowY = - arrowSize / 2
        }
    }

    if (horizontals.includes(direction)) { //计算水平方向（左右）的y坐标

        result.popupY = target.top + target.height / 2 - result.height / 2
        result.arrowY = target.top - result.popupY + target.height / 2 - arrowSize / 2

        if (direction.includes('start')) {
            result.popupY = target.top
            result.arrowY = target.height / 2 - arrowSize / 2
        }
        else if (direction.includes('end')) {
            result.popupY = target.top + target.height - result.height
            result.arrowY = result.height - target.height / 2 - arrowSize / 2
        }

        if (result.popupY < offset[1]) {
            result.popupY = offset[1]
            result.arrowY = target.top - result.popupY + target.height / 2 - arrowSize / 2
        }

        if (result.popupY + result.height > rootHeight - offset[1]) {
            result.popupY = rootHeight - offset[1] - result.height
            result.arrowY = target.top - result.popupY + target.height / 2 - arrowSize / 2
            if (result.arrowY + arrowSize > result.height) result.arrowY = result.height - arrowSize - 2
        }
    }

    return result
}

function getDirection(target, popup, direction, offsetOptions, state = 0) {

    if (!verticals.concat(horizontals).includes(direction)) {
        throw new Error('direction is invalid!')
    }

    if (state >= 4) {
        throw new Error('not enough space!')
    }

    const { gap, arrowSize, offset } = offsetOptions
    const dir = verticals.includes(direction) ? 'vertical' : 'horizontal'
    const subDir = getDirByIndex(direction, 1)
    const dirOptions = {
        vertical: {
            trends: ['top', 'bottom'],
            backup: 'left' + subDir,
            popupSpace: popup.height + gap + arrowSize + offset[1]
        },
        horizontal: {
            trends: ['left', 'right'],
            backup: 'top' + subDir,
            popupSpace: popup.width + gap + arrowSize + offset[0]
        }
    }

    state++  //增加一次计数

    let result = direction

    const { trends, backup, popupSpace } = dirOptions[dir]
    const { sameDir, reserveDir, sameSpace, reserveSpace } = getSpace(target, direction, trends)

    if (sameSpace < popupSpace) { //如果同向空间不足，则改变方向
        state++  //增加一次计数

        if (reserveSpace > popupSpace) {
            result = direction.replace(sameDir, reserveDir) // 如果反向空间满足，方向替换为反向
        } else {
            state++  //增加一次计数
            result = getDirection(target, popup, backup, offsetOptions, state)  // 如果反向空间不满足，则进行横纵方位替换
        }
    }

    return result
}


export {
    getxAxis,
    getyAxis,
    getDirection,
}