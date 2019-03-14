<template>
  <div class="page-container parkList">
    <div class="title">烟草管理</div>
    <div ref="searchBar" class="operations-bar">
      <div class="right">
        <el-form :inline="true" :model="searchBar">
          <el-form-item>
            <el-select v-model="searchBar.firmId" placeholder="请选择厂商">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @blur="getblur"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称:">
            <el-input v-model="searchBar.name" autocomplete placeholder="输入商品名称进行搜索"></el-input>
          </el-form-item>
          <el-form-item label="商品编码:">
            <el-input
              v-model="searchBar.num"
              :value="searchBar.num"
              @keyup.native="handleInput"
              placeholder=" 请输入商品编码进行搜索"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="button-sel" type="primary" @click="search">查询</el-button>
            <el-button class="button-rs" @click="reset">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="left">
        <el-button class="button-add" @click="addclick">
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
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="num" label="商品编码"></el-table-column>
      <el-table-column prop="tradePrice" label="批发价"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="but-f" @click="edit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <page :totalLength="total" :number="pageSize" v-on:listenToChildEvent="showMsgFromChild"/>
    <!-- 添加园区 -->
    <el-dialog :title="modelTitle" :visible.sync="addVisible" width="26%" class="addfrom">
      <el-form :model="addFrom">
        <div class="Formtitle">烟草信息</div>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>商品名称</span>
          </label>
          <el-input v-model="addFrom.name" autocomplete="off" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item v-if="!isedit">
          <label class="itemlable">
            <span class="red">*</span>
            <span>商品编码</span>
          </label>
          <el-input type="tel" v-model="addFrom.num" autocomplete="off" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>烟草厂商</span>
          </label>
          <el-select v-model="addFrom.firmId" placeholder="请选择厂商">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @blur="getblur"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>零售价</span>
          </label>
          <el-input v-model="addFrom.retailPrice" autocomplete="off" placeholder="请输入零售价"></el-input>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>批发价</span>
          </label>
          <el-input v-model="addFrom.tradePrice" autocomplete="off" placeholder="请输入批发价"></el-input>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>种类</span>
          </label>
          <el-input v-model="addFrom.type" autocomplete="off" placeholder="请输入类型"></el-input>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>单位</span>
          </label>
          <el-input v-model="addFrom.unit" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>上传图片</span>
          </label>
          <el-upload
            class="upload-demo"
            action="/file/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handlesuccess"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span></span>
          </label>
          <img v-if="addFrom.signPic && isedit" :src="addFrom.signPic" class="avatar">
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
import { mapMutations } from "vuex";
import {
  firmList,
  cigaretteList,
  postCigarette,
  putCigarette
} from "@/api/api";
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
      modelTitle: "新增用户",
      addVisible: false,
      options: [],
      addFrom: {
        firmId: "",
        name: "",
        num: "",
        retailPrice: "",
        signPic: "",
        tradePrice: "",
        type: "",
        unit: "条"
      },
      pageNum: 1,
      pageSize: 10,
      tableheight: 500,
      entity: [],
      total: 0,
      isLoading: false,
      searchBar: {
        name: "",
        num: "",
        firmId: ""
      },
      multipleSelection: [],
      isedit: false
    };
  },
  mounted() {
    this.init();
  },
  computed: {},
  methods: {
    init() {
      var _this = this;
      var parmas = _this.getseachobj();
      _this.getCigaretteList(parmas);
      _this.getFirmList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleInput() {
      this.searchBar.num = this.searchBar.num.replace(/[^\.\d]/g, "");
    },
    getseachobj() {
      var _this = this;
      let parmas = Object.assign({}, _this.searchBar);
      if (parmas.name == "") {
        delete parmas.name;
      }
      if (parmas.num == "") {
        delete parmas.num;
      }
      if (parmas.firmId == "") {
        delete parmas.firmId;
      } else {
        parmas.firmId = Number(parmas.firmId);
      }
      return parmas;
    },
    //清除重置
    reset() {
      var _this = this;
      _this.searchBar = { name: "", num: "", firmId: "" };
      _this.getCigaretteList();
    },
    //模糊查询
    search() {
      var _this = this;
      var parmas = _this.getseachobj();
      _this.getCigaretteList(parmas, true);
    },
    //获取列表
    getCigaretteList(data, flag) {
      var _this = this;
      let obj = {
        pageNum: _this.pageNum ? _this.pageNum : "",
        pageSize: _this.pageSize ? _this.pageSize : ""
      };
      if (flag === true) {
        obj.pageNum = 1;
      }
      let parmas = Object.assign(obj, data);
      cigaretteList(parmas)
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
    //获取厂商列表
    getFirmList() {
      var _this = this;
      firmList()
        .then(res => {
          if (res.code === "0000") {
            _this.options = res.data;
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
    },

    getblur(event) {},
    handleClose() {},
    showMsgFromChild(currentPage, pageSize, isrefresh) {
      var _this = this;
      if (_this.pageNum == currentPage && _this.pageSize == pageSize) {
        return false;
      }
      _this.pageNum = currentPage;
      _this.pageSize = pageSize;
      var parmas = _this.getseachobj();
      _this.getCigaretteList(parmas);
    },
    // 添加关闭
    addCancle() {
      var _this = this;
      _this.addFrom = {
        username: "",
        isShops: false,
        isAdmin: false,
        phoneNumber: "",
        password: "",
        signPic: ""
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
        firmId: "",
        name: "",
        num: "",
        retailPrice: "",
        tradePrice: "",
        type: "",
        unit: "条",
        signPic: ""
      };
    },
    //添加提交
    addsubmit(flag) {
      var _this = this;
      let parmas = _this.addFrom;
      if (parmas.firmId == "") {
        this.messageShow("请选择厂商", "error", false);
        return false;
      }
      if (parmas.name == "") {
        this.messageShow("请输入商品名称", "error", false);
        return false;
      }
      if (parmas.num == "") {
        this.messageShow("请输入商品编码", "error", false);
        return false;
      }
      if (parmas.retailPrice == "") {
        this.messageShow("请输入零售价", "error", false);
        return false;
      }
      if (parmas.tradePrice == "") {
        this.messageShow("请输入批发价", "error", false);
        return false;
      }
      if (parmas.type == "") {
        this.messageShow("请输入类型", "error", false);
        return false;
      }
      parmas.retailPrice = Number(parmas.retailPrice);
      if (!checkNumber(parmas.firmId)) {
        _this.options.map(ele => {
          if (ele.label == parmas.firmId) {
            parmas.firmId = Number(ele.value);
          }
        });
      } else {
        parmas.firmId = Number(parmas.firmId);
      }
      _this.isLoading = true;
      if (_this.isedit === true) {
        putCigarette(parmas)
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
        postCigarette(parmas)
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
    // 编辑
    edit(data) {
      var _this = this;
      _this.isedit = true;
      _this.fileList = [];
      _this.modelTitle = "编辑信息";
      _this.addVisible = true;
      var firmId = "";
      _this.options.map(ele => {
        if (ele.value == data.firmId) {
          firmId = ele.label;
        }
      });
      _this.addFrom = {
        firmId: firmId,
        name: data.name,
        num: data.num,
        retailPrice: data.retailPrice,
        tradePrice: data.tradePrice,
        type: data.type,
        unit: data.unit,
        id: data.id,
        signPic: data.signPic
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
    },
    //文件上传
    handleRemove(file, fileList) {
      this.addFrom.signPic = "";
    },
    handlePreview(file) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handlesuccess(response, file, fileList) {
      this.addFrom.signPic = response;
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
