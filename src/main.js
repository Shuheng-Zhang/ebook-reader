import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入图标
import './assets/styles/icon.css'
// 导入全局通用样式
import './assets/styles/global.scss'

// 导入 WEB 字体
import './assets/fonts/daysOne.css'
import './assets/fonts/cabin.css'
import './assets/fonts/tangerine.css'
import './assets/fonts/montserrat.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
