<template>
  <div class="page-container parkList">
    <div class="title">库存管理</div>
    <div ref="searchBar" class="operations-bar">
      <div class="right">
        <el-form :inline="true" :model="searchBar">
          <!-- company -->
          <el-form-item label="商铺名称:">
            <el-input v-model="searchBar.name" autocomplete placeholder="输入商铺名称进行搜索"></el-input>
          </el-form-item>
           <el-form-item label="查询日期:">
              <el-date-picker
                v-model="searchBar.queryDate"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="button-sel" type="primary" @click="search">查询</el-button>
            <el-button class="button-rs" @click="reset">清空</el-button>
          </el-form-item>
        </el-form>
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
      <el-table-column prop="name" label="烟草名称"></el-table-column>
      <el-table-column prop="operationType" label="操作类型"></el-table-column>
      <el-table-column prop="operationStock" label="操作数量"></el-table-column>
      <el-table-column prop="operationUnit" label="操作单位"></el-table-column>
      <el-table-column prop="createDate" label="操作时间"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <page
      :totalLength="total"
      :number="pageSize"
      v-on:listenToChildEvent="showMsgFromChild"
    />
  </div>
</template>
<script>
//import DepartmentDialog from './departmentDialog'
import listPage from "@/mixins/listPage";
import page from "@/components/Layout/page";
import table from "@/mixins/table";
import { mapMutations } from "vuex";
import { stocklog } from '@/api/api'
import { md5 , isPoneAvailable ,setCookie,checkNumber,isTelAvailable,Todate} from '@/api/function'
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
      pageNum: 1,
      pageSize: 10,
      tableheight: 500,
      entity:[],
      total:0,
      isLoading: false,
      searchBar: {
        name:'',
        queryDate:''
      },
      multipleSelection: [],
      isedit:false,
      ischeckUser:true,
    };
  },
  mounted() {
    this.init();
  },
  computed:{   
  },
  methods: {
    init() {
      var _this = this;
      var parmas = _this.getseachobj();
      _this.getStocklogs(parmas);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleInput(){
      this.searchBar.num = this.searchBar.num.replace(/[^\.\d]/g,'');
    },
    getseachobj(){
      var _this  = this;
      let parmas =  Object.assign({}, _this.searchBar);
      if(parmas.name == ''){
        delete parmas.name
      }
      if(parmas.queryDate == ''){
        delete parmas.queryDate
      }
      return parmas;
    },
    //清除重置
    reset() {
      var _this = this;
      _this.searchBar = {name:'', queryDate:''};
      _this.getStocklogs()
    },
    //模糊查询
    search() {
      var _this = this;
      var parmas = _this.getseachobj();
      _this.getStocklogs(parmas,true)

    },
    //获取列表
    getStocklogs(data,flag) {
      var _this = this;
      let obj = {
        pageNum: _this.pageNum ? _this.pageNum : "",
        pageSize: _this.pageSize ? _this.pageSize : "",
      };
      if(flag === true){
        obj.pageNum =1
      }
      let parmas = Object.assign(obj,data)
      stocklog(parmas).then(res=>{
        if(res.code === '0000'){
           var newList = res.data.list;
           newList.map(ele=>{
             if(ele.operationType != '' && ele.operationType == 'REDUCE'){
                ele.operationType = '出货'
             }
             if(ele.operationType != '' && ele.operationType == 'ADD'){
                ele.operationType = '进货'
             }
             if(ele.createDate != ''){
                ele.createDate = ele.createDate.split('T')[0]
             }
           })
            _this.entity = newList;
            _this.total = res.data.total;
        }else{
          this.$message({
              message: res.msg,
              type: "error"
          });
        }

      }).catch(err=>{})
    },
    getblur(event){
    },
    handleClose(){},
    showMsgFromChild(currentPage, pageSize,isrefresh) {
      var _this = this;
      if((_this.pageNum == currentPage) && (_this.pageSize == pageSize)){
         return false;
      }
      _this.pageNum = currentPage;
      _this.pageSize = pageSize;
      var parmas = _this.getseachobj();
      _this.getStocklogs(parmas);
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
  margin-top:0px;
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
</style>
