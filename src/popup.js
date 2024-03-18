import { autoUpdate } from '@floating-ui/dom'
import { popupStyle, popupName } from "./option"
import {
    resolveOptions,
    resolveEvent,
    resolveModal,
    updatePosition,
    resolveEl,
    checkPopup,
    addStylesheetRules,
} from "./resolve"

class EasePopup {
    constructor(options = {}) {
        this.update(options)
        this.handleEvent = resolveEvent.bind(this)

        for (const key in popupStyle) {
            addStylesheetRules([popupStyle[key]], popupName)
        }
    }
    update(options) {
        this.options = this.options ? resolveOptions(options, this.options) : resolveOptions(options)
        const callback = updatePosition.bind(this)

        if (this.options.popup && this.options.target) {
            this.cleanup = autoUpdate(this.options.target, this.options.popup, callback)
        }
    }
    show(callback, isDialog = false) {
        checkPopup(this.options)
        if (!isDialog) {
            this.options.popup.show()
        }
        if (this.options.singleOpen) {
            const others = [...document.getElementsByClassName(popupName)].filter(item => item !== this.options.popup)
            others.length && others.forEach(item => item.close && item.close())
        }

        document.addEventListener('click', this.handleEvent, true)

        callback && typeof callback === 'function' && callback()
    }
    showModal(callback) {
        if (!this.options.fullScreen) {
            this.options.popup.show()
            resolveModal({ container: this.options.container, show: true, fullScreen: this.options.fullScreen })
        } else {
            this.options.popup.showModal(this.options.container, this.options.fullScreen)
        }
        this.show(callback, this.options.popup.nodeName === 'DIALOG')
    }
    hide(callback, destroy = false) {
        checkPopup(this.options)
        this.options.popup.close()
        resolveModal({ show: false, destroy })
        document.removeEventListener('click', this.handleEvent, true)

        callback && typeof callback === 'function' && callback()

        if (destroy) this.options.popup.remove()
    }
    destroy(callback) {
        this.cleanup()
        this.hide(callback, true)

        for (let prop in this) {
            this[prop] = null
        }
    }

}

export default EasePopup