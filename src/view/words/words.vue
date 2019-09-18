<template>
<div class="box">
    <div class="words_box">
        <div class="title">留言板</div>
        <div class="ground">
            <input type="text" class="words" v-model="words" @keydown.enter="submit()">
        </div>
        <div class="but" @click="submit()">提交</div>
    </div>
    <div class="words_display">
        <transition-group name="display">
            <span v-for="item in display" :key="item.id" class="word" :style="item.style">{{ReHtmlEscape(item.txt)}}</span>
        </transition-group>
    </div>
    
</div>
</template>
<script>
import { GetWords,AddWords } from '@/api/word'
export default {
    data() {
        return {
            words:'',
            display:[
                
            ]
        }
    },
    created() {
        GetWords().then((data)=>{
            console.log(data);
            if(data.data)
            {
                this.display=data.data;
            }
        });
    },
    methods: {
        HtmlEscape(sHtml) {
            return sHtml.replace(/[']/g,function(c){return {"'":"&apos;"}[c];});
        },
        ReHtmlEscape(sHtml) {
            return sHtml.replace(/&apos;/g,"'");
        },
        submit(){
            if(document.cookie.indexOf("words=blogwords")==-1)
            {
                if(this.words!='' && this.words.length<=50)
                {
                    let words=this.HtmlEscape(this.words);
                    let flag=this.$store.state.flag;
                    AddWords({txt:words,flag:flag}).then((data)=>{
                        if(data.data.code==200){
                            this.$Message.success(data.data.msg);
                            var date=new Date();
                            date.setTime(date.getTime()+1*60*1000); //设置date为当前时间+30分
                            document.cookie="words=blogwords; expires="+date.toGMTString(); //将date赋值给expires
                            GetWords().then((data)=>{
                                if(data.data)
                                {
                                    this.display=data.data;
                                }
                            });
                        }else{
                            this.$Message.error(data.data.msg);
                        }
                    });
                    
                }else{
                    this.$Message.warning('没有填写内容或者内容超过50个字。');
                }
            }else{
                this.$Message.warning('请一分钟后再留言');
            }
        }
    },
}
</script>
<style scoped>
@import url('./words.css');
@import url('./wordsmobile.css');
</style>