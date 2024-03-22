<template>
    <div class="select-example">
        <div :class="[defaultClass, name, { active: active }]" tabindex="1" ref="select" @click="handleClick">
            <input type="text" v-model="selectOption.label" readonly>
        </div>
        <div class="select-options" ref="popup">
            <e-popup :visible="visible" :name="name" :options="popupOptions">
                <div class="option-content">
                    <div class="option-item" v-for="option in list" :key="option.value"
                        :class="{ active: option.active, disabled: option.disabled }" @click="handleOptionClick(option)">
                        {{ option.label
                        }}</div>
                </div>
            </e-popup>
        </div>
    </div>
</template>
<script>
import { ref, computed, watch, reactive, onMounted, onUnmounted } from 'vue'
import EPopup from './popup.vue'
export default {
    name: 'ESelect',
    props: {
        value: {
            type: [String,Boolean],
            default: ''
        },
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
    emits: ['change'],
    setup(props, { emit }) {
        const width = '180px'
        const defaultClass = 'select-input'
        const popupOptions = reactive({
            target: props.name ? `.${defaultClass}.${props.name}` : `.${defaultClass}`,
            direction: 'bottom-start',
            targetGap: 8,
            needArrow: false,
            width: width.match(/\d+/g)[0],
            container: 'body'
        })

        const visible = ref(false)
        const active = ref(false)
        const select = ref(null)
        const selectValue = ref(props.value)
        watch(() => props.value, (val) => {
            selectValue.value = val
        })
        const list = computed(() => {
            return props.options.map(item => {
                const option = typeof item === 'string' ? { label: item, value: item } : item
                option.active = option.value === selectValue.value
                option.disabled = option.disabled || false
                return option
            })
        })
        const selectOption = computed(() => {
            return list.value.find(item => item.value === selectValue.value)
        })
        const handleClick = () => {
            visible.value = !visible.value
        }
        const handleOptionClick = (item) => {
            emit('change', props.name, item.value)
            selectValue.value = item.value
            visible.value = false
            select.value.focus()
            Array.from(document.querySelectorAll(`.${defaultClass}`)).filter(el => el !== select.value).forEach(item => item.classList.remove('active'))

        }
        const handleActive = (event) => {
            const { x, y, width, height } = select.value.getBoundingClientRect()
            const endX = x + width
            const endY = y + height
            if (event.clientX > endX || event.clientX < x || event.clientY > endY || event.clientY < y) {
                active.value = false
            }
            if (event.clientX > x && event.clientX < endX && event.clientY > y && event.clientY < endY) {
                active.value = true
            }
        }
        onMounted(() => {
            document.addEventListener('click', handleActive, true)
        })
        onUnmounted(() => {
            document.removeEventListener('click', handleActive, true)
        })
        return {
            list,
            select,
            width,
            visible,
            active,
            popupOptions,
            defaultClass,
            selectOption,
            handleClick,
            handleOptionClick,
        }
    }
}
</script>
<style scoped>
.select-input {
    width: v-bind(width);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 0 1px #d0d2d8 inset;
    border-radius: 4px;
    cursor: text;
    height: 30px;
    position: relative;

}

:deep(.select-options .ease-popup) {
    overflow-y: auto;
}

.select-input input {
    border: none;
    outline: none;
}

.select-input.active,
.select-input:focus {
    box-shadow: 0 0 0 1px #4abf8a inset;
}

.option-item {
    cursor: pointer;
    padding: 5px;
    margin: 2px 0;
    border-radius: 2px;
}

.option-item:hover,
.option-item.active {
    background-color: #f5f7fa;
    color: #3eaf7c;
}
.option-item.disabled {
    color: #c0c4cc;
    pointer-events: none;
}
</style>