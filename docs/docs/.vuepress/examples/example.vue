<template>
    <div class="example">
        <button v-if="showbutton" class="btn">打开弹窗</button>
        <e-popup :target="btn" :direction="direction" :width="width"></e-popup>
    </div>
</template>
<script>
import EPopup from './popup.vue'
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
        EPopup
    },
    setup() {
        const btn = '.btn'
        return {
            btn
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

.btn {
    padding: 6px 12px;
    cursor: pointer;
}
</style>