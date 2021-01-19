<template>
  <main-layout>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="criteria.username"
          placeholder="请输入username"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <el-select
          @change="handleRuleTypeChange"
          v-model="ruleType"
          style="width: 100%"
        >
          <el-option key="" label="发放原因" value=""></el-option>
          <el-option
            key="default"
            label="发言随机发放"
            value="default"
          ></el-option>
          <el-option key="enable" label="命中关键词" value="enable"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="ruleVisible">
        <el-select v-model="criteria.rule_id">
          <el-option key="" label="关键词" value=""></el-option>
          <el-option
            v-for="rule in rewardRules"
            :key="rule.rule_id"
            :label="rule.keyword"
            :value="rule.rule_id"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <br />
    <el-row :gutter="20">
      <el-col :span="6">
        <el-date-picker
          v-model="criteria.create_date_start"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="发放开始时间"
          style="width: 100%"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="criteria.create_date_end"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="发放结束时间"
          style="width: 100%"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.loadHitLogs">查询</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.exportHitLogs"
          >导出成excel</el-button
        >
      </el-col>
    </el-row>
    <br />
    <el-table :data="this.logs" :fit="true">
      <el-table-column prop="log_id" label="id" width="150"> </el-table-column>
      <el-table-column prop="username" label="用户username" width="200">
      </el-table-column>
      <el-table-column prop="keyword" label="命中关键词"> </el-table-column>
      <el-table-column prop="point" label="发放积分" width="200">
      </el-table-column>
      <el-table-column prop="hit_rule_id" label="发放原因" width="120">
        <template slot-scope="scope">
          {{ scope.row.hit_rule_id === -1 ? "发言随机发放" : "命中关键词" }}
        </template>
      </el-table-column>
      <el-table-column prop="create_date" label="发放时间" width="180">
      </el-table-column>
    </el-table>
    <br /><br />
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="this.criteria.page_size"
      :total="this.logsTotalCount"
      @current-change="this.handlePageChange"
    >
    </el-pagination>
  </main-layout>
</template>

<script>
import RestApi from "../../base/RestApi";
import MainLayout from "../../layouts/MainLayout";

export default {
  name: "Rules",
  components: {
    MainLayout,
  },
  data: function() {
    return {
      criteria: {
        username: "",
        rule_id: "",
        create_date_start: "",
        create_date_end: "",
        page_no: 1,
        page_size: 20,
      },
      ruleType: "",
      rewardRules: [],
      ruleVisible: false,
      logs: [],
      logsTotalCount: 0,
    };
  },
  created() {
    this.loadRules();
    this.loadHitLogs();
  },
  methods: {
    loadHitLogs() {
      const theApp = this;
      RestApi.apiGet("/reward/user-hit-log/list", theApp.criteria, function(
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
          theApp.logsTotalCount = data.total_count;
          theApp.logs = data.result_list;
        }
      });
    },
    exportHitLogs() {
      let exportLink = document.createElement("a");
      exportLink.href = RestApi.toApiAddr(
        "/reward/user-hit-log/export?" + RestApi.revertToQuery(this.criteria)
      );
      exportLink.click();
    },
    loadRules() {
      const theApp = this;
      RestApi.apiGet(
        "/reward/rule/list",
        { start_rule_id: 0, status: "E" },
        function(code, msg, data) {
          if (code !== 0) {
            theApp.$notify({
              title: "关键词加载失败",
              message: msg,
              type: "fail",
              duration: 2000,
            });
          } else {
            theApp.rewardRules = data;
          }
        }
      );
    },
    handleRuleTypeChange(type) {
      if (type === "enable") {
        this.ruleVisible = true;
        this.criteria.rule_id = "";
      } else if (type === "default") {
        this.ruleVisible = false;
        this.criteria.rule_id = -1;
      } else {
        this.ruleVisible = false;
        this.criteria.rule_id = "";
      }
    },
    handlePageChange(page_no) {
      this.criteria.page_no = page_no;
      this.loadHitLogs();
    },
  },
};
</script>

<style scoped></style>
