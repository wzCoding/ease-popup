import { autoUpdate } from '@floating-ui/dom'
import { popupStyle, popupName } from "./option"
import {
    resolveOptions,
    resolveEvent,
    updatePosition,
    checkPopup,
    addStylesheetRules,
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
        const callback = updatePosition.bind(this)
        if(this.options.popup && this.options.target){
            this.cleanup = autoUpdate(this.options.target, this.options.popup, callback)
        }
    }
    show(isDialog = false) {
        checkPopup(this.options)
        if (!isDialog) {
            this.options.popup.showPopup()
        }
        if (this.options.singleOpen) {
            const others = [...document.getElementsByClassName(popupName)].filter(item => item !== this.options.popup)
            others.length && others.forEach(item => item.hidePopup && item.hidePopup())
        }

        document.addEventListener('click', this.handleClick, true)
    }
    showModal() {
        this.show(this.options.popup.nodeName === 'DIALOG')
        this.options.popup.showPopupModal(this.options.container, this.options.fullScreen)
    }
    hide() {
        checkPopup(this.options)
        this.options.popup.hidePopup()
        document.removeEventListener('click', this.handleClick, true)
    }
    destroy() {
        this.cleanup()
        document.removeEventListener('click', this.handleClick, true)
        this.options.popup.remove()
        this.options.onDestroy && this.options.onDestroy()
        for (let prop in this) {
            this[prop] = null
        }
    }

}

export default EasePopup