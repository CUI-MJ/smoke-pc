<template>
  <div>
    <Headtop v-show="this.$route.path != '/login' && (isLogin || loginFlag)"></Headtop>
    <layout v-if="this.$route.path !== '/login'"></layout>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import Layout from "@/components/Layout/index.vue";
import Headtop from "@/components/Layout/Header.vue";
import { getSessionItem } from "@/api/function.js";
import { mapGetters } from "vuex";
export default {
  name: "App",
  data() {
    return {
      loginFlag: this.isLogin ? this.isLogin : getSessionItem("isLogin")
    };
  },
  components: {
    Layout,
    Headtop
  },
  watch: {
    isLogin: val => {
      this.isLogin = val;
    }
  },
  computed: {
    ...mapGetters(["isLogin"])
  }
};
</script>

<style>
body {
  padding: 0;
  margin: 0;
  font-family: arial, Microsoft Yahei;
  background-color: #ffffff;
  width: 100%;
}
a,
a:active,
a:focus,
a:hover {
  text-decoration: none;
}

.el-menu {
  border: none;
}
.el-submenu .el-menu-item {
  min-width: 190px;
}
.el-menu-item,
.el-submenu__title {
  border-bottom: 1px solid #ebebeb;
}
.el-submenu.is-active .el-submenu__title {
  border-bottom-color: #ebebeb;
  background-color: #f5f5f5 !important;
}
.tablePagination .el-pagination__jump {
  float: right;
}
.tablePagination .btn-next {
  float: right;
}
.tablePagination .el-pager {
  float: right;
}
.tablePagination .btn-prev {
  float: right;
}
.page-container {
  margin-bottom: 40px;
}
.page-container .title {
  height: 18px;
  line-height: 18px;
  font-size: 18px;
  color: #282828;
  border-left: 2px solid #209ce4;
  text-indent: 10px;
  margin-bottom: 17px;
}
.page-container .title span {
  font-size: 13px;
  color: #ce5e0b;
}
.el-input__inner {
  box-sizing: border-box;
  height: 35px;
  line-height: 35px;
  border: 1px solid #ccc;
  box-shadow: #000;
}
.el-form-item__error{
  padding-top: 1px;
  font-size: 10px;
}
.el-input--small .el-input__inner {
  height: 35px;
  line-height: 35px;
  font-size: 14px;
}
el-input--mini .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.el-pagination .el-input__inner {
  width: 100%;
}

.el-table thead tr th {
  height: 30px;
  background-color: #f9f9f9 !important;
}
.el-table th,
.el-table td {
  border-left: none;
  border-right: none;
  padding-top: 6px;
  padding-bottom: 6px;
  border-color: #e3e3e3;
}

.el-table th {
  height: 30px;
}
.el-table td {
  height: 44px;
}
.el-table th > .cell {
  font-weight: normal;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #f5f5f5;
}
.el-table--border,
.el-table--group {
  border: 1px solid #e3e3e3;
  box-shadow: none;
}
.el-table th.is-leaf {
  border-bottom: 1px solid #e3e3e3;
}
.operations-bar {
  margin-bottom: 12px;
}
.operations-bar .left {
  float: left;
  padding: 0px;
  margin-top: 4px;
}
.operations-bar .right {
  float: right;
  padding: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.operations-bar .right .el-form-item {
  margin-bottom: 0px;
}
.pages-table {
  width: 100%;
  margin-top: 0px;
}
.tablePagination {
  margin-top: 13px;
}
.el-dialog__header {
  padding: 15px;
  line-height: 24px;
  border-radius:5px;
}
.el-dialog__body {
  padding: 0;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}
.el-dialog__footer {
  padding: 15px;
  line-height: 24px;
}
.el-form-item {
  margin-left: 28px;
}
.bx-form {
  overflow: auto;
}

header .title {
  font-size: 20px;
}
textarea {
  font-family: arial, Microsoft Yahei;
}
.el-textarea__inner {
  border-color: #ccc;
}
.el-button {
  height: 35px;
  padding: 9px 10px;
  box-sizing: border-box;
}
.button-add {
  color: #ffffff;
  background-color: #209ce4;
  border-color: #209ce4;
  vertical-align: middle;
}
.button-rm {
  color: #ffffff;
  background-color: #eb535e;
  border-color: #eb535e;
  vertical-align: middle;
}
.button-sel {
  color: #ffffff;
  background: #169bd5;
  border-color: #169bd5;
  vertical-align: middle;
}
.button-rs {
  background: #f5f5f5;
  border-color: #ccc;
  vertical-align: middle;
}
.el-button--text {
  color: #0773bf;
}
.but-f {
  padding-left: 0px;
  padding-right: 0px;
}
.el-checkbox__inner,
.el-radio__inner {
  border: 1px solid #ccc;
  height: 18px;
  width: 18px;
}
.el-radio__input.is-checked .el-radio__inner:after {
  transform: translate(-50%, -50%) scale(1);
}
.el-radio__inner:after {
  background-color: #409eff;
  height: 12px;
  left: 8px;
  width: 12px;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #282828;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #282828;
}
.el-checkbox__input.is-disabled + span.el-checkbox__label,
.el-radio__input.is-checked + .el-radio__label {
  color: #282828;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #afaeae;
  border-color: #afaeae;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #fff;
}
.el-radio__input.is-checked .el-radio__inner {
  background: none;
}
.el-checkbox__inner::after {
  width: 6px;
  height: 10px;
  left: 5px;
  top: 0px;
}
.number {
  font-weight: normal;
}
.el-checkbox.is-checked + .el-tree-node__label {
  color: #409eff;
}
.el-pagination__editor.el-input .el-input__inner {
  box-shadow: none;
}
.el-pagination {
  white-space: normal;
}
.el-dialog {
  margin-top: 8vh !important;
  margin-bottom: 30px !important;
}
input::-webkit-input-placeholder,
input::-moz-placeholder,
input:-ms-input-placeholder,
input:-moz-placeholder {
  color: #999 !important;
  font-size: 14px;
}

textarea::-webkit-input-placeholder,
textarea::-moz-placeholder,
textarea:-ms-input-placeholder,
textarea:-moz-placeholder {
  color: #999 !important;
  font-size: 14px;
}
/*  */
.el-table .cell,
.el-table th div {
  padding-right: 0px;
}
.activation .el-dialog__body {
  border-bottom: none !important;
  margin: 0 18px !important;
}
.activation .el-dialog__footer {
  text-align: center;
  margin-top: -20px;
}
.activation .el-dialog__footer button {
  width: 130px;
  height: 48px;
  padding: none;
}
.activationForm .el-input__inner {
  height: 46px;
  line-height: 46px;
}
.activation .el-form-item {
  margin-bottom: 0px;
}
.activation .el-checkbox__label{
  line-height:17px;
}
.addfrom .el-form-item__content{
  display:flex;
}
.addfrom .el-form-item{
  padding: 0 61px 0px 43px;
}
.regional .el-tree-node__content{
  height: 40px;
  border-bottom: 1px solid #eee;
}
.regional .el-button{
  padding: 0 2px;
}
/*清除浮动*/
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.el-upload-list__item-name{
  width: 266px!important;
}
.upload-demo{
  width:100%;
}
.el-dialog .el-select{
  width:100%;
}
</style>
