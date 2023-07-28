<template>
  <div id="practice">
    <!-- 长50px高60px的一个向上的三角形 -->
    <div class="a"></div>
    <!-- 一个直角三角形 -->
    <div class="b"></div>
    <!-- 制作一个长50 高60的向右直角三角形 -->
    <div class="c"></div>
  </div>
</template>
<style lang="scss">
#practice {
  display: flex;
  .a {
    height: 0;
    width: 0;
    border-bottom: 60px solid #000;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
  }
  .b {
    height: 0;
    width: 0;
    border-bottom: 60px solid transparent;
    border-left: 60px solid rgb(179, 24, 24);
  }
  .c {
    height: 0;
    width: 0;
    border-bottom: 60px solid #000;
    border-right: 60px solid transparent;
  }

}
</style>