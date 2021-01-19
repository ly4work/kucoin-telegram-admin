import Vue from "vue";
import VueRouter from "vue-router";
// import SubRoute from "@/components/SubRoute";
Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const routes = [
  {
    path: "/mybot/page/bots/login/v2",
    component: () => import(/* webpackChunkName: "login" */ "@/pages/bots/LoginV2")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
