<template>
  <div id="app">
    <main-layout v-if="!isLogin"> </main-layout>
    <router-view v-if="isLogin"></router-view>
  </div>
</template>

<script>
import MainLayout from "./layouts/MainLayout";

export default {
  name: "App",
  components: {
    MainLayout,
  },
  data() {
    return {
      isLogin: /login/g.test(location.href),
    };
  },
};
</script>
<style lang="less">
@import "./styles/reset.less";
@import "./styles/common.less";
</style>
<style>

</style>
