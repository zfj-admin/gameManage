<template>
  123
  <Tree></Tree>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
let data = reactive([
  { name: "1", checked: false },
  {
    name: "2",
    checked: false,
    children: [
      {
        name: "2-1",
        checked: false,
      },
      { name: "2-2", checked: false },
    ],
  },
  {
    name: "3",
    checked: false,
    children: [
      {
        name: "3-1",
        checked: false,
        children: [
          { name: "3-1-1", checked: false },
          { name: "3-1-2", checked: false },
          { name: "3-1-3", checked: false },
        ],
      },
      { name: "3-2", checked: false },
      { name: "3-3", checked: false },
    ],
  },
]);
</script>
<style scoped lang="scss"></style>
