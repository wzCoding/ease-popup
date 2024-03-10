import { popupStyle } from "./option"
import {
    resolveRect,
    resolveParam,
    createArrow,
    addStylesheetRules,
    getxCoord,
    getyCoord,
    getDirection,
    getzIndex
} from "./resolve"


class Popup {
    constructor(target, popup, options = {}) {

        const resolved = resolveParam(arguments)
        console.log(resolved)
        this.target = resolved.target
        this.popup = resolved.popup
        this.options = resolved.options

        this.popup.classList.add('ease-popup')
        addStylesheetRules([popupStyle.popup], 'ease-popup')

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

        const target = resolveRect(this.target)

        const popup = resolveRect(this.popup, { ...this.options, target })

        const safeDirection = getDirection(target, popup, this.options)

        const { popupX, arrowX } = getxCoord(target, popup.width, this.options)

        const { popupY, arrowY } = getyCoord(target, popup.height, this.options)

        const zIndex = getzIndex() + 1

        const styles = {
            'top': `${popupY}px`,
            'left': `${popupX}px`,
            'width': `${popup.width}px`,
            'background-color': `${this.options.background}`,
            'color': `${this.options.color}`,
            'z-index': `${zIndex}`
        }

        if (this.options.needArrow) {
            addStylesheetRules([popupStyle.arrow], 'ease-popup')
            createArrow(this.popup, { safeDirection, arrowSize: this.options.arrowSize, arrowX, arrowY })
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

    show() {
        this.update(this.computeStyle())
        if (this.popup.show && typeof this.popup.show === 'function') {
            this.popup.show()
        }
        this.popup.style.display = 'block'
    }
    showModal() {
        if (this.popup.showModal && typeof this.popup.showModal === 'function') {
            this.popup.showModal()
        }
        this.popup.style.display = 'block'
    }
    hide() {
        if (this.popup.close && typeof this.popup.close === 'function') {
            this.popup.show()
        }
        this.popup.style.display = 'none'
    }

}

export default Popup