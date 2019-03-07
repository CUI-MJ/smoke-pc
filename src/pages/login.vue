<template>
  <div class="login" :style="{height:clientHeight + 'px'}">
    <div class="content">
      <div class="header">烟草管理系统</div>
      <div class="main">
        <el-form :model="loginForm" ref="loginForm" style="width: 100%;height: 100%;" >
          <el-form-item prop="username">
            <el-input type="tel" class="el-input_login" v-model="loginForm.telphone" placeholder="请输入手机号"
                      clearable >
              <img slot="prefix" :src="require('../assets/images/'+userNameImg+'.png')" class="img-login">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" class="el-input_login" v-model="loginForm.password" placeholder="请输入密码"
                       clearable >
              <img slot="prefix" :src="require('../assets/images/'+passWordImg+'.png')" class="img-login">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button class="login-btn" @click.prevent="beforeLogin">
          登录
        </el-button>
      </div>
    </div>
    <div class="errMessage">
      <span>{{errorMessage}}</span>
    </div>
    <!-- <div class="copyright">
      <span>蜂盒科技有限公司版权所有 京公网备 1101052723 津ICP备 11004525号-1</span>
    </div> -->
  </div>
</template>
<script>
  import { loginAdmin } from '@/api/api'
  import { md5 , isPoneAvailable ,setCookie} from '@/api/function'
  import { mapGetters,mapMutations} from 'vuex'

  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          telphone: '',
          password: ''
        },
        userNameImg: 'id2',
        passWordImg: 'password2',
        clientHeight: 700+'px',
        errorMessage: ''
      }
    },
    mounted(){
      this.clientHeight =  document.documentElement.clientHeight;
      console.log(this.clientHeight);
    },
    watch:{
      'loginForm.userName':function(newVal,oldVal){
        if(newVal){
            this.userNameImg = 'id';
        }else{
          this.userNameImg = 'id2';
        }
      },
      'loginForm.password':function(newVal,oldVal){
        if(newVal){
          this.passWordImg = 'password';
        }else{
          this.passWordImg = 'password2';
        }
      }
    },
    methods: {
      ...mapMutations(['setLogin']),
      beforeLogin(){
        var _this = this;
        if(_this.loginForm.telphone == ''){
            return _this.$message.error('请输入手机号');
        }
        if(_this.loginForm.password == ''){
            return _this.$message.error('请输入密码');
        }
        if(!(isPoneAvailable(_this.loginForm.telphone))){
            return _this.$message.error('请输入正确格式的手机号');
        }
        _this.login();
      },
      login() {
        var _this = this;
        let params = {
            password: md5(_this.loginForm.password),
            phoneNumber: _this.loginForm.telphone
        }
        loginAdmin(params).then(res=>{
            console.log(res)
            if(res.code === '0000'){
              console.log(res)
              this.$message({
                message: '登录成功',
                type: 'success'
              });
              setCookie('token',res.data.tokenId)
              this.setLogin(true);
              this.$router.push({path: '/'});
            }else{
              this.errorMessage = res.msg;
              setTimeout(()=>{
                this.errorMessage = '';
                this.loginForm = {
                  telphone: '',
                  password: ''
                }
              },3000)
            }
        }).catch(error=>{
          _this.$message.error('服务器链接超时，请稍后再试！');
        })
      }
    }
  }
</script>
<style>
  .login {
    width: 100%;
    height: 700px;
    margin: 0px auto;
    background: #f6f6f6 url(../assets/images/bg.png) no-repeat top center; /*1920*572*/
    background-size: 100%;
    /*padding-top: 15%;*/
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
  }

  .login .content {
    width: 331px;
    height: 264px;
    background-color: #101f36;
    margin:auto;
    box-sizing: border-box;
    border-radius: 8px;
    color: #fff;
    position: absolute;
    left: 50%;
    top:50%;
    margin-left: -165.5px;
    margin-top: -132px;
  }

  .login .header {
    height: 54px;
    border-radius: 8px 8px 0px 0px;
    text-align: center;
    box-sizing: border-box;
    padding-top: 30px;
    font-size: 20px;
  }

  .login .main {
    height: 160px;
    box-sizing: border-box;
    padding: 32px 0px 31px 0px;
  }

  .login .main .el-input_login
  .el-input__inner {
    height: 40px;
    line-height: 40px;
    border: 1px solid #182c4a;
    background-color: #0b1627;
    border-radius: 3px;
    font-size: 16px;
    box-shadow: none;
    color: #fff;
  }

  .img-login {
    vertical-align: middle;
  }

  .login .main .el-input__inner::-webkit-input-placeholder {
    color: #597298;
    font-size: 16px;
  }

  .login .main .el-input--prefix .el-input__inner {
    padding-left: 48px;
  }
  .login .main .el-input__prefix{
    left: 12px;
  }

  .login .footer {
    height: 50px;
    border-radius: 0px 0px 8px 8px;
    text-align: center;
    line-height: 50px;
    background-color: #209ce4;
  }

  .login .login-btn {
    width: 100%;
    height: 100%;
    font-size: 20px;
    border: none;
    border-radius: 0px 0px 8px 8px;
    color: #fff;
    background-color: #209ce4;
  }

  .login-btn:hover {
    background-color: #1189cf;
  }

  .el-form-item {
    margin-left: 22px;
    margin-right: 22px;
    margin-bottom: 13px;
  }

  .login .errMessage{
    width: 331px;
    font-size: 16px;
    color: #ef4646;
    text-align: center;
    position: absolute;
    left: 50%;
    top:50%;
    margin-left: -165.5px;
    margin-top: 149px;
  }

  .login .copyright {
    position: absolute;
    width: 100%;
    bottom: 42px;
    color: #8f8f8f;
    font-size: 12px;
    text-align: center;
  }

</style>
