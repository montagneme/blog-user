<template>
<div class="box">
    <div class="share_box">
        <ul class="share_list">
            <li v-for="item in shareList" @mouseover="ShareHover(item.id)"  @touchstart="ShareHover(item.id)">
                <a :href="item.href" target="_blank">
                    <div class="share_img_box">
                        <transition name="share">
                            <div class="share_content_box" v-if="shareHoverId==item.id">
                                <p class="share_title">{{item.title}}</p>
                                <p class="share_content">{{item.content}}</p>
                                <p class="share_author">—— 制作人：{{item.author}}</p>
                            </div>
                        </transition>
                        <img :src="item.src" alt="" class="share_img">
                    </div>
                    <transition name="share_tag">
                         <Tag :color="$store.state.tag[item.tag]" class="share_tag" v-if="shareHoverId==item.id">{{item.tag}}</Tag>
                    </transition>
                </a>
            </li>
            <div class="clear"></div>
        </ul>
    </div>
</div>  
</template>
<script>
import { GetShare } from '@/api/tags'
export default {
    data() {
        return {
            shareHoverId:0,
            shareList:[]
        }
    },
    created() {
        this.GetShare();
    },
    methods: {
        GetShare(){
            GetShare().then((data)=>{
                this.shareList=data.data;
            })
        },
        ShareHover(id){
            this.shareHoverId=id;
        }
    },
}
</script>
<style scoped>
@import url('./share.css');
@import url('./sharemobile.css');
</style>