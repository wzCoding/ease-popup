import { autoUpdate } from '@floating-ui/dom'
import { popupStyle } from "./option"
import {
    resolveParam,
    resolveEvent,
    updatePosition,
    addStylesheetRules,
} from "./resolve"


class Popup {
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
    show(isDialog,) {
        this.popup.show()
        if (this.options.single) {
            const others = [...document.getElementsByClassName('ease-popup')].filter(item => item !== this.popup)
            others.length && others.forEach(item => item.close && item.close())
        }

        document.addEventListener('click', this.handleEvent, true)
    }
    showModal() {
        if(this.options.fullscreen){
            this.popup.showModal(this.options.container)
        }else{
           // this.show(this.popup.nodeName == 'DIALOG')
            if(this.popup.nodeName == 'DIALOG'){
                this.popup.show()
                //
            }else{
                this.popup.showModal()
            }
        }  
    }
    hide() {
        this.popup.close()
        document.removeEventListener('click', this.handleEvent, true)
    }
    destroy() {
        this.hide()
        this.cleanup()
        this.popup.remove()
        document.removeEventListener('click', this.handleEvent, true)
        for (let prop in this) {
            this[prop] = null
        }
    }

}

export default Popup