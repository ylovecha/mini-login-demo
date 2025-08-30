import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 将 Axios 附加到 Vue 原型
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
