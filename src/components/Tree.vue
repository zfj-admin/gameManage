<template>
  <!-- <div v-for="item in data">{{ item.name }}</div> -->
  <div>1234</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

interface typeTree {
  name: string,
  checked: boolean,
  children?: []
}
// defineProps<{
//   data?: typeTree[];
// }>();
defineProps({
  data: Array
});
</script>
<style scoped lang="scss"></style>
