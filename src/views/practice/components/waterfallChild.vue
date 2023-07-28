<template>
  <div id="waterfall">
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
const props = defineProps({
  data: Array
})
const state = reactive({
  widthCol: 100,//每个瀑布的宽度
  col: 0,//总列数
  height: [],//存放所有列的高度
})
onMounted(() => {
  // 获取宽度，计算可以放多少列
  let waterfallDom = document.getElementById('waterfall')
  let totalWidth:number = waterfallDom?.offsetWidth || 0
  state.col = Math.floor(totalWidth / (state.widthCol + 10))
  state.height = new Array(state.col).fill(0)
  let fragment = document.createDocumentFragment()
  for(let i = 0; i < props.data.length; i++) {
    let div = document.createElement('div')
    div.classList.add('item')
    div.innerHTML = (i + 1).toString()
    div.style.color = '#fff'
    div.style.width = state.widthCol + 'px'
    div.style.height = props.data[i].height + 'px'
    div.style.backgroundColor = props.data[i].color
    let minCol = Math.min(...state.height)
    let minIndex = state.height.indexOf(minCol)
    div.style.left = minIndex * state.widthCol + minIndex * 10 + 'px'
    div.style.top = state.height[minIndex] + 'px'
    state.height[minIndex]  += props.data[i].height
    fragment?.appendChild(div)
  }
  waterfallDom?.appendChild(fragment)
})
</script>
<style lang="scss">
#waterfall {
  position: relative;
  width: 100%;
  .item {
    position: absolute;
  }
}
</style>