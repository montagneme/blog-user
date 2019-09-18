<template>
<div class="box">
    <div class="search" :class="{search_hover:search.searchOpen || SearchInputing}" @mouseover="SearchHover" @mouseout="SearchHoverOut">
        <div :class="{search_value_box:true,search_value_box_hover:search.searchOpen ||  SearchInputing}">
            <AutoComplete
            v-model="search.searchValue"
            :data="SearchList"
            @on-change="Search"
            placeholder="input here"
            style="width: 410px;background-color: rgb(245,245,245);"
            class="autocomplete"></AutoComplete>
        </div>
        <Icon type="ios-search" size="25" color="rgb(150,150,150)" class="search_icon"/>
    </div>
    <!-- <div class="blog_top">
        <div class="blog_top_img_box">
        </div>
        <div class="blog_title">我的文章</div>
    </div> -->
    <transition name="no_list">
        <div class="no_list" v-if="BolgList.length==0 && !hasSearch">
            <div class="load">
                <Icon type="ios-loading" size="25" class="load_icon"/><span class="load_content">请稍等，正在拉取数据...</span>
            </div>
        </div>
        <div class="no_list" v-if="BolgList.length==0 && hasSearch">
            <div class="load">
                <span class="load_content">没有搜索到内容</span>
            </div>
        </div>
    </transition>
    <transition-group 
    name="bolgList" 
    tag="ul" 
    class="bolg_list"
    >
        <li
        v-for="(item,index) in BolgList" 
        :key="item.id" 
        :hid="item.id" 
        :class="{bolg_click:bolg.bolgListClick==item.id}" 
        @mousedown="BolgDown"
        @mouseup="BolgUp"
        :data-index="index"
        >
            <div class="list_img_box">
                <!-- <img :src="item.imgUrl" alt="" class="list_img"> -->
                <div class="list_title_box">
                    <div class="list_title"><Icon type="ios-quote" class="t_l_icon" size="20"/>{{item.title}}<Icon type="ios-quote" class="t_r_icon" size="20"/></div>
                    <p style="text-align: center;color: rgba(92,107,119,0.8);" class="list_time">发布日期：&nbsp;&nbsp;&nbsp;{{item.time}}</p>
                </div>
            </div>
            <div class="list_info">
                <p class="list_content" v-html="">{{text(item.content) | FontFilter}}</p>
                <div class="list_record">
                    <span class="list_record_span" style="margin-left: 0px;"><Icon type="md-eye" size="15"/>&nbsp;&nbsp;&nbsp;{{item.readNum}}</span>
                    <span class="list_record_span"><Icon type="md-heart" size="15" />&nbsp;&nbsp;&nbsp;{{item.loveNum}}</span>
                    <span class="list_record_span"><Icon type="logo-foursquare" size="15"/>&nbsp;&nbsp;{{item.fontNum}}</span>
                    <div class="list_tag">
                        <div v-for="tag in item.tags" :key="tag" class="tag"><Icon :type="$store.state.tag[tag].style" :color="$store.state.tag[tag].color" size="18" style="line-height: 1px;"/>&nbsp;{{tag}}</div>
                    </div>
                </div>
            </div>
            <div class="new" v-if="(new Date()-new Date(item.time))/86400000<=newTime">new</div>
            <!-- <div class="hr"></div> -->
        </li>
    </transition-group>
    <div class="head_right" :style="{top:headTop+'px',left:headLeft+'px'}">
        <Tooltip max-width="200" :always="tipStatus" :delay="tipDelay" placement="top" class="head_img_content_box" :content="tipContent">
            <div class="head_img_box">
                <img :src="headImg" alt="">
                <!-- <Icon type="ios-contact" size="60"/> -->
            </div>
        </Tooltip>
        <p class="head_intro">仲威的博客</p>
    </div>
    <div class="head_left" :style="{top:headTop+'px',left:headLeft_2+'px'}">
        <div class="head_left_box">
            <div class="notice_box">
                <p class="notice_title"><Icon type="md-text"  style="line-height: 1px;margin-right: 10px;" size="20"/>最新公告</p>
                <transition-group 
                name="noticeList" 
                tag="ul" 
                class="notice_list"
                >
                <li v-for="item in notice" :key="item.id">
                    <Icon type="md-radio-button-on" color="rgb(138,43,226)" size="10" style="line-height: 1px;" class="notice_icon"/>
                    <span class="notice_time">{{item.time}}</span>
                    <p class="notice_content">{{item.content}}</p>
                    
                </li>
                </transition-group>
            </div>
        </div>
        <div class="head_left_box" style="margin-top: 40px;">
            <div class="notice_box">
                <p class="notice_title"><Icon type="md-happy"  style="line-height: 1px;margin-right: 10px;" size="20"/>友情链接</p>
                <transition-group 
                name="noticeList" 
                tag="ul" 
                class="notice_list"
                >
                <li v-for="item in link" :key="item.id" style="margin-top: 8px;">
                    <a :href="item.href" target="_blank">{{item.title}}</a>
                </li>
                </transition-group>
            </div>
        </div>
        
    </div>
    <div class="page" v-if="BolgList.length!=0">
        <Page :total="page.dataNum" show-total :current="page.nowPage" :page-size="page.pageNum" @on-change="PageChange"/>
    </div>
    
</div>
</template>
<script>
import headImg from '@/assets/head.jpg'
import $ from 'jquery'
import { GetArticle,GetArticleNum,GetNotice,GetFri } from '@/api/articlelist'
export default {
    data(){
        return {
            headImg:headImg,
            notice:[],
            link:[],
            tip:['欢迎来到仲威的博客','此博客用于记录我自己的学习路程和一些心得','如果你觉得这些对你有帮助那就翻翻文章吧！','本博客是由我自己运用vue独立开发，觉得还不错记得收藏起来！','over!'],
            tipEnd:'别碰我，睡觉呢。',
            tipContent:'...',
            tipStatus:false,
            tipDelay:500,
            headTop:90,
            headLeft:1800,
            headLeft_2:-200,
            startTime:0,
            newTime:5,
            search:{
                searchValue:'',
                searchOpen:false,
                searchData:[]
            },
            hasSearch:false,
            bolg:{
                bolgListClick:''
            },
            page:{
                dataNum:500,
                nowPage:1,
                pageNum:10
            }
        }
    },
    methods: {
        Search(){
            this.hasSearch=true;
            console.log(1);
            this.page.nowPage=1;
            GetArticleNum(this.search.searchValue).then((data)=>{
                this.page.dataNum=data.data[0]['count(*)'];
            })
            GetArticle(this.search.searchValue,0,this.page.pageNum).then((data)=>{
                window.scrollTo(0,0);
                this.$store.commit('bolgList',data.data);
                sessionStorage.setItem('nowPage',1);
            });
        },
        //tip介绍
        Tip(){
            let index=0;
            let timer=setInterval(()=>{
                this.tipStatus=false;
                setTimeout(()=>{
                    if(index==this.tip.length)
                    {
                        this.tipContent=this.tipEnd;
                        clearInterval(timer);
                    }else{
                        this.tipContent=this.tip[index];
                        this.tipStatus=true;
                        index++;
                    }
                },this.tipDelay);

            },4000);
        },
        BindEvent(){
            this.headLeft=$('.bolg_list').width()+$('.bolg_list').offset().left+50+40;
            this.headLeft_2=$('.bolg_list').offset().left-40-$('.head_left').width()+50;
            $(document).on('scroll',(ev)=>{
                if(this.$route.path=='/')
                {
                    this.headTop=$(document).scrollTop()+90;
                }
            })
            $(window).on('resize',(ev)=>{
                if(this.$route.path=='/'){
                    this.headLeft=$('.bolg_list').width()+$('.bolg_list').offset().left+40;
                    this.headLeft_2=$('.bolg_list').offset().left-40-$('.head_left').width();
                }
            })
        },
        UnbindEvent(){
            $(document).unbind('scroll');
            $(window).unbind('resize');
        },
        BolgDown(el){
            
            this.bolg.bolgListClick=el.currentTarget.getAttribute('hid');
            // this.$router.push('/Article/'+el.currentTarget.getAttribute('hid'));
        },
        BolgUp(el){
            this.$router.push('/Article/'+el.currentTarget.getAttribute('hid'));
            this.bolg.bolgListClick=''
        },
        SearchHover(){
            this.search.searchOpen=true;
        },
        SearchHoverOut(){
            this.search.searchOpen=false;
        },
        handleSearch(){
           
        },
        PageChange(index){
            GetArticle(this.search.searchValue,(index-1)*this.page.pageNum,this.page.pageNum).then((data)=>{
                window.scrollTo(0,0);
                this.$store.commit('bolgList',data.data);
                sessionStorage.setItem('nowPage',index);
            });
            
        },
        text(str){
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
            str = str.replace(/\s/g, ''); //将空格去掉
            return str;
        },
        Console(){
            console.log("%c欢迎访问 blogme.top 仲威的博客", "background-color:rgb(30,30,30);border-radius:4px;font-size:12px;padding:4px;color:rgb(220,208,129);");
            console.log("%c大佬们不要做坏事哈~", "background-color:rgb(30,30,30);border-radius:4px;font-size:12px;padding:4px;color:rgb(24,173,121);");
        }
    },
    computed:{
        SearchInputing(){
            if(this.search.searchValue!='')
            {
                return true;
            }else{
                return false;
            }
        },
        BolgList(){
            return this.$store.state.bolg.bolgList
        },
        SearchList(){
            if(this.search.searchValue!='')
            {
                let list=this.$store.state.bolg.bolgList
                let searchList=[];
                for(let i=0;i<list.length;i++)
                {
                    searchList.push(list[i].title);
                }
                return searchList;
            }else{
                return [];
            }
            
        }
    },
    filters:{
        FontFilter(val){
            return val.substr(0,200)+'...'
        }
    },
    created() {
        //获取列表
        // GetArticle(0,10).then((data)=>{
        //     this.$store.commit('bolgList',data.data);
        // });
        

        //控制台提示
        this.Console();


        this.Tip();
        if(sessionStorage.getItem('nowPage'))
        {
            this.page.nowPage=parseInt(sessionStorage.getItem('nowPage'));
        }
        GetArticleNum(this.search.searchValue).then((data)=>{
            this.page.dataNum=data.data[0]['count(*)'];
        })
        GetNotice(0,4).then((data)=>{
            this.notice=data.data;
        })
        GetFri().then((data)=>{
            this.link=data.data
        })
        document.onmouseup=()=>{
            this.bolg.bolgListClick='';
        }
    },
    mounted() {
        this.BindEvent();
    },

}
</script>
<style scoped>
    @import url('./blogmain.css');
    @import url('./blogmainmobile.css');
</style>