<template>
  <div class="container people-import" style="background-color:#ffffff">
    <div class="content">
      <div class="Navigation">
        <div :style="title_tep_1" class="tep_1 tep tep_div">
          <span>数据导入</span>
          <div v-bind:style="title_tep_1"></div>
        </div>
      </div>
      <div v-if="peopleImportStep == 1" class="first-step">
        <div class="info">
          <p>提示:</p>
          <p>
            <span>第一步：</span>
            <span>先下载Excel文档模板</span>
            <a
              :href="downloadUrl"
              download="https://oss.membert.chinajinmao.cn/cigarette/importSmoke.xlsx"
            >下载模板</a>
          </p>
          <p>
            <span>第二步：</span>
            <span>下载后，填写需要导入的列数据，标红列为必填项</span>
          </p>
          <p>
            <span>第三步：</span>
            <span>选择需要导入的数据进行导入</span>
            <!--<span class="error">导入文件总大小不能超过2G</span>-->
          </p>
        </div>
        <div class="operation">
          <el-form
            id="importForm"
            method="post"
            enctype="multipart/form-data"
            :model="upload.addFile"
            :rules="upload.addFileRules"
            ref="uploadForm"
            :label-width="labelWidth"
            class="demo-ruleForm"
          >
            <el-form-item
              class="el-form-item"
              required
              :label="'烟草信息'"
              prop="fileUpLoad"
              :error="excelEmptyMsg"
            >
              <span>Excel文件</span>
              <input @change="getUploadFile" type="file">
            </el-form-item>
            <!-- <el-form-item class="el-form-item">
              <el-button class="button-md" size="medium" type="primary" :disabled="!operable">下一步</el-button>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import XLSX from "xlsx";
import { importStock } from "@/api/api";
import Cookie from "js-cookie";
import { mapGetters } from "vuex";
import { MessageBox } from "element-ui";
import table from "@/mixins/table";
export default {
  name: "Import",
  mixins: [table],
  data() {
    return {
      userId: "",
      operable: true,

      table: {},
      magicHeight: 261,
      tableTnB: 60,
      cellHeight: 76,
      // magicHeight: 51 + 20 + 35 + 42 + 40,

      excelEmptyMsg: "",
      batchImportResultCount: {},
      loading: {},

      //后期可用于做进度条
      batchState: {
        index: 0,
        total: 0,
        curUserBatch: false,
        batchStateType: 0,
        userId: -1
      },

      //本次开发使用的状态码
      batchStatus: "",

      loading: null,
      stateTimerId: null,

      peopleImportStep: 1,
      title_tep_1: {
        backgroundColor: "#38adff",
        color: "#fff"
      },
      //上传相关信息
      action: "/ihome-owner/api/person/batch/batchAddPermanentPreview",
      upload: {
        excelList: [],
        folderFileCount: 0,
        fileList: [],
        addFile: {},
        addFileRules: {
          fileUpLoad: [
            { required: true, message: "人员信息不能为空", trigger: "blur" }
          ]
        }
      }
    };
  },
  computed: {
    downloadUrl() {
      return `https://oss.membert.chinajinmao.cn/cigarette/importSmoke.xlsx`;
    },
    labelWidth() {
      return "140px";
    }
  },
  mounted() {},
  methods: {
    getUploadFile(e) {
      //拿到所导入文件的名字
      var _this = this;
      let fileName = e.target.files[0];
      //定义reader，存放文件读取方法
      let reader = new FileReader();
      //启动函数
      reader.readAsBinaryString(fileName);
      //onload在文件被读取时自动触发
      reader.onload = function(e) {
        //workbook存放excel的所有基本信息
        let workbook = XLSX.read(e.target.result, { type: "binary" });
        //定义sheetList中存放excel表格的sheet表，就是最下方的tab
        let sheetList = workbook.SheetNames;
        //存放json数组格式的表格数据
        let resultJson = [];
        //存放字符串数组格式的表格数据
        let resultFormulae = [];
        sheetList.forEach(function(y) {
          let worksheet = workbook.Sheets[y];
          let json = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
          let formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[y]);
          if (json.length > 0) {
            //具体如何处理看项目需求，我的项目其实只有一个sheet，在这里写成循环避免大家误会
            //数据处理与存放
            resultJson.push(json);
            resultFormulae.push(formulae);
          }
        });
        var newresult = [];
        resultJson[0].map(ele => {
          var obj = {};
          for (const key in ele) {
            if (key.trim() == "商铺ID") {
               obj.shopsId = ele[key];
            }
            if (key.trim() == "操作数量") {
              obj.operationStock = ele[key];
            }
            if (key.trim() == "烟草编码") {
              obj.cigaretteId = ele[key];
            }
          }
           newresult.push(obj)
        });
        _this.postImportStock(newresult)
      };
    },
    postImportStock(data) {
      importStock(data).then(res=>{
         if(res.code == '0000'){
            this.$confirm(`${res.msg},点击确定回列表页`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push({path:'/regional'});
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消回列表页,可以继续导入'
              });          
            });
         }
         else{
           this.$message.error(res.msg);
         }
      }).catch(err=>{

      })
    },
    // 上传 loading 提示
    showLoading() {
      let warningTemplate = `<div class="loading-content">
          <div style="font-size:40px;color:blue;margin-bottom:15px;">
            <i class="el-icon-loading"></i>
          </div>
          <div style="margin-bottom:15px">
            <span> 正在上传人员信息，请耐心等待 </span>
          </div>
        </div>`;
      MessageBox.alert(warningTemplate, " ", {
        showConfirmButton: false,
        dangerouslyUseHTMLString: true,
        customClass: "loading-box",
        center: true,
        callback: action => {
          this.abortConfirm();
        }
      });
    },
    // 数据解析时是否返回列表页 confirm
    confirmToLeave() {
      MessageBox.confirm(
        "正在处理人员信息，可点击“确定”返回人员管理页面等候，或进行其他操作",
        "提示",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(_ => {
          clearInterval(this.stateTimerId);
          this.$router.push({ path: "/personnel/permanentPersonnel" });
        })
        .catch(_ => {});
    },
    // 生成第二步的预览数据
    generatePreview() {
      let data = Object.assign(
        {},
        { tenantId: this.tenantId, userId: this.userId },
        this.preview.pager
      );
      this.$store
        .dispatch("GetPreviewPermanent", data)
        .then(res => {
          if (res.status === 200) {
            this.preview.table = res.entity.content;
            this.preview.pager.totalElements = res.entity.totalElements;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(_ => {});
    },
    // 上一步：到第一步，上传页面。 清空已上传的缓存文件
    backToFirst() {
      let data = Object.assign(
        {},
        { tenantId: this.tenantId, userId: this.userId, state: 0 }
      );
      this.$store
        .dispatch("ClearImportCache", data)
        .then(_ => {
          this.upload.excelList = [];
          this.operable = true;
          this.setupFirstStep();
        })
        .catch(_ => {});
    },
    // 开始导入操作
    importOk() {
      //取消同步操作，不再使用loading等待
      // this.loading = this.$loading({
      //   lock: true,
      //   text: '数据正在导入，请稍等...',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      Cookie.set("isWatingToImport", "true");
      let params = Object.assign(
        {},
        { tenantId: this.tenantId, userId: this.userId }
      );
      this.$store
        .dispatch("CompleteImportPermanent", params)
        .then(_ => {
          MessageBox.close();
          this.$notify({
            title: "提示",
            message: "数据正在导入...",
            duration: 3000
          });
          this.parseingData();
          // this.stateTimerId = setInterval(this.checkImportState, 5000)
        })
        .catch(error => {
          this.loading.close();
          this.importAgain();
        });
    },
    // 重试导入
    importAgain() {
      this.$confirm("导入失败！", "提示", {
        confirmButtonText: "再试一次",
        cancelButtonText: "取消操作",
        type: "warning",
        center: true
      })
        .then(() => {
          this.importOk();
        })
        .catch(() => {
          this.backToFirst();
        });
    },
    // 生成导入结果列表
    generateResult() {
      let data = Object.assign(
        {},
        { tenantId: this.tenantId, userId: this.userId },
        this.result.pager
      );
      return this.$store
        .dispatch("GetPreviewPermanent", data)
        .then(res => {
          this.result.table = res.entity.content;
          this.result.pager.totalElements = res.entity.totalElements;
        })
        .catch(_ => {});
    },
    // 跳到第三步导入结果展示
    setupThirdStep() {
      this.peopleImportStep = 3;
      this.contentHeight -= 26;
      this.title_tep_1.backgroundColor = "#73c5ff";
      this.title_tep_2.backgroundColor = "#73c5ff";
      this.title_tep_1.color = "#fff";
      this.title_tep_2.color = "#fff";
      this.title_tep_3.backgroundColor = "#38adff";
      this.title_tep_3.color = "#fff";
      this.generateResult();
      //暂未使用
      // this.getBatchImportResultCount()
    },
    // 获取导入结果的成功失败统计
    getBatchImportResultCount() {
      this.$store
        .dispatch("GetBatchImportResultCount")
        .then(res => {
          this.batchImportResultCount = res;
        })
        .catch(_ => {});
    },
    // 导入完成 返回人员列表界面，清空导入数据
    backToList() {
      let data = Object.assign(
        {},
        { tenantId: this.tenantId, userId: this.userId, state: 0 }
      );
      this.$store
        .dispatch("ClearImportCache", data)
        .then(_ => {
          Cookie.remove("isWatingToImport");
          this.$router.replace({ path: "/personnel/permanentPersonnel" });
        })
        .catch(_ => {});
    },
    changePageSize(val) {
      this.result.pager.size = val;
      this.result.pager.page = 1;
      this.generateResult();
    },
    gotoPage(val) {
      this.result.pager.page = val;
      this.generateResult();
    },
    changePreviewPageSize(val) {
      this.preview.pager.size = val;
      this.preview.pager.page = 1;
      this.generatePreview();
    },
    gotoPreviewPage(val) {
      this.preview.pager.page = val;
      this.generatePreview();
    }
  },
  handleParsingError() {
    this.setupFirstStep();
    clearInterval(this.stateTimerId);
    // 解析失败，目前解析失败很可能是文件错误，所以清空缓存数据，让用户重新上传
    this.$notify.error({
      title: "导入失败",
      message: "人员导入操作失败",
      duration: 3000
    });
    let data = Object.assign(
      {},
      { tenantId: this.tenantId, userId: this.userId, state: 0 }
    );
    this.$store.dispatch("ClearImportCache", data);
    MessageBox.close();
  },
  beforeDestroy() {
    //退出页面可以清除缓存
    /*
       let data = Object.assign({},{tenantId:this.tenantId,userId:this.userId,state: 0})
      if(this.batchState.curUserBatch && this.batchState.batchStateType === 4){
        this.$store.dispatch('ClearImportCache',data)
      }
      */
  }
};
</script>
<style>
.first-step .button-md,
.second-step .button-md,
.third-step .button-md {
  width: 98px;
}
.first-step .operation {
  margin-top: 39px;
  padding-left: 100px;
}

.first-step .info {
  background-color: #fbeedc;
  min-height: 100px;
  margin-top: 11px;
  border-left: 4px solid #ef8c50;
  padding: 8px 0 8px 18px;
  font-size: 14px;
}

.first-step .info > p {
  margin: 0;
  line-height: 25px;
  color: #d66e29;
}
.people-import .content {
  box-sizing: border-box;
  padding: 10px;
}
.people-import .el-upload-list__item {
  display: inline-block;
  width: 200px;
}
.Navigation {
  font-size: 15px;
  color: #282828;
  height: 36px;
  background-color: #eceff4;
}

.Navigation > .tep {
  line-height: 36px;
  text-align: center;
  float: left;
  width: 33%;
  position: relative;
}

.tep_div > div {
  position: absolute;
  border: 4px solid #fff;
  border-bottom: 0;
  border-left: 0;
  border-radius: 5px;
  top: 3px;
  right: -13px;
  width: 24px;
  height: 26px;
  transform: rotate(45deg);
  z-index: 2;
}

.people-import .el-form-item {
  margin-bottom: 16px;
}

.el-form-item2 {
  margin-bottom: 0;
}

.people-import .result {
  font-size: 14px;
  margin-top: 18px;
}

.error {
  color: red;
}
.text-error {
  color: red;
}
.text-success {
  color: green;
}
/* .tablePagination {
    margin-top: 18px;
  } */
.loading-box {
  width: 200px !important;
  height: 135px !important;
}
.el-message-box__headerbtn {
  z-index: 2001;
}
.loading-content {
  position: relative !important;
  bottom: 35px !important;
}
.import-result-count {
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  padding-left: 18px;
  margin-top: -18px;
}
.people-import .el-upload-list {
  display: inline-block;
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  height: 15px;
  top: 6px;
}
.people-import .upload-item {
  display: inline-block;
  padding: 0 10px;
}
.people-import .el-upload-list__item:first-child {
  margin-top: 0;
}
</style>
