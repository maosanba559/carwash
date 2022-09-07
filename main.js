import valid from '@/common/lib/validate.js'
import mpShare from '@/common/mixin/mpShare.js'
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$validate = valid.validate
  app.mixin(mpShare)
  return {
    app
  }
}
// #endif