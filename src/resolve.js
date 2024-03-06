import { rootWidth, rootHeight, verticals, horizontals, popupOption, popupTheme } from "./option"

function resolveEl(el) {
    if (typeof el === "string") {
        return document.getElementById(el) || document.getElementsByClassName(el)[0]
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

function resolveRect(el, maxWidth, offsetX) {
    el = resolveEl(el)
    let { left, top, right, bottom, width, height } = resolveElSize(el)

    if (maxWidth) {
        const autoWidth = rootWidth - width >= offsetX * 2 ? width : rootWidth - offsetX * 2
        width = maxWidth == 'auto' ? autoWidth : Number(maxWidth)
    }

    return {
        left,
        right: rootWidth - right,
        top,
        bottom: rootHeight - bottom,
        width,
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
    console.log(resolved)
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

function addStylesheetRules(rules, id) {
    if (!document.getElementById(id)) {
        const style = document.createElement("style")
        style.id = id
        style.type = "text/css"
        document.getElementsByTagName("head")[0].appendChild(style)

        if (!window.createPopup) {
            /* For Safari */
            style.appendChild(document.createTextNode(""))
        }

        const sheet = document.styleSheets[document.styleSheets.length - 1]

        for (let index = 0; index < rules.length; index++) {

            let rule = rules[index]
            let selector = rule[0]
            let rulesText = ""

            let childIndex = 1
            if (Object.prototype.toString.call(rule[1][0]) === "[object Array]") {
                rule = rule[1]
                childIndex = 0
            }

            for (; childIndex < rule.length; childIndex++) {
                let childRule = rule[childIndex]
                rulesText += `${childRule[0]}:${childRule[1]}${childRule[2] ? " !important" : ""};\n`
            }

            if (sheet.insertRule) {
                sheet.insertRule(selector + "{" + rulesText + "}", sheet.cssRules.length);
            } else {
                /* IE */
                sheet.addRule(selector, rulesText, -1);
            }
        }
    }
}
export {
    resolveEl,
    resolveRect,
    resolveArrow,
    resolveOption,
    addStylesheetRules
}