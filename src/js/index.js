import { getxAxis, getyAxis, getDirection } from "./direction"
import { resolveEl, resolveRect, resolveArrow, resolveOption, addStylesheetRules } from "./resolve"
import { popupStyle } from "./option"

class Popup {
    constructor(target, popup, options = {}) {
        if (!target || !popup) {
            return
        }

        this.popup = resolveEl(popup)
        this.target = resolveEl(target)
        this.options = options

        addStylesheetRules([popupStyle.popup], 'ease-popup')

        if (this.options.useCache) {
            this.state = 0
            this.styles = {}
        }

        this.applyStyle(
            this.computeStyle()
        )

    }

    computeStyle() {

        if (this.options.useCache) {

            console.log('useCache')

            if (this.state >= 2) return this.styles

            this.state++

        }

        const resolved = resolveOption(this.options)

        const targetRect = resolveRect(this.target)

        const popupRect = resolveRect(this.popup)

        const { safeDirection, safeWidth } = getDirection(targetRect, popupRect, resolved)

        const { popupX, arrowX } = getxAxis(targetRect, safeWidth, resolved)

        const { popupY, arrowY } = getyAxis(targetRect, popupRect.height, resolved)

        const styles = {
            '--popup-x': `${popupX}px`,
            '--popup-y': `${popupY}px`,
            '--popup-width': `${safeWidth}px`,
            '--popup-background': `${resolved.background}`,
            '--popup-color': `${resolved.color}`
        }

        if (resolved.needArrow) {
            this.popup.classList.add('arrow-popup')
            addStylesheetRules([popupStyle.arrow], 'ease-popup-arrow')

            styles['--arrow-x'] = `${arrowX}px`
            styles['--arrow-y'] = `${arrowY}px`
            styles['--arrow-size'] = `${resolved.arrowSize}px`
            styles['--arrow-rotate'] = `${resolveArrow(safeDirection)}deg`
        }

        this.options.direction = safeDirection

        return styles
    }

    applyStyle(styles) {
        for (let key in styles) {
            this.popup.style.setProperty(key, styles[key])
        }

        if (this.styles) this.styles = styles

        return styles
    }

    update() {

        this.applyStyle(
            this.computeStyle()
        )

    }

    show() {
        this.update()
        this.popup.style.display = 'block'

    }

    hide() {

        this.popup.style.display = 'none'
    }

}

export default Popup