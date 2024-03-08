import { verticals, horizontals, popupOption, popupTheme } from "./option"

function getRootSize() {
    return {
        rootWidth: document.documentElement.clientWidth,
        rootHeight: document.documentElement.clientHeight
    }
}
function getzIndex() {
    const result = [...document.querySelectorAll('*')].map(
        el => getComputedStyle(el).zIndex !== 'auto'
    )
    return result.length > 0 ? Math.max(...result) + 1 : 0
}
function getDirByIndex(direction, index) {
    const mark = "-"
    const result = direction.split(mark)[index]
    return result ? (index > 0 ? mark + result : result) : ''
}

function getxCoord(targeRect, popupWidth, options) {
    const { rootWidth } = getRootSize()
    const { direction, targetGap, arrowSize, boundryGap } = options
    const { left: targetLeft, width: targetWidth } = targeRect
    const result = { popupX: 0, arrowX: 0 }

    if (verticals.includes(direction)) {  //计算垂直方向（上下）的x坐标

        //default
        result.popupX = targetLeft + targetWidth / 2 - popupWidth / 2
        result.arrowX = popupWidth / 2 - arrowSize / 2

        //start
        if (direction.includes('start')) {
            result.popupX = targetLeft
            result.arrowX = targetWidth / 2 - arrowSize / 2
        }

        //end
        else if (direction.includes('end')) {
            result.popupX = targetLeft + targetWidth - popupWidth
            result.arrowX = popupWidth - targetWidth / 2 - arrowSize / 2
        }

        //validate
        if (result.popupX < boundryGap[0]) {
            result.popupX = boundryGap[0]
            result.arrowX = targetLeft - boundryGap[0] + targetWidth / 2 - arrowSize / 2
        }
        if (result.popupX + popupWidth > rootWidth - boundryGap[0]) {
            result.popupX = rootWidth - popupWidth - boundryGap[0]
            result.arrowX = targetLeft - result.popupX + targetWidth / 2 - arrowSize / 2
        }
    }

    //horizontals
    if (horizontals.includes(direction)) { //计算水平方向（左右）的x坐标

        //left
        if (direction.includes('left')) {
            result.popupX = targetLeft - popupWidth - targetGap - arrowSize
            result.arrowX = popupWidth - arrowSize / 2
        }

        //right
        else if (direction.includes('right')) {
            result.popupX = targetLeft + targetWidth + targetGap + arrowSize
            result.arrowX = - arrowSize / 2
        }
    }

    return result
}

function getyCoord(targetRect, popupHeight, options) {
    const { rootHeight } = getRootSize()
    const { direction, targetGap, arrowSize, boundryGap } = options
    const result = { popupY: 0, arrowY: 0 }
    const targetHeight = targetRect.height
    let top = targetRect.top

    //vertiacls
    if (verticals.includes(direction)) {  //计算垂直方向（上下）的y坐标

        //top-Y
        if (direction.includes('top')) {
            result.popupY = top - popupHeight - targetGap - arrowSize
            result.arrowY = popupHeight - arrowSize / 2
        }

        //bottom-Y
        else if (direction.includes('bottom')) {
            result.popupY = top + targetHeight + targetGap + arrowSize
            result.arrowY = - arrowSize / 2
        }
    }

    //horizontals
    if (horizontals.includes(direction)) { //计算水平方向（左右）的y坐标

        //validate
        if (targetRect.top < boundryGap[1]) {
            top = boundryGap[1]
        }
        if (targetRect.bottom < boundryGap[1]) {
            top = top - boundryGap[1]
        }

        //default-Y
        result.popupY = top + targetHeight / 2 - popupHeight / 2
        result.arrowY = top - result.popupY + targetHeight / 2 - arrowSize / 2

        //start-Y
        if (direction.includes('start')) {
            result.popupY = top
            result.arrowY = targetHeight / 2 - arrowSize / 2
        }

        //end-Y
        else if (direction.includes('end')) {
            result.popupY = top + targetHeight - popupHeight
            result.arrowY = popupHeight - targetHeight / 2 - arrowSize / 2
        }

        //validate
        if (result.popupY < boundryGap[1]) {
            result.popupY = boundryGap[1]
            result.arrowY = top - result.popupY + targetHeight / 2 - arrowSize / 2
        }
        if (result.popupY + popupHeight > rootHeight - boundryGap[1]) {
            result.popupY = rootHeight - boundryGap[1] - popupHeight
            result.arrowY = top - result.popupY + targetHeight / 2 - arrowSize / 2
        }
    }

    return result
}

function getDirection(target, popup, options, state = 0) {

    const { direction, arrowSize, targetGap, boundryGap } = options

    if (!verticals.concat(horizontals).includes(direction)) {
        throw new Error('direction is invalid!')
    }

    if (state >= 4) {
        throw new Error('not enough space!')
    }

    let result = direction

    const isVertical = verticals.includes(result)
    const mainDirection = getDirByIndex(result, 0)
    const subDirection = getDirByIndex(result, 1)
    const configs = [
        {
            defaults: ['left', 'right'],
            reset: 'top' + subDirection,
            popupSpace: popup.width + targetGap + arrowSize / 2 + boundryGap[0]
        },
        {
            defaults: ['top', 'bottom'],
            reset: 'left' + subDirection,
            popupSpace: popup.height + targetGap + arrowSize / 2 + boundryGap[1]
        }
    ]

    state++  //增加一次计数

    const { defaults, reset, popupSpace } = configs[Number(isVertical)]
    const same = defaults.filter(item => mainDirection === item)[0]  //计算当前方向
    const reserve = defaults.filter(item => mainDirection !== item)[0]  //计算当前方向反向

    if (target[same] < popupSpace) { //如果同向空间不足，则改变方向
        state++  //增加一次计数

        if (target[reserve] >= popupSpace) {
            result = result.replace(same, reserve) // 如果反向空间满足，方向替换为反向
        } else {
            state++  //增加一次计数
            options.direction = reset // 如果反向空间不满足，则进行横纵方位替换
            result = getDirection(target, popup, options, state = 0)  // 如果反向空间不满足，则进行横纵方位替换
        }
    }

    return result
}

function resolveEl(el) {
    if (typeof el === "string") {
        return document.getElementById(el) || document.getElementsByClassName(el)[0] || document.querySelector(el)
    }
    return el
}

function resolveElSize(el) {
    const display = getComputedStyle(el).getPropertyValue("display")
    if (display === "none") {
        const styles = [
            { key: "display", value: "block", origin: getComputedStyle(el).getPropertyValue("display") },
            { key: "pointer-events", value: "none", origin: getComputedStyle(el).getPropertyValue("pointer-events") },
            { key: "visibility", value: "hidden", origin: getComputedStyle(el).getPropertyValue("visibility") },
            { key: "z-index", value: -999, origin: getComputedStyle(el).getPropertyValue("z-index") },
        ]

        // 利用visibility、z-index、pointer-events属性模拟display：none效果
        for (const item of styles) {
            el.style[item.key] = item.value
        }

        // 获取元素尺寸信息
        const rect = el.getBoundingClientRect()

        // 将元素样式恢复
        for (const item of styles) {
            el.style[item.key] = item.origin
        }

        return rect
    } else {
        return el.getBoundingClientRect()
    }
}

function resolveRect(el, options) {
    //获取页面大小及元素大小，设置安全宽度，避免宽度溢出页面
    el = resolveEl(el)
    const { rootWidth, rootHeight } = getRootSize()
    const { top, right, bottom, left, height, width: elWidth } = resolveElSize(el)
    let safeWidth = elWidth

    if (options) {
        const { target, width, direction, arrowSize, targetGap, boundryGap } = options
        if (width === 'auto') {
            if (verticals.includes(direction)) {
                safeWidth = rootWidth - safeWidth >= boundryGap[0] * 2 ? safeWidth : rootWidth - boundryGap[0] * 2
            } else if (horizontals.includes(direction)) {
                const blank = boundryGap[0] + targetGap + arrowSize
                const space = target.left > target.right ? target.left : target.right
                safeWidth = space - safeWidth >= blank ? safeWidth : space - blank
            }
        } else {
            if (width && !isNaN(width)) {
                safeWidth = Number(width)
            } else {
                throw new Error('width is invalid!')
            }
        }
        el.style.setProperty('--popup-width', `${safeWidth}px`)
        safeWidth = resolveElSize(el).width
    }

    return {
        top,
        right: rootWidth - right,
        bottom: rootHeight - bottom,
        left,
        width: safeWidth,
        height
    }
}

function resolveArrow(direction) {
    let rotate = 0

    if (verticals.includes(direction)) {
        rotate = direction.includes('top') ? -45 : 135
    }
    if (horizontals.includes(direction)) {
        rotate = direction.includes('left') ? 225 : 45
    }

    return rotate
}

function resolveOption(options) {
    const resolved = Object.assign({}, popupOption, options)
    if (!resolved.needArrow) {
        resolved.arrowSize = 0
    }

    if (resolved.theme) {

        if (popupTheme[resolved.theme]) {
            resolved.background = popupTheme[resolved.theme].background
            resolved.color = popupTheme[resolved.theme].color
        }
        else if (typeof resolved.theme === 'object') {
            resolved.background = resolved.theme.background
            resolved.color = resolved.theme.color
        }
    }

    return resolved
}

function resolveTransition(el, transitions, start = true) {

    const getClass = (name) => {
        let className
        if (typeof transitions[name] === 'string') {
            className = transitions[name]
        } else {
            className = `ease-popup-${name}`
            addStylesheetRules([[`.${className}`, transitions[name]]], 'ease-popup')
        }
        return className
    }
    const enterClass = getClass('enter')
    const leaveClass = getClass('leave')
    if (start) {
        new Promise((resolve) => {
            el.classList.add(leaveClass)
            el.style.display = 'block'
            setTimeout(resolve, 0)
        }).then(() => {
            el.classList.remove(leaveClass)
            el.classList.add(enterClass)
        })
    } else {
        el.classList.add(leaveClass)
    }

    el.addEventListener('transitionend', function () {
        if (!start) {
            el.style.display = 'none'
            el.classList.remove(leaveClass)
        } else {
            el.classList.remove(enterClass)
        }
    }, { once: true })
}

//this function is from MDN,and I just made some changes to
//support use one <style> tag to add styleRules 
function addStylesheetRules(rules, id) {
    let sheet
    if (document.getElementById(id)) {
        sheet = document.getElementById(id).sheet
    } else {
        const style = document.createElement("style")
        style.id = id
        style.type = "text/css"
        document.getElementsByTagName("head")[0].appendChild(style)

        if (!window.createPopup) {
            style.appendChild(document.createTextNode(""))
        }
        sheet = document.styleSheets[document.styleSheets.length - 1]
    }
    console.log(sheet)
    for (let index = 0; index < rules.length; index++) {
        let rule = rules[index]
        let selector = rule[0]
        let existRule = [...sheet.rules].filter(item => item.selectorText === selector)
        if (existRule.length) {
            break;
        }

        let subIndex = 1
        let ruleText = ""

        if (Object.prototype.toString.call(rule[1][0]) === "[object Array]") {
            rule = rule[1]
            subIndex = 0
        }

        for (; subIndex < rule.length; subIndex++) {
            let subRule = rule[subIndex]
            ruleText += `${subRule[0]}:${subRule[1]}${subRule[2] ? " !important" : ""};\n`
        }

        if (sheet.insertRule) {
            sheet.insertRule(selector + "{" + ruleText + "}", sheet.cssRules.length);
        } else {
            sheet.addRule(selector, ruleText, -1);
        }
    }

}
export {
    getxCoord,
    getyCoord,
    getzIndex,
    getDirection,
    resolveEl,
    resolveRect,
    resolveArrow,
    resolveOption,
    addStylesheetRules,
    resolveTransition
}