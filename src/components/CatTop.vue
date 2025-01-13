<template>
    <div class="cats" :style="{ top: catsTop }" ref="cats" @click="catTop">fasdfsd      </div>
</template>
 
<script  setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
const cats = ref(null);
const catsTop = ref('-80px')
let doctH = 0 // 文档高度
let viewH = 0 // 可视区域高度

//点击后跳转至顶部
const catTop = () => {
    document.documentElement.scrollTop = document.body.scrollTop = 0
}

//滚动时运行代码，用于计算滚动位置
const calcScroll = () => {
    const scroll = document.documentElement.scrollTop || document.body.scrollTop
    const hideH = doctH - viewH
    let rate = scroll / hideH
    if (rate >= 1) {
        rate = 1
    }
    // console.log(rate);
    const result = Math.floor(viewH * rate)
    catsTop.value = `${result - 128}px`
    doctH === scroll + viewH ? cats.value?.classList.add('bottom') : cats.value?.classList.remove('bottom')
    console.log('test')
}

onMounted(async () => {
    await nextTick(() => {
        //将浏览器视口中可视区域的高度（不包括滚动条、工具栏等）赋值给变量 doctH
        doctH = document.body.clientHeight
        //获取浏览器视口高度的标准属性
        viewH = window.innerHeight || document.documentElement.clientHeight
        console.log(doctH, viewH);
        window.addEventListener('scroll', calcScroll)
    })
})

onUnmounted(() => {
    window.removeEventListener('scroll', calcScroll)

})
</script>
 
<style scoped>
/* 回到顶部 - 小猫咪 */
.cats {
    position: fixed;
    right: 56px;
    top: 0px;
    z-index: 9999;
    width: 64px;
    height: 64px;
    transform: translateX(50%);
    background: url('/src/assets/logo.jpg') no-repeat center center / contain;
    cursor: pointer;
}

.cats::after {
    position: absolute;
    content: '到底啦～';
    right: 55%;
    top: -110%;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('/src/assets/vue.svg') no-repeat center center / contain;
    font-size: 14px;
    color: rgb(57, 197, 187);
    padding-top: 6px;
    box-sizing: border-box;
    opacity: 0;
    transition: all .2s ease-in-out;
    pointer-events: none;
}

.cats.bottom::after {
    opacity: 1;
}
</style>