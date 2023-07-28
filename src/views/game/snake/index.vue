<template>
  <div id="snakeContainer">
    <el-row>
      <el-col :span="6">
        <el-form-item label="请选择场地大小：">
          <el-select
            v-model="state.siteSize"
            class="m-2"
            placeholder="Select"
            @change="renderSite"
          >
            <el-option
              v-for="item in state.siteSizeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="请选择速度：">
          <el-select v-model="state.speed" class="m-2" placeholder="Select">
            <el-option
              v-for="item in state.speedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-tabs v-model="state.activeName">
      <el-tab-pane label="JS版本" name="one">
        <div class="square"></div>
        <div>
          <el-button
            type="primary"
            @click="startGame"
            :disabled="state.startDisabled"
            >开始</el-button
          >得分：{{ state.score }}
        </div>
      </el-tab-pane>
      <el-tab-pane label="canvas版本" name="two">
        <canvasnake
          :siteSize="state.siteSize"
          :speed="state.speed"
        ></canvasnake>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import canvasnake from "./canvasNake.vue";
let state = reactive({
  siteSize: 10, //场地大小
  speed: 2, //运动速度
  siteSizeOptions: [
    {
      value: 10,
      label: "10*10",
    },
    {
      value: 20,
      label: "20*20",
    },
    {
      value: 30,
      label: "30*30",
    },
  ], //场地选项
  speedOptions: [
    {
      value: 3,
      label: "慢",
    },
    {
      value: 2,
      label: "中",
    },
    {
      value: 1,
      label: "快",
    },
  ], //速度选项
  snake: [], //存储蛇的身体
  foodPosition: [], //食物的位置
  startDisabled: false, //控制开始按钮不能反复点击
  dir: "", //运动方向
  moveSetinterval: null, //定时器
  interval: false, //不能连续按下键盘
  score: 0, //得分
  activeName: "one", //当前正在展示的tab
});
onMounted(() => {
  renderSite();
});
// 渲染场地
const renderSite = () => {
  let square = document.querySelector(".square");
  square?.replaceChildren();
  for (let i = 0; i < state.siteSize; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < state.siteSize; j++) {
      let col = document.createElement("div");
      col.classList.add("col", `c${i}-${j}`);
      row.appendChild(col);
    }
    square?.appendChild(row);
  }
};
// 随机生成一个点
const getPoint = () => {
  let x = Math.floor(Math.random() * state.siteSize);
  let y = Math.floor(Math.random() * state.siteSize);
  return [x, y];
};
// 随机生成食物的位置
const getFoodLocation = () => {
  let location = getPoint();
  // 判断食物有没有生成到蛇身上
  for (let i = 0; i < state.snake.length; i++) {
    if (
      location[0] === state.snake[i][0] &&
      location[1] === state.snake[i][1]
    ) {
      getFoodLocation();
      return;
    }
  }
  // 先移除原来的食物
  let foorPre = document.querySelector(
    `.c${state.foodPosition[0]}-${state.foodPosition[1]}`
  );
  foorPre?.classList.remove("food");
  let foodDiv = document.querySelector(`.c${location[0]}-${location[1]}`);
  foodDiv?.classList.add("food");
  state.foodPosition = location;
  // return [x,y]
};
// 渲染蛇身
const drawSnake = (flag: string) => {
  // 1.初始情况，只渲染
  // 2.正常移动，加一个头，去掉一个尾巴
  // 3.吃到食物，加一个头，尾巴保持不动
  let snakeH = state.snake[0];
  let snakeT = state.snake[state.snake.length - 1];
  let snakeDiv = document.querySelector(`.c${snakeH[0]}-${snakeH[1]}`);
  if (flag === "init") {
    for (let i = 0; i < state.snake.length; i++) {
      let snakeDiv = document.querySelector(
        `.c${state.snake[i][0]}-${state.snake[i][1]}`
      );
      snakeDiv?.classList.add("snake");
    }
  } else if (flag === "movebody") {
    snakeDiv?.classList.add("snake");
    let snakeTail = document.querySelector(`.c${snakeT[0]}-${snakeT[1]}`);
    snakeTail?.classList.remove("snake");
    state.snake.pop();
  } else {
    snakeDiv?.classList.add("snake");
  }
};
// 开始游戏
const startGame = async () => {
  state.startDisabled = true;
  state.snake = [
    [0, 1],
    [0, 0],
  ];
  // 初始化分数
  state.score = 0;
  state.food = [];
  await renderSite();
  await drawSnake("init");
  await getFoodLocation();
  window.addEventListener("keyup", moveReady);
};
// 移动前的准备
const moveReady = (e: KeyboardEvent) => {
  if (state.interval) return;
  switch (e.code) {
    case "ArrowLeft":
      if (state.dir !== "R") state.dir = "L";
      break;
    case "ArrowUp":
      if (state.dir !== "B") state.dir = "T";
      break;
    case "ArrowRight":
      if (state.dir !== "L") state.dir = "R";
      break;
    case "ArrowDown":
      if (state.dir !== "T") state.dir = "B";
      break;
  }
  console.log(state.dir);
  state.interval = true;
  state.moveSetinterval && clearInterval(state.moveSetinterval);
  state.moveSetinterval = setInterval(move(), 200 * state.speed);
};
// 开始移动
const move = () => {
  let headPre = state.snake[0];
  let headNext = [];
  switch (state.dir) {
    case "L":
      headNext[0] = headPre[0];
      headNext[1] = headPre[1] - 1;
      break;
    case "T":
      headNext[0] = headPre[0] - 1;
      headNext[1] = headPre[1];
      break;
    case "R":
      headNext[0] = headPre[0];
      headNext[1] = headPre[1] + 1;
      break;
    case "B":
      headNext[0] = headPre[0] + 1;
      headNext[1] = headPre[1];
      break;
  }
  state.snake.unshift(headNext);
  // 判断是否吃到食物
  if (
    headNext[0] === state.foodPosition[0] &&
    headNext[1] === state.foodPosition[1]
  ) {
    // 吃到食物
    // 重新生成一个食物
    state.score++;
    getFoodLocation();
    drawSnake("addbody");
  } else {
    drawSnake("movebody");
  }

  if (isWall() || biteSelf() || snakeFull()) {
    // 清除定时器
    clearInterval(state.moveSetinterval);
    // 清除监听
    window.removeEventListener("keyup", moveReady);
    // 解除开始按钮的禁用
    state.startDisabled = false;
    return move;
  }
  state.interval = false;
  return move;
};
// 判断撞墙
const isWall = () => {
  let [x, y] = state.snake[0];
  if (x < 0 || y < 0 || x >= state.siteSize || y >= state.siteSize) {
    ElMessage.error("一头撞死！");
    return true;
  }
  return false;
};
// 判断咬到自己
const biteSelf = () => {
  let head = state.snake[0];
  for (let i = 1; i < state.snake.length; i++) {
    if (head[0] === state.snake[i][0] && head[1] === state.snake[i][1]) {
      ElMessage.error("自己的肉，真香~");
      return true;
    }
  }
  return false;
};
// 判断吃饱
const snakeFull = () => {
  if (state.snake.length >= Math.pow(state.siteSize, 2)) {
    ElMessage.success("吃饱啦！");
    return true;
  }
  return false;
};
</script>
<style lang="scss">
#snakeContainer {
  height: 100%;
  .square {
    display: inline-block;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  .row {
    display: flex;
    box-sizing: border-box;

    .col {
      height: 15px;
      width: 15px;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
    .food {
      background-color: blue;
    }
    .snake {
      background-color: purple;
    }
  }
}
</style>
