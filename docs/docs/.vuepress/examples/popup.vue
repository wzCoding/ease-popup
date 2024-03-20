<template>
    <Teleport to="body">
        <dialog class="ease-popup" ref="popup">
            <slot>
                <div class="ease-popup-content">这是一个弹窗</div>
            </slot>
        </dialog>
    </Teleport>
</template>
<script>
import { ref, watch, onMounted, onUnmounted, reactive } from 'vue'
import EasePopup from 'ease-popup'
export default {
    name: 'EPopup',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        options: {
            type: Object,
            default: () => {
                return {
                    target: null,
                    direction: 'bottom',
                    arrow: true,
                    targetGap: 15,
                    modal: false,
                    width: 'auto',
                    content: '',
                    container: null,
                }
            }
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const popup = ref(null)
        const popupOptions = reactive(props.options)
        let instance = new EasePopup(popupOptions)
        onMounted(() => {
            instance.update({ target: popupOptions.target, popup: popup.value, container: popupOptions.container })
        })
        const clean = watch(() => props.modelValue, (val) => {
            instance.options.popup.visible ? instance.hide() : instance.show()
            emit('update:modelValue', val)
        })
        onUnmounted(() => {
            instance.destroy()
            instance = null
            clean()
        })
        return {
            popup
        }
    }
}
</script>
