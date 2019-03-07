<template>
  <div class="inner" :class="{collapsed: collapsed}">
    <div class="sideBar">
      <side-bar :collapsed="collapsed"></side-bar>
    </div>
    <div class="content">
      <!-- <div class="breadcrumbs" v-if="breadcrumbs.length"> 
          <font-awesome-icon icon="map-marker-alt" rotate="90" class="wz-address" />
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="breadcrumb in breadcrumbs" :key="breadcrumb.name" :to="{ path: breadcrumb.path }">{{$t("layout.breadcrumbs." + breadcrumb.name)}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>-->
      <div class="content-view">
        <router-view></router-view>
      </div>
    </div>

    <div
      v-if="loading"
      style="position:fixed; top:0;left:0;bottom:0;right:0;z-index:9527"
      @click="$event.stopPropagation()"
    ></div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import SideBar from "@/components/SideBar";

export default {
  name: "layout",

  data() {
    return {
      breadcrumbs: null,
      collapsed:false,
    };
  },

  components: {
    SideBar
  },

  computed: {
    ...mapGetters(["loading"])
  },

  watch: {
    $route() {
      this.breadcrumbs = this.getBreadcrumbs();
    },

    collapsed() {
    }
  },

  methods: {
    getBreadcrumbs() {
      let temp = [];

      if (this.$route.name == "Main") return [];

      let matched = this.$route.matched;

      for (let i = 0; i < matched.length; i++) {
        if (matched[i].meta.parent) {
          temp.push(matched[i].meta.parent);
        }

        temp.push({
          name: matched[i].name,

          path: matched[i].path
        });
      }

      return temp;
    },

    backList() {
    }
  },

  created() {
    this.breadcrumbs = this.getBreadcrumbs();
  }
};
</script>
<style scoped>
.inner {
  height: 100%;
}
.sideBar {
  position: fixed;

  top: 43px;

  bottom: 0px;

  width: 181px;

  overflow: hidden;

  background-color: #ffffff;

  border-right: 1px solid #e3e3e3;

  margin-top: 8px;
}

.collapsed .sideBar {
  width: 50px;
}

.content {
  padding-left: 195px;

  padding-top: 43px;

  box-sizing: border-box;

  min-height: 566px;
}

.bodyPadding {
  margin: 22px;
}

.collapsed .content {
  margin-left: 50px;
}

.breadcrumbs {
  background: #fff;

  height: 30px;

  width: 100%;

  padding: 7px 0 0 13px;

  border-bottom: 1px solid #ebebeb;

  box-sizing: border-box;

  float: left;
}

.content-view {
  height: 100%;

  margin-top: 7px;

  box-sizing: border-box;

  padding: 20px 22px 0 22px;
}

.toggle {
  float: left;

  color: #ffffff;

  margin-left: 10px;

  margin-top: 6px;

  font-size: 18px;

  background-color: #0380aa;

  height: 31px;

  line-height: 31px;

  width: 32px;

  text-align: center;
}

.wz-address {
  float: left;

  color: #686b6f;

  margin-right: 6px;

  font-size: 14px;
}

.index-date {
  color: #dedede;
  font-size: 14px;
  font-family: arial, Microsoft Yahei;
  border-left: 1px solid #28364a;
  border-right: 1px solid #28364a;
  display: inline-block;
}

.index-date span {
  line-height: 51px;
}

.index-date .day {
  padding-left: 18px;
}

.index-date .week {
  margin-left: 18px;

  margin-right: 8px;

  padding-right: 18px;
}
.line {
  width: 2px;
  height: 18px;
  background: #fff;
}
</style>
