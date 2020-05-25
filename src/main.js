import Vue from "vue";
import Axios from "axios";
import App from "./App.vue";
import store from "./store"

Vue.config.productionTip = false;

// 解决跨域 step1
Axios.defaults.baseURL = '/api'

// 把Axios挂载到vue的原型中，在vue中每个组件都可以使用axios发送请求,
// 不需要每次都 import一下 Axios了，直接使用 $Axios 即可
Vue.prototype.$axios = Axios;


new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
