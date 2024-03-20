<template>
    <div class="example">
        <!-- <form class="form-area">
            <div class="select-item" v-for="option in formOptions" :key="option.label">
                <span>{{ option.label }}:</span>
                <e-select :value="formValues[option.label]" :name="option.label" :options="option.options"
                    @change="onChange"></e-select>
            </div>
        </form>
        <div class="example-area">
            <span class="title">演示区域</span>
            <button class="example-btn" @click="handleClick">演示按钮</button>
            <e-popup v-model="visible" :options="formValues">
                <div class="ease-popup-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus eum
                    earum laboriosam omnis minima, id sint ipsam eaque odit laudantium dolor est assumenda doloremque
                    dolores tempora commodi fuga, fugit qui?</div>
            </e-popup>
        </div> -->
        <div class="example-area example-tooltip">
            <button class="example-btn" :class="options.tooltip.target" @click="visibleChange('tooltip')">演示按钮</button>
            <e-popup v-model="visibles['tooltip']" :options="options['tooltip']">
                <div class="ease-popup-content">Lorem ipsum </div>
            </e-popup>
        </div>
    </div>
</template>
<script>
import { computed, reactive, ref, onMounted } from 'vue'
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

        const visibles = reactive({
            'tooltip': false,
        })
        const options = {
            tooltip: {
                direction: "left",
                target: 'example-btn-1',
                container: 'example-tooltip',
            },
        }
        const visibleChange = (name) => {
            visibles[name] = !visibles[name]
        }
        return {
            options,
            visibles,
            visibleChange
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

div.example-box {
    position: relative;

}

.example-area {
    width: 100%;
    height: 200px;
    border: 1px solid #d0d2d8;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

}

.example-title {
    /* position: absolute;
    top: 10px;
    left: 10px;
    color: #d0d2d8; */
}

.example-area .example-btn {
    padding: 5px 12px;
    cursor: pointer;
}
</style>