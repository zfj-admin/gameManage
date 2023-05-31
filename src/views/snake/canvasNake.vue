<template>
  <div id="canvasNake">
    <canvas id="myCanvas" :width="props.siteSize * 15" :height="props.siteSize * 15"
      >你的浏览器不支持canvas，请升级浏览器</canvas
    >
    <div>
      <el-button
        type="primary"
        @click="startGame"
        :disabled="state.startDisabled"
        >开始</el-button
      >得分：{{ state.score }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, onMounted, defineProps } from "vue";

const props = withDefaults(
  defineProps<{
    siteSize: number;
    speed: number;
  }>(),
  {
    siteSize: 20,
    speed: 2,
  }
);
const state = reactive({
  canvas: null, //canvas对象
  ctx: null, //是js操作canvas的接口
  // 背景颜色
  gameBackground: "white",
  // 蛇的颜色
  snakeColor: "purple",
  // 蛇的边框颜色
  snakeBorder: "#ccc",
  // 食物颜色
  foodColor: "blue",
  // 画布宽度
  gameWidth: props.siteSize * 15,
  // 画布高度
  gameHeight: props.siteSize * 15,
  // 单位大小
  unitSize: 15,
  snake: [], //存储蛇的身体
  foodPosition: [], //食物的位置
  startDisabled: false, //控制开始按钮不能反复点击
  dir: "", //运动方向
  moveSetinterval: null, //定时器
  score: 0, //得分
});
onMounted(() => {
  state.canvas = document.getElementById("myCanvas");
  state.canvas.style.border = "1px solid #ccc";
  state.ctx = state.canvas?.getContext("2d");
});
// 随机生成一个点,保证生成的数字都是unitSize的倍数
const getPoint = () => {
  let point = [];
  point[0] =
    Math.round(
      (Math.random() * (state.gameWidth - state.unitSize)) / state.unitSize
    ) * state.unitSize;
  point[1] =
    Math.round(
      (Math.random() * (state.gameWidth - state.unitSize)) / state.unitSize
    ) * state.unitSize;
  console.log(point);
  return point;
};
// 渲染食物
const drawFood = (flag?: string) => {
  if (!flag) {
    state.foodPosition = getPoint();
    // 判断食物有没有生成到蛇的身上
    state.snake.forEach((ele) => {
      if (
        state.foodPosition[0] === ele[0] &&
        state.foodPosition[1] === ele[1]
      ) {
        drawFood();
        return;
      }
    });
  }
  state.ctx.fillStyle = state.foodColor;
  state.ctx.fillRect(
    state.foodPosition[0],
    state.foodPosition[1],
    state.unitSize,
    state.unitSize
  );
};

// 渲染蛇
const drawSnake = () => {
  state.ctx.fillStyle = state.snakeColor;
  state.ctx.strokeStyle = state.snakeBorder;
  state.snake.forEach((ele) => {
    state.ctx.fillRect(ele[0], ele[1], state.unitSize, state.unitSize);
    state.ctx.strokeRect(ele[0], ele[1], state.unitSize, state.unitSize);
  });
};
// 监听键盘事件，确定蛇的移动方向
const getDirection = (e: KeyboardEvent) => {
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
  // 键盘已经弹起，开始移动
  clearInterval(state.moveSetinterval);
  state.moveSetinterval = setInterval(move(), 200 * props.speed);
};
const move = () => {
  let newHead: number[] = [];
  let oldHead: number[] = state.snake[0];
  switch (state.dir) {
    case "T":
      newHead[0] = oldHead[0];
      newHead[1] = oldHead[1] - state.unitSize;
      break;
    case "B":
      newHead[0] = oldHead[0];
      newHead[1] = oldHead[1] + state.unitSize;
      break;
    case "L":
      newHead[0] = oldHead[0] - state.unitSize;
      newHead[1] = oldHead[1];
      break;
    case "R":
      newHead[0] = oldHead[0] + state.unitSize;
      newHead[1] = oldHead[1];
      break;
  }
  // 判断是否吃到食物
  state.snake.unshift(newHead);
  let eatFood: boolean = false;
  if (
    newHead[0] !== state.foodPosition[0] ||
    newHead[1] !== state.foodPosition[1]
  ) {
    // 没吃到食物
    state.snake.pop();
  } else {
    state.score++;
    eatFood = true;
  }
  // 判断是否撞墙、咬到自己或吃饱
  if (isSelf() || full() || isWall()) {
    clearInterval(state.moveSetinterval);
    window.removeEventListener("keyup", getDirection);
    state.startDisabled = false
    return move;
  }
  state.ctx.fillStyle = state.gameBackground;
  state.ctx.fillRect(0, 0, state.gameWidth, state.gameHeight);
  if (eatFood) {
    drawFood();
  } else {
    drawFood("noeat");
  }
  drawSnake();
  return move;
};
// 撞墙
const isWall = () => {
  let [x, y] = state.snake[0];
  if (
    x < 0 ||
    y < 0 ||
    x > state.gameWidth - state.unitSize ||
    y > state.gameWidth - state.unitSize
  ) {
    ElMessage.error("一头撞死！");
    return true;
  }
  return false;
};
// 咬到自己
const isSelf = () => {
  let [x, y] = state.snake[0];
  for (let i = 1; i < state.snake.length; i++) {
    if (x === state.snake[i][0] && y === state.snake[i][1]) {
      ElMessage.error("自己的肉，真香~");
      return true;
    }
  }
  return false;
};
// 吃饱
const full = () => {
  if (
    state.snake.length ===
    (state.gameWidth - state.unitSize) * (state.gameHeight - state.unitSize)
  ) {
    ElMessage.success("吃饱啦！");
    return true;
  }
  return false;
};
//开始游戏
const startGame = () => {
  // 开始按钮不能再点击
  state.startDisabled = true
  // 初始化蛇数据
  state.snake = [
    [state.unitSize, 0],
    [0, 0],
  ];
  // 初始化分数
  state.score = 0;
  //  初始化画布
  state.ctx.fillStyle = state.gameBackground;
  state.ctx.fillRect(0, 0, state.gameWidth, state.gameHeight);
  drawSnake();
  drawFood();
  window.addEventListener("keyup", getDirection);
};
</script>
<style scoped lang="scss">
#canvasNake {
}
</style>
