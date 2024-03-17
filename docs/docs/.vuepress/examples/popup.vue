<template>
    <div class="popup-example">
        <dialog class="ease-popup" ref="popup">
            <slot>
                <div class="ease-popup-content">这是一个弹窗</div>
            </slot>
        </dialog>
    </div>
</template>
<script>
import { ref, onMounted, onUnmounted } from 'vue'
import EasePopup from 'ease-popup'
const triggers = {
    click: ['click'],
    hover: ['mouseenter', 'mouseleave'],
    focus: ['focus', 'blur'],
}
export default {
    name: 'EPopup',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        target: {
            type: [String, Object],
            default: ''
        },
        trigger: {
            type: String,
            default: 'click'
        },
        direction: {
            type: String,
            default: 'bottom'
        },
        arrow: {
            type: Boolean,
            default: true
        },
        targetGap: {
            type: [Number, String],
            default: 15,
        },
        modal: {
            type: Boolean,
            default: false
        },
        width: {
            type: [Number, String],
            default: 'auto'
        },
        content: {
            type: [String, Array],
            default: ''
        }
    },
    emits: ['update:modelValue'],
    setup(props,{emit}) {
        let instance
        const popup = ref(null)
        const showPopup = () => {
            emit('update:modelValue', true)
            instance && instance[props.modal ? 'showModal' : 'show']()
        }
        const hidePopup = () => {
            emit('update:modelValue', false)
            instance && instance.hide()
        }
        onMounted(() => {
            const targetEl = document.querySelector(props.target)
            const width = props.width === 'target' ? targetEl.clientWidth : props.width
            instance = new EasePopup(
                targetEl,
                popup.value,
                {
                    direction: props.direction,
                    needArrow: props.arrow,
                    width: width,
                    targetGap: props.targetGap,
                }
            )
            function handleClick() {
                if (!instance.popup.open) {
                    showPopup()
                    emit('update:modelValue', true)
                } else {
                    hidePopup()
                    emit('update:modelValue', false)
                }
                
                //showPopup.value ? instance[props.modal ? 'showModal' : 'show']() : instance.hide()
            }
            triggers[props.trigger].forEach(t => {
                targetEl.addEventListener(t, handleClick)
            });
        })
        onUnmounted(() => {
            instance.destroy()
            instance = null
        })
        return {
            popup
        }
    }
}
</script>
<style scoped></style>