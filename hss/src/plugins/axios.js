import axios from "axios";
import Vue from "vue";
const server = process.env.VUE_APP_SERVER || "/";
const $axios = axios.create();
$axios.interceptors.request.use(config => {
  config.baseURL = server;
  return config;
})

export default {
  install() {
    Vue.prototype.axios = $axios;
  },
};
