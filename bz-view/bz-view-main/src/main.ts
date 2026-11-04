import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
    // create naive ui
    create,
    // component
    NButton,
    NForm,
    NFormItem,
    NInput,
    NUpload,
    NImage,
    NUploadDragger,
    NIcon,
    NCheckbox,
    NCheckboxGroup,
    NSpace,
    NMessageProvider,
    NList,
    NListItem,
    NSpin
} from 'naive-ui'
const naive = create({
    components: [NButton, NForm, NFormItem, NInput, NUpload, NImage, NUploadDragger, NIcon, NCheckbox,
        NCheckboxGroup, NSpace, NMessageProvider, NList, NListItem,NSpin]
})

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(naive) //组件库
app.use(createPinia())
app.use(router)

app.mount('#app')
