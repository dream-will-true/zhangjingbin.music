import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// 引入axios
import axios from './myaxios/myaxios'
// 将axios挂载到Vue的原型上
Vue.prototype.$http=axios;
new Vue({
  render: h => h(App),
}).$mount('#app')
