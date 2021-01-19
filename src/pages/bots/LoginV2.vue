<template>
  <el-container>
    <el-form
      ref="loginForm"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="login-box"
    >
      <h3 class="login-title">kc电报群bot管理后台</h3>
      <el-form-item label="账号" prop="userName">
        <el-input
          type="text"
          placeholder="请输入账号"
          v-model="form.userName"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          placeholder="请输入密码"
          v-model="form.password"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit('loginForm')"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </el-container>
</template>

<style scoped>
.login-box {
  /* border: 1px solid #dcdfe6; */
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>

<script>
// import MainLayout from "../../layouts/MainLayout";
// import _ from "lodash";
// import languageList, { languageMap } from "../../profile/lang";
import http from "../../http";
import { getQueryString } from "../../utils";
import { Loading } from "element-ui";

export default {
  components: {
    // MainLayout,
  },
  data: function() {
    return {
      form: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [
          { required: true, message: "账号不可为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不可为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }
        let loadingInstance = Loading.service({});

        let params = this.form;
        // console.log(params);
        http.get("/ms/login", { params }).then((res) => {
          console.log(res);
          if (res.data === "success" || res.data === "登录成功") {
            this.$message({
              message: "登录成功",
              type: "success",
            });
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
          setTimeout(() => {
            let returnUrl =
              getQueryString("returnUrl") || "/mybot/page/bots/botentry/list";
            location.href = returnUrl;
          }, 1000 * 0.5);
        });
      });
    },
  },
};
</script>
