<template>
    <div class="select-example">
        <div :class="[defaultClass, name]">
            <input type="text" readonly>
        </div>
        <div class="select-options" ref="popup">
            <e-popup v-model="visible" direction="bottom-start" :target="target" width="target" :arrow="false" :targetGap="8"
                trigger="click" @update:modelValue="visibleChange">
                123
            </e-popup>
        </div>
    </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue'
import EPopup from './popup.vue'
export default {
    name: 'ESelect',
    props: {
        name: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: () => []
        }
    },
    components: { EPopup },
    setup(props) {
        const visible = ref(false)    
        const defaultClass = 'select-input'
        const target = computed(() => {
            return props.class ? `.${defaultClass}.${props.name}` : `.${defaultClass}`
        })
        const visibleChange = (val) => {
            console.log(val)
        }
        const handleFocus = (e) => {
            console.log('focus')
            if (e.target.nodeName === 'INPUT') {
                e.target.focus()
            } else {
                e.target.parentNode.querySelector('input').focus()
            }
        }
        onMounted(() => {
            document.querySelector(target.value).addEventListener('click', handleFocus)
            //document.querySelector(target.value).addEventListener('focus',handleFocus)
        })
        return {
            visible,
            defaultClass,
            target,
            visibleChange
        }
    }
}
</script>
<style scoped>
.select-input {
    width: 180px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: text;
    height: 30px;
    position: relative;
}

.select-input input {
    border: none;
    outline: none;
}
.select-input:active,.select-input:focus {
    border: 1px solid #000;
}
</style>