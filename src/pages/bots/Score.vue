<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input v-model="criteria.username" placeholder="请输入用户昵称" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="criteria.userId" placeholder="请输入用户id" />
      </el-col>
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
        <el-button type="primary" @click="this.handleReset">清空</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.handleGetDetail">查询</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px">
      <el-col :span="2">
        <el-button type="primary">
          <el-link
            :href="
              /127\.0\.0\.1/g.test(window.location.host)
                ? 'http://127.0.0.1:8080/ms/botCoin/userScore/export'
                : '/kc2j/ms/botCoin/userScore/export'
            "
            download="true"
            >导出</el-link
          >
        </el-button>
      </el-col>
    </el-row>
    <br />
    <el-table :data="this.list" v-loading="loading">
      <el-table-column prop="userId" label="userId" width="120">
      </el-table-column>
      <el-table-column prop="opId" label="绑定账号" width="90">
      </el-table-column>
      <el-table-column prop="username" label="用户昵称"> </el-table-column>
      <el-table-column prop="score" label="积分"> </el-table-column>
      <el-table-column prop="completion" label="答题完成率">
        <template slot-scope="scope">
          <span style="color: green;">
            {{ scope.row.completion + "%" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="200">
        <template slot-scope="scope">
          {{ new Date(scope.row.createDate).toLocaleString() }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="edit(scope.row)"
            >编辑</el-button
          >
          <!-- <el-button type="danger" size="small" @click="del(scope.row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <br /><br />
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="this.criteria.page_size"
      :total="this.total"
      @current-change="this.handlePageChange"
    >
    </el-pagination>

    <!-- 新增语言tab时的确认框 -->
    <el-dialog title="编辑分数" :visible.sync="dialogVisible" width="30%">
      <h3>用户: {{ editModalInfo.username }}</h3>
      <el-input type="number" :min="0" v-model="editModalInfo.score">
      </el-input>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import RestApi from "../../base/RestApi";
// import MainLayout from "../../layouts/MainLayout";
// import _ from "lodash";
import languageList, { languageMap } from "../../profile/lang";
import http from "../../http";
import { Loading } from "element-ui";

export default {
  name: "course",
  components: {
    // MainLayout,
  },
  data: function() {
    return {
      window,
      loading: false,
      languageList,
      languageMap,
      criteria: {
        username: "",
        userId: "",
        page_no: 1,
        page_size: 10,
        create_date_start: "",
        create_date_end: "",
      },
      list: [],
      total: 0,
      dialogVisible: false,

      editModalInfo: {
        userId: "",
        score: "",
      },
    };
  },
  created() {
    // this.loadRewardUsers();
  },
  mounted() {
    this.handleGetDetail();
  },
  methods: {
    handlePageChange(page_no) {
      this.criteria.page_no = page_no;
      this.handleGetDetail();
    },
    handleReset() {
      this.criteria.username = "";
      this.criteria.userId = "";
    },
    handleGetDetail() {
      const params = this.criteria;
      // if (!params.nation) delete params.nation;
      let loadingInstance = Loading.service({});

      http
        .get("/ms/botCoin/userScore/list", {
          params,
        })
        .then((res) => {
          console.log(res);
          if (res.data) {
            this.list = res.data.list;
            this.total = res.data.count;
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        });
    },
    edit(item) {
      this.dialogVisible = true;
      this.editModalInfo = item;
    },
    createOrUpdate() {
      let loadingInstance = Loading.service({});

      let params = {
        userId: this.editModalInfo.userId,
        score: this.editModalInfo.score,
      };
      // console.log(params);
      http.post("/ms/botCoin/userScore/update", params).then((res) => {
        console.log(res);
        if (res.data === "success") {
          this.$message({
            message: "提交成功",
            type: "success",
          });
        }
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
          this.dialogVisible = false;
          this.handleGetDetail();
        });
      });
    },
    handleExport() {
      http.get("/ms/botCoin/userScore/export");
    },
  },
};
</script>

<style scoped>
.tabs-tg {
  padding: 20px;
}
.h3-tg {
  padding-left: 20px;
  font-size: 16px;
  color: #666;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.dialog-footer button {
  margin: 0 20px;
}
.box {
  height: 100vh;
  padding-bottom: 30px;
  overflow-y: scroll;
}
</style>
