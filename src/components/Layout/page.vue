<template>
     <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalLength">
            </el-pagination>
        </div>
</template>
<script>
export default {
    data(){
        return{
            currentPage:1,
            total:0,
            list:[],
            pageSize:0,
            isrefresh:false,
        }
    },
    props:['number','totalLength'],
    mounted(){
        this.pageSize = parseInt(this.number);
        this.total = parseInt(this.totalLength);
        this.handleCurrentChange(1);
    },
    watch:{
        'getDatas':function(val){
            this.list = val;
            this.handleCurrentChange(this.currentPage);
        },
        'totalLength':function(val){
            this.total  = val;
            this.handleCurrentChange(this.currentPage);
        }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentPage = val;
        this.isrefresh = true;
        this.senditems(this.currentPage,this.pageSize)
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.currentPage = 1;
        this.isrefresh = true;
        this.senditems(this.currentPage,this.pageSize)
      },
      senditems(currentPage,pageSize){
        this.$emit('listenToChildEvent',currentPage,pageSize);
      }
    }
}
</script>
<style>
.block{
    text-align: right;
}
.el-pagination{
    margin-top: 20px;
}
.el-pagination__total,.el-pagination__sizes{
    float: left;
}
.el-pager li{
    background: #eee;
    margin: 0 2px;
}
.el-pager li.active{
    color: #fff;
    background: #409EFF;
}
.el-pagination .btn-prev{
    background: #eee;
    margin-right: 5px;
}
.el-pagination .btn-next{
    background: #eee;
    margin-left: 5px;
}
.el-pagination button:disabled{
    background: #eee;
}
</style>

