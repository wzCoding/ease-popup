import { popupStyle } from "./option"
import {
    resolveParam,
    resolveEvent,
    addStylesheetRules,
    updateStyles,
    getPositionOptions
} from "./resolve"
import { computePosition } from '@floating-ui/dom';

class Popup {
    constructor(target, popup, options = {}) {

        const resolved = resolveParam(arguments)
        this.target = resolved.target
        this.popup = resolved.popup
        this.options = resolved.options

        this.popup.classList.add('ease-popup')

        addStylesheetRules([popupStyle.popup], 'ease-popup')
        addStylesheetRules([popupStyle.dialog], 'ease-popup')
        addStylesheetRules([popupStyle.arrow], 'ease-popup')
    }
    update() {
        const positionOptions = getPositionOptions(this.popup, this.options)
        computePosition(
            this.target,
            this.popup,
            positionOptions
        ).then((res) => {
            console.log(res)
            this.options.direction = res.placement
            updateStyles(this.popup, this.options, res)
        });
    }
    show(isDialog) {
        this.update()
        if (!isDialog) this.popup.show()
        if (this.options.single) {
            const others = [...document.getElementsByClassName('ease-popup')].filter(item => item !== this.popup)
            others.forEach(item => item.close())
        }

        this.clickOutSide = resolveEvent.bind(this)
        document.addEventListener('click', this.clickOutSide, true)
    }
    showModal() {
        this.popup.showModal(this.options.container)
        this.show(this.popup.nodeName == 'DIALOG')
    }
    hide() {
        this.popup.close()
        if (this.clickOutSide) {
            document.removeEventListener('click', this.clickOutSide, true)
            this.clickOutSide = null
        }
    }

}

export default Popup