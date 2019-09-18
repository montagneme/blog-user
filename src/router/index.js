import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'blogmain',
      component:()=>import('@/view/blogmain/blogmain'),
      meta:{
        keepAlive:true
      }
    },
    {
      path:'/Article/:id',
      name:'Article',
      component:()=>import('@/view/article/article'),
    },
    {
      path:'/About',
      name:'About',
      component:()=>import('@/view/about/about'),
      meta:{
        keepAlive:true
      }
    },
    {
      path:'/Knowledge',
      name:'knowledge',
      component:()=>import('@/view/knowledge/knowledge'),
      meta:{
        keepAlive:true
      }
    },
    {
      path:'/Not',
      name:'not',
      component:()=>import('@/view/not/not')
    },
    {
      path:'/Words',
      name:'Words',
      component:()=>import('@/view/words/words')
    },
    {
      path:'/Draw',
      name:'Draw',
      component:()=>import('@/view/draw/draw'),
      meta:{
        keepAlive:true
      }
    },
    {
      path:'/Share',
      name:'Share',
      component:()=>import('@/view/share/share'),
      meta:{
        keepAlive:true
      }
    },
    {
      path:'*',
      redirect:'/Not'
    }
  ],



  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if(savedPosition){
          resolve(savedPosition);
        }else{
          resolve({ x: 0, y: 0 });
        }
      },300)
    })
  }
})


