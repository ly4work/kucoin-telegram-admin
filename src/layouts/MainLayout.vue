<template>
  <el-container style="height: 100%">
    <el-header id="default-header" height="auto">
      <el-row>
        <el-col :span="3">
          <img id="header-logo" src="../assets/images/logo.svg" alt="Logo" />
        </el-col>
        <el-col :span="3" :offset="18">
          <el-dropdown id="header-operation">
            <span class="el-dropdown-link">
              {{ currentOperator.operator_id
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="handleLogout">退出登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside id="default-nav">
        <el-menu @select="goPage" :router="true" :default-active="activeMenu">
          <el-menu-item
            :key="item.path"
            v-for="item in menus"
            :index="item.path"
          >
            <i :class="item.icon"></i>
            <span slot="title">
              {{ item.title }}
            </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import http from "../http";
import menus from './../profile/menu'
export default {
  components: {},
  data() {
    return {
      activeMenu: '',
      currentOperator: {
        operator_id: "Admin管理员",
        role: "Unknown",
      },
      menus
    };
  },
  created() {
    console.log(`CURRENT ROUTER => `, location.pathname)
    this.activeMenu = location.pathname
  },
  methods: {
    goPage(index) {
      console.log(index)
      // this.activeMenu = index;
      // this.$root.currentRoute = this.activeMenu;
      this.$router.push(index)
      // window.history.pushState(null, null, index);

    },
    handleLogout() {
      http.get("/ms/logout").then(() => {
        setTimeout(() => {
          location.href = `/mybot/page/bots/login/v2?returnUrl=${encodeURIComponent(
            window.location.href
          )}`;
        }, 1000 * 0.5);
      });
    },
  },
};
</script>
<style scoped>
#default-header {
  border-bottom: 1px solid #e6e6e6;
  padding: 15px 25px;
  height: auto;
}

#header-logo {
  height: 35px;
}

#header-operation {
  padding-top: 15px;
}

#default-nav {
  width: 200px !important;
  display: block;
  position: relative;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>