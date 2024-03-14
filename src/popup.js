import { autoUpdate } from '@floating-ui/dom'
import { popupStyle } from "./option"
import {
    resolveParam,
    resolveEvent,
    resolveModal,
    updatePosition,
    addStylesheetRules,
} from "./resolve"


class EasePopup {
    constructor(target, popup, options = {}) {

        const resolved = resolveParam(arguments)
        this.target = resolved.target
        this.popup = resolved.popup
        this.options = resolved.options

        this.popup.classList.add('ease-popup')

        for (const key in popupStyle) {
            addStylesheetRules([popupStyle[key]], 'ease-popup')
        }

        this.cleanup = this.update()
        this.handleEvent = resolveEvent.bind(this)
    }
    update() {
        const callback = updatePosition.bind(this)
        return autoUpdate(this.target, this.popup, callback)
    }
    show(isDialog) {
        if (!isDialog) this.popup.show()
        if (this.options.singleOpen) {
            const others = [...document.getElementsByClassName('ease-popup')].filter(item => item !== this.popup)
            others.length && others.forEach(item => item.close && item.close())
        }

        document.addEventListener('click', this.handleEvent, true)
    }
    showModal() {
        const isDialog = this.popup.nodeName == 'DIALOG'
        if (!this.options.fullScreen) {
            if (isDialog) {
                this.popup.show()
                resolveModal(this.options.container, true, this.options.fullScreen)
            } else {
                this.popup.showModal(this.options.container)
            }
        } else {
            this.popup.showModal(document.body, this.options.fullScreen)
        }
        this.show(isDialog)

    }
    hide(isDestroy) {
        this.popup.close()
        const modal = resolveModal()
        if(isDestroy && modal) modal.remove()
        document.removeEventListener('click', this.handleEvent, true)
    }
    destroy() {
        this.hide(true)
        this.cleanup()
        this.popup.remove()
        document.removeEventListener('click', this.handleEvent, true)
        for (let prop in this) {
            this[prop] = null
        }
    }

}

export default EasePopup