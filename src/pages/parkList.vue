<template>
  <div class="page-container parkList">
    <div class="title">用户管理</div>
    <div ref="searchBar" class="operations-bar">
      <div class="right">
        <el-form :inline="true" :model="searchBar">           
          <el-form-item label="用户名:">
            <el-input v-model="searchBar.username" placeholder="输入用户名进行搜索"></el-input>
          </el-form-item>
           <el-form-item label="手机号:">
            <el-input v-model="searchBar.phoneNumber" placeholder="输入手机号进行搜索"></el-input>
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
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="phoneNumber" label="手机号"></el-table-column>
      <el-table-column prop="type" label="用户类型"></el-table-column>
      <el-table-column prop="createDate" label="创新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="but-f" @click="edit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <page
      :totalLength="total"
      :number="pageSize"
      v-on:listenToChildEvent="showMsgFromChild"
    />
    <!-- 添加园区 -->
    <el-dialog :title="modelTitle" :visible.sync="addVisible" width="26%" class="addfrom">
      <el-form :model="addFrom">
        <div class="Formtitle">用户信息</div>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>用户名</span>
          </label>
          <el-input v-model="addFrom.username" autocomplete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item v-if="!isedit">
          <label class="itemlable">
            <span class="red">*</span>
            <span>手机号</span>
          </label>
          <el-input type="tel" v-model="addFrom.phoneNumber" autocomplete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>密码</span>
          </label>
          <el-input type="password" v-model="addFrom.password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>用户类型</span>
          </label>
           <el-select v-model="addFrom.type" placeholder="用户类型">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
           </el-select>
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
import { queryUser , postuser, putuser } from '@/api/api'
import { md5 , isPoneAvailable ,setCookie} from '@/api/function'
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
      modelTitle:'新增用户',
      addVisible: false,
      addFrom: {
        username: "",
        type:'',
        phoneNumber:'',
        password: ""
      },
      department: null,
      pageNum: 1,
      pageSize: 10,
      tableheight: 500,
      entity:[],
      total:0,
      isLoading: false,
      searchBar: {
        username: "",
        type:'',
        phoneNumber:''
      },
      multipleSelection: [],
      isedit:false,
      //新增选择器
      options: [{
          value: '1',
          label: '管理员'
        }, {
          value: '2',
          label: '客户经理'
        }, {
          value: '3',
          label: '商铺用户'
        },],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var _this = this;
      var parmas = _this.getseachobj();
      this.getQueryUserList(parmas);
    },
    ...mapMutations(["setTenantId","setParkName"]),
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getseachobj(){
      var _this  = this;
      let parmas =  Object.assign({}, _this.searchBar);
      return parmas;
    },
    //清除重置
    reset() {
      var _this = this;
      _this.searchBar = { userName: "", phoneNumber: "" ,type:''};
      _this.getQueryUserList()
    },
    //模糊查询
    search() {
      var _this = this;
      var parmas = _this.getseachobj();
      _this.getQueryUserList(parmas,true)

    },
    //获取列表
    getQueryUserList(data,flag) {
      var _this = this;
      let obj = {
        pageNum: _this.pageNum ? _this.pageNum : "",
        pageSize: _this.pageSize ? _this.pageSize : "",
      };
      if(flag === true){
        obj.pageNum =1
      }
      let parmas = Object.assign(obj,data)
      queryUser(parmas).then(res=>{
        if(res.code === '0000'){
           var newList = res.data.list;
            newList.map(ele=>{
               if(ele.type == 1){
                 ele.type = '管理员'
               }
               if(ele.type == 2){
                 ele.type = '客户经理'
               }
               if(ele.type == 3){
                 ele.type = '商铺用户'
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

      }).catch(err=>{
      })
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
      _this.getQueryUserList(parmas);
    },
    //进入
    gopage(id,name) {
      var _this = this;
      _this.setTenantId(id);
      _this.setParkName(name)
      _this.$router.push({ path: "/regional", query: { tenantId: id,nama:name} });
    },
    // 添加关闭
    addCancle() {
      var _this = this;
      _this.addFrom = {
        username: "",
        type:'',
        phoneNumber: "",
        password: ""
      };
      _this.addVisible = false;
    },
    addclick(){
      var _this = this;
      _this.modelTitle = '新增用户'
      _this.isedit = false;
      _this.addVisible = true;
      _this.addFrom = {
        username: "",
        type:'',
        phoneNumber: "",
        password: ""
      };
    },
    //添加提交
    addsubmit(flag) {
      var _this = this;
      let parmas = _this.addFrom;
      if(parmas.username == ''){
        this.messageShow('请输入用户名','error',false)
        return false;
      }
      if(parmas.phoneNumber == ''){
        this.messageShow('请输入手机号','error',false)
        return false;
      }
      if(parmas.password == ''){
        this.messageShow('请输入密码','error',false)
        return false;
      }
      if(!(isPoneAvailable(parmas.phoneNumber))){
        this.messageShow('请输入正确的手机号','error',false)
        return false;
      }
      if(parmas.type == ''){
        this.messageShow('请选择用户类型','error',false)
        return false;
      }
      
      parmas.password = md5(parmas.password)
      _this.isLoading = true;
      if(_this.isedit === true){
        putuser(parmas).then(res=>{
          if(res.code === '0000'){         
              this.$message({
                message: res.msg,
                type: "success"
              });
              _this.addCancle();
              _this.init();
              _this.isLoading = false
          }else{
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        }).catch(err=>{}) 

      }else{
        postuser(parmas).then(res=>{
          if(res.code === '0000'){
              this.$message({
                message: res.msg,
                type: "success"
              });
              _this.addCancle();
              _this.init();
              _this.isLoading = false
          }else{
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        }).catch(err=>{}) 
      }

    },
    // 编辑
    edit(data){
      var _this = this;
       _this.isedit = true;
       _this.modelTitle = '编辑用户'
       _this.addVisible = true;
       _this.addFrom = {
        username: data.username,
        type:data.type,
        phoneNumber: data.phoneNumber,
        password : data.password,
        id :data.id
      }
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
