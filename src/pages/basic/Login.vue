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
      <el-form-item label="账号" prop="operator_id">
        <el-input
          type="text"
          placeholder="请输入账号"
          v-model="form.operator_id"
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
  border: 1px solid #dcdfe6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>

<script>
import MainLayout from "../../layouts/MainLayout.vue";
import RestApi from "../../base/RestApi";

export default {
  components: {
    MainLayout,
  },
  data: function() {
    return {
      form: {
        operator_id: "",
        password: "",
      },
      rules: {
        operator_id: [
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

        const theApp = this;
        RestApi.apiPost("/basic/login", this.form, function(code, msg, data) {
          if (code !== 0) {
            theApp.$notify({
              title: "登录失败",
              message: msg,
              type: "fail",
              duration: 2000,
            });
          } else {
            let returnUrl = RestApi.getQueryVariable("returnUrl");
            if (returnUrl) {
              returnUrl = decodeURI(returnUrl);
            } else {
              returnUrl = "/";
            }
            window.location.href = returnUrl;
          }
        });
      });
    },
  },
};
</script>
