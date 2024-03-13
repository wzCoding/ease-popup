import { computePosition, size, offset, arrow, flip, shift, hide, detectOverflow } from '@floating-ui/dom'
import { popupOption, popupTheme, arrowOption } from "./option"

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
    const positionOptions = getPositionOptions(this.popup, this.options)
    computePosition(
        this.target,
        this.popup,
        positionOptions
    ).then((res) => {
        console.log(res)
        this.options.direction = res.placement
        updateStyles.call(this, res)
    });
}

function updateStyles(data) {
    const zIndex = getzIndex() + 2
    const { cleanup, popup, options } = this
    const { x, y, placement, middlewareData } = data
    const popupStyles = {
        'left': `${x}px`,
        'top': `${y}px`,
        'z-index': `${zIndex}`,
        'background-color': `${options.theme.background}`,
        'color': `${options.theme.color}`,
    }
    Object.assign(popup.style, popupStyles)
    // 更新箭头样式
    if (options.needArrow) {
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
    if (middlewareData.hide.referenceHidden) {
        popup.style.visibility = 'hidden'
        cleanup && cleanup()
    } else {
        popup.style.visibility = 'visible'
    }
}

function getzIndex() {
    const result = [...document.querySelectorAll('*')].map(
        el => getComputedStyle(el).zIndex !== 'auto'
    )
    return result.length > 0 ? Math.max(...result) + 1 : 0
}

function getPositionOptions(popup, options) {
    const overflowOptions = {
        boundary: resolveEl(options.container),
        padding: options.boundryGap
    }
    const result = {
        placement: options.direction,
        middleware: [
            offset(options.targetGap), //设置popup平移距离
            flip(overflowOptions),  //设置popup自动调整方向
            shift(overflowOptions),  //设置popup不超出容器
            preventOverflow(overflowOptions), //设置popup防止溢出
            size({ ...overflowOptions, apply }), //设置popup尺寸
            hide(overflowOptions) //设置popup隐藏
        ]
    }
    if (options.needArrow) {
        result.middleware.push(arrow({ element: resolveArrow(popup) }))
    }
    return result
}

function resolveType(value) {
    return Object.prototype.toString.call(value).replace('object ', "").match(/\w+/g)[0].toLowerCase();
}

function resolveEl(el) {
    let result
    if (resolveType(el) === "string") {
        result = document.getElementById(el) || document.getElementsByClassName(el)[0] || document.querySelector(el)
    }
    if (resolveType(el).includes("element")) result = el
    return result
}
function resolveParam(params) {
    let args = [...params]
    let target, popup, options
    if (!args.length) {
        throw new Error('at least "target" parameter is required')
    }
    target = resolveEl(args[0])
    if (!target) {
        throw new Error('target parameter is invalid')
    }
    if (args.length === 1) {
        options = resolveOption({})
        popup = resolvePopup(popup, options)
    }

    if (args.length >= 2) {
        const i = args[2] ? 2 : 1
        options = resolveOption(resolveType(args[i]) === 'object' ? args[i] : {})
        popup = resolvePopup(args[1], options)
    }

    return { target, popup, options }
}

function resolveModal(container, show) {
    const className = 'ease-popup-modal'
    const zIndex = getzIndex() + 1
    let modal = document.querySelector(`.${className}`)
    console.log(container)
    if (!modal && container) {
        modal = document.createElement('div')
        modal.className = className
        modal.style.zIndex = zIndex
        container.appendChild(modal)
    }
    if (modal) {
        modal.style.display = show ? 'block' : 'none'
        modal.parentNode.style.overflow = show ? 'hidden' : 'auto'
    }
}
function resolvePopup(popup, options) {
    popup = resolveEl(popup)
    if (!popup) {
        popup = document.createElement('dialog')
        const container = resolveEl(options.container)
        if (!popup.show && resolveType(popup.show) !== 'function') {
            popup = document.createElement('div')
        }
        container.appendChild(popup)
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
                value: function (container) {
                    resolveModal(resolveEl(container), true)
                },
                writable: false,
                configurable: false,
            },
            close: {
                value: function () {
                    this.open = false
                    this.style.display = 'none'
                    resolveModal()
                },
                writable: false,
                configurable: false,
            }
        }
        Object.defineProperties(popup, configs)
    }
    popup.className += ` ease-popup ease-popup-${document.querySelectorAll('.ease-popup').length}`
    if (options.content) popup.innerHTML = `<div class='ease-popup-content'>${options.content}</div>`
    if (options.width) popup.style.width = `${options.width}px`
    return popup
}

function resolveOption(options) {
    const resolved = Object.assign({}, popupOption, options)
    if (!resolved.needArrow) {
        resolved.arrowSize = 0
    }

    if (resolved.theme) {
        if (popupTheme[resolved.theme]) {
            resolved.theme = popupTheme[resolved.theme]
        }
    }

    return resolved
}
function resolveEvent(event) {
    if (!this.target.contains(event.target)) {
        //通过点击坐标判断是否是在popup元素自身或是外部，更兼容一些
        const { x, y, width, height } = this.popup.getBoundingClientRect()
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
function resolveArrow(popup) {
    const className = 'ease-popup-arrow'
    let arrow = popup.querySelector(`.${className}`)
    if (!arrow) {
        arrow = document.createElement('div')
        arrow.classList.add(className)
        popup.appendChild(arrow)
    }
    return arrow
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
    resolveParam,
    resolveOption,
    resolveEvent,
    addStylesheetRules,
}