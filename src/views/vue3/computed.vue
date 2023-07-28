<template>
  <!-- 测试computed计算属性 -->
  模糊搜索：<input v-model="state.searchText"/>
  <table border style="border-collapse: collapse">
    <thead>
      <th>商品名称</th>
      <th>商品单价</th>
      <th>商品数量</th>
      <th>操作</th>
    </thead>
    <tbody>
      <tr v-for="(item ,index) in state.searchData" :key="item.name">
        <td align="center">{{ item.name }}</td>
        <td align="center">{{ item.price }}</td>
        <td align="center"><button @click="() => item.num > 1 ? item.num-- : null">-</button>{{ item.num }}<button @click="() => item.num++">+</button></td>
        <td align="center"><button @click="del(index)">删除</button></td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td align="right" colspan="5">总价：{{ total }}</td>
      </tr>
    </tfoot>
  </table>
  <!-- 测试watch -->
  <input v-model="a.b.c"/>
</template>
<script setup lang="ts">
import { computed, reactive,watch,ref} from "vue";

const state = reactive({
  formData: [
    {
      name: "帽子",
      price: 20,
      num: 1,
    },
    {
      name: "衣服",
      price: 200,
      num: 1,
    },
    {
      name: "裤子",
      price: 80,
      num: 1,
    },
  ],
  searchText: '',//模糊搜索
  searchData:[],//搜索
});

// 计算总数
 let total = computed(() => {
  return state.searchData.reduce((prev:number,cur:{num:number,price:number}) => {
    return prev + cur.num * cur.price
  }, 0)
 })

 //模糊搜索
 state.searchData = computed(() => {
  return state.formData.filter((item:{name:string}) => {
    // return item.name.indexOf(state.searchText) != -1
    return item.name.includes(state.searchText)
  })
 })
//  watch
 let a = reactive({b:{c:'e'}})
watch(a,(newValue, oldValue) => {
  console.log(newValue);
})
// 删除
const del = (index: number) => {
  state.formData.splice(index, 1)
  console.log(state.formData);
  
}
// map方法，会根据return的语句，返回符合条件的新的数组，这个例子会返回所有id组成的数组
let arr = [{id:'1',name:'we'},{id:'1',name:'we'},{id:'1',name:'we'},{id:'1',name:'we'},{id:'1',name:'we'}]
const abc = () => {
  let b = arr.map(item => item.id)
  console.log(b);
} 
abc()
</script>
<style lang="sss" scoped></style>
