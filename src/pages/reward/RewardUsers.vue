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
        <el-select v-model="criteria.order_type">
          <el-option key="point" label="按总积分倒排" value="point"></el-option>
          <el-option
            key="create_date"
            label="按创建时间倒排"
            value="create_date"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.loadRewardUsers">查询</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.handleReset"
          >批量发放礼物</el-button
        >
      </el-col>
    </el-row>
    <br />
    <el-table :data="this.users" :fit="true">
      <el-table-column prop="user_id" label="id" width="150"> </el-table-column>
      <el-table-column prop="username" label="用户username"> </el-table-column>
      <el-table-column prop="total_point" label="总积分" width="100">
      </el-table-column>
      <el-table-column prop="create_date" label="创建时间" width="180">
      </el-table-column>
    </el-table>
    <br /><br />
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="this.criteria.page_size"
      :total="this.usersTotalCount"
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
        order_type: "point",
        page_no: 1,
        page_size: 20,
      },
      users: [],
      usersTotalCount: 0,
    };
  },
  created() {
    this.loadRewardUsers();
  },
  methods: {
    loadRewardUsers() {
      const theApp = this;
      RestApi.apiGet("/reward/user/list", theApp.criteria, function(
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
          theApp.usersTotalCount = data.total_count;
          theApp.users = data.result_list;
        }
      });
    },
    handleReset() {
      this.$confirm(
        "本操作将对所有人的积分清零，表示本轮活动结束，工作人员已给用户发放礼物，知晓本功能带来的影响。",
        "批量发放礼物",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          const theApp = this;
          RestApi.apiGet("/reward/user/reset", null, function(code, msg, data) {
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
                message: "操作成功",
                type: "success",
                duration: 2000,
              });
              theApp.users = [];
              theApp.usersTotalCount = 0;
            }
          });
        })
        .catch(() => {});
    },
    handlePageChange(page_no) {
      this.criteria.page_no = page_no;
      this.loadRewardUsers();
    },
  },
};
</script>

<style scoped></style>
