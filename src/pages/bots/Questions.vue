<template>
  <main-layout>
    <el-row :gutter="20">
      <!-- <el-col :span="6">
        <el-select v-model="criteria.nation">
          <el-option
            :label="item.name + ' - ' + item.mark"
            v-model="item.code"
            v-for="item in languageList"
            :key="item.code"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.handleReset">清空</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="this.handleGetDetail">查询</el-button>
      </el-col> -->
      <el-col :span="3">
        <el-button type="primary" @click="this.handleCreate"
          >新增问题</el-button
        >
      </el-col>
    </el-row>
    <br />
    <el-table :data="this.list" v-loading="loading">
      <el-table-column prop="originId" label="id" width="90"> </el-table-column>
      <el-table-column prop="content" label="问题名称">
        <template slot-scope="scope">
          <span>{{ scope.row.relaList[0].content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="所属卡片id" width="150">
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
          <h3 class="h3-tg">问题管理 / {{ editTitle }}</h3>
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
              <el-form-item label="问题内容" prop="content">
                <!-- 问题需要支持 markdown -->
                <el-input
                  type="textarea"
                  :rows="7"
                  v-model="obj.content"
                  placeholder="支持markdown语法"
                />
                <el-button type="primary" style="margin-top: 20px;">
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
              <el-form-item label="选择卡片id" prop="parentId">
                <el-select v-model="obj.parentId">
                  <el-option
                    :label="item.originId"
                    v-for="item in parentList"
                    v-model="item.originId"
                    :key="item.originId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-divider></el-divider>

              <el-form-item label="Button" prop="buttonList">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  @click="handleAddButton(obj, index)"
                  >新增Button</el-button
                >
                <div>
                  <el-row
                    class="row-bg"
                    :gutter="20"
                    v-for="(btn, i) in obj.buttonList"
                    :key="btn.hash"
                  >
                    <el-col :span="2">
                      <el-tag style="width: 100%;">选项{{ i + 1 }}</el-tag>
                    </el-col>
                    <el-col :span="7">
                      <el-tag style="width: 100%;">{{
                        btn.url.replace(
                          /\"right\":\d{1}/g,
                          `"right":${btn.right || 0}`
                        )
                      }}</el-tag>
                    </el-col>
                    <el-col :span="10">
                      <el-input
                        v-model="btn.text"
                        placeholder="输入按钮的自定义名称"
                        @input="handleChangeInput($event, i, index, 'text')"
                      >
                      </el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-select
                        style="width: 100%;"
                        v-model="btn.right"
                        placeholder="是否正确"
                        @change="handleChangeInput($event, i, index, 'right')"
                      >
                        <el-option
                          :label="bk.label"
                          v-for="bk in questionList"
                          v-model="bk.right"
                          :key="bk.label"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="2">
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="small"
                        @click="($event) => handleDeleteBtn(i, index)"
                      ></el-button>
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
import mixinButton, { buttonMap } from "../../profile/buttons";
import { getHashCode } from "../../utils/index";
import marked from "marked";
import http from "../../http";
import { Loading } from "element-ui";
import { getQueryString } from "../../utils";

export default {
  name: "questions",
  components: {
    MainLayout,
  },
  data: function() {
    return {
      loading: false,
      marked,
      languageList,
      tabLanguageList: languageList,
      languageMap,
      criteria: {
        nation: "",
        page_no: 1,
        page_size: 20,
      },

      list: [],
      parentList: [],
      total: 0,
      editVisible: false,
      dialogVisible: false,
      editTitle: "新增问题",
      editableTabsValue: "0",
      editModalInfo: {
        content: "",
        nation: "",
        buttonList: [],
      },
      emptyInfo: {
        content: "",
        nation: "",
        buttonList: [],
      },
      emptyButton: {
        text: "",
        type: "callback",
        subType: "question",
        url: '{"type":"/answer","id":"${this_id}","right":0}',
        label: "",
      },
      questionList: [
        { label: "正确答案", right: 1 },
        { label: "错误答案", right: 0 },
      ],
      editBodyInfo: {
        editList: [
          {
            content: "",
            nation: "zh-cn",
            buttonList: [],
          },
        ],
      },
      systemButtonList: mixinButton("question"),
      validRules: {
        content: [
          { required: true, message: "请输入问题名称", trigger: "blur" },
          {
            min: 1,
            max: 3000,
            message: "内容长度限制在1～3000个字符",
            trigger: "blur",
          },
        ],
        nation: [{ required: true, message: "请选择语言" }],
        buttonList: [{ required: true, message: "请选择语言" }],
      },
    };
  },
  created() {
    // this.loadRewardUsers();
  },
  mounted() {
    this.handleGetDetail();
    this.handleGetParentDetail();
    // setTimeout(() => {
    this.handleInit();
    // }, 0);
  },
  methods: {
    handleInit() {
      //  从上层级跳来
      const parentId = getQueryString("parentId");
      if (parentId) {
        this.editVisible = true;
        this.editTitle = "新增问题";

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
    handleChangeInput($event, i, index, key) {
      console.log("=>>", $event, i, index);
      const editBodyInfo = _.cloneDeep(this.editBodyInfo);
      editBodyInfo.editList[index].buttonList[i][key] = $event;
      this.editBodyInfo = editBodyInfo;
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
        type: "question",
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
    handleDeleteBtn(i, index) {
      const editBodyInfo = _.cloneDeep(this.editBodyInfo);
      editBodyInfo.editList[index].buttonList.splice(i, 1);
      this.editBodyInfo = editBodyInfo;
      // console.log("index", index);
      // const nextButtonList = _.cloneDeep(this.editModalInfo.buttonList);
      // nextButtonList.splice(index, 1);
      // console.log(nextButtonList);
      // this.editModalInfo = Object.assign(this.editModalInfo, {
      //   buttonList: nextButtonList,
      // });
    },
    handleAddButton(item, index) {
      const emptyButton = Object.assign(_.cloneDeep(this.emptyButton), {
        hash: getHashCode(),
      });

      const editBodyInfo = _.cloneDeep(this.editBodyInfo);
      editBodyInfo.editList[index].buttonList.push(emptyButton);
      this.editBodyInfo = editBodyInfo;

      // const emptyButton = Object.assign(_.cloneDeep(this.emptyButton), {
      //   hash: getHashCode(),
      // });
      // console.log(getHashCode());
      // console.log(emptyButton);
      // const editModalInfo = _.cloneDeep(this.editModalInfo);
      // editModalInfo.buttonList.push(emptyButton);
      // this.editModalInfo = editModalInfo;
      // console.log(this.editModalInfo.buttonList);
    },
    handleCreate() {
      this.editVisible = true;
      this.editTitle = "新增问题";
      this.editBodyInfo = {
        editList: [
          {
            content: "",
            nation: "zh-cn",
            buttonList: [],
          },
        ],
      };
    },
    edit(item) {
      this.editVisible = true;
      this.editTitle = "编辑问题";
      this.editableTabsValue = "0";
      this.editBodyInfo = {
        editList: [
          {
            content: "",
            nation: "zh-cn",
            buttonList: [],
          },
        ],
      };
      item.relaList.forEach((o, i) => {
        const buttonList = JSON.parse(o.buttonArray);
        console.log("序列化前: buttonList= >", buttonList);
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
              type: "question",
              subType: "question",
              url: btn.url,
              right: btn.right,
              isCallback: true,
            };
            buttonList[index] = btn;
          }
        });

        console.log("edit buttonList =>", buttonList);
        o.buttonList = buttonList;
      });
      console.log("\n 1=>>>", this.editBodyInfo, "\n <====");
      this.$set(this.editBodyInfo, "editList", item.relaList);
      this.$set(this.editBodyInfo, "originId", item.originId);
      console.log("\n 2=>>>", this.editBodyInfo, "\n <====");

      return void 0;

      // this.editVisible = true;
      // this.editTitle = "编辑问题";
      // const buttonList = JSON.parse(item.buttonArray);
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
      //       right: item.right,
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
      // console.log(this.editModalInfo);
      // return
      let loadingInstance = Loading.service({});
      const editBodyInfo = _.cloneDeep(this.editBodyInfo);

      //  外层循环editBodyInfo
      editBodyInfo.editList.forEach((o, i) => {
        o.type = "question";
        // o.parentId = -1;
        const buttonList = _.cloneDeep(o.buttonList);
        //  内层循环 buttonList
        buttonList.forEach((btn, index) => {
          console.log("btn:=>", btn);
          let url = btn.url;
          let type = btn.type;
          if (btn.type === "nation") {
            url = "/nation " + url;
          }
          if (btn.isCallback) {
            type = "callback";
          }

          buttonList[index] = {
            text: btn.text,
            type: "callback",
            subType: "question",
            isCallback: btn.isCallback,
            url: url.replace(/\"right\":\d{1}/g, `"right":${btn.right || 0}`),
            right: btn.right,
          };
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
      //     console.log("btn:=>", btn);
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
      //       right: btn.right,
      //     };
      //   }
      // );

      // console.log("buttonList:", buttonList);
      // editModalInfo.buttonList = buttonList;

      // let params = {
      //   type: "question",
      //   nation: editModalInfo.nation,
      //   parentId: editModalInfo.parentId,
      //   content: editModalInfo.content,
      //   buttonList: editModalInfo.buttonList,
      // };
      // if (editModalInfo.id) {
      //   params.id = editModalInfo.id;
      // }
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
      // return;

      // this.$refs["modalForm"].validate(async (valid) => {
      //   if (!valid) {
      //     return;
      //   }

      //   let loadingInstance = Loading.service({});

      //   const editModalInfo = _.cloneDeep(this.editModalInfo);
      //   const buttonList = _.cloneDeep(this.editModalInfo.buttonList).map(
      //     (btn) => {
      //       console.log("btn:=>", btn);
      //       let url = btn.url;
      //       let type = btn.type;
      //       if (btn.type === "nation") {
      //         url = "/nation " + url;
      //       }
      //       if (btn.isCallback) {
      //         type = "callback";
      //       }
      //       return {
      //         text: btn.text,
      //         type,
      //         subType: btn.subType || "",
      //         isCallback: btn.isCallback,
      //         url,
      //         right: btn.right,
      //       };
      //     }
      //   );

      //   console.log("buttonList:", buttonList);
      //   editModalInfo.buttonList = buttonList;

      //   let params = {
      //     type: "question",
      //     nation: editModalInfo.nation,
      //     parentId: editModalInfo.parentId,
      //     content: editModalInfo.content,
      //     buttonList: editModalInfo.buttonList,
      //   };
      //   if (editModalInfo.id) {
      //     params.id = editModalInfo.id;
      //   }
      //   const res = await http.post(
      //     "/ms/botCoin/questionRela/saveOrUpdate",
      //     params
      //   );
      //   console.log(res);
      //   if (res.data === "success") {
      //     this.$message({
      //       message: "提交成功",
      //       type: "success",
      //     });
      //   }
      //   this.$nextTick(() => {
      //     // 以服务的方式调用的 Loading 需要异步关闭
      //     loadingInstance.close();
      //     this.editVisible = false;
      //     this.handleGetDetail();
      //   });
      //   return;
      // });
    },
    handleGetParentDetail() {
      const params = {
        type: "card",
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
  },
};
</script>

<style scoped lang="less">
// @import './../../styles/md.less';
.form-tg {
  // padding: 20px;
}
.tabs-tg {
  padding: 20px;
}
.h3-tg {
  padding-left: 20px;
  font-size: 16px;
  color: #666;
}
.row-bg {
  margin: 10px 0;
}
.md-frame {
  background-image: none;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 4px;
  padding: 10px 0;
  /* padding-right: 0; */
  height: 139px;
  overflow-y: scroll;
  position: relative;
  width: 100%;
  vertical-align: bottom;
  font-size: 14px;

  /* width: 92%; */
}
.markdown-content {
  padding: 10px;
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
