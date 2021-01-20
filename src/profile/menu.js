export const basePath = '/mybot/page/bots'
export default [
  {
    title: "欢迎语管理",
    path: `${basePath}/welcome/list`,
    name: "welcome",
    icon: "el-icon-guide",
  },
  {
    title: "语言管理",
    path: `${basePath}/homelang/list`,
    name: "homelang",
    icon: "el-icon-smoking",
  },
  {
    title: "绑定用户",
    path: `${basePath}/binduser/list`,
    name: "binduser",
    icon: "el-icon-s-check",
  },
  {
    title: "绑定回复",
    path: `${basePath}/bindsuc/list`,
    name: "bindsuc",
    icon: "el-icon-headset",
  },
  {
    title: "引导管理",
    path: `${basePath}/botentry/list`,
    name: "botentry",
    icon: "el-icon-s-home",
  },
  {
    title: "主题管理",
    path: `${basePath}/theme/list`,
    name: "theme",
    icon: "el-icon-s-open",
  },
  {
    title: "课程管理",
    path: `${basePath}/course/list`,
    name: "course",
    icon: "el-icon-document-copy",
  },
  {
    title: "卡片管理",
    path: `${basePath}/card/list`,
    name: "card",
    icon: "el-icon-reading",
  },
  {
    title: "问答管理",
    path: `${basePath}/question/list`,
    name: "question",
    icon: "el-icon-question",
  },
  {
    title: "积分管理",
    path: `${basePath}/score/list`,
    name: "score",
    icon: "el-icon-magic-stick",
  },
];
