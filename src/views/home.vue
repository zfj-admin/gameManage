<template>
  <div id="common-layout">
    <div class="head">Header</div>
    <div class="container">
      <div class="aside">
        <el-menu
          :default-active="state.activeRouter"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          unique-opened
        >
          <el-sub-menu index="0">
            <template #title>
              <el-icon><location /></el-icon>
              <span>html+css</span>
            </template>
            <el-menu-item index="/">三角形</el-menu-item>
            <el-menu-item index="/waterfallWall">瀑布墙</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>vue3属性</span>
            </template>
            <el-menu-item index="/vue3/computed">computed</el-menu-item>
            <el-menu-item index="/vue3/father">组件传值</el-menu-item>
            <el-menu-item index="/vue3/treeComponent">递归组件</el-menu-item>
            <el-sub-menu index="1-4">
              <template #title>item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><location /></el-icon>
              <span>游戏管理</span>
            </template>
            <el-menu-item index="/game/snake">贪吃蛇</el-menu-item>
            <el-menu-item index="/game/chess">五子棋</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/abc">
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
import { watch, reactive } from "vue";
import {
  useRouter,
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";
const router = useRouter();
// 解决刷新之后，总是默认第一个菜单时激活状态
router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    state.activeRouter = to.path;
    next();
  }
);
const state = reactive({
  activeRouter: "/",
});
const handleSelect = (index:string) => {
  state.activeRouter = index;
  console.log(index);
  router.push({ path:index, });
}
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
      flex-basis: 250px;
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
