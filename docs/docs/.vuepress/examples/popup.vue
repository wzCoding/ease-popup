<template>
    <Teleport to="body">
        <transition name="fade">
            <dialog v-show="show" class="ease-popup" :class="className" ref="popup">
                <slot>
                    <div class="ease-popup-content">这是一个弹窗</div>
                </slot>
            </dialog>
        </transition>
    </Teleport>
</template>
<script>
import { ref, toRef, watch, onMounted, onUnmounted, reactive } from 'vue'
import EasePopup from 'ease-popup'
export default {
    name: 'EPopup',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ''
        },
        options: {
            type: Object,
            default: () => {
                return {
                    target: null,
                    direction: 'bottom',
                    needArrow: true,
                    targetGap: 15,
                    modal: false,
                    width: 'auto',
                    content: '',
                    container: 'body',
                }
            }
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const popup = ref(null)
        const className = props.name ? `${props.name}-popup` : ''
        const popupOptions = reactive(props.options)
        let instance = new EasePopup(popupOptions)
        const show = ref(props.visible)
        onMounted(() => {
            instance.update({ target: popupOptions.target, popup: popup.value, container: popupOptions.container })
        })
        const cleanOptions = watch(() => props.options, (val) => {
            instance.update(val)
        }, { deep: true })
        const cleanModelValue = watch(() => props.visible, () => {
            instance.options.popup.visible ? instance.hide() : instance[props.options.modal ? 'showModal' : 'show']() 
            show.value = instance.options.popup.visible
            emit('update:modelValue', instance.options.popup.visible)
        })
        
        onUnmounted(() => {
            cleanOptions()
            cleanModelValue()
            instance.destroy()
            instance = null
        })
        return {
            popup,
            className,
            show
        }
    }
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
