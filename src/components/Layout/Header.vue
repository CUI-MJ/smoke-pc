<template>
  <div class="topheader">
    <header>
      <div class="left">
        <div class="line"></div>
        <div class="title">
          <span class="excision"></span>烟草管理系统
        </div>
      </div>
      <div class="right">
        <span class="index-date">
          <span class="day">{{day}}</span>
          <span class="week">{{week}}</span>
        </span>
        <div class="index-user">
          <img :src="userpic" alt class="userpic">
          <span class="username">hello,{{username}}</span>
          <span class="logout" @click="logout">退出登陆</span>
        </div>
      </div>
    </header>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      username: "admin",
      userpic: require("@/assets/images/pic.png"),
      collapsed: false,
      day:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      week: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ][new Date().getDay()]
    };
  },
  mounted() {},
  methods: {
    ...mapMutations(['removeLogin']),
    logout() {
      this.removeLogin();
      console.log(1)
      window.location.replace('/#/login'); 
    }
  }
};
</script>
<style scoped>
.topheader {
  width: 100%;
  height: 51px;
  background-color: #101f36;
  overflow: hidden;
  position: fixed;
  top: 0;
  z-index: 99;
}
header {
  height: 51px;
}
header .left {
  float: left;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-left: 15px;
}

header .logo {
  background: url(./../../assets/logo-white.png) no-repeat left center;
  background-size: 147px auto;
  width: 150px;
  height: 51px;
  margin-left: 11px;
  display: inline-block;
}
header .title {
  display: inline-block;
  height: 51px;
  line-height: 53px;
  color: #ffffff;
  margin-left: 14px;
}
header .right {
  float: right;
  height: 51px;
  width: 400px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.index-user {
  padding: 0 18px;
  color: #dedede;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.index-user .userpic {
  width: 41px;
  height: 41px;
  margin-right: 9px;
}
.index-date {
  color: #dedede;
  font-size: 14px;
  font-family: arial, Microsoft Yahei;
  border-left: 1px solid #28364a;
  border-right: 1px solid #28364a;
  display: inline-block;
  height: 51px;
  padding: 0 18px;
  line-height: 51px;
}
.logout {
  margin-left: 10px;
  cursor: pointer;
}
</style>

