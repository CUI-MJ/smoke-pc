<template>
  <el-dialog :title="data.id ? '编辑业主' : '添加业主'"
             :visible.sync="dialogVisible"
             :before-close="beforeClose"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             width="500px">
    <div id="permanentDialog" class="content">
      <div class="info">
        <!--业主信息-->
        <div class="info-form">
          <el-form :model="formList" :rules="rules"  ref="personnelForm" label-width="80px" :label-position="'left'" @submit.native.prevent>
            <el-form-item label="业主姓名">
              <el-input v-model="formList.name" maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="formList.phone" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="房间号" prop="code">
              <el-input v-model="formList.code" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="关联区域" prop="areaId" style="margin-top: 5px">
              <div class="area-tree">
                <div class="header"></div>
                <div class="body">
                  <el-tree
                    v-model="formList.areaId"
                    :data="treeData"
                    :props="defaultProps"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :empty-text="'无区域'"
                    accordion
                    :default-checked-keys="defaultKey"
                    :default-expand-all = "defaultExpand"
                    :check-on-click-node="true"
                    :check-strictly="true"
                    @check-change="treeKeyChange"
                    @node-click="treeNodeClick"
                  >
                  </el-tree>
                </div>
              </div>
            </el-form-item>
            <!--业主图片-->
            <el-form-item class="info-photo">
              <!--用于对from-item-label的80px进行重新定位-->
              <div style="margin: -1px 0 0 -81px;">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :data="uploadData"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button v-if="isAdd" type="primary" @click="beforeSubmitForm('personnelForm','add')">确 定</el-button>
      <el-button v-else type="primary" @click="beforeSubmitForm('personnelForm','edit')">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import dialog from '@/mixins/dialog'
  import Area from '@/api/area'
  import Permanent from '@/api/permanent'
  import {mapGetters,mapActions} from 'vuex'
  import {checkWidth2} from '@/utils/photoTools'

  export default {
    name: "permanentDialog",
    mixins: [dialog],
    props: ['data'],
    components: {},
    data() {
      var checkPhoto = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入联系方式'));
        }else{
          callback();
        }
      };
      var checkCode = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入房间号'));
        }else{
          callback();
        }
      };
      var checkArea = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择关联区域'));
        }else{
          callback();
        }
      };
      return {
        dialogVisible: true,
        areaList: [],
        treeData: [],
        checkedId: null,
        defaultProps: {
          children: 'children',
          label: 'label',
          parentId: 'parentId'
        },
        defaultKey:[],
        defaultExpand:false,
        formList: {
          name: '',
          phone: '',
          code: '',
          areaId: '',
          pic: ''
        },
        //照片上传
        imageUrl: '',
        uploadUrl: 'ihome-face/api/images/qualityPC',
        uploadData: {
          pic: '',
          type: 'user'
        },
        //表单校验规则
        rules:{
          phone:[
            {required:true, validator: checkPhoto, trigger: 'blur'}
          ],
          code:[
            {required:true, validator: checkCode, trigger: 'blur'}
          ],
          areaId:[
            {required:true, validator: checkArea,  trigger: 'change'}
          ]
        }
      }
    },
    mounted() {
      this.getAeraList();
      if(this.data.id){
        this.initEditInfo();
      }
    },
    computed: {
      ...mapGetters(['tenantId']),
      isAdd(){
        if(this.data.id){
          return false;
        }
        return true;
      }
    },
    methods: {
      //初始化编辑
      initEditInfo(){
        let editInfo = this.data;
        if(editInfo.id){
          this.formList = Object.assign({},{
            name: editInfo.name,
            phone: editInfo.phone,
            code: editInfo.code,
            areaId: '',
            pic: editInfo.pic,
            houseId: editInfo.id,
            personId: editInfo.personId
          })
          this.imageUrl = this.formList.pic;
          if(editInfo.fourthId){
            this.formList.areaId = editInfo.fourthId;
            this.defaultKey.push(editInfo.fourthId.toString());
          }else if(editInfo.thirdId){
            this.formList.areaId = editInfo.thirdId;
            this.defaultKey.push(editInfo.thirdId.toString());
          }else if(editInfo.secondId){
            this.formList.areaId = editInfo.secondId;
            this.defaultKey.push(editInfo.secondId.toString());
          }else{
            this.formList.areaId = editInfo.firstId;
            this.defaultKey.push(editInfo.firstId.toString());
          }
          this.defaultExpand = true;
        }
      },
      //获取区域列表
      getAeraList() {
        Area.getAreaAllOptions({tenantId: this.tenantId}).then(res => {
          if (res.status === 200) {
            // this.areaList = res.entity;
            this.treeData = this.transformTreeData(res.entity);
          }
        })
      },
      /*
        *封装为tree组件可使用的数据
        *目前共4层节点,可以使用以下方式，待优化
      */
      transformTreeData(areaList) {
        let nodeList = [];
        for (let i = 0, len = areaList.length; i < len; i++) {
          //第一层节点
          if (areaList[i].parent_id === null) {
            nodeList.push({
              id: areaList[i].id,
              label: areaList[i].name,
              parentId: null,
              children: []
            })
          }
          if (areaList[i].parent_id) {
            //第二层节点
            nodeList.forEach((first_area) => {
              if (areaList[i].parent_id === first_area.id) {
                first_area.children.push({
                  id: areaList[i].id,
                  label: areaList[i].name,
                  parentId: areaList[i].parent_id,
                  children: []
                })
              }
              if (first_area.children.length > 0) {
                //第三层节点
                first_area.children.forEach((second_area) => {
                  if (areaList[i].parent_id === second_area.id) {
                    second_area.children.push({
                      id: areaList[i].id,
                      label: areaList[i].name,
                      parentId: areaList[i].parent_id,
                      children: []
                    })
                  }
                  //第四层节点
                  if (second_area.children.length > 0) {
                    second_area.children.forEach((third_area) => {
                      if (areaList[i].parent_id === third_area.id) {
                        third_area.children.push({
                          id: areaList[i].id,
                          label: areaList[i].name,
                          parentId: areaList[i].parent_id,
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }
        return nodeList;
      },
      //获取选中的节点的 key 所组成的数组
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      //获取当前被选中节点的 key
      getCurrentKey() {

      },
      //用于单选操作
      treeKeyChange(data, checked, node) {
        if (checked == true) {
          this.checkedId = data.id;
          this.formList.areaId = data.id;
          this.$refs.tree.setCheckedNodes([data]);
        }
      },
      treeNodeClick(data, checked, node) {
        this.$refs.tree.setCheckedNodes([data]);
      },

      //照片上传相关
      handleAvatarSuccess(res, file) {
        if(res.status === 200){
          this.imageUrl = res.entity;
          this.formList.pic = res.entity;
        }else{
          this.$message.error(res.message);
        }

      },

      async beforeAvatarUpload(file) {
        //转化单位为MB
        const photoSize = file.size / 1024 / 1024;
        //判断格式
        if (!/\.(bmp|jpg|jpeg|png|BMP|JPG|PNG)$/.test(file.name)) {
          this.$message({
            message: '照片格式不正确- 照片仅支持jpg、png格式',
            type: 'warning'
          });
          return;
        }
        //判断大小
        if (photoSize > 10) {
          this.$message({
            message: '照片不能大于10M',
            type: 'warning'
          });
          return;
        }
        //判断尺寸
        let imgBase64 = await checkWidth2(file);
        this.uploadData.pic = imgBase64;
      },

      //表单校验
      beforeSubmitForm(formName,type){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(type == 'add'){
              this.formList.tenantId = 262;
              this.addPermanent();
            }else{
              this.formList.tenantId = 262;
              this.editPermanent();
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //添加
      addPermanent(){
        Permanent.addPermanent(this.formList).then(res=>{
          if(res.status === 200 ){
            this.$emit('close');
            this.$message.success(res.message);
          }else{
            this.$message.error(res.message);
          }
        })
      },
      //编辑
      editPermanent(){
        Permanent.editPermanent(this.formList).then(res=>{
          if(res.status === 200 ){
            this.$emit('close');
            this.$message.success(res.message);
          }else{
            this.$message.error(res.message);
          }
        })
      }
    }
  }
</script>

<style scoped>
  .content {
    margin: 10px 25px;
    position: relative;
    box-sizing: border-box;
  }

  .info {
    height: 520px;
  }

  .info-form {
    padding-top: 25px;
  }

  .info-photo {
    width: 141px;
    height: 153px;
    position: absolute;
    right: 15px;
    top: 15px;
    border: 1px dashed #d9d9d9;
    box-sizing: border-box;
  }

  .area-tree {
    width: 270px;
    height: 320px;
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
  }

  .area-tree .header {
    height: 40px;
    border-radius: 8px 8px 0 0;
    background-color: #f5f7fa;
  }

  .area-tree .body {
    padding: 8px 6px;
    overflow: auto;
  }

  /*照片上传相关*/
  .avatar-uploader .el-upload {
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background-color: black;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 141px;
    height: 153px;
    line-height: 153px;
    text-align: center;
  }

  .avatar {
    width: 141px;
    height: 153px;
    display: block;
  }

</style>
