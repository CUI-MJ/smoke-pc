<template>
  <el-dialog title="详情"
             :visible.sync="dialogVisible"
             :before-close="beforeClose"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             width="700px">
    <div class="dialog">
      <!--业主信息-->
      <div class="info">
        <span v-model="top" class = "top">
          业主：{{top.name}} &nbsp;&nbsp;&nbsp;&nbsp;一级分区：{{top.firstAreaName || '无'}}
          &nbsp;&nbsp;&nbsp;&nbsp;二级分区：{{top.secondAreaName || '无'}} &nbsp;&nbsp;&nbsp;&nbsp;
          三级分区：{{top.thirdAreaName || '无'}}&nbsp;&nbsp;&nbsp;&nbsp;四级分区：{{top.fourthAreaName || '无'}}
        </span>
      </div>
      <!--表格-->
      <el-table :data="table" width="80%">
        <el-table-column label="照片" width="150">
          <template slot-scope="scope">
            <img width="54" height="58" class = "pic" :src="scope.row.pic"/>
          </template>
        </el-table-column>
        <el-table-column property="name" label="关联人员" width="200"></el-table-column>
        <el-table-column property="phone" label="联系方式"></el-table-column>
        <el-table-column property="personType" label="角色">
          <template slot-scope="scope">
            <p v-if="scope.row.personType=='1'">业主</p>
            <p v-if="scope.row.personType=='2'">家人</p>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <!--<div class="tablePagination">
        <el-pagination background
                       @size-change="changePageSize"
                       @current-change="changePageNumber"
                       :current-page="searchParams.page"
                       :page-sizes="[10,20]"
                       :page-size="table.size"
                       layout="total, sizes, jumper, next, pager, prev"
                       :total="table.totalElements">
        </el-pagination>
      </div>
      -->
    </div>
  </el-dialog>
</template>

<script>
  import dialog from '@/mixins/dialog'
  import Permanent from '@/api/permanent'
  export default {
    name: "detailDialog",
    mixins: [dialog],
    props: ['data'],
    data() {
      return {
        dialogVisible: true,
        table: [],
        date: {}
        /*searchParams: {
         page: 1,
         size: 10
        },*/
      }
    },
    mounted() {
      this.datail(this.data.id);
      this.top(this.data);
    },
    methods: {
      datail(id){
        Permanent.getdetailDialog(id).then(res => {
          if (res.status === 200) {
            this.table = res.entity;
          }
        })
      },
      top(data){
        this.top =  this .data;
      }
      /*cellStyle(row,column,rowIndex,columnIndex) {
        return "text-align:center";
      },
      rowClass(row,rowIndex) {
        return "text-align:center";
      }
      changePageSize(val) {
        this.searchParams.page = 1;
        this.searchParams.size = val;
        this.refreshList();
      },
      changePageNumber(val) {
        this.searchParams.page = val;
        this.refreshList();
      },*/

    }
  }
</script>

<style scoped>
  .info{
    margin: 15px 8px;
    height: 30px;
    border-bottom:0.5px solid rgb(228, 220, 220);
  }
  .top{
    font-weight:bold;
    font-color:#282828;
    font-size:14px;
  }
  .dialog{
    padding: 5px 10px;
  }
  .pic{
    vertical-align: middle;
  }
</style>
