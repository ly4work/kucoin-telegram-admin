<template>
  <main-layout>
    <el-form
      :model="defaultRule"
      :rules="rules"
      ref="form"
      label-width="200px"
      style="width: 400px"
    >
      <el-form-item label="单次放发积分数" prop="point">
        <el-input type="number" v-model="defaultRule.point"></el-input>
        <span class="hint">(只允许输入0～100的正整数)</span>
      </el-form-item>
      <el-form-item label="发言随机发放概率" prop="probability">
        <el-input type="number" v-model="defaultRule.probability">
          <template slot="append">%</template>
        </el-input>
        <span class="hint">(只允许输入0～100的正整数)</span>
      </el-form-item>
      <el-form-item label="发言随机发放每日上限" prop="daily_point">
        <el-input type="number" v-model="defaultRule.daily_point"></el-input>
        <span class="hint">(只允许输入正整数)</span>
      </el-form-item>
      <el-form-item class="form-submit-button">
        <el-button type="primary" v-on:click="onSubmit('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </main-layout>
</template>

<style>
.hint {
  color: lightgray;
  text-align: left;
  width: 100%;
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
      defaultRule: {
        rule_id: -1,
        point: 0,
        probability: "",
        daily_point: "",
      },
      rules: {
        point: [
          { required: true, message: "请输入单次放发积分数", trigger: "blur" },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        probability: [
          {
            required: true,
            message: "请输入发言随机发放概率",
            trigger: "blur",
          },
          {
            pattern: /^(0|[1-9]\d?|100)$/,
            message: "请输入输入0～100的正整数",
            trigger: "blur",
          },
        ],
        daily_point: [
          {
            required: true,
            message: "请输入发言随机发放每日上限",
            trigger: "blur",
          },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    const theApp = this;
    RestApi.apiGet("/reward/rule/list", { rule_id: -1 }, function(
      code,
      msg,
      data
    ) {
      if (code !== 0) {
        theApp.$notify({
          title: "数据加载失败",
          message: msg,
          type: "fail",
          duration: 2000,
        });
      } else {
        theApp.defaultRule = data[0];
      }
    });
  },
  methods: {
    onSubmit(formName) {
      const theApp = this;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }
        RestApi.apiPost("/reward/rule/update", this.defaultRule, function(
          code,
          msg,
          data
        ) {
          if (code !== 0) {
            theApp.$notify({
              title: "失败",
              message: msg,
              type: "fail",
              duration: 2000,
            });
          } else {
            theApp.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
              duration: 2000,
            });
          }
        });
      });
    },
  },
};
</script>
