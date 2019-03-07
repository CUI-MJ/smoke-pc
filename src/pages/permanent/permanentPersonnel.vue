<template>
  <div id="permanent" class="page-container">
    <div class="title">常驻人员</div>
    <div ref="searchBar" class="access-bar">
      <div class="right">
        <el-form :inline="true" :model="searchBar" class="demo-form-inline">
          <div>
            <el-form-item label="业主姓名：">
              <el-input v-model="searchBar.name" placeholder="请输入业主姓名"  maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：">
              <el-input v-model="searchBar.phone" placeholder="请输入联系方式"  maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="房 间 号：">
              <el-input v-model="searchBar.code" placeholder="请输入联系方式"  maxlength="10"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="一级分区：">
            <el-select v-model="searchBar.firstAreaId" placeholder="请选择一级分区"
                       @change="getAreaOption(2,searchBar.firstAreaId)">
              <el-option
                v-for="item in areaInfo.firstArea"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分区：">
            <el-select v-model="searchBar.secondAreaId" placeholder="请选择二级分区"
                       @change="getAreaOption(3,searchBar.secondAreaId)">
              <el-option
                v-for="item in areaInfo.secondArea"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="三级分区：">
            <el-select v-model="searchBar.thirdAreaId" placeholder="请选择三级分区"
                       @change="getAreaOption(4,searchBar.thirdAreaId)">
              <el-option
                v-for="item in areaInfo.thirdArea"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="四级分区：">
            <el-select v-model="searchBar.fourthAreaId" placeholder="请选择四级分区">
              <el-option
                v-for="item in areaInfo.fourthArea"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="button-sel" type="primary" @click="search">查询</el-button>
            <el-button class="button-rs" @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="left">
        <el-button class="button-add" @click="permanent={}">
          <font-awesome-icon style="margin-right: 5px" :icon="['fas', 'plus']" rotate="90"/>
          添加
        </el-button>
        <el-button class="button-sel" @click="batchImport">
          <font-awesome-icon style="margin-right: 5px" :icon="['fas', 'download']" rotate="90"/>
          批量导入
        </el-button>
        <el-button class="button-rm" @click="deletePeople">
          <font-awesome-icon style="margin-right: 5px" :icon="['fas', 'trash-alt']" rotate="90"/>
          删除
        </el-button>
      </div>
    </div>

    <el-table :max-height="tableHeight" :data="table.content" class="data-table" style="width: 100%" border
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        :label="'照片'" width="150">
        <template slot-scope="scope">
          <img width="54" height="58" style="vertical-align: middle;" :src="scope.row.pic"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="'业主姓名'">
      </el-table-column>
      <el-table-column :label="'联系方式'" prop="phone" show-overflow-tooltip></el-table-column>
      <el-table-column
        :label="'一级分区'">
        <template slot-scope="scope">
          {{scope.row.firstAreaName || '无'}}
        </template>
      </el-table-column>
      <el-table-column :label="'二级分区'">
        <template slot-scope="scope">
          {{scope.row.secondAreaName || '无'}}
        </template>
      </el-table-column>
      <el-table-column :label="'三级分区'">
        <template slot-scope="scope">
          {{scope.row.thirdAreaName || '无'}}
        </template>
      </el-table-column>
      <el-table-column :label="'四级分区'">
        <template slot-scope="scope">
          {{scope.row.fourthAreaName || '无'}}
        </template>
      </el-table-column>
      <el-table-column :label="'房间号'" prop="code"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="padding-left:0px"
            @click="edit(scope.row)">
            编辑
          </el-button>
          <el-button
            type="text"
            style="padding-left:0px"
            @click="detail(scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--:current-page="table.page+1"-->
    <div class="tablePagination">
      <el-pagination background
                     @size-change="changePageSize"
                     @current-change="changePageNumber"
                     :current-page="searchParams.page"
                     :page-sizes="[10,20,50]"
                     :page-size="table.size"
                     layout="total, sizes, jumper, next, pager, prev"
                     :total="table.totalElements">
      </el-pagination>
    </div>
    <permanent-dialog v-if="permanent" :data="permanent" @close="permanent=null;refreshList()"></permanent-dialog>
    <detail-dialog v-if="detailInfo" :data="detailInfo" @close="detailInfo=null"></detail-dialog>
  </div>
</template>
<script>
  import listPage from '@/mixins/listPage'
  import table from '@/mixins/table'
  import {mapGetters,mapActions} from 'vuex'
  import Permanent from '@/api/permanent'
  import Area from '@/api/area'
  import detailDialog from './detailDialog'
  import PermanentDialog from './permanentDialog'

  export default {
    name: 'Access',
    mixins: [listPage, table],
    mixins: [table],
    components: {
      PermanentDialog,
      detailDialog
    },
    data() {
      return {
        table: {},
        searchBar: {
          name: '',
          phone: '',
          code: '',
          firstAreaId: '',
          secondAreaId: '',
          thirdAreaId: '',
          fourthAreaId: ''
        },
        searchParams: {
          page: 1,
          size: 10
        },
        multipleSelection: [],
        //分区联动
        areaInfo: {
          firstArea: [],
          secondArea: [],
          thirdArea: [],
          fourthArea: []
        },
        //启动add_dialog
        permanent: null,
        detailInfo:null,
        cellHeight: 71,
        magicHeight: 51 + 20 + 35 + 42 + 40
      }
    },
    computed:{
      ...mapGetters(['tenantId'])
    },
    mounted() {
      this.refreshList();
      this.getAreaOption(1);
    },
    methods: {
      ...mapActions(['GetPermanentList']),
      getAreaOption(flag, parentId) {
        let params = {};
        if (parentId) {
          params = Object.assign({
            tenantId: this.tenantId,
            parentId: parentId
          })
        } else {
          params = Object.assign({
            tenantId: this.tenantId
          })
        }
        Area.getAreaOptions(params)
          .then(res => {
            if (flag === 1) {
              this.areaInfo.firstArea = res.entity;
              this.searchBar.secondAreaId = '';
              this.searchBar.thirdAreaId = '';
              this.searchBar.fourthAreaId = '';
            } else if (flag === 2) {
              this.areaInfo.secondArea = res.entity;
              this.searchBar.secondAreaId = '';
              this.searchBar.thirdAreaId = '';
              this.searchBar.fourthAreaId = '';
            } else if (flag === 3) {
              this.areaInfo.thirdArea = res.entity;
              this.searchBar.fourthAreaId = '';
            } else {
              this.areaInfo.fourthArea = res.entity;
            }
          });
      },
      refreshList() {
        this.searchBar = Object.assign({}, this.searchBar, this.searchParams);
        this.searchBar.tenantId = this.tenantId;
        Permanent.getPermanentList(this.searchBar).then(res => {
          if (res.status === 200) {
            this.table = res.entity;
            console.log(this.table)
          }
        })
      },
      //优化：之后统一抽出来写个mixins
      //现在：先以功能和时间为主
      search() {
        this.refreshList(this.searchBar);
      },
      clear() {
        Object.keys(this.searchBar).forEach(key => this.searchBar[key] = '');
        this.searchBar.page = 1;
        this.refreshList();
      },
      changePageSize(val) {
        this.searchParams.page = 1;
        this.searchParams.size = val;
        this.refreshList();
      },
      changePageNumber(val) {
        this.searchParams.page = val;
        this.refreshList();
      },
      detail(detailInfo) {
        this.detailInfo = detailInfo;
      },
      edit(permanent) {
        console.log(permanent)
        this.permanent = permanent
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deletePeople() {
        if (this.multipleSelection.length <= 0) {
          return this.$message.warning('请选择要删除的人员！');
        }
        if (this.multipleSelection.length > 0) {
          let ids = this.multipleSelection.map(item => item.id).join(',');
          let params = {};
          params.tenantId = this.tenantId;
          params.houseIds = ids;
          this.$confirm('确认删除所选的人员吗？').then(_ => {
            //判断是否为最后一条数据或全部删除
            if (this.searchParams.page !== 1) {
              let checkNumber = this.table.totalElements - (this.searchParams.page - 1) * this.searchParams.size;
              if (checkNumber === this.multipleSelection.length) {
                this.searchParams.page -= 1;
              }
            }
            Permanent.multiDeletePermanent(params)
              .then(res => {
                if (res.status == 200) {
                  this.$message.success('删除成功');
                  this.refreshList();
                } else {
                  this.$message.error('删除失败');
                }
              });
          });
        }
      },
      batchImport() {

      }
    }
  }
</script>
<style>
  #permanent .access-bar {
    display: flex;
    flex-direction: column;
  }

  #permanent .el-form-item {
    margin-left: 0px;
    margin-bottom: 15px;
  }

  #permanent .left {
    margin-bottom: 10px;
  }

  #permanent .tablePagination {
    margin-top: 10px;
  }

  .text-success {
    color: #67c23a;
  }

  .text-danger {
    color: #dc3545;
  }

  #permanent .el-form-item .el-input .el-input__inner {
    min-width: 150px;
    max-width: 160px;
  }
</style>
