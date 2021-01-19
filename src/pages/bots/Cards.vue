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
        <el-input v-model="criteria.parentId" placeholder="请输入课程id" />
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.handleReset">清空</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.handleGetDetail">查询</el-button>
      </el-col> -->
      <el-col :span="3">
        <el-button type="primary" @click="this.handleCreate"
          >新增卡片</el-button
        >
      </el-col>
    </el-row>
    <br />
    <el-table :data="this.list" v-loading="loading">
      <el-table-column prop="originId" label="id" width="90"> </el-table-column>
      <el-table-column prop="content" label="卡片名称">
        <template slot-scope="scope">
          <span>{{ scope.row.relaList[0].content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="所属课程id" width="120">
      </el-table-column>

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

      <el-table-column prop="courses" label="新增问题" width="80">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleToPage({ page: 'question', item: scope.row })"
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
          <h3 class="h3-tg">卡片管理 / {{ editTitle }}</h3>
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
              <el-form-item label="内容" prop="content">
                <!-- 问题需要支持 markdown -->
                <el-input
                  type="textarea"
                  :rows="7"
                  v-model="obj.content"
                  placeholder="支持markdown语法"
                />
                <el-button
                  type="primary"
                  style="margin-top: 20px;"
                  size="small"
                >
                  <a
                    style="color: #fff;"
                    href="https://tool.lu/markdown/"
                    target="_blank"
                    >点击跳转到markdown编辑器</a
                  >
                </el-button>
              </el-form-item>
              <el-divider></el-divider>

              <!-- <el-form-item label="语言" prop="nation">
                <el-select v-model="editModalInfo.nation">
                  <el-option
                    :label="item.name + ' - ' + item.mark"
                    v-for="item in languageList"
                    v-model="item.code"
                    :key="item.code"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="选择课程id" prop="parentId">
                <el-select v-model="obj.parentId">
                  <el-option
                    :label="item.originId"
                    v-for="item in parentList"
                    v-model="item.originId"
                    :key="item.originId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Button" prop="buttonList">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  disabled
                  >新增Button</el-button
                >
                <div>
                  <el-row
                    class="row-bg"
                    :gutter="20"
                    v-for="(btn, i) in obj.buttonList"
                    :key="btn.hash"
                  >
                    <template>
                      <el-col :span="8">
                        <el-tag style="width: 100%;">开始答题按钮</el-tag>
                      </el-col>
                    </template>
                    <el-col :span="8">
                      <el-tag style="width: 100%;">{{ btn.url }}</el-tag>
                    </el-col>
                    <el-col :span="8">
                      <el-input
                        v-model="btn.text"
                        placeholder="输入按钮的自定义名称"
                        @input="handleChangeInput($event, i, index, 'text')"
                      >
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </el-form>
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
import { getHashCode } from "../../utils/index";
import { getQueryString } from "../../utils";

export default {
  name: "cards",
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

      editTitle: "新增卡片",
      editableTabsValue: "0",

      editModalInfo: {
        content: "",
        nation: "",
        buttonList: [],
      },
      emptyInfo: {
        content: "",
        nation: "zh-cn",
        buttonList: [
          {
            text: "",
            type: "callback",
            subType: "start",
            isCallback: true,
            parentId: "",
            url: '{"type":"/question","id":"${this_id}"}',
          },
        ],
      },
      editBodyInfo: {
        editList: [
          {
            content: "",
            nation: "zh-cn",
            buttonList: [
              {
                text: "",
                type: "callback",
                subType: "start",
                isCallback: true,
                parentId: "",
                url: '{"type":"/question","id":"${this_id}"}',
              },
            ],
          },
        ],
      },
      validRules: {
        content: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
          {
            min: 1,
            max: 5000,
            message: "内容长度限制在1～5000个字符",
            trigger: "blur",
          },
        ],
        nation: [{ required: true, message: "请选择语言" }],
        parentId: [{ required: true, message: "请选择课程" }],
        buttonList: [{ required: true, message: "请设置button组" }],
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
        this.editTitle = "新增卡片";
        const emptyInfo = _.cloneDeep(this.emptyInfo);
        const editBodyInfo = _.cloneDeep(this.editBodyInfo);
        Object.assign(emptyInfo, { parentId });

        editBodyInfo.editList = [emptyInfo];
        editBodyInfo.parentId = parentId;
        this.editBodyInfo = editBodyInfo;
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
        type: "card",
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
      this.editTitle = "新增卡片";
      const emptyInfo = _.cloneDeep(this.emptyInfo);

      this.editBodyInfo = {
        editList: [emptyInfo],
      };
    },
    edit(item) {
      this.editVisible = true;
      this.editTitle = "编辑卡片";
      this.editableTabsValue = "0";
      this.editBodyInfo = {
        editList: [_.cloneDeep(this.emptyInfo)],
      };
      item.relaList.forEach((o, i) => {
        const buttonList = JSON.parse(o.buttonArray);
        buttonList.forEach((btn, index) => {
          if (btn.type === "nation") {
            btn = {
              hash: getHashCode(),
              text: btn.text,
              type: btn.type,
              url: btn.url.split(" ")[1],
              subType: btn.subType,
              isCallback: btn.isCallback,
            };
            buttonList[index] = btn;
            // console.log(btn);
          } else if (btn.type === "callback") {
            // console.log("item => ", btn, btn.subType);
            btn = {
              hash: getHashCode(),
              text: btn.text,
              type: btn.subType,
              subType: btn.subType,
              url: btn.url,
              isCallback: btn.isCallback,
            };
            buttonList[index] = btn;
          }
        });

        // console.log("edit buttonList =>", buttonList);
        o.buttonList = buttonList;
      });

      console.log("\n 1=>>>", this.editBodyInfo, "\n <====");
      this.$set(this.editBodyInfo, "editList", item.relaList);
      this.$set(this.editBodyInfo, "originId", item.originId);
      console.log("\n 2=>>>", this.editBodyInfo, "\n <====");

      // buttonList.forEach((item, index) => {
      //   if (item.type === "nation") {
      //     console.log(item.url.split(" ")[1]);
      //     item = {
      //       text: item.text,
      //       type: item.type,
      //       url: item.url.split(" ")[1],
      //       subType: item.subType,
      //       isCallback: item.isCallback,
      //     };
      //     buttonList[index] = item;
      //     console.log(item);
      //   } else if (item.type === "callback") {
      //     console.log("item => ", item, item.subType);
      //     item = {
      //       text: item.text,
      //       type: item.subType,
      //       subType: item.subType,
      //       url: item.url,
      //       isCallback: item.isCallback,
      //     };
      //     buttonList[index] = item;
      //   }
      // });
      // console.log("edit buttonList =>", buttonList);

      // this.editModalInfo = {
      //   content: item.content,
      //   id: item.id,
      //   parentId: item.parentId,
      //   nation: item.nation,
      //   buttonList,
      // };
      // this.$nextTick(() => {
      //   this.$refs["modalForm"].clearValidate();
      // });
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
        o.type = "card";
        // o.parentId = -1;
        const buttonList = _.cloneDeep(o.buttonList);
        //  内层循环 buttonList
        buttonList.forEach((btn, index) => {
          let cBtn = _.cloneDeep(btn);
          if (cBtn.type === "nation") {
            // console.log(btn.url.split(" ")[1]);
            cBtn = {
              text: cBtn.text,
              type: cBtn.type,
              url: "/nation " + cBtn.url,
              subType: cBtn.subType,
              isCallback: cBtn.isCallback,
            };
            buttonList[index] = cBtn;
            // console.log(btn);
          } else if (["theme", "bindUser", "start"].includes(cBtn.subType)) {
            // console.log("item => ", btn, btn.subType);
            cBtn = {
              text: cBtn.text,
              type: "callback",
              subType: cBtn.subType,
              url: cBtn.url,
              isCallback: cBtn.isCallback,
            };
            buttonList[index] = cBtn;
          }
        });

        console.log("edit buttonList =>", buttonList);
        o.buttonList = buttonList;
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
          // console.log(res);
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

      // const buttonList = _.cloneDeep(this.editModalInfo.buttonList).map(
      //   (btn) => {
      //     let url = btn.url;
      //     let type = btn.type;
      //     if (btn.type === "nation") {
      //       url = "/nation " + url;
      //     }
      //     if (btn.isCallback) {
      //       type = "callback";
      //     }
      //     return {
      //       text: btn.text,
      //       type,
      //       subType: btn.subType || "",
      //       isCallback: btn.isCallback,
      //       url,
      //     };
      //   }
      // );

      // console.log("buttonList:", buttonList);
      // editModalInfo.buttonList = buttonList;
      // let params = {
      //   type: "card",
      //   nation: editModalInfo.nation,
      //   parentId: editModalInfo.parentId,
      //   content: editModalInfo.content,
      //   buttonList: editModalInfo.buttonList,
      // };
      // if (editModalInfo.id) {
      //   params.id = editModalInfo.id;
      // }
      // console.log(params);
      // const res = await http.post(
      //   "/ms/botCoin/questionRela/saveOrUpdate",
      //   params
      // );
      // console.log(res);
      // if (res.data === "success") {
      //   this.$message({
      //     message: "提交成功",
      //     type: "success",
      //   });
      // }
      // this.$nextTick(() => {
      //   // 以服务的方式调用的 Loading 需要异步关闭
      //   loadingInstance.close();
      //   this.editVisible = false;
      //   this.handleGetDetail();
      // });
      // console.log([...this.list]);
      // this.$refs["modalForm"].validate(async (valid) => {
      //   if (!valid) {
      //     return;
      //   }
      // });
    },
    handleChangeInput($event, i, index, key) {
      console.log("=>>", $event, i, index);
      const editBodyInfo = _.cloneDeep(this.editBodyInfo);
      editBodyInfo.editList[index].buttonList[i][key] = $event;
      this.editBodyInfo = editBodyInfo;
    },
    handleGetParentDetail() {
      const params = {
        type: "course",
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
