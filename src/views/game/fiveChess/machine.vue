<template>
  <div id="fiveChessContent">
    <h3 v-if="state.win">恭喜{{ state.color === 1 ? "黑" : "白" }}胜利!!</h3>
    <h3 v-else>{{ state.color === 1 ? "黑" : "白" }}方下棋</h3>
    <canvas id="canvasChessM" :width="state.siteSize*20" :height="state.siteSize*20"
      >你的浏览器不支持canvas，请升级浏览器</canvas
    >
    <div>
      <el-button type="primary" @click="startGame">{{
        state.startDisabled ? "重来" : "开始"
      }}</el-button>
      <el-button type="primary" @click="recallChess">悔棋</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
const state = reactive({
  siteSize: 10, //棋盘大小 15 * 15
  startDisabled: false, //是否禁用开始按钮
  canvasChess: null, //canvas对象
  ctx: null, //操作画布的接口
  chessArr: [], //存储棋局，黑棋为1，白棋为2，未下棋显示0
  color: 1, //当前下棋颜色
  win: false,
  recallChessArr: [], //悔棋,用于存放下棋的顺序
  score: [], //用于计算空白位置的分值
});
// 渲染棋盘
const renderSite = () => {
  state.ctx?.clearRect(0, 0, state.siteSize * 20, state.siteSize * 20);
  state.color = 1
  state.win = false
  state.startDisabled = true
  state.chessArr = []
  state.score = []
  state.canvasChess = document.getElementById("canvasChessM");
  state.ctx = state.canvasChess?.getContext("2d");
  state.ctx.strokeStyle = "#ccc";
  for (let i = 0; i < state.siteSize; i++) {
    let temp = [];
    for (let j = 0; j < state.siteSize; j++) {
      state.ctx.strokeRect(i * 20, j * 20, 20, 20);
      temp.push(0);
    }
    state.chessArr.push(temp);
    state.score.push(temp.slice());
  }
};
// 判断胜负
const isWin = (a: number, b: number, color: number) => {
  // 以此点为圆心，判断四条线是否能连成五子
  let [top, left, leftBottom, rightBottom] = [1, 1, 1, 1];
  // 判断纵向
  for (let i = 1; i <= 4; i++) {
    if (b - i >= 0 && state.chessArr[b - i][a] === color) {
      top++;
    } else {
      break;
    }
  }
  for (let i = 1; i <= 4; i++) {
    if (b + i < state.siteSize && state.chessArr[b + i][a] === color) {
      top++;
    } else {
      break;
    }
  }
  // 判断横向
  for (let i = 1; i <= 4; i++) {
    if (a - i >= 0 && state.chessArr[b][a - i] === color) {
      left++;
    } else {
      break;
    }
  }
  for (let i = 1; i <= 4; i++) {
    if (a + i < state.siteSize && state.chessArr[b][a + i] === color) {
      left++;
    } else {
      break;
    }
  }
  // 判断左斜线
  for (let i = 1; i <= 4; i++) {
    if (b - i >= 0 && a - i >= 0 && state.chessArr[b - i][a - i] === color) {
      leftBottom++;
    } else {
      break;
    }
  }
  for (let i = 1; i <= 4; i++) {
    if (
      b + i < state.siteSize &&
      a + i < state.siteSize &&
      state.chessArr[b + i][a + i] === color
    ) {
      leftBottom++;
    } else {
      break;
    }
  }
  // 判断右斜线
  for (let i = 1; i <= 4; i++) {
    if (
      b - i >= 0 &&
      a + i < state.siteSize &&
      state.chessArr[b - i][a + i] === color
    ) {
      rightBottom++;
    } else {
      break;
    }
  }
  for (let i = 1; i <= 4; i++) {
    if (
      b + i < state.siteSize &&
      a - i >= 0 &&
      state.chessArr[b + i][a - i] === color
    ) {
      rightBottom++;
    } else {
      break;
    }
  }
  if (top >= 5 || left >= 5 || leftBottom >= 5 || rightBottom >= 5) {
    state.win = true;
    return true;
  }
};
// 画圆
const drawCircle = (a: number, b: number, color:number, flag?:string) => {
  state.ctx.beginPath();
  state.ctx.arc(a * 20, b * 20, 8, 0, 2 * Math.PI);
  state.ctx.fillStyle = color === 1 ? "black" : "white";
  state.ctx.fill();
  state.ctx.closePath();
  state.ctx.stroke();
  state.chessArr[b][a] = color;
  if(flag != 'huiqi') {
    state.recallChessArr.push([a,b,color])
  }
  // 下子之后判断是否胜利
  if (isWin(a, b, color)) {
    return;
  } 
  state.color = color === 1 ? 2 : 1;
};
// 计分表
const chessScore = (playerNum: number, computerNum: number) => {
  // 这个五元组中既有机器落子又有计算机落子，则分数为0
  if (playerNum > 0 && computerNum > 0) {
    return 0;
  }
  // 全部为空没有棋子，14
  if (playerNum == 0 && computerNum == 0) {
    return 14;
  }
  // 机器有一子，70
  if (computerNum == 1) {
    return 70;
  }
  // 有两子，1600
  if (computerNum === 2) return 1600;

  // 有三子，30000
  if (computerNum === 3) return 30000;
  // 有四子，1600000
  if (computerNum === 4) return 1600000;
  // 玩家有一子 30
  if (playerNum === 1) return 30;
  // 玩家有两子 800
  if (playerNum === 2) return 800;
  // 玩家有三子 3600
  if (playerNum === 3) return 3600;
  // 玩家有四子200000
  if (playerNum === 4) return 200000;
  // 其它情况 return -1
  return -1;
};
// 计算机下棋
const computerAI = () => {
  // 计算所有位置可能赢的情况
  let playerNum = 0;
  let computerNum = 0;
  let tempScore = 0;
  let maxScore = -1;
  let maxScoreX = 0;
  let maxScoreY = 0;
  // 计算所有横向的
  for (let i = 0; i < state.siteSize; i++) {
    for (let j = 0; j < state.siteSize - 4; j++) {
      for (let k = j; k < j + 5; k++) {
        if (state.chessArr[i][k] === 1) {
          playerNum++;
        } else if (state.chessArr[i][k] === 2) {
          computerNum++;
        }
      }
      tempScore = chessScore(playerNum, computerNum);
      for (let k = j; k < j + 5; k++) {
        state.score[i][k] += tempScore;
      }
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }

  // 计算所有竖向的空白位置得分
  for (let i = 0; i < state.siteSize; i++) {
    for (let j = 0; j < state.siteSize - 4; j++) {
      for (let k = j; k < j + 5; k++) {
        if (state.chessArr[k][i] === 1) {
          playerNum++;
        } else if (state.chessArr[k][i] === 2) {
          computerNum++;
        }
      }
      tempScore = chessScore(playerNum, computerNum);
      for (let k = j; k < j + 5; k++) {
        state.score[k][i] += tempScore;
      }
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }

  // 计算所有正斜线上的空白位置得分
  for (let i = 0; i < state.siteSize - 4; i++) {
    for (let j = 0; j < state.siteSize - 4; j++) {
      for (let k = 0; k < 5; k++) {
        if (state.chessArr[i + k][j + k] === 1) {
          playerNum++;
        } else if (state.chessArr[i + k][j + k] === 2) {
          computerNum++;
        }
      }
      tempScore = chessScore(playerNum, computerNum);
      for (let k = 0; k < 5; k++) {
        state.score[i + k][j + k] += tempScore;
      }
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }

  // 计算所有反斜线上的空白位置得分
  for (let i = 0; i < state.siteSize - 4; i++) {
    for (let j = state.siteSize - 1; j > 3; j--) {
      for (let k = 0; k < 5; k++) {
        if (state.chessArr[i + k][j - k] === 1) {
          playerNum++;
        } else if (state.chessArr[i + k][j - k] === 2) {
          computerNum++;
        }
      }
      tempScore = chessScore(playerNum, computerNum);
      for (let k = 0; k < 5; k++) {
        state.score[i + k][j - k] += tempScore;
      }
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }
  console.log(state.score);
  // 从空位置中找到得分最大的位置
  for (let i = 0; i < state.siteSize; i++) {
    for (let j = 0; j < state.siteSize; j++) {
      if (state.chessArr[i][j] == 0 && state.score[i][j] > maxScore) {
        maxScoreX = i;
        maxScoreY = j;
        maxScore = state.score[i][j];
      }
    }
  }
  // 找出最大分值的坐标
  return [maxScoreX, maxScoreY];
};
// 开始下棋
const startGame = () => {
  state.recallChessArr = []
  renderSite()
  state.canvasChess.addEventListener("mouseup", (e: MouseEvent) => {
    if (!state.win && state.color == 1 && state.chessArr[Math.round(e.offsetY / 20)][Math.round(e.offsetX / 20)] === 0) {      
      drawCircle(Math.round(e.offsetX / 20), Math.round(e.offsetY / 20),state.color);
      // 计算机下棋
      let [computerX, computerY] = computerDown();
      // let [computerX, computerY] = computerAI();
      drawCircle(computerY, computerX,state.color);
      
    }
  });
};
// 悔棋
const recallChess = () => {
  if(state.recallChessArr.length < 2) return
  state.recallChessArr.length = state.recallChessArr.length - 2
  renderSite()
  for(let i = 0; i < state.recallChessArr.length; i++) {
    drawCircle(...state.recallChessArr[i],'huiqi')
  }
};
const computerDown = () => {
  // 五元组中黑棋(玩家)数量
  let playerNum = 0;
  // 五元组中白棋(电脑)数量
  let computerNum = 0;
  // 五元组临时得分
  let tempScore = 0;
  // 最大得分
  let maxScore = -1;
  let maxScoreX = 0;
  let maxScoreY = 0;

  // 横向寻找
  for (let i = 0; i < state.siteSize; i++) {
    for (let j = 0; j < state.siteSize - 4; j++) {
      for (let k = j; k < j + 5; k++) {
        // 如果是玩家落得子
        if (state.chessArr[k][i] == 1) {
          playerNum++;
        } else if (state.chessArr[k][i] == 2) {
          //如果是电脑落子
          computerNum++;
        }
      }
      // 将每一个五元组中的黑棋和白棋个数传入评分表中
      tempScore = chessScore(playerNum, computerNum);
      // 为该五元组的每个位置添加分数
      for (let k = j; k < j + 5; k++) {
        state.score[k][i] += tempScore;
      }
      // 清空五元组中棋子数量和五元组临时得分
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }

  // 纵向寻找
  for (let i = 0; i < state.siteSize; i++) {
    for (let j = 0; j < state.siteSize - 4; j++) {
      for (let k = 0; k < j + 5; k++) {
        if (state.chessArr[i][k] == 1) {
          playerNum++;
        } else if (state.chessArr[i][k] == 2) {
          computerNum++;
        }
      }
      tempScore = chessScore(playerNum, computerNum);
      for (let k = j; k < j + 5; k++) {
        state.score[i][k] += tempScore;
      }
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }

  // 反斜线寻找

  // 反斜线上侧部分
  for (let i = state.siteSize - 1; i >= 4; i--) {
    for (let k = i, j = 0; j < state.siteSize && k >= 0; j++, k--) {
      let m = k; //x 14 13
      let n = j; //y 0  1
      for (; m > k - 5 && k - 5 >= -1; m--, n++) {
        if (state.chessArr[m][n] == 1) {
          playerNum++;
        } else if (state.chessArr[m][n] == 2) {
          computerNum++;
        }
      }
      // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
      if (m == k - 5) {
        tempScore = chessScore(playerNum, computerNum);
        for (m = k, n = j; m > k - 5; m--, n++) {
          state.score[m][n] += tempScore;
        }
      }
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }
  // 反斜线下侧部分
  for (let i = 1; i < state.siteSize; i++) {
    for (
      let k = i, j = state.siteSize - 1;
      j >= 0 && k < state.siteSize;
      j--, k++
    ) {
      let m = k; //y 1
      let n = j; //x 14
      for (; m < k + 5 && k + 5 <= state.siteSize; m++, n--) {
        if (state.chessArr[n][m] == 1) {
          playerNum++;
        } else if (state.chessArr[n][m] == 2) {
          computerNum++;
        }
      }
      // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
      if (m == k + 5) {
        tempScore = chessScore(playerNum, computerNum);
        for (m = k, n = j; m < k + 5; m++, n--) {
          state.score[n][m] += tempScore;
        }
      }
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }

  // 正斜线寻找

  // 正斜线上侧部分
  for (let i = 0; i < state.siteSize - 1; i++) {
    for (let k = i, j = 0; j < state.siteSize && k < state.siteSize; j++, k++) {
      let m = k;
      let n = j;
      for (; m < k + 5 && k + 5 <= state.siteSize; m++, n++) {
        if (state.chessArr[m][n] == 1) {
          playerNum++;
        } else if (state.chessArr[m][n] == 2) {
          computerNum++;
        }
      }
      // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
      if (m == k + 5) {
        tempScore = chessScore(playerNum, computerNum);
        for (m = k, n = j; m < k + 5; m++, n++) {
          state.score[m][n] += tempScore;
        }
      }
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }

  // 正斜线下侧部分
  for (let i = 1; i < state.siteSize - 4; i++) {
    for (let k = i, j = 0; j < state.siteSize && k < state.siteSize; j++, k++) {
      let m = k;
      let n = j;
      for (; m < k + 5 && k + 5 <= state.siteSize; m++, n++) {
        if (state.chessArr[n][m] == 1) {
          playerNum++;
        } else if (state.chessArr[n][m] == 2) {
          computerNum++;
        }
      }
      // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
      if (m == k + 5) {
        tempScore = chessScore(playerNum, computerNum);
        for (m = k, n = j; m < k + 5; m++, n++) {
          state.score[n][m] += tempScore;
        }
      }
      playerNum = 0;
      computerNum = 0;
      tempScore = 0;
    }
  }

  // 从空位置中找到得分最大的位置
  for (let i = 0; i < state.siteSize; i++) {
    for (let j = 0; j < state.siteSize; j++) {
      if (state.chessArr[i][j] == 0 && state.score[i][j] > maxScore) {
        maxScoreX = i;
        maxScoreY = j;
        maxScore = state.score[i][j];
      }
    }
  }
  return [maxScoreX, maxScoreY];
};
</script>
<style lang="scss">
#fiveChessContent {
  #canvasChessM {
    border: 1px solid #ccc;
    cursor: pointer;
    background-color: rgba(238, 238, 238, 0.3);
    box-sizing: border-box;
  }
}
</style>
