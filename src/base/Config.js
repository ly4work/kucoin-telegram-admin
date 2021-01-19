const envs = {
  development: {
    // api: "http://localhost:19501/api",
    api: "",
    loginPage: "http://localhost:8010/page/basic/login",
  },
  production: {
    api: "/api",
    loginPage: "/page/basic/login",
  },
};

export default {
  _instance: envs[process.env.NODE_ENV == null ? "development" : "production"],
  instance() {
    return this._instance;
  },
};
