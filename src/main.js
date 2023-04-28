import { createApp } from 'vue'
import App from './App.vue'
import store from './vuexStore/store'
import router from './router/router'
import './assets/styles/styles.scss'
import axios from 'axios'
import VueTheMask from 'vue-the-mask'
import Vue3MobileDetection from "vue3-mobile-detection"
import Notifications from '@kyvg/vue3-notification'
import { useAccordion } from "vue3-rich-accordion"
import VCalendar from 'v-calendar';
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'v-calendar/style.css'
import vClickOutside from "click-outside-vue3"
import { vfmPlugin } from 'vue-final-modal'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueTheMask)
app.use(Vue3MobileDetection)
app.use(Notifications)
app.use(useAccordion)
app.use(VCalendar, {})
app.use(VueSidebarMenu)
app.use(vClickOutside)
app.use(vfmPlugin)
app.mount('#app')

app.config.globalProperties.$http = axios
const token = localStorage.getItem('tokenWorker')
if (token) {
    app.config.globalProperties.$http.defaults.headers.common['Authorization'] = token
}