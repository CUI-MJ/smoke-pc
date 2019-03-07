<template>
  <div class="page-container parkList">
    <div class="title">商铺管理</div>
    <div ref="searchBar" class="operations-bar">
      <div class="right">
        <el-form :inline="true" :model="searchBar">
          <!-- company -->
          <el-form-item label="商铺地址:">
            <el-input v-model="searchBar.address" autocomplete placeholder="输入商铺地址进行搜索"></el-input>
          </el-form-item>
          <el-form-item label="商铺名称:">
            <el-input v-model="searchBar.name" autocomplete placeholder="输入商铺名称进行搜索"></el-input>
          </el-form-item>
           <el-form-item label="所属公司:">
            <el-input v-model="searchBar.company"  placeholder=" 请输入所属公司进行搜索"></el-input>
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
        <!-- :disabled="!isImportUsable" -->
        <el-button class="button-sel" @click="batchImport">
          <font-awesome-icon style="margin-right: 5px" :icon="['fas', 'download']" rotate="90"/>
          批量导入
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
      <el-table-column prop="name" label="商铺名称"></el-table-column>
      <el-table-column prop="address" label="商铺地址"></el-table-column>
      <el-table-column prop="company" label="所属公司"></el-table-column>
      <el-table-column prop="phone" label="联系电话"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="userId" label="绑定用户"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="but-f" @click="edit(scope.row)">修改</el-button>
          <!-- <el-button type="text" class="but-f" @click="editnum(scope.row)">编辑库存</el-button> -->
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
        <div class="Formtitle">商铺管理</div>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>商铺名称</span>
          </label>
          <el-input v-model="addFrom.name" autocomplete="off" placeholder="请输入商铺名称"></el-input>
        </el-form-item>
        <el-form-item v-if="!isedit">
          <label class="itemlable">
            <span class="red">*</span>
            <span>商铺地址</span>
          </label>
          <el-input type="tel" v-model="addFrom.address" autocomplete="off" placeholder="请输入商铺地址"></el-input>
        </el-form-item>
         <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>商铺类型</span>
          </label>
          <el-input v-model="addFrom.type" autocomplete="off" placeholder="请输入商铺类型"></el-input>
        </el-form-item>
         <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>联系电话</span>
          </label>
         <el-input v-model="addFrom.phone" autocomplete="off" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span>所属公司</span>
          </label>
         <el-input v-model="addFrom.company" autocomplete="off" placeholder="请输入所属公司"></el-input>
        </el-form-item>
         <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>检索用户</span>
          </label>
         <el-input v-model="addFrom.unit" autocomplete="off" placeholder="请输入检索用户手机号"></el-input>
        </el-form-item>
        <el-form-item>
         <el-button size="mini" @click="userCheck" :disabled="!ischeckUser">点击进行用户检测</el-button>
        </el-form-item>
        <el-form-item>
          <label class="itemlable">
            <span class="red">*</span>
            <span>绑定用户</span>
          </label>
         <el-input v-model="addFrom.userId" autocomplete="off" disabled ></el-input>
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
import { postShopList ,addInventory ,reduceInventory , postShops,putShops,shopsDetails,getByPhone} from '@/api/api'
import { md5 , isPoneAvailable ,setCookie,checkNumber,isTelAvailable} from '@/api/function'
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
      options:[],
      addFrom: {
        address: "",
        company: "",
        name: "",
        phone: '',
        type: "",
        userId: '',
        unit:''
      },
      pageNum: 1,
      pageSize: 10,
      tableheight: 500,
      entity:[],
      total:0,
      isLoading: false,
      searchBar: {
        address: "",
        company:'',
        name:'',
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
      _this.getShopsList(parmas);
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
      if(parmas.company == ''){
        delete parmas.company
      }
      if(parmas.address == ''){
        delete parmas.address
      }
      return parmas;
    },
    //清除重置
    reset() {
      var _this = this;
      _this.searchBar = { name: "", address: "" ,company:'',};
      _this.getShopsList()
    },
    //模糊查询
    search() {
      var _this = this;
      var parmas = _this.getseachobj();
      _this.getShopsList(parmas,true)

    },
    //获取列表
    getShopsList(data,flag) {
      var _this = this;
      let obj = {
        pageNum: _this.pageNum ? _this.pageNum : "",
        pageSize: _this.pageSize ? _this.pageSize : "",
      };
      if(flag === true){
        obj.pageNum =1
      }
      let parmas = Object.assign(obj,data)
      postShopList(parmas).then(res=>{
        console.log(res)
        if(res.code === '0000'){
           var newList = res.data.list;
            _this.entity = newList;
            _this.total = res.data.total;
        }else{
          this.$message({
              message: res.msg,
              type: "error"
          });
        }

      }).catch(err=>{
        this.$message({
              message: '服务器发生错误，请稍后再试！',
              type: "error"
        });
      })
    },
    getblur(event){
      console.log(event,2222)
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
      _this.getShopsList(parmas);
    },
    // 添加关闭
    addCancle() {
      var _this = this;
      _this.addFrom = {
        address: "",
        company: "",
        name: "",
        phone: '',
        type: "",
        userId: '',
        unit:''
      };
      _this.addVisible = false;
    },
    addclick(){
      var _this = this;
      _this.modelTitle = '新增商铺'
      _this.isedit = false;
      _this.addVisible = true;
      _this.addFrom = {
        address: "",
        company: "",
        name: "",
        phone: '',
        type: "",
        userId: '',
        unit:'',
      };
    },
    //添加提交
    addsubmit(flag) {
      var _this = this;
      let parmas = _this.addFrom;
      if(parmas.name == ''){
        this.messageShow('请输入商铺名称','error',false)
        return false;
      }
      if(parmas.address == ''){
        this.messageShow('请输入商铺地址','error',false)
        return false;
      }
      if(parmas.phone == ''){
        this.messageShow('请输入商铺电话','error',false)
        return false;
      }
      if(!(isPoneAvailable(parmas.phone) || isTelAvailable(parmas.phone))){
        this.messageShow('请输入正确的电话格式','error',false)
        return false;
      }
      if(parmas.type == ''){
        this.messageShow('请输入类型','error',false)
        return false;
      }
      _this.isLoading = true;
      delete parmas.unit
      if(_this.isedit === true){
        putShops(parmas).then(res=>{
          console.log(res)
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
        }).catch(err=>{
          this.$message({
              message: '服务器发生错误，请稍后再试！',
              type: "error"
          });
        }) 

      }else{
        postShops(parmas).then(res=>{
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
        }).catch(err=>{
          this.$message({
              message: '服务器发生错误，请稍后再试！',
              type: "error"
          });
        }) 
      }

    },
    // 编辑
    edit(data){
      console.log(data);
      var _this = this;
       _this.isedit = true;
       _this.modelTitle = '编辑信息'
       _this.addVisible = true;
       _this.addFrom = {
        address: data.address,
        company: data.company,
        name: data.name,
        phone: data.phone,
        type: data.type,
        userId: data.userId,
        id:data.id
      }
    },
    //用户检测
    userCheck(){
      var _this  = this;
      _this.ischeckUser = false;
      if(_this.addFrom.unit == ''){
        _this.messageShow('请输入检测用户的手机号','error',false);
        _this.ischeckUser = true;
        return false;
      }
      if(!isPoneAvailable(_this.addFrom.unit)){
        _this.messageShow('请输入正确格式的手机号','error',false);
        _this.ischeckUser = true;
        return false;
      }
      getByPhone(_this.addFrom.unit).then(res=>{
        _this.ischeckUser = true;
        if(res.code === '0000'){
              _this.$message({
                message:'检索成功',
                type: "success"
              });
            _this.addFrom.userId = res.data.id
          }else{
            _this.$message({
              message: res.msg,
              type: "error"
            });
          }
      }).catch(err=>{
        _this.ischeckUser = true;
           _this.$message({
              message: '服务器发生错误，请稍后再试！',
              type: "error"
          });
      })
      console.log(_this.addFrom)
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
    batchImport(){
      this.$router.push({path:'/permanentImport'});
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
