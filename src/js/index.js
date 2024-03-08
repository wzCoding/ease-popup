import { resolveEl, resolveRect, resolveArrow, resolveOption, addStylesheetRules ,getxCoord, getyCoord, getDirection} from "./resolve"
import { popupStyle } from "./option"

class Popup {
    constructor(target, popup, options = {}) {
        if (!target) {
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

        const target = resolveRect(this.target)

        const popup = resolveRect(this.popup, { ...resolved, target })

        const  safeDirection = getDirection(target, popup, resolved)

        const { popupX, arrowX } = getxCoord(target, popup.width, resolved)

        const { popupY, arrowY } = getyCoord(target, popup.height, resolved)

        const styles = {
            '--popup-x': `${popupX}px`,
            '--popup-y': `${popupY}px`,
            '--popup-width': `${popup.width}px`,
            '--popup-background': `${resolved.background}`,
            '--popup-color': `${resolved.color}`
        }

        if (resolved.needArrow) {
            this.popup.classList.add('arrow')
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