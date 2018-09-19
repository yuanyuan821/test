import Vue from 'vue'
import sduheader from '@/components/header/header1'
/*import sduheader from '@/components/header/hainanHeader'*/
import iview from 'sduept-vue'
import axios from "axios"
import 'sduept-vue/dist/styles/iview.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './vuex'
// import './main.css'
import './mainHainan.css'
import './pad.css'
import echarts from 'echarts'
import highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import { dateToString } from "@/components/js/dateToString"
import { monthEnd } from "@/components/js/monthEnd"
highcharts3D(highcharts);

Vue.use(iview)
Vue.use(ElementUI)
Vue.prototype.$Axios = axios
Vue.prototype.$dateToString = dateToString;
Vue.prototype.$monthEnd = monthEnd;
Vue.config.productionTip = false

axios.defaults.baseURL = "/test"
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


window.highcharts3D=highcharts3D
window.highcharts = highcharts
window.echarts = echarts
window.echarts.resize = function (callback) {
    if(this.$route.path === this.path){
    callback()
    }else if(this.$store.state.draw.resize === true){
      this.$store.commit('addPathCache',this.path)
    }
}

window.addEventListener('scroll',()=>{})

Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    return fmt
}
      
window.setOrdinal = function (array,currentPage,pageSize) {
  array.forEach(function (element,index) {
      element.ordinal = (currentPage - 1) * pageSize + index + 1
  })
  return array
}
window.strfunc=function(param){
  var str='';
  if(param.length ==0){
   return '';
  }
  else{
    for(var i=0;i<param.length-1;i++){
      str+=param[i]+","
    } 
    str+=param[param.length - 1];
    return str;
  }
}
//检测平台
var system = {
  win: false,
  mac: false,
  xll: false,
  ipad:false
};

var p = navigator.platform;
system.win = p.indexOf("Win") == 0;
system.mac = p.indexOf("Mac") == 0;
system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
//跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
if (system.win || system.mac || system.xll) {
       /*  var dom= document.getElementsByTagName("body");
   dom[0].id="padstyle"*/
} else {
   var dom= document.getElementsByTagName("body");
   dom[0].id="padstyle"
}

new Vue({
  el: '#app',
  router,
  store,
  components: { sduheader:sduheader },
  mounted () {
    window.onresize = () => {
      this.$store.dispatch('redrawAsync')
    }
  }
})
