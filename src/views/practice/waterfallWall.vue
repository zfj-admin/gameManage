<template>
  <WaterfallChild :data="data"></WaterfallChild>
</template>

<script setup lang="ts">
import { reactive} from 'vue'
import WaterfallChild from './components/waterfallChild.vue';
const data = reactive([])
const randerData = () => {
  let colorList = ['#000000','#C0C0C0','#808080','#FF0000','#8B0000','#FFA500','#FFFF00','#008000','#00FFFF','#008B8B','#0000FF','#00008B','#800080','#4B0082','#FFC0CB']
  for(let i = 0; i < 50; i++) {
    let obj = {
      color: colorList[Math.floor(Math.random() * colorList.length)],
      height: Math.ceil(Math.random() * 200 + 100)//100-300以内的高度,
    }
    data.push(obj)
  }
}
randerData()
</script>
<style scoped lang="scss">
</style>