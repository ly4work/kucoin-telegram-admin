import languageList from "./lang";

export const buttonMap = {
  nation: {
    type: "nation",
    label: "语言Button",
    values: languageList,
  },
  url: { type: "url", label: "跳转链接Button" },
  bindUser: {
    type: "bindUser",
    subType: "bindUser",
    isCallback: true,
    label: "绑定用户Button",
    value: "/bind  KuCoin UID",
  },
  theme: {
    type: "theme",
    subType: "theme",
    isCallback: true,
    label: "主题列表Button",
    value: '{"id":"${this_id}","type":"/theme"}',
  },
  start: {
    type: "start",
    subType: "start",
    isCallback: true,
    label: "开始答题Button",
    value: '{"type":"/question","id":"${this_id}"}',
  },
  question: {
    type: "questions",
    subType: "start",
    isCallback: true,
    label: "答案选项Button",
    right: 0,
    url: '{"type":"/answer","id":"${this_id}","right":1}',
  },
};

export default function mixinButton(arrString) {
  const buttonTypeList = arrString.split(",");
  if (buttonTypeList.length > 0) {
    return buttonTypeList.map((key) => {
      return buttonMap[key] || {};
    });
  } else {
    return [];
  }
}
