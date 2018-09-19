// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iview from 'iview'
import axios from "axios"
import 'iview/dist/styles/iview.css'
import './main.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' 
import $  from 'jquery'
import "./js/jquery.soap"
import {formatTime} from "./js/formatTime.js"
import "./xmlToJson"
import "./js/jquery.xml2json.js"

Vue.use(iview)
Vue.use(ElementUI)
Vue.prototype.$Axios = axios
Vue.prototype.$formatTime = formatTime
Vue.config.productionTip = false

// axios.defaults.baseURL = "/test"
axios.interceptors.response.use(function(response){
  let data = response.data;
   if(data.sessionStatus === "timeout"){
    var hrtest ="http://"+window.location.host;
    window.location.href=hrtest;
    return;
  }
  if((typeof data == 'string') && data.constructor == String){
     try{
      data = JSON.parse(data);
    }catch(error){
      data=data
    }

  }
  return data;
},function(error){
    return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
