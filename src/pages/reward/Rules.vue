<template>
  <main-layout>
    <el-row type="flex" justify="end">
      <el-col :span="2">
        <el-button type="primary" @click="handleCreate">新建关键词</el-button>
      </el-col>
      <el-col :span="1"> </el-col>
    </el-row>
    <br />
    <el-table :data="this.enableRewardRules" :fit="true">
      <el-table-column prop="rule_id" label="id" width="80"> </el-table-column>
      <el-table-column prop="keyword" label="关键词内容"> </el-table-column>
      <el-table-column prop="point" label="积分" width="50"> </el-table-column>
      <el-table-column prop="probability" label="获取概率" width="100">
      </el-table-column>
      <el-table-column prop="daily_point" label="每日发放上限" width="120">
      </el-table-column>
      <el-table-column prop="total_point" label="总积分上限" width="100">
      </el-table-column>
      <el-table-column prop="create_date" label="创建时间" width="180">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 'E' ? 'success' : 'danger'"
            disable-transitions
            size="mini"
          >
            {{ scope.row.status === "E" ? "生效中" : "已停用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit(scope.row)"
            >编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="editTitle"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="35%"
    >
      <el-form ref="rewardRule" :rules="validRules" :model="rewardRule">
        <el-form-item label="关键词内容" prop="keyword">
          <el-input v-model="rewardRule.keyword" placeholder="1～50字符" />
        </el-form-item>
        <el-form-item label="命中后发放积分" prop="point">
          <el-input v-model="rewardRule.point" placeholder=">0的正整数" />
        </el-form-item>
        <el-form-item label="获取积分概率" prop="probability">
          <el-input v-model="rewardRule.probability" placeholder="0～100">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="每天发放上限" prop="daily_point">
          <el-input v-model="rewardRule.daily_point" placeholder=">0的正整数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="createOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </main-layout>
</template>

<script>
import RestApi from "../../base/RestApi";
import MainLayout from "../../layouts/MainLayout";
import DateUtil from "../../base/DateUtil";

export default {
  name: "Rules",
  components: {
    MainLayout,
  },
  data: function() {
    return {
      editVisible: false,
      editTitle: "新建关键词",
      rewardRules: [],
      rewardRule: this.buildEmptyRewardRule(),
      validRules: {
        keyword: [
          { required: true, message: "请输入关键词内容", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "内容长度限制在1～50个字符",
            trigger: "blur",
          },
        ],
        point: [
          { required: true, message: "请输入命中后发放积分", trigger: "blur" },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        probability: [
          { required: true, message: "请输入获取积分概率", trigger: "blur" },
          {
            pattern: /^(0|[1-9]\d?|100)$/,
            message: "请输入输入0～100的正整数",
            trigger: "blur",
          },
        ],
        daily_point: [
          { required: true, message: "请输入每天发放上限", trigger: "blur" },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    enableRewardRules: function() {
      return this.rewardRules.filter((x) => x.status === "E");
    },
  },
  created() {
    this.loadRewardRules();
  },
  methods: {
    loadRewardRules() {
      const theApp = this;
      RestApi.apiGet(
        "/reward/rule/list",
        { start_rule_id: 0, status: "E" },
        function(code, msg, data) {
          if (code !== 0) {
            theApp.$notify({
              title: "数据加载失败",
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
    handleEdit(rule) {
      this.editVisible = true;
      this.editTitle = "编辑关键词";
      this.rewardRule = rule;
      this.$nextTick(() => {
        this.$refs["rewardRule"].clearValidate();
      });
    },
    handleCreate() {
      this.editVisible = true;
      this.editTitle = "新建关键词";
      this.rewardRule = this.buildEmptyRewardRule();
      this.$nextTick(() => {
        this.$refs["rewardRule"].clearValidate();
      });
    },
    handleDelete(rule) {
      this.$confirm("确认删除关键词" + rule.keyword + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          const theApp = this;
          RestApi.apiPost(
            "/reward/rule/update",
            {
              rule_id: rule.rule_id,
              status: "D",
            },
            function(code, msg, data) {
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
                  message: "删除成功",
                  type: "success",
                  duration: 2000,
                });
                rule.status = "D";
              }
            }
          );
        })
        .catch(() => {});
    },
    buildEmptyRewardRule() {
      return {
        rule_id: "",
        keyword: "",
        point: "",
        probability: "",
        daily_point: "",
        total_point: 99999999,
        status: "E",
      };
    },
    createOrUpdate() {
      this.$refs["rewardRule"].validate((valid) => {
        if (!valid) {
          return;
        }

        const theApp = this;
        if (theApp.rewardRule.rule_id) {
          RestApi.apiPost("/reward/rule/update", this.rewardRule, function(
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
                message: "更新成功",
                type: "success",
                duration: 2000,
              });
              theApp.editVisible = false;
            }
          });
        } else {
          RestApi.apiPost("/reward/rule/create", this.rewardRule, function(
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
                message: "创建成功",
                type: "success",
                duration: 2000,
              });
              theApp.editVisible = false;
              theApp.rewardRule.rule_id = data;
              theApp.rewardRule.create_date = DateUtil.dateFormat(
                "YYYY-mm-dd HH:MM:SS",
                new Date()
              );
              theApp.rewardRules.unshift(theApp.rewardRule);
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped></style>
