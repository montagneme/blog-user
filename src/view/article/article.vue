<template>
<div class="box">
    <!-- <div class="box_img_box1">
        <div class="box_img_shelter1"></div>
        <img :src="ArticleInfo.imgUrl" alt="" class="box_img1">
    </div>
    <div class="box_img_box2">
            <div class="box_img_shelter2"></div>
            <img :src="ArticleInfo.imgUrl" alt="" class="box_img2">
        </div> -->
    <div class="back">
        <Icon type="md-arrow-round-back" size="40" @click="Back"/>
    </div>
    <div class="love" @mouseover="LoveOver" @mouseout="LoveOut" @click="LoveClick">
        <Icon type="md-heart" size="40" class="love_ico"/>
    </div>
    <Icon type="md-list-box" size="40" :class="{catalog_icon:true,catalog_icon_open:catalogOpen}"  @click="CatalogOpen()"  v-if="thisArticle.point"/>
    <div :class="{catalog:true,catalog_open:catalogOpen}" v-if="thisArticle.point">
        <Icon type="md-close-circle" class="catalog_close" size="20" @click="CatalogClose()"/>
        <p class="catalog_name">目录</p>
        <p v-for="(item,index) in nameArr" @click="To(pointArr[index])" class="catalog_li">{{item}}</p>
    </div>

    <div class="article">
        <p class="article_title">{{thisArticle.title}}</p>
        <div class="article_record">
            <span style="margin-left: 0px;">日期：&nbsp;{{thisArticle.time}}</span>
            <span>阅读数：&nbsp;{{thisArticle.readNum}}</span>
            <span>喜爱：&nbsp;{{thisArticle.loveNum}}</span>
            <span>字数：&nbsp;{{thisArticle.fontNum}}</span>
        </div>
        <div class="tags">
                <div v-for="tag in thisArticle.tags" :key="tag" class="tag"><Icon :type="$store.state.tag[tag].style" :color="$store.state.tag[tag].color" size="18" style="line-height: 1px;"/>&nbsp;{{tag}}</div>
        </div>
        <Divider/>
        <div class="article_content" v-html="thisArticle.content"></div>
    </div>
    <div class="talk">
        <div class="talk_box">
            <p class="talk_title">评论:</p>
                <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
                        <FormItem label="评论内容" prop="talk">
                            <Input v-model="formItem.talk" type="textarea" :autosize="{minRows: 6,maxRows: 6}" placeholder="200字以内" class="input"></Input>
                            <p style="overflow: hidden;margin-top:5px;">
                                <span style="cursor:pointer;display:block;float:left;height:20px;line-height:20px;text-align: center;user-select:none;" v-for="(item,index) in emoji" :key="index" @click="append(item)">{{item}}</span>
                            </p>
                        </FormItem>
                        <FormItem label="名称">
                            <Input type="text" v-model="formItem.name" placeholder="名称" style="width: 300px" class="talk_name input">
                                
                            </Input>
                        </FormItem>
                        <FormItem label="网址" prop="href">
                            <Input v-model="formItem.href" placeholder="示例：www.blogme.top（ 可不填 ）" class="talk_name" style="width: 300px;">
                                <Select v-model="formItem.head" slot="prepend" style="width: 80px">
                                    <Option value="0">http://</Option>
                                    <Option value="1">https://</Option>
                                </Select>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" long ghost @click="TalkSubmit('formItem')" style="width: 150px;">Submit</Button>
                        </FormItem>
                    </Form>
        </div>
    </div>
    <div class="talk_display">
        <div class="talk_display_box">
            <p class="talk_title" >评论区:</p>
            <transition-group name="talklist" tag="ul" class="talk_list" v-if="talkList.length!=0">
                <li
                v-for="item in talkList"
                :key="item.id"
                class="li"
                >
                <div class="talk_head">
                    <Badge dot v-if="(new Date()-new Date(item.time))/86400000<=newTime">
                        <Avatar icon="ios-person" size="small"/>
                    </Badge>
                    <Avatar icon="ios-person" size="small" v-else/>
                </div>
                <p class="talk_p1" @mouseover="ReplyIndex(item.id)"><a :href="item.href" target="_blank">{{ReHtmlEscape(item.name)}}</a>:<transition name="reply"><span class="reply_button"  @click="ReplyActive(item.id)" v-if="replyId==item.id"><Icon type="ios-chatbubbles-outline" /></span></transition></p>
                <p class="talk_time">{{item.time}}</p>
                <p class="talk_p2">{{ReHtmlEscape(item.talk)}}</p>
                <transition name="replay_active">
                        <div class="replay_talk_box" v-if="replyActiveId==item.id">
                            <div class="reply_return" @click="ReplyReturn"><Icon type="ios-arrow-up" size="25"/></div>
                            
                            <Form ref="replyFormItem" :model="formItem" :label-width="80" :rules="ruleValidate">
                                <FormItem label="评论内容" prop="talk">
                                    <Input v-model="formItem.talk" type="textarea" :autosize="{minRows: 6,maxRows: 6}" placeholder="200字以内" class="input"></Input>
                                    <p style="overflow: hidden;margin-top:5px;">
                                        <span style="cursor:pointer;display:block;float:left;height:20px;line-height:20px;text-align: center;user-select:none;" v-for="(item,index) in emoji" :key="index" @click="append(item)">{{item}}</span>
                                    </p>
                                </FormItem>
                                <FormItem label="名称">
                                    <Input type="text" v-model="formItem.name" placeholder="名称" style="width: 300px" class="talk_name input">
                                        
                                    </Input>
                                </FormItem>
                                <FormItem label="网址" prop="href">
                                    <Input v-model="formItem.href" placeholder="示例：www.blogme.top（ 可不填 ）"  class="talk_name" style="width: 300px;">
                                        <Select v-model="formItem.head" slot="prepend" style="width: 80px">
                                            <Option value="0">http://</Option>
                                            <Option value="1">https://</Option>
                                        </Select>
                                    </Input>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" long ghost @click="TalkSubmit('replyFormItem',item.id,item.name,item.href)" style="width: 150px;">Submit</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </transition>
                <ul class="reply_talk">
                    <li v-for="reply in item.replyTalk" :key="reply.id">
                        <div class="talk_head">
                            <Badge dot v-if="(new Date()-new Date(reply.time))/86400000<=newTime">
                                <Avatar icon="ios-person" size="small"/>
                            </Badge>
                            <Avatar icon="ios-person" size="small" v-else/>
                        </div>
                        <p class="talk_p1 talk_p1_2" @mouseover="ReplyIndex(reply.id)"><a :href="reply.href" target="_blank">{{ReHtmlEscape(reply.name)}}</a>:<transition name="reply"><span class="reply_button"  @click="ReplyActive(reply.id)" v-if="replyId==reply.id"><Icon type="ios-chatbubbles-outline" /></span></transition></p>
                        <p class="talk_time talk_time_2" style="width: 160px;">{{reply.time}}</p>
                        <p class="talk_p2">@<a :href="reply.toHref" target="_blank">{{ReHtmlEscape(reply.toName)}}</a>&nbsp;&nbsp;{{ReHtmlEscape(reply.talk)}}</p>
                        <transition name="replay_active">
                            <div class="replay_talk_box" v-if="replyActiveId==reply.id">
                                <div class="reply_return" @click="ReplyReturn"><Icon type="ios-arrow-up" size="25"/></div>
                                <Form ref="replyFormItem" :model="formItem" :label-width="80" :rules="ruleValidate" >
                                    <FormItem label="评论内容" prop="talk">
                                        <Input v-model="formItem.talk" type="textarea" :autosize="{minRows: 6,maxRows: 6}" placeholder="200字以内" class="input"></Input>
                                        <p style="overflow: hidden;margin-top:5px;">
                                            <span style="cursor:pointer;display:block;float:left;height:20px;line-height:20px;text-align: center;user-select:none;" v-for="(item,index) in emoji" :key="index" @click="append(item)">{{item}}</span>
                                        </p>
                                    </FormItem>
                                    <FormItem label="名称">
                                        <Input type="text" v-model="formItem.name" placeholder="名称" style="width: 300px" class="talk_name input">
                                            
                                        </Input>
                                    </FormItem>
                                    <FormItem label="网址" prop="href">
                                        <Input v-model="formItem.href" placeholder="示例：www.blogme.top（ 可不填 ）"  class="talk_name" style="width: 300px;">
                                            <Select v-model="formItem.head" slot="prepend" style="width: 80px">
                                                <Option value="0">http://</Option>
                                                <Option value="1">https://</Option>
                                            </Select>
                                        </Input>
                                    </FormItem>
                                    <FormItem>
                                        <Button type="primary" long ghost @click="TalkSubmit('replyFormItem',reply.tid,reply.name,reply.href)" style="width: 150px;">Submit</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </transition>
                    </li>
                </ul>
                </li>
            </transition-group>
            <p v-else class="talk_not">暂无评论</p>
        </div>
    </div>
    <div class="bottom">
        <div class="bottom_box">
            <div class="last" v-if="JSON.stringify(lastArticle)!='{}'">
                <div class="bottom_title_box">
                    <div class="last_title" @click="Last(lastArticle.id)">上一篇</div>
                    <div class="bottom_title">{{lastArticle.title}}</div>
                </div>                
            </div>
            <div class="next" v-if="JSON.stringify(nextArticle)!='{}'">
                <div class="bottom_title_box">
                    <div class="last_title" @click="Next(nextArticle.id)">下一篇</div>
                    <div class="bottom_title">{{nextArticle.title}}</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import 'highlight.js/styles/atom-one-dark.css'
import { AddReadNum,AddLoveNum,GetThisArticle } from '@/api/articlelist'
import { AddTalk,GetTalk } from '@/api/talk'
import './handleimg.css'
export default {
    data(){
        return {
            lastArticle:{},
            nextArticle:{},
            thisArticle:{
                    id:0,
                    title:'',
                    content:'',
                    tags:[],
                    time:'0-0-0',
                    readNum:0,
                    loveNum:0,
                    fontNum:0,
                    point:''
                },
            replyActiveId:0,
            replyId:0,
            newTime:5,
            catalogOpen:false,
            pointArr:[],
            nameArr:[],
            formItem:{
                talk:'',
                // sex:'',
                name:'',
                href:'',
                head:'',   //0:http    1:https
                id:this.$route.params.id,
                tid:0,
                toName:'',
                toHref:''
            },
            ruleValidate: {
                    talk: [
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                        { type: 'string', max:200, message: '最多输入200个字', trigger: 'blur' }
                    ],
                    href: [
                        {  type:'string',message:'请输入正确的域名',trigger:'blur',pattern:'^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$'}
                    ]
            },
            talkList:[],
            emoji:[
                '😂','😃','😀','😁','😂','😃','😄','😅','😆','😇','😈','😉','😊',
                '😋','😌','😍','😎','😏','😐','😑','😒','😓','😔','😕','😖','😗',
                '😘','😙','😚','😛','😜','😝','😞','😟','😠','😡','😢','😣','😤',
                '😥','😦','😧','😨','😩','😪','😫','😬','😭','😮','😯','😰','😱',
                '😲','😳','😴','😵','😶','😷','😸','😹','😺','😻','😼','😽','😾',
                '😿','🙀','🙁','🙂','🙃','🙄','🙅','🙆','🙇','🙈','🙉','🙊','🙋',
                '🙌','🙍','🙎','🙏'
            ]
            // sexActive:0
        }
    },
    created() {
            // if(!sessionStorage.getItem('nowPage'))
            // {
            //     sessionStorage.setItem('nowPage',index);
            // }\
            this._getArticle();
    },
    computed:{
        
    },
    methods: {
        append(emoji){
            this.formItem.talk=this.formItem.talk+emoji;
        },
        _getArticle(){
            this.formItem.id=this.$route.params.id;
            this.pointArr=[];
            this.nameArr=[];
            AddReadNum(this.$route.params.id);
            GetTalk(this.$route.params.id).then((data)=>{
                this.talkList=data.data;
            })
            GetThisArticle(this.$route.params.id).then((res)=>{
                this.thisArticle=res.data.this;
                this.lastArticle=res.data.last;
                this.nextArticle=res.data.next;
                if(this.thisArticle.point)
                {
                    let point=this.thisArticle.point;
                    point=point.split(',')
                    point.forEach((el,index)=>{
                        if(index%2==0)
                        {
                            this.pointArr.push(el);
                        }else{
                            this.nameArr.push(el);
                        }
                    });
                }
                console.log(this.thisArticle);
            })
        },
        ReplyReturn(){
            this.replyActiveId=0;
        },
        ReplyActive(id){
            this.replyActiveId=id;
        },
        ReplyIndex(id){
            this.replyId=id;
        },
        CatalogClose(){
            this.catalogOpen=false;
        },
        CatalogOpen(){
            if(this.catalogOpen){
                this.catalogOpen=false;
            }else{
                this.catalogOpen=true;
            }
        },
        To(el){
            document.getElementById(el).scrollIntoView({
                behavior: "smooth"
            });
        },
        HtmlEscape(sHtml) {
            return sHtml.replace(/[']/g,function(c){return {"'":"&apos;"}[c];});
        },
        ReHtmlEscape(sHtml) {
            return sHtml.replace(/&apos;/g,"'");
        },
        LoveOver(){
            this.loveHover=true;
        },
        LoveOut(){
            this.loveHover=false;
        },
        LoveClick(){
            AddLoveNum(this.$route.params.id).then((data)=>{
                if(data.status==200)
                {
                    this.$Message.success('感谢您点赞👍');
                }else{
                    this.$Message.error('点赞失败了');
                }
            })
        },
        Last(id){
            this.$router.push({name:'Article',params:{id:parseInt(id)}});
        },
        Next(id){
            this.$router.push({name:'Article',params:{id:parseInt(id)}});
        },
        Back(){
            // if(sessionStorage.getItem('nowPage'))
            // {
            //     sessionStorage.setItem('nowPage',1);
            // }
            this.$router.push('/');
        },
        // SexActive(val){
        //     this.sexActive=val;
        //     this.formItem.sex=val;
        // },
        TalkSubmit(name,tid=0,toname='',tohref=''){
                let ref=this.$refs[name];
                if(tid!=0){
                    ref=this.$refs[name][0];    //解决iview的表单循环机制
                }
                if(document.cookie.indexOf("name=blogtalk")==-1)
                {
                    ref.validate((valid) => {
                        if (valid) {
                            //表单验证通过
                            this.formItem.tid=tid;
                            this.formItem.toName=this.HtmlEscape(toname);
                            this.formItem.toHref=tohref;
                            if(this.formItem.name=='')
                            {
                                this.formItem.name='匿名';
                            }
                            // if(this.formItem.sex=='')
                            // {
                            //     this.formItem.sex='不知名性别';
                            // }
                            if(this.formItem.href=='')
                            {
                                this.formItem.href='javascript:;';
                                this.formItem.head='';
                                
                            }else if(this.formItem.head=='' || this.formItem.head==undefined){
                                this.formItem.head='0';
                            }
                            
                            if(this.formItem.talk=='')
                            {
                                this.$Message.warning('请先填写评论');
                            }else{
                                //提交上去
                                this.formItem.name=this.HtmlEscape(this.formItem.name);
                                this.formItem.talk=this.HtmlEscape(this.formItem.talk);
                                AddTalk(this.formItem).then((data)=>{
                                    if(data.data.code)
                                    {
                                        this.formItem.talk='';
                                        this.$Message.success(data.data.msg);
                                        var date=new Date();
                                        date.setTime(date.getTime()+1*60*1000); //设置date为当前时间+30分
                                        document.cookie="name=blogtalk; expires="+date.toGMTString(); //将date赋值给expires
                                    }else{
                                        this.$Message.warning(data.data.msg);
                                    }
                                    GetTalk(this.$route.params.id).then((data)=>{
                                        this.talkList=data.data;
                                    })
                                })
                                this.formItem.name=this.ReHtmlEscape(this.formItem.name);
                                this.formItem.talk=this.ReHtmlEscape(this.formItem.talk);
                                if(this.formItem.href=='javascript:;')
                                {
                                    this.formItem.href='';
                                }
                            }
                        } else {
                            this.$Message.error('填写有误');
                        }
                    })
                }else{
                    this.$Message.warning('请一分钟后再评论');
                }
                
            
        },
        text(str){
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
            str = str.replace(/\s/g, ''); //将空格去掉
            return str;
        }
    },
    filters:{
        FontFilter(val){
            return val.substr(0,200)+'...'
        }
    },
    watch: {
        '$route'(to,from){
            this._getArticle();
        }
    },
}
</script>
<style scoped>
    @import url('./article.css');
    @import url('./articlemobile.css');
</style>