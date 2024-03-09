import { popupStyle } from "./option"
import {
    resolveEl,
    resolveRect,
    resolveArrow,
    resolveOption,
    resolveTransition,
    addStylesheetRules,
    getxCoord,
    getyCoord,
    getDirection,
    getzIndex
} from "./resolve"

function resolveType(value) {
    return Object.prototype.toString.call(value).replace('object ', "").match(/\w+/g)[0].toLowerCase();
}
function resolveArgs(args) {

    let [target, popup] = [...args]

    if (!target) {
        throw new Error('the target element cannot be missing')
    }

    if (!resolveType(target).includes("element")) {
        if (resolveType(target) === "string" && !resolveEl(target)) {
            throw new Error('the target element cannot be missing')
        }
    }

    if (popup) {
        if (!resolveType(popup).includes("element")) {
            if (resolveType(popup) === "string" && !resolveEl(popup)) {
                
            }
        }
    }

    if(['element','string'].includes(resolveType(target))){

    }


}
class Popup {
    constructor(target, popup, options = {}) {
        const args = resolveArgs(arguments)

        this.popup = resolveEl(popup)
        this.target = resolveEl(target)
        this.options = resolveOption(options)
        console.log(this.options)
        this.popup.classList.add('ease-popup')
        for (const key of ['popup', 'enter', 'leave']) {
            addStylesheetRules([popupStyle[key]], 'ease-popup')
        }

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

        const zIndex = getzIndex()

        const styles = {
            '--popup-x': `${popupX}px`,
            '--popup-y': `${popupY}px`,
            '--popup-width': `${popup.width}px`,
            '--popup-background': `${this.options.background}`,
            '--popup-color': `${this.options.color}`,
            '--popup-zIndex': `${zIndex}`
        }

        if (this.options.needArrow) {
            this.popup.classList.add('arrow')
            addStylesheetRules([popupStyle.arrow], 'ease-popup')

            styles['--arrow-x'] = `${arrowX}px`
            styles['--arrow-y'] = `${arrowY}px`
            styles['--arrow-size'] = `${this.options.arrowSize}px`
            styles['--arrow-rotate'] = `${resolveArrow(safeDirection)}deg`
            styles['--arrow-zIndex'] = `${zIndex - 1}`
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
        resolveTransition(this.popup, this.options.transition)
    }

    hide() {
        resolveTransition(this.popup, this.options.transition, false)
    }

}

export default Popup