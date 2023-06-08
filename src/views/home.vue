<template>
  <div id="common-layout">
    <div class="head">Header</div>
    <div class="container">
      <div class="aside">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            <el-icon><KnifeFork /></el-icon>
            <span>贪吃蛇</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><icon-menu /></el-icon>
            <span>五子棋</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><document /></el-icon>
            <span>Navigator Three</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><setting /></el-icon>
            <span>Navigator Four</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";

import { useRouter } from "vue-router";
const router = useRouter();
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
  switch (key) {
    case "1":
      router.push("/");
      break;
    case "2":
      router.push("chess");
      break;
    default:
    router.push("/");
      break;
  }
};
</script>
<style scoped lang="scss">
@import "@/styles/variables.scss";
#common-layout {
  height: 100%;
  width: 100%;
  .head {
    height: 100px;
    background-color: $color-primary;
    line-height: 100px;
  }
  .container {
    display: flex;
    height: calc(100% - 100px);
    .aside {
      flex-basis: 200px;
      height: 100%;
      overflow: auto;
      border-right: solid 1px #dcdfe6;
      .el-menu {
        border: none;
      }
    }
    ::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px !important;
    }
    ::-webkit-scrollbar-thumb {
      /*滚动条里面的滑块*/
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.1);
    }
    ::-webkit-scrollbar-track {
      /*滚动条里面轨道背景*/
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.1);
    }
    .main {
      flex-grow: 1;
      height: 100%;
      overflow: auto;
      padding: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
