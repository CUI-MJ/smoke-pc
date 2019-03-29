<template>
  <div class="page-container parkList">
    <div class="title">公告管理</div>
    <div ref="searchBar" class="operations-bar">
      <div class="right">
        <el-form :inline="true" :model="searchBar">
          <el-form-item label="公告类型:">
            <el-select v-model="searchBar.type" placeholder="请选择公告类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @blur="getblurType"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公告名称:">
            <el-input v-model="searchBar.title" autocomplete placeholder="输入公告名称进行搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="button-sel" type="primary" @click="search">查询</el-button>
            <el-button class="button-rs" @click="reset">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="left">
        <el-button class="button-add" @click="addclick" v-if="getUserType !=2">
          <font-awesome-icon style="margin-right: 5px" :icon="['fas', 'plus-circle']" rotate="90"/>新增
        </el-button>
        <!-- <el-button class="button-rm" @click="multiRemove"><font-awesome-icon style="margin-right: 5px" :icon="['fas', 'trash-alt']" rotate="90" />批量删除</el-button> -->
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      class="pages-table"
      v-loading="isLoading"
      :max-height="tableheight"
      :header-row-style="{height:0}"
      :header-cell-style="{padding:0}"
      :row-style="{height:0}"
      :cell-style="{padding:0}"
      :data="entity"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="title" label="公告名称"></el-table-column>
      <el-table-column prop="type" label="公告类型"></el-table-column>
      <el-table-column label="公告状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">已发布</span>
          <span v-if="scope.row.status == 0">未发布</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="getUserType !=2">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            class="but-f"
            @click="push(scope.row,0)"
          >撤回</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            class="but-f"
            @click="push(scope.row,1)"
          >发布</el-button>
          <el-button type="text" class="but-f" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" class="but-f" @click="push(scope.row,2)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <page :totalLength="total" :number="pageSize" v-on:listenToChildEvent="showMsgFromChild"/>
    <!-- 添加园区 -->
    <el-dialog :title="modelTitle" :visible.sync="addVisible" width="40%" class="addfrom">
      <el-form :model="addFrom">
        <div class="Formtitle">公号信息</div>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>公告名称</span>
          </label>
          <el-input v-model="addFrom.title" autocomplete="off" placeholder="请输入公告名称"></el-input>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>公告类型</span>
          </label>
          <el-select v-model="addFrom.type" placeholder="请选择公告类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>公告内容</span>
          </label>
          <el-input
            type="textarea"
            :autosize="{ minRows:10, maxRows:20}"
            placeholder="请输入内容"
            v-model="addFrom.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancle">取 消</el-button>
        <el-button type="primary" @click="addsubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//import DepartmentDialog from './departmentDialog'
import listPage from "@/mixins/listPage";
import page from "@/components/Layout/page";
import table from "@/mixins/table";
import { mapMutations ,mapGetters } from "vuex";
import { noticeList, postNotice, putNotice } from "@/api/api";
import { md5, isPoneAvailable, setCookie, checkNumber } from "@/api/function";
export default {
  name: "Config",
  mixins: [listPage, table],
  components: {
    page
  },
  data() {
    return {
      activationVisible: false,
      activationFrom: {
        userName: "",
        password: "",
        passwordChecked: false
      },
      fileList: [],
      modelTitle: "新增公号",
      addVisible: false,
      options: [],
      addFrom: {
        title: "",
        type: "",
        content: ""
      },
      pageNum: 1,
      pageSize: 10,
      tableheight: 500,
      entity: [],
      total: 0,
      isLoading: false,
      searchBar: {
        type: "",
        title: ""
      },
      multipleSelection: [],
      isedit: false,
      typeOptions: [
        {
          value: "政策法规",
          label: "政策法规"
        },
        {
          value: "组内活动",
          label: "组内活动"
        }
      ]
    };
  },
  mounted() {
    this.init();
    console.log(this.getUserType)
  },
  computed: {
     ...mapGetters([
      'getUserType'
     ])
  },
  methods: {
    init() {
      var _this = this;
      var parmas = _this.getseachobj();
      _this.getNoticeList(parmas);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getseachobj() {
      var _this = this;
      let parmas = Object.assign({}, _this.searchBar);
      return parmas;
    },
    //清除重置
    reset() {
      var _this = this;
      _this.searchBar = { type: "", title: "" };
      _this.getNoticeList();
    },
    //模糊查询
    search() {
      var _this = this;
      var parmas = _this.getseachobj();
      _this.getNoticeList(parmas, true);
    },
    //获取列表
    getNoticeList(data, flag) {
      var _this = this;
      let obj = {
        pageNum: _this.pageNum ? _this.pageNum : "",
        pageSize: _this.pageSize ? _this.pageSize : ""
      };
      if (flag === true) {
        obj.pageNum = 1;
      }
      let parmas = Object.assign(obj, data);
      console.log(parmas);
      noticeList(parmas)
        .then(res => {
          if (res.code === "0000") {
            var newList = res.data.list;
            _this.entity = newList;
            _this.total = res.data.total;
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    getblurType(event) {},
    handleClose() {},
    showMsgFromChild(currentPage, pageSize, isrefresh) {
      var _this = this;
      if (_this.pageNum == currentPage && _this.pageSize == pageSize) {
        return false;
      }
      _this.pageNum = currentPage;
      _this.pageSize = pageSize;
      var parmas = _this.getseachobj();
      _this.getNoticeList(parmas);
    },
    // 添加关闭
    addCancle() {
      var _this = this;
      _this.addFrom = {
        title: "",
        type: "",
        content: ""
      };
      _this.addVisible = false;
    },
    addclick() {
      var _this = this;
      _this.fileList = [];
      _this.modelTitle = "新增信息";
      _this.isedit = false;
      _this.addVisible = true;
      _this.addFrom = {
        title: "",
        type: "",
        content: ""
      };
    },
    //添加提交
    addsubmit(flag) {
      var _this = this;
      let parmas = _this.addFrom;
      if (parmas.title == "") {
        this.messageShow("请输入公告标题", "error", false);
        return false;
      }
      if (parmas.type == "") {
        this.messageShow("请选择公告类型", "error", false);
        return false;
      }
      if (parmas.content == "") {
        this.messageShow("请输入公告内容", "error", false);
        return false;
      }
      _this.isLoading = true;
      if (_this.isedit === true) {
        putNotice(parmas)
          .then(res => {
            if (res.code === "0000") {
              this.$message({
                message: res.msg,
                type: "success"
              });
              _this.addCancle();
              _this.init();
              _this.isLoading = false;
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "服务器发生错误，请稍后再试！",
              type: "error"
            });
          });
      } else {
        postNotice(parmas)
          .then(res => {
            if (res.code === "0000") {
              this.$message({
                message: res.msg,
                type: "success"
              });
              _this.addCancle();
              _this.init();
              _this.isLoading = false;
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "服务器发生错误，请稍后再试！",
              type: "error"
            });
          });
      }
    },
    push(data, flag) {
      var _this = this;
      let parmas = {
        id: data.id,
        status: flag
      };
      var text = '';
      if(flag == 0){
        text = '确认撤回此文章?'
      }
      if(flag == 1){
        text = '确认发布此文章?'
      }
      if(flag == 2){
        text = '此操作将永久删除该文章, 是否继续?'
      }
      this.$confirm( text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          putNotice(parmas)
            .then(res => {
              if (res.code === "0000") {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                _this.init();
                _this.isLoading = false;
              } else {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$message({
                message: "服务器发生错误，请稍后再试！",
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 编辑
    edit(data) {
      var _this = this;
      _this.isedit = true;
      _this.modelTitle = "编辑信息";
      _this.addVisible = true;
      _this.addFrom = {
        title: data.title,
        type: data.type,
        content: data.content,
        id: data.id
      };
    },
    //消息提示封装
    messageShow(message, type, isfunc) {
      var _this = this;
      _this.$message({
        message: message,
        type: type,
        onClose: () => {
          if (isfunc) {
            _this.init();
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.operations-bar {
  overflow: hidden;
  width: auto;
  height: auto;
  border: 0px;
  padding: 0px;
}
.el-form-item {
  margin-left: 0px;
}
.parkList {
  margin-top: 0px;
  padding: 20px 0px;
}
/* 激活 */
.activation .el-dialog--center {
  text-align: left;
}

.activation .el-dialog__body {
  margin: 0 18px;
  padding: 0px;
  border-bottom: none;
  border-top: 1px solid #ddd;
}
.activation .activationCheckbox {
  margin: 14px 0px 23px;
}
.activation .activationCheckbox .el-checkbox__label {
  line-height: 17px;
}
/* 添加 */
.addfrom .Formtitle {
  height: 40px;
  padding-left: 17px;
  line-height: 40px;
  font-size: 16px;
  color: #282828;
}
.addfrom .itemlable {
  width: 100px;
}
.addfrom .itemlable .red {
  color: red;
  margin-right: 2px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
