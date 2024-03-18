import { computePosition, size, offset, arrow, flip, shift, hide, detectOverflow } from '@floating-ui/dom'
import { popupOption, popupTheme, arrowOption, popupName, arrowName, modalName, directions } from "./option"

const preventOverflow = (options) => ({
    name: "preventOverflow",
    async fn(state) {
        const overflow = await detectOverflow(state, options);
        return {
            data: overflow
        }
    },
})

function apply(state) {
    Object.assign(state.elements.floating.style, {
        maxWidth: `${state.availableWidth}px`,
        maxHeight: `${state.availableHeight}px`
    })
}
function updatePosition() {
    const positionOptions = getPositionOptions(this.options)
    computePosition(
        this.options.target,
        this.options.popup,
        positionOptions
    ).then((res) => {
        this.options.direction = res.placement
        updateStyles(this.options, res)
    });
}

function updateStyles(options, data) {
    const zIndex = getzIndex() + 2
    const { popup, theme, needArrow } = options
    const { x, y, placement, middlewareData } = data
    const popupStyles = {
        'left': `${x}px`,
        'top': `${y}px`,
        'z-index': `${zIndex}`,
        'background-color': `${theme.background}`,
        'color': `${theme.color}`,
    }
    Object.assign(popup.style, popupStyles)
    if (needArrow) {
        const arrow = resolveArrow(popup)
        const { x, y } = middlewareData.arrow
        const side = placement.split('-')[0]
        const staticSide = arrowOption.side[side];
        const rotate = arrowOption.rotate[side];
        const arrowStyles = {
            'left': x != null ? `${x}px` : '',
            'top': y != null ? `${y}px` : '',
            'z-index': `${zIndex - 1}`,
            'transform': `rotate(${rotate}deg)`,
            [staticSide]: '-5px'
        }
        Object.assign(arrow.style, arrowStyles)
    }
    popup.style.visibility = middlewareData.hide.referenceHidden ? 'hidden' : 'visible'
}

function getzIndex() {
    const result = [...document.querySelectorAll('*')].map(
        el => getComputedStyle(el).zIndex !== 'auto'
    )
    return result.length > 0 ? Math.max(...result) + 1 : 0
}
function insideOffset(options) {
    const { direction, width, offset } = options
    return ({ rects }) => {
        const result = { mainAxis: 0, crossAxis: 0 }
        const [x = 0, y = 0] = offset
        if (direction.includes('center')) {
            result.mainAxis = rects.reference.width / 2 - rects.floating.width / 2 + x
            result.crossAxis = rects.reference.height / 2 - rects.floating.height / 2 + y
        }
        if (direction.includes('left') || direction.includes('right')) {
            result.mainAxis = -(width + x)
            result.crossAxis = 0 + y
        }
        return result
    }
}
function getPositionOptions(options) {
    const overflowOptions = {
        boundary: options.container,
        padding: options.boundryGap
    }
    const offsetOptions = options.placement === 'inside' ? insideOffset(options) : options.targetGap
    const result = {
        placement: options.direction,
        middleware: [
            offset(offsetOptions), //设置popup平移距离
            flip(overflowOptions),  //设置popup自动调整方向
            shift(overflowOptions),  //设置popup不超出容器
            preventOverflow(overflowOptions), //设置popup防止溢出
            size({ ...overflowOptions, apply }), //设置popup尺寸
            hide(overflowOptions) //设置popup隐藏
        ]
    }
    if (options.needArrow) {
        result.middleware.push(arrow({ element: resolveArrow(options.popup) }))
    }
    return result
}
function checkPopup(options) {
    const { container, target, popup } = options
    if (!container.contains(target)) {
        console.warn('the target element is outside the container，popup will be hidden')
    }
    if (!container.contains(popup)) {
        container.appendChild(popup)
    }
}
function resolveEl(el) {
    let result
    if (resolveType(el) === "string") {
        result = document.getElementById(el) || document.getElementsByClassName(el)[0] || document.querySelector(el)
    }
    if (resolveType(el).includes("element")) result = el
    return result
}
function resolveType(value) {
    return Object.prototype.toString.call(value).replace('object ', "").match(/\w+/g)[0].toLowerCase();
}
function resolveArrow(popup) {
    let arrow = popup.querySelector(`.${arrowName}`)
    if (!arrow) {
        arrow = document.createElement('div')
        arrow.classList.add(arrowName)
        popup.appendChild(arrow)
    }
    return arrow
}
function resolveModal(options) {
    let modal = resolveEl(`.${modalName}`)
    const { container, show, fullScreen, destroy } = options
    if (!modal && container) {
        modal = document.createElement('div')
        modal.className = modalName
        modal.style.zIndex = getzIndex() + 1
        modal.style.position = 'fixed'
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
        document.body.appendChild(modal)
        if (!fullScreen) {

            const { left, top } = getComputedStyle(container)
            const { x, y, width, height } = container.getBoundingClientRect()

            modal.style.left = `${left && left != 'auto' ? left : x + 'px'}`
            modal.style.top = `${top && top != 'auto' ? top : y + 'px'}`
            modal.style.width = `${width}px`
            modal.style.height = `${height}px`
        } else {
            modal.style.inset = '0'
        }
    }
    if (modal) {
        modal.style.display = show ? 'block' : 'none'
        if (destroy) modal.remove()
    }
    return modal
}
function resolvePopup(options) {
    let popup = resolveEl(options.popup)
    if (!popup) {
        popup = document.createElement('dialog')
        if (!popup.show && resolveType(popup.show) !== 'function') {
            popup = document.createElement('div')
        }
    }
    if (!popup.show && resolveType(popup.show) !== 'function') {
        const configs = {
            open: {
                value: false,
                writable: true,
                configurable: false,
            },
            show: {
                value: function () {
                    this.open = true
                    this.style.display = 'block'
                },
                writable: false,
                configurable: false,
            },
            showModal: {
                value: function (container, fullScreen) {
                    resolveModal({ container, show: true, fullScreen })
                },
                writable: false,
                configurable: false,
            },
            close: {
                value: function () {
                    this.open = false
                    this.style.display = 'none'
                },
                writable: false,
                configurable: false,
            }
        }
        Object.defineProperties(popup, configs)
    }
    const className = popup.className.split(' ')
    if (!className.includes(popupName)) className.push(popupName)
    popup.className = className.join(' ').trim()
    if (options.content) popup.innerHTML = `<div class='${popupName}-content'>${options.content}</div>`
    if (options.width) popup.style.width = `${options.width}px`
    return popup
}
function resolveOptions(newOptions, oldOptions) {
    if (!oldOptions) oldOptions = popupOption
    const resolved = Object.assign({}, oldOptions, newOptions)

    resolved.target = resolveEl(resolved.target)
    resolved.container = resolveEl(resolved.container)

    if (resolved.placement === 'inside') {
        resolved.needArrow = false
        resolved.container = resolved.target
    }

    if (resolved.target === document.body) {
        resolved.fullScreen = true
    }

    if (resolved.theme) {
        if (popupTheme[resolved.theme]) {
            resolved.theme = popupTheme[resolved.theme]
        }
    }

    if (!resolved.target) {
        logError('target parameter is required')
    }
    if (resolved.width !== 'auto' && isNaN(resolved.width)) {
        logError('the width option is invalid')
    }
    if (isNaN(resolved.targetGap)) {
        logError('the targetGap option is invalid')
    }
    if (isNaN(resolved.boundryGap)) {
        logError('the boundryGap option is invalid')
    }
    if (!Object.keys(directions).includes(resolved.placement)) {
        logError('the placement option is invalid')
    }
    if (!resolved.container) {
        logError('the container option is invalid')
    }
    if (!directions[resolved.placement].includes(resolved.direction)) {
        logError(`the direction does not comply with the placement option: '${resolved.placement}'`)
    }

    resolved.popup = resolvePopup(resolved)
    return resolved
}
function resolveEvent(event) {
    if (!this.options.target.contains(event.target) || this.options.target === document.body) {
        //通过点击坐标判断是否是在popup元素自身或是外部，更兼容一些
        const { x, y, width, height } = this.options.popup.getBoundingClientRect()
        const endX = x + width
        const endY = y + height
        if (this.options.closeByOutSide && this.options.singleOpen) {
            if (event.clientX > endX || event.clientX < x || event.clientY > endY || event.clientY < y) {
                this.hide()
            }
        }
        if (!this.options.selfClick) {
            if (event.clientX > x && event.clientX < endX && event.clientY > y && event.clientY < endY) {
                this.hide()
            }
        }
    }
}
function logError(errorInfo) {
    throw new Error(errorInfo)
}
//I found this function on MDN and made some modifications 
//to support adding styles using a single <style> tag
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
    preventOverflow,
    apply,
    updatePosition,
    getzIndex,
    getPositionOptions,
    checkPopup,
    resolveOptions,
    resolvePopup,
    resolveEvent,
    resolveModal,
    resolveEl,
    addStylesheetRules,
}