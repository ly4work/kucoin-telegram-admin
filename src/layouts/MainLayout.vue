<template>
  <el-container style="height: 100%">
    <el-header id="default-header" height="auto">
      <el-row>
        <el-col :span="3">
          <!-- <img id="header-logo" src="../images/logo.svg" alt="Logo" /> -->
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
        <el-menu :default-active="this.activeMenu" @select="goPage">
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
          <!-- <el-menu-item index="/mybot/page/reward/default-rule/detail">
            <i class="el-icon-setting"></i>
            <span slot="title">随机发放管理</span>
          </el-menu-item>
          <el-menu-item index="/mybot/page/reward/rule/list">
            <i class="el-icon-notebook-1"></i>
            <span slot="title">关键词管理</span>
          </el-menu-item>
          <el-menu-item index="/mybot/page/reward/user/list">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/mybot/page/reward/hit-log/list">
            <i class="el-icon-present"></i>
            <span slot="title">用户积分明细</span>
          </el-menu-item>
          <el-menu-item index="/mybot/page/basic/config/list">
            <i class="el-icon-present"></i>
            <span slot="title">系统配置</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

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
  width: 200px;
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

<script>
// import RestApi from "../base/RestApi";
import http from "../http";
// import { Loading } from "element-ui";

export default {
  components: {},
  data() {
    return {
      activeMenu: this.$root.currentRoute,
      currentOperator: {
        operator_id: "Admin管理员",
        role: "Unknown",
      },
      menus: [
        // {
        //   title: "随机发放管理",
        //   path: "/mybot/page/reward/default-rule/detail",
        //   icon: "el-icon-setting",
        // },
        // {
        //   title: "关键词管理",
        //   path: "/mybot/page/reward/rule/list",
        //   icon: "el-icon-notebook-1",
        // },
        // {
        //   title: "用户管理",
        //   path: "/mybot/page/reward/user/list",
        //   icon: "el-icon-user",
        // },
        // {
        //   title: "用户积分明细",
        //   path: "/mybot/page/reward/hit-log/list",
        //   icon: "el-icon-present",
        // },
        // {
        //   title: "系统配置",
        //   path: "/mybot/page/basic/config/list",
        //   icon: "el-icon-setting",
        // },
        {
          title: "欢迎语管理",
          path: "/mybot/page/bots/welcome/list",
          icon: "el-icon-guide",
        },
        {
          title: "语言管理",
          path: "/mybot/page/bots/homelang/list",
          icon: "el-icon-smoking",
        },
        {
          title: "绑定用户",
          path: "/mybot/page/bots/binduser/list",
          icon: "el-icon-s-check",
        },
        {
          title: "绑定回复",
          path: "/mybot/page/bots/bindsuc/list",
          icon: "el-icon-headset",
        },
        {
          title: "引导管理",
          path: "/mybot/page/bots/botentry/list",
          icon: "el-icon-s-home",
        },
        {
          title: "主题管理",
          path: "/mybot/page/bots/theme/list",
          icon: "el-icon-s-open",
        },
        {
          title: "课程管理",
          path: "/mybot/page/bots/course/list",
          icon: "el-icon-document-copy",
        },
        {
          title: "卡片管理",
          path: "/mybot/page/bots/card/list",
          icon: "el-icon-reading",
        },
        {
          title: "问答管理",
          path: "/mybot/page/bots/question/list",
          icon: "el-icon-question",
        },
        {
          title: "积分管理",
          path: "/mybot/page/bots/score/list",
          icon: "el-icon-magic-stick",
        },
      ],
    };
  },
  created() {
    // const theApp = this;
    // RestApi.apiGet("/basic/me", null, function(code, msg, data) {
    //   if (code !== 0) {
    //     theApp.$notify({
    //       title: "获取当前用户信息失败",
    //       message: msg,
    //       type: "fail",
    //       duration: 2000,
    //     });
    //   } else {
    //     theApp.currentOperator = data;
    //   }
    // });
  },
  methods: {
    goPage(index) {
      this.activeMenu = index;
      this.$root.currentRoute = this.activeMenu;
      window.history.pushState(null, null, index);
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
