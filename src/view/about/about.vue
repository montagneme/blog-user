<template>
<div class="box">
    <web-fire></web-fire>
    <p class="intro">
        哟！又在写BUG呢？
        <br>
        路漫漫其修远兮，吾写BUG而求索。
        <br>
        这里住着个前端小菜鸡，记录生活，分享技术，主前端，副后端。热爱媳妇儿，热爱生活，热爱编程。
        <br>
        <br>
        联系作者：
        <br>
        QQ：956661947 
        <br>
        邮箱：956661947@qq.com
        <br>
        现就读于：重庆理工大学
        <br>
        <br>
        —— <span class="flag" @click="flag(false)">4月20日</span></p>
</div>
</template>
<script>
import $ from 'jquery'
import fire from '@/components/fire/fire' 
export default {
    data() {
        return {
            circle:[]
        }
    },
    components:{
        'web-fire':fire
    },
    methods: {
        flag(state){
            this.$store.commit('getFlag',true);
            this.$Notice.info({
                title: '获得彩蛋',
                desc: state ? '' : '4月20日是一个特殊的日子，恭喜你获得彩蛋，可以在留言板中留下彩色发光字体。'
            });
        }
    },
}
</script>
<style scoped>
@import url('./about.css');
@import url('./aboutmobile.css');
</style>