<template>
<div class="box">
    <div class="not">404</div>
</div>
</template>
<script>
import $ from 'jquery'
export default {
    data() {
        return {
            
        }
    },
    mounted() {
        this.ShadowMove();
    },
    methods: {
        ShadowMove(){
            let x=Number.parseInt($('.not').width())/2+Number.parseInt($('.not').css('marginLeft'));
            let y=Number.parseInt($('.not').height())/2+Number.parseInt($('.not').css('marginTop'));
            let m_x,m_y;
            $(document).on('mousemove',(ev)=>{Move(ev)});
            function Move(ev){
                let oe=ev||event;
                m_x=(x-oe.clientX)/100;
                m_y=(y-oe.clientY)/50;
                $('.not').css({
                    textShadow:`${m_x}px ${m_y}px 10px rgb(230,230,230)`,
                    transform:`translateZ(50px) translateX(${m_x*2}px) translateY(${m_y*2}px) rotateX(${m_y*2}deg) rotateY(${-m_x*2}deg)`,
                });
            }
        }
    },
}
</script>
<style scoped>
@import url('./not.css');
@import url('./notmobile.css');
</style>