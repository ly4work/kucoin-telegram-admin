<template>
  <main-layout>
    <el-table :data="this.configs" :fit="true">
      <el-table-column prop="name" label="名称" width="200"> </el-table-column>
      <el-table-column prop="value" label="值"> </el-table-column>
      <el-table-column prop="note" label="备注" width="200"> </el-table-column>
      <el-table-column prop="update_user" label="更新人" width="150">
      </el-table-column>
      <el-table-column prop="update_date" label="更新时间" width="180">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit(scope.row)"
            >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="更新配置"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="35%"
    >
      <el-form ref="configForm" :rules="validRules" :model="config">
        <el-form-item label="名称" prop="name">
          <el-input v-model="config.name" disabled />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="config.value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </main-layout>
</template>

<script>
import RestApi from "../../base/RestApi";
import MainLayout from "../../layouts/MainLayout";
import DateUtil from "../../base/DateUtil";

export default {
  name: "Configs",
  components: {
    MainLayout,
  },
  data: function() {
    return {
      editVisible: false,
      configs: [],
      config: {
        key: "",
        name: "",
        value: "",
      },
      validRules: {
        value: [{ required: true, message: "请输入配置值", trigger: "blur" }],
      },
    };
  },
  created() {
    this.loadConfigs();
  },
  methods: {
    loadConfigs() {
      const theApp = this;
      RestApi.apiGet("/basic/config/list", null, function(code, msg, data) {
        if (code !== 0) {
          theApp.$notify({
            title: "数据加载失败",
            message: msg,
            type: "fail",
            duration: 2000,
          });
        } else {
          theApp.configs = data;
        }
      });
    },
    handleEdit(config) {
      this.editVisible = true;
      this.config = config;
    },
    handleUpdate() {
      this.$refs["configForm"].validate((valid) => {
        if (!valid) {
          return;
        }

        const theApp = this;
        RestApi.apiPost("/basic/config/update", this.config, function(
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
      });
    },
  },
};
</script>

<style scoped></style>
