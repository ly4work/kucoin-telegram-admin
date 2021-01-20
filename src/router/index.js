import Vue from "vue";
import VueRouter from "vue-router";
// import SubRoute from "@/components/SubRoute";
Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/mybot/page/bots/login/v2",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/LoginV2"),
  },
  {
    path: "/mybot/page/bots/botentry/list",
    name: "botentry",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/BotEntry"),
  },
  {
    path: "/mybot/page/bots/theme/list",
    name: "theme",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/Theme"),
  },
  {
    path: "/mybot/page/bots/course/list",
    name: "course",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/Courses"),
  },
  {
    path: "/mybot/page/bots/card/list",
    name: "card",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/Cards"),
  },
  {
    path: "/mybot/page/bots/question/list",
    name: "question",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/Questions"),
  },
  {
    path: "/mybot/page/bots/score/list",
    name: "score",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/Score"),
  },
  {
    path: "/mybot/page/bots/welcome/list",
    name: "welcome",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/Welcome"),
  },
  {
    path: "/mybot/page/bots/homelang/list",
    name: "homelang",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/HomeLang"),
  },
  {
    path: "/mybot/page/bots/binduser/list",
    name: "binduser",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/BindUser"),
  },
  {
    path: "/mybot/page/bots/bindsuc/list",
    name: "bindsuc",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/bots/BindSuc"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
