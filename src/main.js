import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "normalize.css/normalize.css";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "./assets/style/utilities.css";
Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
