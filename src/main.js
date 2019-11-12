import Vue from 'vue';
import VueRouter from 'vue-router';
import routerConfig from './router';
import app from './vue/app';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
Vue.prototype.axios = axios;
Vue.use(ElementUI);
Vue.use(VueRouter);
var router=new VueRouter(routerConfig);
new Vue({
    el:"#app",
    render:(h)=>h(app),
    router:router
})
