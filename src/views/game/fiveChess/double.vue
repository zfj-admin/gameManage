<template>
  <el-tabs v-model="state.activeName">
    <el-tab-pane label="双人下棋" name="one">
      <div id="fiveChessContent" style="'font-color':'red'">
        <h3 v-if="state.win">
          恭喜{{ state.color === 1 ? "黑" : "白" }}胜利!!
        </h3>
        <h3 v-else>{{ state.color === 1 ? "黑" : "白" }}方下棋</h3>
        <canvas id="canvasChess" :width="state.siteSize*20" :height="state.siteSize*20"
          >你的浏览器不支持canvas，请升级浏览器</canvas
        >
        <div>
          <el-button type="primary" @click="initGame">{{
            state.startDisabled ? "重来" : "开始"
          }}</el-button>
          <el-button type="primary" @click="recallChess">悔棋</el-button>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="人机互弈" name="two"> 
      <Machine></Machine>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import Machine from './machine.vue'
const state = reactive({
  siteSize: 10, //棋盘大小 15 * 15
  startDisabled: false, //是否禁用开始按钮
  canvasChess: null, //canvas对象
  ctx: null, //操作画布的接口
  chessArr: [], //存储棋局，黑棋为1，白棋为2，未下棋显示0
  color: 1, //当前下棋颜色
  win: false,
  recallChessArr: [], //悔棋,用于存放下棋的顺序
  activeName: "one",
});
onMounted(() => {
  renderSite();
});
// 渲染棋盘
const renderSite = () => {
  state.canvasChess = document.getElementById("canvasChess");
  state.ctx = state.canvasChess?.getContext("2d");
  state.ctx.strokeStyle = "#ccc";
  for (let i = 0; i < state.siteSize; i++) {
    let temp = [];
    for (let j = 0; j < state.siteSize; j++) {
      temp.push(0);
      state.ctx.strokeRect(i * 20, j * 20, 20, 20);
    }
    state.chessArr.push(temp);
  }
};
// 判断胜负
const isWin = (a: number, b: number, color: number) => {
  // 判断此点延申的四条线路是否出现五子相连情况
  let [topBottomL, leftRightL, leftBottomL, rightBottomL] = [1, 1, 1, 1];
  let [top, bottom, left, right, leftTop, leftBottom, rightTop, rightBottom] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  for (let i = 1; i <= 4; i++) {
    // 不是相同颜色或者已经超出边界
    // 线路一：上下线路
    if (top && a - i >= 0 && state.chessArr[a - i][b] === color) {
      topBottomL++;
    } else {
      top = false;
    }
    if (
      bottom &&
      a + i < state.siteSize &&
      state.chessArr[a + i][b] === color
    ) {
      topBottomL++;
    } else {
      bottom = false;
    }
    // // 线路二：左右线路
    if (left && b - i >= 0 && state.chessArr[a][b - i] === color) {
      leftRightL++;
    } else {
      left = false;
    }
    if (right && b + i < state.siteSize && state.chessArr[a][b + i] === color) {
      leftRightL++;
    } else {
      right = false;
    }
    // // 线路三：左对角线
    if (
      leftTop &&
      a - i >= 0 &&
      b - i >= 0 &&
      state.chessArr[a - i][b - i] === color
    ) {
      leftBottomL++;
    } else {
      leftTop = false;
    }
    if (
      leftBottom &&
      a + i < state.siteSize &&
      b + i < state.siteSize &&
      state.chessArr[a + i][b + i] === color
    ) {
      leftBottomL++;
    } else {
      leftBottom = false;
    }
    // // 线路四：右对角线
    if (
      rightTop &&
      b + i < state.siteSize &&
      a - i >= 0 &&
      state.chessArr[a - i][b + i] === color
    ) {
      rightBottomL++;
    } else {
      rightTop = false;
    }
    if (
      rightBottom &&
      b - i >= 0 &&
      a + i < state.siteSize &&
      state.chessArr[a + i][b - i] === color
    ) {
      rightBottomL++;
    } else {
      rightBottom = false;
    }
    if (
      topBottomL >= 5 ||
      leftRightL >= 5 ||
      leftBottomL >= 5 ||
      rightBottomL >= 5
    ) {
      state.win = true;
      state.canvasChess.removeEventListener("mouseup", startGame);
      break;
    }
  }
};
// 画圆准备
const drawCircleReady = async (a: number, b: number) => {
  if (state.chessArr[b][a] !== 0) return;
  state.recallChessArr.push([b, a, state.color]);
  state.chessArr[b][a] = state.color;
  await drawCircle(a, b);
  state.color = state.color == 2 ? 1 : 2;
  // 判断胜负
  isWin(b, a, state.color);
};
// 画圆
const drawCircle = (a: number, b: number) => {
  state.ctx.beginPath();
  state.ctx.arc(a * 20, b * 20, 8, 0, 2 * Math.PI);
  state.ctx.fillStyle = state.chessArr[b][a] === 1 ? "black" : "white"; //设置填充颜色
  state.ctx.fill(); //开始填充
  state.ctx.closePath();
  state.ctx.stroke();
};
// 开始下棋
const startGame = (e: MouseEvent) => {
  drawCircleReady(Math.round(e.offsetX / 20), Math.round(e.offsetY / 20));
};
//开始游戏
const initGame = () => {
  state.chessArr = [];
  state.recallChessArr = [];
  state.color = 1;
  state.win = false;
  // 清空画布
  state.ctx.clearRect(0, 0, state.siteSize * 20, state.siteSize * 20);
  renderSite();
  // 监听鼠标按下抬起
  state.canvasChess.addEventListener("mouseup", startGame);
};
// 悔棋
const recallChess = () => {
  console.log(state.recallChessArr);
  if (state.recallChessArr.length) {
    let [x, y, z] = state.recallChessArr.pop();
    state.color = z;
    state.chessArr[x][y] = 0;
    againDrawSite();
  }
};
// 重新画棋盘
const againDrawSite = () => {
  // 清空画布
  state.ctx.clearRect(0, 0, state.siteSize * 20, state.siteSize * 20);
  for (let i = 0; i < state.siteSize; i++) {
    for (let j = 0; j < state.siteSize; j++) {
      state.ctx.strokeRect(i * 20, j * 20, 20, 20);
    }
  }
  for (let i = 0; i < state.chessArr.length; i++) {
    for (let j = 0; j < state.chessArr[i].length; j++) {
      if (state.chessArr[i][j] != 0) {
        drawCircle(j, i);
      }
    }
  }
};
</script>
<style lang="scss">
#fiveChessContent {
  #canvasChess {
    border: 1px solid #ccc;
    cursor: pointer;
    background-color: rgba(238, 238, 238, 0.3);
  }
}
</style>
