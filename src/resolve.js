import { computePosition, size, offset, arrow, flip, shift, hide, detectOverflow } from '@floating-ui/dom'
import { popupOption, popupTheme, arrowOption, popupName, arrowName, modalName, fullScreenName, directions } from "./option"

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
    const { popup, theme, needArrow } = options
    const { x, y, placement, middlewareData } = data
    const arrow = popup.querySelector(`.${arrowName}`)
    const popupStyles = {
        'left': `${x}px`,
        'top': `${y}px`,
        'background-color': `${theme.background}`,
        'color': `${theme.color}`,
        'position': 'absolute',
        'visibility': middlewareData.hide.referenceHidden ? 'hidden' : 'visible'
    }
    if (!options.fullScreen) popup.classList.remove(fullScreenName)
    Object.assign(popup.style, popupStyles)
    if (arrow && needArrow) {
        const { x, y } = middlewareData.arrow
        const side = placement.split('-')[0]
        const staticSide = arrowOption.side[side];
        const rotate = arrowOption.rotate[side];
        const arrowStyles = {
            'left': x != null ? `${x}px` : '',
            'top': y != null ? `${y}px` : '',
            'transform': `rotate(${rotate}deg)`,
            'display': 'block',
            [staticSide]: '-5px'
        }
        Object.assign(arrow.style, arrowStyles)
    } else if (arrow && !needArrow) {
        Object.assign(arrow.style, { display: 'none' })
    }
}

function getzIndex(popup) {
    const list = [...document.querySelectorAll('*')].filter(
        el => getComputedStyle(el).zIndex !== 'auto'
    ).map(el => getComputedStyle(el).zIndex)
    const max = list.length > 0 ? Math.max(...list) : 0
    const self = getComputedStyle(popup).zIndex == 'auto' ? 0 : getComputedStyle(popup).zIndex
    return max > self ? max + 2 : self
}

function resolveSize(el) {
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
function fullScreenPosition(options) {
    let rootWidth = window.innerWidth
    const rootHeight = window.innerHeight
    const scrollWidth = rootWidth - document.body.clientWidth
    rootWidth = rootWidth - scrollWidth
    const { direction, popup, offset, boundryGap } = options
    let { width, height } = resolveSize(popup)
    if (rootWidth - boundryGap * 2 < width) width = rootWidth - boundryGap * 2
    const mainDir = direction.split('-')[0]
    const crossDir = direction.split('-')[1]
    let x = 0, y = 0
    switch (mainDir) {
        case 'left':
            x = 0 + boundryGap + offset[0]
            y = rootHeight / 2 - height / 2 + offset[1]
            break
        case 'right':
            x = rootWidth - width - boundryGap - offset[0]
            y = rootHeight / 2 - height / 2 - offset[1]
            break
        case 'center':
            x = rootWidth / 2 - width / 2 + offset[0]
            y = rootHeight / 2 - height / 2 + offset[1]
            break
        default:
    }

    switch (crossDir) {
        case 'start':
            y = 0 + boundryGap + offset[1]
            break
        case 'end':
            y = rootHeight - height - boundryGap - offset[1]
            break
        default:
    }
    if (popup.querySelector(`.${arrowName}`)) {
        popup.querySelector(`.${arrowName}`).style.display = 'none'
    }
    popup.classList.add(fullScreenName)
    addStylesheetRules([
        [
            `.${fullScreenName}`,
            ['position', 'fixed', true],
            ['visibility', 'visible', true],
            ['left', `${x}px`, true],
            ['top', `${y}px`, true],
        ]
    ])

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
            result.mainAxis = -(width == 'auto' ? rects.floating.width : Number(width)) - x
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
    if (!target) {
        console.error('the target option is required')
    }
    if (!container) {
        console.error('the container option is invalid')
    }
    if (!container.contains(target)) {
        console.warn('the target element is outside the container，popup will be hidden')
    }
    if (!container.contains(popup) && !document.body.contains(popup)) {
        document.body.appendChild(popup)
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
    arrow.style.zIndex = getzIndex(popup) - 1
    return arrow
}
function resolveModal(options, show, destroy) {
    let modal = resolveEl(`.${modalName}`)
    if (!modal && options.container && show) {
        const { container, popup, fullScreen } = options
        modal = document.createElement('div')
        modal.className = modalName
        modal.style.zIndex = getzIndex(popup) - 1
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
        modal.style.inset = '0'
        if (!fullScreen) {
            modal.style.position = 'absolute'
            options.container.style.position = 'relative'
            container.appendChild(modal)
        } else {
            modal.style.position = 'fixed'
            document.body.appendChild(modal)
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
    }
    if (options.needArrow) {
        resolveArrow(popup)
    }

    if (!popup.showPopup && typeof popup.showPopup !== 'function') {
        const configs = {
            visible: {
                value: false,
                writable: true,
                configurable: false,
            },
            showPopup: {
                value: function () {
                    this.visible = true
                    if (this.nodeName === 'DIALOG') {
                        this.show()
                    } else {
                        this.style.display = 'block'
                    }
                    options.onShow && options.onShow()
                },
                writable: false,
                configurable: false,
            },
            showPopupModal: {
                value: function (fullScreen) {
                    this.visible = true
                    if (this.nodeName === 'DIALOG') {
                        fullScreen ? this.showModal() : this.show()
                    } else {
                        this.style.display = 'block'
                    }
                    options.onShow && options.onShow()
                },
                writable: false,
                configurable: false,
            },
            hidePopup: {
                value: function () {
                    this.visible = false
                    if (this.nodeName === 'DIALOG') {
                        this.close()
                    } else {
                        this.style.display = 'none'
                    }
                    options.onHide && options.onHide()
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
    popup.style.zIndex = getzIndex(popup)
    popup.style.width = options.width == 'auto' ? 'fit-content' : `${options.width}px`
    if (options.content) popup.innerHTML = `<div class='${popupName}-content'>${options.content}</div>`
    return popup
}
function resolveOptions(newOptions, oldOptions) {

    if (!oldOptions) oldOptions = popupOption
    const resolved = Object.assign({}, oldOptions, newOptions)

    resolved.target = resolveEl(resolved.target)
    resolved.container = resolveEl(resolved.container)
    resolved.fullScreen = resolved.target === document.body

    if (resolved.placement === 'inside') {
        resolved.needArrow = false
        resolved.container = resolved.target
    }

    if (resolved.theme) {
        if (popupTheme[resolved.theme]) {
            resolved.theme = popupTheme[resolved.theme]
        }
    }

    if (resolved.width !== 'auto' && isNaN(resolved.width)) {
        console.error('the width option is invalid')
    }
    if (isNaN(resolved.targetGap)) {
        console.error('the targetGap option is invalid')
    }
    if (isNaN(resolved.boundryGap)) {
        console.error('the boundryGap option is invalid')
    }
    if (!Object.keys(directions).includes(resolved.placement)) {
        console.error('the placement option is invalid')
    }
    if (!directions[resolved.placement].includes(resolved.direction)) {
        console.error(`the direction does not comply with the placement option: '${resolved.placement}'`)
    }
    if (resolved.onShow && typeof resolved.onShow !== 'function') {
        console.error('the onShow option is invalid')
    }
    if (resolved.onHide && typeof resolved.onHide !== 'function') {
        console.error('the onHide option is invalid')
    }
    if (resolved.onDestroy && typeof resolved.onDestroy !== 'function') {
        console.error('the onDestroy option is invalid')
    }

    resolved.popup = resolvePopup(resolved)

    return resolved
}
function resolveEvent(event) {
    if (!this.options.target.contains(event.target) || this.options.target === document.body || this.options.target === this.options.container) {
        //通过点击坐标判断是否是在popup元素自身或是外部
        const { x, y, width, height } = this.options.popup.getBoundingClientRect()
        const endX = x + width
        const endY = y + height
        if (this.options.closeByOutSide) {
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
        let selectors = [...sheet.cssRules].map(item => item.selectorText)
        let ruleIndex = selectors.indexOf(selector)
        if (ruleIndex > -1) {
            sheet.deleteRule(ruleIndex)
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
    updatePosition,
    fullScreenPosition,
    checkPopup,
    resolveOptions,
    resolveModal,
    resolveEvent,
    addStylesheetRules,
}