import { defineClientConfig } from 'vuepress/client'

import Example from './examples/example.vue'
import ESelect from './examples/select.vue'

export default defineClientConfig({
    enhance({ app }) {
        app.component('Example', Example)
        app.component('ESelect', ESelect)
    },

})