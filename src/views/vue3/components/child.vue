<template>
  <h3>这是子组件，接收到的数据：{{ num }}</h3>
  <button @click="toValue">点击查看子组件传给父组件的值</button>
  <div>这是父组件调用子组件方法的结果：{{ abc }}</div>
  
</template>

<script setup lang="ts">
import {ref} from 'vue'
type Props = {
  num?: number[]
}
withDefaults(defineProps<Props>(), {
  // 复杂数据类型要使用函数的方式
  num: () => [1,2,3]
})

const emits = defineEmits(['getValue'])
const toValue = () => {
  emits('getValue', '啦啦啦')
}
let abc = ref('')
const childFn = () => {
 abc.value = '子组件的方法被父组件调用了'
}
defineExpose({
  childFn
})
</script>
<style scoped lang="scss">
</style>