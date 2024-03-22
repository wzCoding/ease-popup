<template>
    <div class="example">
        <form class="form-area">
            <div class="select-area">
                <div class="select-item" v-for="option in formOptions" :key="option.name">
                    <span>{{ option.name }}:</span>
                    <e-select :value="formValues[option.name]" :name="option.name" :options="option.options"
                        @change="onChange"></e-select>
                </div>
            </div>
            <div class="tip">注：示例中所展示的下拉框组件均使用本插件制作</div>
        </form>
        <div class="example-area">
            <span class="example-title">演示区域</span>
            <button class="example-btn" @click="handleClick">演示按钮</button>
            <e-popup :visible="visible" :options="formValues">
                <div class="ease-popup-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus eum
                    earum laboriosam omnis minima, id sint ipsam eaque odit laudantium dolor est assumenda doloremque
                    dolores tempora commodi fuga, fugit qui?</div>
            </e-popup>
        </div>
    </div>
</template>
<script>
import { reactive, ref } from 'vue'
import EPopup from './popup.vue'
import ESelect from './select.vue'
export default {
    name: 'Example',
    props: {
        showbutton: {
            type: Boolean,
            default: true
        },
        direction: {
            type: String,
            default: 'bottom'
        },
        width: {
            type: String,
            default: 'auto'
        }
    },
    components: {
        EPopup,
        ESelect
    },
    setup() {
        const visible = ref(false)
        const configs = {
            "inside": ['left', 'left-start', 'left-end', 'right', 'right-start', 'right-end', 'center', 'center-start', 'center-end'],
            "outside": ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
        }
        const formValues = reactive({
            "target": ".example-btn",
            "container": ".example-area",
            "direction": "bottom",
            "placement": "outside",
            "width": "auto",
            "needArrow": true,
            "modal": false,
        })
        const formOptions = reactive([
            {
                name: 'target',
                options: [
                    { label: '演示按钮', value: '.example-btn', disabled: false },
                    { label: '演示区域', value: '.example-area' },
                    { label: 'document.body', value: 'body' },
                ]
            },
            {
                name: 'container',
                options: [
                    { label: '演示区域', value: '.example-area' },
                    { label: 'document.body', value: 'body' },
                ]
            },
            {
                name: 'direction',
                options: configs.outside
            },
            {
                name: 'placement',
                options: ['outside', 'inside']
            },
            {
                name: 'width',
                options: ['auto', '200']
            },
            {
                name: 'needArrow',
                options: [{ label: true, value: true }, { label: false, value: false }]
            },
            {
                name: 'modal',
                options: [{ label: true, value: true }, { label: false, value: false }]
            }
        ])
        const onChange = (name, value) => {
            formValues[name] = value

            if (name === 'placement') {
                formValues.target = value === 'outside' ? '.example-btn' : '.example-area'
                changePlacement(value)
            }
            if (name === 'target') {
                formValues.placement = value === '.example-btn' ? 'outside' : 'inside'
                changePlacement(formValues.placement)
            }
        }
        const changePlacement = (value) => {
            const isOutside = value === 'outside'

            formValues.direction = isOutside ? 'bottom' : 'center'
            formValues.width = isOutside ? 'auto' : '200'
            formValues.container = isOutside ? '.example-area' : formValues.target
            formValues.needArrow = isOutside ? true : false
            formOptions[2].options = configs[value]
            formOptions[0].options[0].disabled = !isOutside
            formOptions[1].options.forEach(item => item.disabled = !isOutside)
        }
        const handleClick = () => {
            visible.value = !visible.value
        }
        return {
            visible,
            formValues,
            formOptions,
            onChange,
            handleClick
        }
    }
}
</script>
<style scoped>
.example {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07);
    margin: 20px 0;
}

.form-area {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap-reverse;
    gap: 20px;
}

.form-area .tip {
    flex: 1;
    color: #d0d2d8;
    box-sizing: border-box;
}

.form-area .select-item {
    display: flex;
    width: 270px;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
}

.example-area {
    width: 100%;
    height: 400px;
    border: 1px solid #d0d2d8;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

}

.example-title {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #d0d2d8;
}

.example-area .example-btn {
    padding: 5px 12px;
    cursor: pointer;
}

</style>