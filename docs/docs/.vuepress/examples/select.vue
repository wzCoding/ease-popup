<template>
    <div class="select-example">
        <div :class="[defaultClass, name, { active: visible }]" tabindex="1" ref="select" @click="handleClick">
            <input type="text" v-model="selectOption.label" readonly>
        </div>
        <div class="select-options" ref="popup">
            <e-popup v-model="visible" :options="popupOptions">
                <div class="option-content">
                    <div class="option-item" v-for="option in list" :key="option.value"
                        :class="{ active: option.active }" @click="handleOptionClick(option)">{{ option.label
                        }}</div>
                </div>
            </e-popup>
        </div>
    </div>
</template>
<script>
import { ref, computed, watch, reactive } from 'vue'
import EPopup from './popup.vue'
export default {
    name: 'ESelect',
    props: {
        value: {
            type: String,
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
            arrow: false,
            width: width.match(/\d+/g)[0],
        })

        const visible = ref(false)
        const select = ref(null)
        const selectValue = ref(props.value)
        watch(() => props.value, (val) => {
            selectValue.value = val
        })
        const list = computed(() => {
            return props.options.map(item => {
                const option = typeof item === 'string' ? { label: item, value: item } : item
                option.active = option.value === selectValue.value
                return option
            })
        })
        const selectOption = computed(() => {
            return list.value.find(item => item.value === selectValue.value)
        })
        const handleClick = (event) => {
            visible.value = !visible.value
            event.currentTarget.focus()
        }
        const handleOptionClick = (item) => {
            selectValue.value = item.value
            emit('change', props.name, item.value)
            visible.value = false
            select.value.focus()
        }

        return {
            list,
            select,
            width,
            visible,
            popupOptions,
            defaultClass,
            selectOption,
            handleClick,
            handleOptionClick
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
</style>