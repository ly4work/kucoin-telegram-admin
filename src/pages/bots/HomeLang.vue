<template>
  <main-layout>
    <el-row :gutter="20">
      <el-col :span="3">
        <el-button type="primary" @click="this.handleCreate" icon="el-icon-plus"
          >新增语言</el-button
        >
      </el-col>
    </el-row>
    <br />
    <el-table :data="this.list" v-loading="loading">
      <!-- <el-table-column prop="originId" label="id" width="90"> </el-table-column> -->
      <el-table-column prop="content" label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.relaList[0].content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nation" label="语言" width="220">
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
      <!-- <el-table-column prop="courses" label="新增主题" width="80">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleToPage({ page: 'theme', item: scope.row })"
            >添加</el-button
          >
        </template>
      </el-table-column> -->
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
                    <el-col :span="6">
                      <el-select
                        v-model="btn.type"
                        @change="
                          (val) => {
                            handleChangeSystemKeyButton(val, i, index);
                          }
                        "
                      >
                        <el-option
                          :label="o.label"
                          v-for="o in systemButtonList"
                          v-model="o.type"
                          :key="o.type"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <template v-if="btn.type === 'nation'">
                      <el-col :span="8">
                        <el-select
                          style="width: 100%;"
                          v-model="btn.url"
                          @change="
                            ($event) =>
                              handleChangeNationSelect($event, i, index)
                          "
                        >
                          <el-option
                            :label="bk.name + ' - ' + bk.mark"
                            v-for="bk in languageList"
                            v-model="bk.code"
                            :key="bk.code"
                          ></el-option>
                        </el-select>
                      </el-col>
                    </template>
                    <template
                      v-if="btn.type === 'bindUser' || btn.type === 'theme'"
                    >
                      <el-col :span="8">
                        <el-tag style="width: 100%;">{{ btn.url }}</el-tag>
                      </el-col>
                    </template>
                    <template v-if="btn.type === 'url'">
                      <el-col :span="8">
                        <el-input
                          v-model="btn.url"
                          placeholder="输入链接地址"
                          @input="handleChangeInput($event, i, index, 'url')"
                        >
                        </el-input>
                      </el-col>
                    </template>
                    <el-col :span="8">
                      <el-input
                        v-model="btn.text"
                        placeholder="输入按钮的名称"
                        @input="handleChangeInput($event, i, index, 'text')"
                      >
                      </el-input>
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
export default {
  name: "botentry",
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
      total: 0,
      editVisible: false,
      dialogVisible: false,
      editTitle: "新增语言管理",
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
        type: "",
        url: "",
        label: "",
      },
      editBodyInfo: {
        editList: [
          {
            content: "",
            nation: "en",
            buttonList: [],
          },
        ],
      },
      systemButtonList: mixinButton("nation"),
      validRules: {
        content: [
          { required: true, message: "请输入语言管理引导", trigger: "blur" },
          {
            min: 1,
            max: 5000,
            message: "内容长度限制在1～5000个字符",
            trigger: "blur",
          },
        ],
        nation: [{ required: true, message: "请选择语言" }],
        buttonList: [{ required: true, message: "请选择语言" }],
      },
    };
  },
  mounted() {
    this.handleGetDetail();
  },
  methods: {
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
    },
    handleGetDetail() {
      const params = {
        type: "nation",
        parentId: -1,
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
            this.editVisible = false;
          });
        });
    },
    handleDeleteBtn(i, index) {
      // console.log("index", index);

      const editBodyInfo = _.cloneDeep(this.editBodyInfo);
      editBodyInfo.editList[index].buttonList.splice(i, 1);
      this.editBodyInfo = editBodyInfo;

      // const nextButtonList = _.cloneDeep(this.editModalInfo.buttonList);
      // nextButtonList.splice(index, 1);
      // console.log(nextButtonList);
      // this.editModalInfo = Object.assign(this.editModalInfo, {
      //   buttonList: nextButtonList,
      // });
    },
    handleChangeSystemKeyButton(val, i, index) {
      console.log(val, i, index);
      //  更换顶层按钮类型后，需要先清空按钮的url和values
      // this.$set(
      //   this.editModalInfo.buttonList,
      //   index,
      //   Object.assign(this.editModalInfo.buttonList[index], {
      //     url: "",
      //     values: null,
      //   })
      // );
      this.$set(
        this.editBodyInfo.editList[index].buttonList,
        i,
        Object.assign(this.editBodyInfo.editList[index].buttonList[i], {
          url: "",
          values: null,
        })
      );
      // if (val === "nation") {
      //   this.$set(
      //     this.editModalInfo.buttonList,
      //     index,
      //     Object.assign(this.editModalInfo.buttonList[index], {
      //       values: buttonMap.nation.values,
      //     })
      //   );
      //   console.log(this.editModalInfo.buttonList[index].values);
      // } else if (val === "bindUser" || val === "theme" || val === "start") {
      //   this.$set(
      //     this.editModalInfo.buttonList,
      //     index,
      //     Object.assign(this.editModalInfo.buttonList[index], {
      //       url: buttonMap[val].value,
      //       isCallback: buttonMap[val].isCallback,
      //       subType: buttonMap[val].subType,
      //     })
      //   );
      // } else if (val === "url") {
      // }
      // return void 0;
      const editBodyInfo = _.cloneDeep(this.editBodyInfo);

      if (val === "nation") {
        // this.$set(
        //   this.editBodyInfo.editList[index].buttonList,
        //   i,
        //   Object.assign(this.editBodyInfo.editList[index].buttonList[i], {
        //     values: buttonMap.nation.values,
        //   })
        // );
        // console.log(this.editBodyInfo[index].editList.buttonList.values);

        editBodyInfo.editList[index].buttonList[i] = Object.assign(
          this.editBodyInfo.editList[index].buttonList[i],
          {
            values: buttonMap.nation.values,
          }
        );
      } else if (val === "bindUser" || val === "theme" || val === "start") {
        editBodyInfo.editList[index].buttonList[i] = Object.assign(
          this.editBodyInfo.editList[index].buttonList[i],
          {
            url: buttonMap[val].value,
            isCallback: buttonMap[val].isCallback,
            subType: buttonMap[val].subType,
          }
        );
        // this.$set(
        //   this.editBodyInfo.editList[index].buttonList,
        //   i,
        //   Object.assign(this.editBodyInfo.editList[index].buttonList[i], {
        //     url: buttonMap[val].value,
        //     isCallback: buttonMap[val].isCallback,
        //     subType: buttonMap[val].subType,
        //   })
        // );
      } else if (val === "url") {
      }
      this.editBodyInfo = editBodyInfo;
      this.$nextTick(() => {
        console.log(
          "\n更新系统类型后  buttonList => ",
          this.editBodyInfo.editList[index].buttonList
        );
        console.log(
          "\n更新系统类型后 this.editBodyInfo => ",
          this.editBodyInfo
        );
      });
    },
    handleChangeNationSelect($event, i, index) {
      console.log("=>>", $event, i, index);
      const editBodyInfo = _.cloneDeep(this.editBodyInfo);
      editBodyInfo.editList[index].buttonList[i].url = $event;
      this.editBodyInfo = editBodyInfo;
      // console.log(2021, this.editBodyInfo.editList[0].buttonList);
    },
    handleChangeInput($event, i, index, key) {
      console.log("=>>", $event, i, index);
      const editBodyInfo = _.cloneDeep(this.editBodyInfo);
      editBodyInfo.editList[index].buttonList[i][key] = $event;
      this.editBodyInfo = editBodyInfo;
    },
    handleAddButton(item, index) {
      const emptyButton = Object.assign(_.cloneDeep(this.emptyButton), {
        hash: getHashCode(),
      });

      const editBodyInfo = _.cloneDeep(this.editBodyInfo);
      editBodyInfo.editList[index].buttonList.push(emptyButton);
      this.editBodyInfo = editBodyInfo;
    },
    handleCreate() {
      this.editVisible = true;
      this.editTitle = "新增语言管理";
      this.editBodyInfo = {
        editList: [
          {
            content: "",
            nation: "en",
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
      // this.$nextTick(() => {
      //   this.$refs["modalForm"].clearValidate();
      // });
      this.editVisible = true;
      this.editTitle = "编辑语言管理";
      this.editableTabsValue = "0";
      this.editBodyInfo = {
        editList: [
          {
            content: "",
            nation: "en",
            buttonList: [],
          },
        ],
      };
      item.relaList.forEach((o, i) => {
        const buttonList = JSON.parse(o.buttonArray || "[]");
        buttonList.forEach((btn, index) => {
          if (btn.type === "nation") {
            btn = {
              // hash: getHashCode(),
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
              // hash: getHashCode(),
              text: btn.text,
              type: btn.subType,
              subType: btn.subType,
              url: btn.url,
              isCallback: btn.isCallback,
            };
            buttonList[index] = btn;
          }
          Object.assign(btn, {
            hash: getHashCode(),
          });
        });

        // console.log("edit buttonList =>", buttonList);
        o.buttonList = buttonList;
      });
      console.log("\n 1=>>>", this.editBodyInfo, "\n <====");
      this.$set(this.editBodyInfo, "editList", item.relaList);
      this.$set(this.editBodyInfo, "originId", item.originId);
      console.log("\n 2=>>>", this.editBodyInfo, "\n <====");

      return void 0;
      // this.editModalInfo = item;
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
      //     };
      //     buttonList[index] = item;
      //   }
      // });
      // console.log("edit buttonList =>", buttonList);
      // this.editModalInfo = {
      //   content: item.content,
      //   id: item.id,
      //   nation: item.nation,
      //   buttonList,
      // };
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
        o.type = "nation";
        o.parentId = -1;
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

      // console.log(this.editModalInfo);
      // return
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
      //       };
      //     }
      //   );

      //   console.log("buttonList:", buttonList);
      //   editModalInfo.buttonList = buttonList;

      //   let params = {
      //     type: "main",
      //     nation: editModalInfo.nation,
      //     parentId: -1,
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
