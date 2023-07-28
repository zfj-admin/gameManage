<template>
  <div>
    <h3>这是父组件</h3>
    <div>子组件传递的值是：{{ childValue }}</div>
    <el-button @click="callChildFn">点击按钮调用子组件的方法</el-button>
    <hr>
    <Child ref="childDom" :num="num" @get-value="getValue"></Child>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive} from 'vue'
import Child from './components/child.vue'
let num = reactive([3,4,5])
let childValue = ref('')
const getValue = (val) => {
  childValue.value = val
}
const childDom = ref(null)
const callChildFn = () => {
  childDom.value.childFn()
}
</script>
<style scoped lang="scss">
</style>