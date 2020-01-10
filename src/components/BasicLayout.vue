<template>
  <el-container>
    <el-header>
      网易云音乐MV 提取
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "BasicLayout"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-container {
  width: 1400px;
  margin: 0 auto;
}
.el-header {
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 34px;
  border-bottom: 2px solid #eeeeee;
}
</style>
