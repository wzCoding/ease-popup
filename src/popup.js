import { autoUpdate } from '@floating-ui/dom'
import { popupStyle, popupName } from "./option"
import {
    resolveParam,
    resolveEvent,
    resolveModal,
    updatePosition,
    addStylesheetRules,
} from "./resolve"


class EasePopup {
    constructor(target, popup, options) {

        const resolved = resolveParam([target, popup, options])
        this.target = resolved.target
        this.popup = resolved.popup
        this.options = resolved.options
        this.popup.classList.add(popupName)

        this.isDialog = this.popup.nodeName === 'DIALOG' //判断是否是dialog元素，dialog元素自带show方法

        for (const key in popupStyle) {
            addStylesheetRules([popupStyle[key]], popupName)
        }

        this.cleanup = this.update()
        this.handleEvent = resolveEvent.bind(this)
    }
    update() {
        const callback = updatePosition.bind(this)
        return autoUpdate(this.target, this.popup, callback)
    }
    show(callback) {
        if (!this.isDialog) this.popup.show()
        if (this.options.singleOpen) {
            const others = [...document.getElementsByClassName(popupName)].filter(item => item !== this.popup)
            others.length && others.forEach(item => item.close && item.close())
        }

        document.addEventListener('click', this.handleEvent, true)

        callback && callback()
    }
    showModal(callback) {
        if (!this.options.fullScreen) {
            if (!this.isDialog) {
                this.popup.show()
                resolveModal({ container: this.options.container, show: true, fullScreen: this.options.fullScreen })
            } else {
                this.popup.showModal(this.options.container)
            }
        } else {
            this.popup.showModal(document.body, this.options.fullScreen)
        }
        this.show(callback)

    }
    hide(callback) {
        this.popup.close()
        resolveModal({ show: false })
        document.removeEventListener('click', this.handleEvent, true)
        
        callback && callback()  
    }
    destroy(callback) {
        this.cleanup()
        this.popup.remove()
        resolveModal({ destroy: true })
        document.removeEventListener('click', this.handleEvent, true)
        for (let prop in this) {
            this[prop] = null
        }

        callback && callback()
    }

}

export default EasePopup