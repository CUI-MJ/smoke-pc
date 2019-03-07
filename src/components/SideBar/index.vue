<template>
  <scroll-bar>
    <el-menu
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="handleselect"
      background-color="#ffffff"
      text-color="#282828"
      active-text-color="#fff"
      mode="vertical"
      :default-active="$route.path"
      :collapse="collapsed"
      :unique-opened="true"
      >
      <template  v-for="(route, index) in getRouters">
      <router-link v-if="route.meta && route.meta.isNav" :to="route.path" :key="route.name" 
        :class="{'is-active':route.meta.isSelect}">
          <el-menu-item :index="route.path" :key="route.name" class="left-bar-div">
            <template slot="title">
              <div class="icon-sma">
                <img v-if="route.meta.isSelect" :src="require(`@/assets/images/${route.meta.icon}-w.png`)" alt="">
                <img v-else :src="require(`@/assets/images/${route.meta.icon}-b.png`)" alt="">
              </div>
              <span>{{route.meta.title}}</span>
            </template>
          </el-menu-item>
        </router-link>
        <!-- <el-submenu v-else :index="index.toString()" :key="route.name" class="left-bar-div">
          <template slot="title">
            <div class="icon-sma">
                <img v-if="route.meta.isSelect" :src="require(`@/assets/images/${route.meta.icon}-w.png`)" alt="">
                <img v-else :src="require(`@/assets/images/${route.meta.icon}-b.png`)" alt="">
            </div>
            <span>{{route.meta.title}}</span>      
          </template>
          <template v-for="(childRoute) in route.children">
            <router-link v-if="!childRoute.meta.hidden" :to="route.path + '/' + childRoute.path" :key="childRoute.name">
              <el-menu-item :index="route.path + '/' + childRoute.path">
              <font-awesome-icon style="margin-left:10px;margin-right:8px;" :icon="['fas', 'caret-right']" rotate="90" />
              <span >{{childRoute.meta.title}}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu> -->
      </template>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters,mapMutations} from 'vuex'
import ScrollBar from '@/components/ScrollBar'
import { faHome } from '@fortawesome/fontawesome-free-solid'
import _ from 'lodash'
export default {
  components: { ScrollBar },
  props: ['collapsed'],
  data() {
    return {
    }
  },
  created() {
  },
  watch:{

  },
  methods: {
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
    handleselect(key, keyPath){
      var newRouter = this.getRouters;
      newRouter.forEach(element => {
        if(element.path == key){
          element.meta.isSelect = true
        }else{
          element.meta.isSelect = false
        }
      });
      this.setRouter(newRouter)
    },
    ...mapMutations([
      'setRouter'
    ]),
  },
  computed: {
    ...mapGetters([
      'getRouters'
    ])
  },
}
</script>
<style>
/* .is-active .el-submenu__title {
  color:#fff!important;
} */
.is-active{
  background-color: #209ce4 !important;
  color: #ffffff !important;
}
.icon-sma {
  display:inline-block;
  height: 15px;
  width: 19px;
  margin-right: 20px;
  margin-left: 17px;
}
.el-menu-item span.dot {
  background:#75797d;
  width:5px;
  height:5px;
  display:inline-block;
  margin: 0 22px 0 6px;
  font-size: 14px;
}
.el-menu-item.is-active span.dot {
  background:#1eb9ed;
}
.left-bar-div .el-submenu__title {
  height: 40px;
  line-height: 38px;  
  padding-left:0px!important;
  padding-right:16px!important;
}
.left-bar-div svg {
  font-size: 15px;  
  padding-right: 20px;
}
.left-bar-div .el-menu-item {
  height:40px!important;
  line-height: 40px!important; 
/*
  margin-bottom:1px;
*/
  padding-left:12px!important;
}
.el-menu-item, .el-submenu__title {
  height: 40px;
  line-height: 38px;
  padding-left: 0px!important;
}
.icon-sma{
  position: relative;
}
.icon-sma img{
  position: absolute;
  top:-3px;
}
</style>
