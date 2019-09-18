<template>
  <div id="app">
    <!-- 导航栏 -->
    <transition name="loading">
      <div v-if="IsLoading" class="loading">
        <div class="spin">
          <Spin size="large" fix></Spin>
        </div>
      </div>
    </transition>
      <div :class="'guide '+Guide">
        <!-- <div class="head">
          <img src="" alt="" class="head_img">
          <p class="head_name">MONTAGNE 的博客</p>
        </div>  -->

        <div class="guide_box">
          <ul class="guide_list">
            <li v-for="item in guide.guideList" :key="item.id" @mouseover="GuideHover(item.id)" @click="GuideActive(item.id)" @mouseout="GuideHoverOut(item.id)">
              <router-link v-if="item.id!=4"  :to="item.to" tag="div" class="guide_to">{{item.name}}</router-link>
              <a v-else :href="item.to" style="width: 100%;height:100%;display: block;" class="guide_to">{{item.name}}</a>
              <div class="l">
                <div class="l_c" :class="{guide_hover:guide.guideIndex==item.id,guide_active:guide.guideActiveIndex==item.id}"></div>
              </div>
            </li>
          </ul>
        </div>
        <Tooltip  :content="eleIntro" placement="bottom" class="ele_box">
            <div class="ele" :style="{animation: 'ele_sock '+eleClickNum*5+'ms linear infinite'}" @click="EleSpeedAdd">
                <div class="ele_head"></div>
                <div class="ele_body" :style="{animation: 'ele_move '+eleClickNum*10+'ms linear infinite'}"></div>
              </div>
        </Tooltip>
      </div>
        <transition name="router" class="router" >
          <keep-alive>
              <router-view v-if="$route.meta.keepAlive"/>
          </keep-alive>
        </transition>
        <transition name="router" class="router" >
              <router-view v-if="!$route.meta.keepAlive"/>
          </transition>
          <div class="player">
              <Player v-if="isPc"></Player>
          </div>
  </div>
</template>

<script>
import Player from '@/components/player/player'
export default {
  name: 'App',
  data(){
    return {
      eleIntro:'老哥，知识不够用？来充充电，快！点老子！',
      eleClickNum:500,
      guide:{
        guideList:[
          {id:1,name:'文章',to:'/'},
          {id:7,name:'小玩意儿',to:'/Share'},
          {id:3,name:'前端架构',to:'/Knowledge'},
          {id:5,name:'留言板',to:'/Words'},
          {id:2,name:'关于我',to:'/About'},
          
          // {id:6,name:'画板',to:'/Draw'},
          // {id:4,name:'Github',to:'https://github.com/montagneme'}
        ],
        guideIndex:0,
        guideActiveIndex:1,
      },
      isPc:true,
    }
  },
  mounted() {
    if(sessionStorage.getItem('guideActive'))
    {
      this.guide.guideActiveIndex=sessionStorage.getItem('guideActive')
    }
  },
  created() {
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){   //手机端
        this.isPc=false;
    }
  },
  components:{
    Player,
  },
  methods: {
    EleSpeedAdd(){
      //电池动画
      if(this.eleClickNum==10)
      {
        this.eleIntro='啊啊啊啊啊啊啊啊啊！控制不住啦!'
      }else{
        if(this.eleClickNum==400)
        {
          this.eleIntro='给老子继续点！'
        }
        if(this.eleClickNum==300)
        {
          this.eleIntro='拿出你的手速！'
        }
        if(this.eleClickNum==200)
        {
          this.eleIntro='快点！要不行了！'
        }
        if(this.eleClickNum==100)
        {
          this.eleIntro='啊啊啊！加油啊!'
        }
        if(this.eleClickNum==30)
        {
          this.eleIntro='额啊啊啊啊啊啊！'
        }
        this.eleClickNum-=10;
      }
    },
    GuideHover(val){
      this.guide.guideIndex=val;
    },
    GuideHoverOut(val){
      this.guide.guideIndex=0;
    },
    GuideActive(val){
      this.guide.guideActiveIndex=val;
      if(val!=4)
      {
        sessionStorage.setItem('guideActive',val);
      }
    },
  },
  computed: {
    IsLoading(){
      return this.$store.state.isloading;
    },
    Guide(){
      switch(this.$route.path)
      {
        case '/':
        return 'guide_1'
        break;
        case '/About':
        return 'guide_2'
        break;
        case '/Knowledge':
        return 'guide_3'
        break;
        case '/Words':
        return 'guide_4'
        break;
        case '/Draw':
        return 'guide_1'
        break;
        case '/Share':
        return 'guide_4'
        break;
        default:
        return ''
        break;
      }
      
    },
  },
  watch: {
    '$route'(to,from){
      //导航路由
      switch(to.path)
      {
        case '/':
        sessionStorage.setItem('guideActive',1);
        this.guide.guideActiveIndex=sessionStorage.getItem('guideActive')
        this.guide.guideIndex=0;
        break;
        case '/About':
        sessionStorage.setItem('guideActive',2);
        this.guide.guideActiveIndex=sessionStorage.getItem('guideActive')
        this.guide.guideIndex=0;
        break;
        case '/Knowledge':
        sessionStorage.setItem('guideActive',3);
        this.guide.guideActiveIndex=sessionStorage.getItem('guideActive')
        this.guide.guideIndex=0;
        break;
        case '/Words':
        sessionStorage.setItem('guideActive',5);
        this.guide.guideActiveIndex=sessionStorage.getItem('guideActive')
        this.guide.guideIndex=0;
        break;
        case '/Draw':
        sessionStorage.setItem('guideActive',6);
        this.guide.guideActiveIndex=sessionStorage.getItem('guideActive')
        this.guide.guideIndex=0;
        break;
        case '/Share':
        sessionStorage.setItem('guideActive',7);
        this.guide.guideActiveIndex=sessionStorage.getItem('guideActive')
        this.guide.guideIndex=0;
        break;
      }
    }
  },
}
</script>

<style>
  @import url('./App.css');
  @import url('./Appmobile.css');
</style>
