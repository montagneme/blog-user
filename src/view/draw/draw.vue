<template>
<div class="box">
    <canvas id="drawing-board"></canvas>
    <div class="color-group">
        <ul>
            <li id="white" class="color-item" style="background-color: white;"></li>
            <li id="black" class="color-item active" style="background-color: black;"></li>
            <li id="red" class="color-item" style="background-color: #FF3333;"></li>
            <li id="blue" class="color-item" style="background-color: #0066FF;"></li>
            <li id="yellow" class="color-item" style="background-color: #FFFF33;"></li>
            <li id="green" class="color-item" style="background-color: #33CC66;"></li>
            <li id="gray" class="color-item" style="background-color: gray;"></li>
        </ul>
    </div>
    <div id="range-wrap"><input type="range" id="range" min="1" max="30" value="5" title="调整笔刷粗细" style="background-color: unset;"></div>
    <div class="tools">
        <button id="brush" class="active" title="画笔"><i class="iconfont icon-qianbi"></i></button>
        <button id="eraser" title="橡皮擦"><i class="iconfont icon-xiangpi"></i></button>
        <button id="clear" title="清空"><i class="iconfont icon-qingchu"></i></button>
        <button id="undo" title="撤销"><i class="iconfont icon-chexiao"></i></button>
        <button id="save" title="保存"><i class="iconfont icon-fuzhi"></i></button>
    </div>
</div>
</template>
<script>
import { UploadCanvas } from '@/api/draw'
export default {
    data() {
        return {
            
        }
    },
    mounted() {
        
        let self=this;
        let canvas = document.getElementById("drawing-board");
        let ctx = canvas.getContext("2d");
        let eraser = document.getElementById("eraser");
        let brush = document.getElementById("brush");
        let reSetCanvas = document.getElementById("clear");
        let aColorBtn = document.getElementsByClassName("color-item");
        let save = document.getElementById("save");
        let undo = document.getElementById("undo");
        let range = document.getElementById("range");
        let clear = false;
        let activeColor = 'black';
        let lWidth = 4;

        autoSetSize(canvas,document.documentElement.clientWidth,document.documentElement.clientHeight);

        setCanvasBg('white');


        getColor();

        let loadImg=new Image();
        loadImg.src='../../knowledge/canvas.png';   //改
        loadImg.onload=()=>{
            if(IsPC())
            {
                let w=document.documentElement.clientWidth;
                let h=w/loadImg.width*loadImg.height;
                let t=(document.documentElement.clientHeight-h)/2;
                autoSetSize(canvas,w,h);
                listenToUser(canvas,t,0);
                ctx.drawImage(loadImg, 0, 0,w,h);
                canvas.style.top=t+'px';
            }else{
                // let h=document.documentElement.clientHeight;
                // let w=document.documentElement.clientHeight/loadImg.width*loadImg.height;
                // let l=(document.documentElement.clientWidth-w)/2;
                // autoSetSize(canvas,w,h);
                // listenToUser(canvas,0,l);
                // ctx.translate(w/2,h/2);
                // ctx.rotate(90 * Math.PI / 180);
                // ctx.drawImage(loadImg, -h/2,-w/2,h,w);
                // ctx.rotate(-90 * Math.PI / 180);
                // ctx.translate(-w/2,0-h/2);
                // canvas.style.left=l+'px';
                

                //直接旋转canvas，而不是旋转画布。
                let h=document.documentElement.clientHeight;
                let w=h/loadImg.width*loadImg.height;
                let l=(document.documentElement.clientWidth-h)/2;
                let t=(document.documentElement.clientHeight-w)/2;
                autoSetSize(canvas,h,w);
                listenToUser(canvas,0,(document.documentElement.clientWidth-w)/2,w);
                ctx.drawImage(loadImg,0,0,h,w);
                canvas.style.left=l+'px';
                canvas.style.top=t+'px';
                canvas.style.transform='rotate(90deg)';
                
            }
            
        }

        function IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
        function autoSetSize(canvas,w,h) {
            let pageWidth = w;
            let pageHeight = h;
            canvas.width = pageWidth;
            canvas.height = pageHeight;
        }

        function setCanvasBg(color) {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
        }

        function listenToUser(canvas,top,left,w = 0) {
            let painting = false;
            let lastPoint = {x: undefined, y: undefined};
            if (document.body.ontouchstart !== undefined) {
                canvas.ontouchstart = function (e) {
                    this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height);//在这里储存绘图表面
                    saveData(this.firstDot);
                    painting = true;
                    let y = e.touches[0].clientX-left;   //canvas
                    let x = e.touches[0].clientY-top;    //canvas
                    y=w-y;
                    lastPoint = {"x": x, "y": y}; 
                    ctx.save();
                    drawCircle(x, y, 0);
                };
                canvas.ontouchmove = function (e) {
                    if (painting) {
                        let y = e.touches[0].clientX-left;
                        let x = e.touches[0].clientY-top;
                        y=w-y;
                        let newPoint = {"x": x, "y": y};
                        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                        lastPoint = newPoint;
                    }
                    return false;
                };

                canvas.ontouchend = function () {
                    painting = false;
                }
            } else {
                canvas.onmousedown = function (e) {
                    this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height);//在这里储存绘图表面
                    saveData(this.firstDot);
                    painting = true;
                    let x = e.clientX-left;
                    let y = e.clientY-top;
                    lastPoint = {"x": x, "y": y};
                    ctx.save();
                    drawCircle(x, y, 0);
                };
                canvas.onmousemove = function (e) {
                    if (painting) {
                        let x = e.clientX-left;
                        let y = e.clientY-top;
                        let newPoint = {"x": x, "y": y};
                        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y,clear);
                        lastPoint = newPoint;
                    }
                };

                canvas.onmouseup = function () {
                    painting = false;
                };

                canvas.mouseleave = function () {
                    painting = false;
                }
            }
        }

        function drawCircle(x, y, radius) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            if (clear) {
                ctx.clip();
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.restore();
            }
        }

        function drawLine(x1, y1, x2, y2) {
            ctx.lineWidth = lWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            if (clear) {
                ctx.save();
                ctx.globalCompositeOperation = "destination-out";
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.closePath();
                ctx.clip();
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.restore();
            }else{
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.closePath();
            }
        }

        range.onchange = function(){
            lWidth = this.value;
        };

        eraser.onclick = function () {
            clear = true;
            this.classList.add("active");
            brush.classList.remove("active");
        };

        brush.onclick = function () {
            clear = false;
            this.classList.add("active");
            eraser.classList.remove("active");
        };

        reSetCanvas.onclick = function () {
            //先询问一下
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setCanvasBg('white');
        };

        save.onclick = function () {
            //保存
            //旋转canvas
            let imgUrl = canvas.toDataURL("image/png");
            UploadCanvas({data:imgUrl}).then((data)=>{
                if(data.data){
                    self.$Message.success('保存成功');
                }
            })
        };

        function getColor(){
            for (let i = 0; i < aColorBtn.length; i++) {
                aColorBtn[i].onclick = function () {
                    for (let i = 0; i < aColorBtn.length; i++) {
                        aColorBtn[i].classList.remove("active");
                        this.classList.add("active");
                        activeColor = this.style.backgroundColor;
                        ctx.fillStyle = activeColor;
                        ctx.strokeStyle = activeColor;
                    }
                }
            }
        }

        let historyDeta = [];

        function saveData (data) {
            (historyDeta.length === 10) && (historyDeta.shift());// 上限为储存10步，太多了怕挂掉
            historyDeta.push(data);
        }

        undo.onclick = function(){
            if(historyDeta.length < 1) return false;
            ctx.putImageData(historyDeta[historyDeta.length - 1], 0, 0);
            historyDeta.pop()
        };  
    },
}
</script>
<style scoped>
@import url('./draw.css');
</style>