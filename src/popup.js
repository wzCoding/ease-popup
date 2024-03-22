import { autoUpdate } from '@floating-ui/dom'
import { popupStyle, popupName } from "./option"
import {
    resolveOptions,
    resolveModal,
    resolveEvent,
    fullScreenPosition,
    updatePosition,
    checkPopup,
    addStylesheetRules
} from "./resolve"

class EasePopup {
    constructor(options = {}) {
        this.update(options)
        this.handleClick = resolveEvent.bind(this)

        for (const key in popupStyle) {
            addStylesheetRules([popupStyle[key]], popupName)
        }
    }
    update(options) {
        this.options = this.options ? resolveOptions(options, this.options) : resolveOptions(options)
        if (this.options.popup && this.options.target) {
            if (this.options.fullScreen) {
                this.cleanup && this.cleanup()
                fullScreenPosition(this.options)
            } else {
                const callback = updatePosition.bind(this)
                this.cleanup = autoUpdate(this.options.target, this.options.popup, callback)
            }
        }
    }
    show() {
        checkPopup(this.options)
        if (this.options.fullScreen) fullScreenPosition(this.options)
        this.options.popup.showPopup()

        if (this.options.singleOpen) {
            const others = [...document.getElementsByClassName(popupName)].filter(item => item !== this.options.popup)
            others.length && others.forEach(item => item.hidePopup && item.hidePopup())
        }

        document.addEventListener('click', this.handleClick, true)
    }
    showModal() {
        //this.show(this.options.popup.nodeName === 'DIALOG')
        this.options.popup.showPopupModal(this.options.fullScreen)

        if (!this.options.fullScreen) {
            resolveModal(this.options, true, false)
        }

        if (this.options.singleOpen) {
            const others = [...document.getElementsByClassName(popupName)].filter(item => item !== this.options.popup)
            others.length && others.forEach(item => item.hidePopup && item.hidePopup())
        }

        document.addEventListener('click', this.handleClick, true)
    }
    hide(destroy = false) {
        checkPopup(this.options)
        this.options.popup.hidePopup()
        if (!this.options.fullScreen) {
            resolveModal(this.options, false, destroy)
        }
        document.removeEventListener('click', this.handleClick, true)
    }
    destroy() {
        this.hide(true)
        this.options.popup.remove()
        this.options.onDestroy && this.options.onDestroy()
        this.cleanup && this.cleanup()
        for (let prop in this) {
            this[prop] = null
        }
    }

}

export default EasePopup