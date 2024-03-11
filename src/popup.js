import { popupStyle } from "./option"
import {
    resolveRect,
    resolveParam,
    resolveArrow,
    addStylesheetRules,
    getxCoord,
    getyCoord,
    getDirection,
    getzIndex
} from "./resolve"
function resolveEvent(event) {
    if (this.options.closeByOutSide && !this.popup.contains(event.target) && !this.target.contains(event.target)) {
        this.popup.close()
    }
    if (!this.options.contentClick && !this.target.contains(event.target)) {
        this.popup.close()
    }
}
class Popup {
    constructor(target, popup, options = {}) {

        const resolved = resolveParam(arguments)
        this.target = resolved.target
        this.popup = resolved.popup
        this.options = resolved.options

        if (this.options.open) {
            popupStyle.popup.display = 'block'
        }


        this.popup.classList.add('ease-popup')
        addStylesheetRules([popupStyle.popup], 'ease-popup')
        addStylesheetRules([popupStyle.dialog], 'ease-popup')
        if (this.options.useCache) {
            this.state = 0
            this.styles = {}
        }

        this.update(
            this.computeStyle()
        )
    }

    computeStyle() {

        if (this.options.useCache) {

            console.log('useCache')

            if (this.state >= 2) return this.styles

            this.state++

        }

        const targetRect = resolveRect(this.target)
        const popupRect = resolveRect(this.popup, { ...this.options, target: targetRect })
        const safeDirection = getDirection(targetRect, popupRect, this.options)

        const { popupX, arrowX } = getxCoord(targetRect, popupRect.width, this.options)

        const { popupY, arrowY } = getyCoord(targetRect, popupRect.height, this.options)

        const zIndex = getzIndex() + 1

        const styles = {
            'top': `${popupY}px`,
            'left': `${popupX}px`,
            'width': `${popupRect.width}px`,
            'background-color': `${this.options.background}`,
            'color': `${this.options.color}`,
            'z-index': `${zIndex}`
        }

        if (this.options.needArrow) {
            addStylesheetRules([popupStyle.arrow], 'ease-popup')
            resolveArrow(this.popup, { safeDirection, arrowSize: this.options.arrowSize, arrowX, arrowY })
        }

        this.options.direction = safeDirection

        return styles
    }

    update(styles) {

        for (let key in styles) {
            this.popup.style.setProperty(key, styles[key])
        }

        if (this.styles) this.styles = styles

        return styles

    }
    clickOutSide() {
        return resolveEvent.bind(this)
    }
    show() {
        this.update(this.computeStyle())
        this.popup.show()
        if (this.options.single) {
            const others = [...document.getElementsByClassName('ease-popup')].filter(item => item !== this.popup)
            others.forEach(item => item.close())
        }

        if (this.options.contentClick || this.options.closeByOutSide) {
            this.clickOutSide = resolveEvent.bind(this)
            document.addEventListener('click', this.clickOutSide, true)
        }
    }
    showModal() {
        this.popup.showModal()
    }
    hide() {
        this.popup.close()
        if (this.clickOutSide) {
            document.removeEventListener('click', this.clickOutSide, true)
        }
    }

}

export default Popup