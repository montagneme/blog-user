<template>
<div class="box">
    <div class="cat">
        <iframe src="/blog/static/cat/index.html" frameborder="0" width="100%" height="100%" scrolling="no"></iframe>
    </div>
    <div class="module">
        <div class="module_box" v-for="item in info">
            <p class="module_title">{{item.title}}</p>
            <ul class="module_ul">
                <li v-for="tag in item.tags"  :style="{border:'1px solid rgb('+tag.color+')'}">
                    <a :href="tag.href" target="_blank" style="width: 100%;height: 100%;display:block;">
                        <img :src="tag.imgUrl" alt="" class="tag_img">
                        <div class="tag_box">
                            <p class="tag_title" :style="{color:'rgb('+tag.color+')'}">{{tag.title}}</p>
                            <p class="tag_content" :style="{color:'rgba('+tag.color+',0.8)'}">{{tag.content}}</p>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>
<script>
import { GetTags } from '@/api/tags'
export default {
    data() {
        return {
            info:[]
        }
    },
    created() {
        GetTags().then((data)=>{
            this.info=data.data;
        });
    },
}
</script>
<style scoped>
@import url('./knowledge.css');
@import url('./knowledgemobile.css');
</style>