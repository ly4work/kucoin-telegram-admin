<template>
  <main-layout>
    <el-row :gutter="20">
      <!-- <el-col :span="5">
        <el-select v-model="criteria.nation">
          <el-option
            :label="item.name + ' - ' + item.mark"
            v-model="item.code"
            v-for="item in languageList"
            :key="item.code"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="criteria.parentId" placeholder="请输入首页id" />
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.handleReset">清空</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.handleGetDetail">查询</el-button>
      </el-col> -->
      <el-col :span="3">
        <el-button type="primary" @click="this.handleCreate"
          >新增主题</el-button
        >
      </el-col>
    </el-row>
    <br />
    <el-table :data="this.list" v-loading="loading">
      <el-table-column prop="originId" label="id" width="90"> </el-table-column>
      <el-table-column prop="content" label="主题名称">
        <template slot-scope="scope">
          <span>{{ scope.row.relaList[0].content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="所属首页id"> </el-table-column>
      <el-table-column prop="nation" label="语言" width="120">
        <template slot-scope="scope">
          <span>{{
            (languageMap[scope.row.relaList[0].nation] &&
              languageMap[scope.row.relaList[0].nation].name +
                " - " +
                languageMap[scope.row.relaList[0].nation].mark) ||
              "脏数据"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="courses" label="新增课程" width="80">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleToPage({ page: 'course', item: scope.row })"
            >添加</el-button
          >
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="del(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <br /><br />
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="this.criteria.page_size"
      :total="this.total"
    >
    </el-pagination>

    <el-drawer
      :title="editTitle"
      :visible.sync="editVisible"
      :with-header="false"
      :wrapperClosable="false"
      size="80%"
    >
      <div class="box">
        <header>
          <h3 class="h3-tg">首页管理 / {{ editTitle }}</h3>
        </header>
        <el-tabs
          v-model="editableTabsValue"
          type="card"
          closable
          editable
          @tab-add="handleAddTab"
          @tab-remove="handleRemoveTab"
          class="tabs-tg"
        >
          <el-tab-pane
            v-for="(obj, index) in editBodyInfo.editList"
            :key="obj.nation"
            :label="languageMap[obj.nation].mark"
            :name="String(index)"
          >
            <el-form
              class="form-tg"
              ref="modalForm_{{index}}"
              :rules="validRules"
              :model="obj"
            >
              <el-form-item label="主题内容" prop="content">
                <el-input v-model="obj.content" />
              </el-form-item>

              <el-form-item label="首页id" prop="parentId">
                <el-select v-model="obj.parentId">
                  <el-option
                    :label="item.originId"
                    v-for="item in parentList"
                    v-model="item.originId"
                    :key="item.originId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editVisible = false">取 消</el-button>
              <el-button type="primary" @click="createOrUpdate()"
                >确 定</el-button
              >
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="createOrUpdate()">确 定</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 新增语言tab时的确认框 -->
    <el-dialog title="选择语言" :visible.sync="dialogVisible" width="30%">
      <el-select @change="handleDialogConfirm" v-model="editBodyInfo.nation">
        <el-option
          :label="item.name + ' - ' + item.mark"
          v-model="item.code"
          v-for="item in tabLanguageList"
          :key="item.code"
        ></el-option>
      </el-select>
    </el-dialog>
  </main-layout>
</template>

<script>
import RestApi from "../../base/RestApi";
import MainLayout from "../../layouts/MainLayout";
import _ from "lodash";
import languageList, { languageMap } from "../../profile/lang";
import http from "../../http";
import { Loading } from "element-ui";
import { getQueryString } from "../../utils";

export default {
  name: "theme",
  components: {
    MainLayout,
  },
  data: function() {
    return {
      loading: false,
      languageList,
      tabLanguageList: languageList,
      languageMap,
      criteria: {
        nation: "",
        parentId: "",
        page_no: 1,
        page_size: 20,
      },
      list: [],
      parentList: [],
      total: 0,
      editVisible: false,
      dialogVisible: false,
      editTitle: "新增主题",
      editableTabsValue: "0",
      editModalInfo: {
        content: "",
        nation: "",
      },
      emptyInfo: {
        content: "",
        nation: "",
      },
      editBodyInfo: {
        editList: [
          {
            content: "",
            nation: "zh-cn",
            buttonList: [],
          },
        ],
      },
      validRules: {
        content: [
          { required: true, message: "请输入主题名称", trigger: "blur" },
          {
            min: 1,
            max: 5000,
            message: "内容长度限制在1～50个字符",
            trigger: "blur",
          },
        ],
        nation: [{ required: true, message: "请选择语言" }],
        parentId: [{ required: true, message: "请选择首页" }],
      },
    };
  },
  created() {
    // this.loadRewardUsers();
  },
  mounted() {
    this.handleGetDetail();
    this.handleGetParentDetail();
    this.handleInit();

  },
  methods: {
    handleInit() {
      //  从上层级跳来
      const parentId = getQueryString("parentId");
      if (parentId) {
        this.editVisible = true;
        this.editTitle = "新增主题";

        this.editBodyInfo = {
          editList: [
            {
              content: "",
              nation: "zh-cn",
              parentId,
              buttonList: [],
            },
          ],
          parentId,
        };
      }
    },
    // 语言选择弹框
    handleDialogConfirm(event) {
      console.log(event);
      const emptyInfo = _.cloneDeep(this.emptyInfo);
      emptyInfo.nation = event;
      this.editBodyInfo.editList.push(emptyInfo);
      this.dialogVisible = false;
      this.editableTabsValue = this.editBodyInfo.editList.length - 1 + "";
    },
    // 删除语言tab
    handleRemoveTab(name) {
      console.log(name);
      this.editBodyInfo.editList.splice(name, 1);
    },
    //  添加语言tab
    handleAddTab() {
      //  先刷一遍tabLanguageList
      const tabLanguageList = _.cloneDeep(this.tabLanguageList);
      this.editBodyInfo.editList.forEach((item) => {
        let index = tabLanguageList.findIndex((o) => {
          return o.code === item.nation;
        });
        if (index >= 0) {
          tabLanguageList.splice(index, 1);
        }
      });
      console.log(tabLanguageList);
      this.tabLanguageList = tabLanguageList;

      //  弹出语言选择框
      this.dialogVisible = true;
      return;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
    handleReset() {
      this.criteria.nation = "";
      this.criteria.parentId = "";
    },
    handleGetDetail() {
      const params = {
        type: "theme",
        // parentId: this.criteria.parentId,
        // nation: this.criteria.nation,
      };
      // if (!params.nation) delete params.nation;
      let loadingInstance = Loading.service({});

      http
        .get("/ms/botCoin/questionRela/top/list", {
          params,
        })
        .then((res) => {
          console.log(res);
          if (res.data) {
            this.list = res.data;
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
            // this.editVisible = false;
          });
        });
    },
    handleCreate() {
      this.editVisible = true;
      this.editTitle = "新增主题";

      this.editBodyInfo = {
        editList: [
          {
            content: "",
            nation: "zh-cn",
            buttonList: [],
          },
        ],
      };
      // this.editModalInfo = _.cloneDeep(this.emptyInfo);
      // this.$nextTick(() => {
      //   this.$refs["modalForm"].clearValidate();
      // });
    },
    edit(item) {
      this.editVisible = true;
      this.editTitle = "编辑主题";
      this.editableTabsValue = "0";

      // this.editModalInfo = item;
      // this.$nextTick(() => {
      //   this.$refs["modalForm"].clearValidate();
      // });
      this.editBodyInfo = {
        editList: [
          {
            content: "",
            nation: "zh-cn",
            buttonList: [],
          },
        ],
      };
      this.$set(this.editBodyInfo, "editList", item.relaList);
      this.$set(this.editBodyInfo, "originId", item.originId);
      // this.handleGetParentDetail();
    },
    del(item) {
      const params = {
        originId: item.originId,
      };
      let loadingInstance = Loading.service({});

      http.get("/ms/botCoin/questionRela/delete", { params }).then((res) => {
        console.log(res);
        if (res.success) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
        }
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
          this.handleGetDetail();
        });
      });
    },
    createOrUpdate() {
      let loadingInstance = Loading.service({});
      const editBodyInfo = _.cloneDeep(this.editBodyInfo);
      //  外层循环editBodyInfo
      editBodyInfo.editList.forEach((o, i) => {
        o.type = "theme";
        // o.parentId = o.parentId;
      });
      let params = {};
      if (editBodyInfo.originId) {
        params.originId = editBodyInfo.originId;
      }

      http
        .post("/ms/botCoin/questionRela/saveOrUpdate", editBodyInfo.editList, {
          params,
        })
        .then((res) => {
          if (res.data === "success") {
            this.$message({
              message: "提交成功",
              type: "success",
            });
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
            this.editVisible = false;
            this.handleGetDetail();
          });
          return void 0;
        });
      // console.log(res);

      // this.$refs["modalForm"].validate(async (valid) => {
      //   if (!valid) {
      //     return;
      //   }

      // });
    },
    handleGetParentDetail() {
      const params = {
        type: "main",
        // parentId,
      };
      http
        .get("/ms/botCoin/questionRela/top/list", {
          params,
        })
        .then((res) => {
          console.log(res);
          if (res.data) {
            this.parentList = res.data;
          }
        });
    },
    handleToPage({ page, item }) {
      console.log(page, item);
      // const historyNewStack = `/mybot/page/bots/`th eme/list`
      const historyNewStack = `/mybot/page/bots/${page}/list?parentId=${item.originId}&_from=parent`;
      // this.activeMenu = index;
      // this.$root.currentRoute = `/mybot/page/bots/theme/list?parentNation=${item.nation}&parentId=${item.id}&_from=parent`;
      // // this.$root.currentRoute = `/mybot/page/bots/theme/list`;
      // window.history.pushState(null, null, historyNewStack);
      window.location.href = historyNewStack;
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
