// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import iview from 'iview'
import 'iview/dist/styles/fonts/ionicons.svg'
import 'iview/dist/styles/fonts/ionicons.ttf'
import 'iview/dist/styles/fonts/ionicons.woff'
import 'iview/dist/styles/iview.css'

import { GetArticle } from '@/api/articlelist'

Vue.config.productionTip = false
Vue.use(iview);


//切换路由进度条全局配置
Vue.prototype.$Loading.config({
  color: 'rgb(25,125,127)',
  failedColor: '#f0ad4e'
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

//全局路由
router.beforeEach((to, from, next) => {
  iview.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iview.LoadingBar.finish();
  

  //获取文章
  if(store.state.bolg.bolgList.length==0)
  {
    //路由过来后加载数据
    //session保存当前翻页的页数
    if(sessionStorage.getItem('nowPage'))
    {
      let nowPage=sessionStorage.getItem('nowPage');
      GetArticle('',(nowPage-1)*10,10).then((data)=>{
        store.commit('bolgList',data.data);
      })
    }else{
      GetArticle('',0,10).then((data)=>{
        store.commit('bolgList',data.data);
      })
    }
  }else{
    //已经请求到了数据
  }
});



//axios生产环境自动配置
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '' : '/apis'
//axios请求超时时间
axios.defaults.timeout = 100000


//http请求拦截器
axios.interceptors.request.use(config => {
  store.state.isloading=true;
  return config
}, error => {
  Vue.prototype.$Message.error('拉取数据失败,请刷新页面');
  return Promise.reject(error.response)
})

//http响应拦截器
axios.interceptors.response.use(data => {
  store.state.isloading=false;
  return data
}, error => {
  let _status = error.response && error.response.status
  if (_status === 504 || _status === 404) {
    Vue.prototype.$Message.error('响应失败,请刷新页面');
  
  }
  return Promise.reject(error)
})