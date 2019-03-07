import Vue from 'vue'
import Router from 'vue-router'
//登录页面
const login = resolve => require.ensure([], () => resolve(require('@/pages/login')), 'login')
//园区管理
const parkList = resolve => require.ensure([], () => resolve(require('@/pages/parkList')), 'parkList')
//商铺管理
const regional = resolve => require.ensure([], () => resolve(require('@/pages/regional')), 'regional')

const permanentImport = resolve => require.ensure([], () => resolve(require('@/pages/permanent/permanentImport')), 'permanentImport')
//设备管理
const device = resolve => require.ensure([], () => resolve(require('@/pages/device')), 'device')
//人员管理
const record = resolve => require.ensure([], () => resolve(require('@/pages/record')), 'record')


Vue.use(Router)
export const routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      title:'登录页',
      isLogin: false,
      isNav:false,
      isSelect:false,
    },
  },
  {
    path: '/permanentImport',
    name: 'permanentImport',
    component: permanentImport,
    meta: {
      title: '批量导入',
      icon: 'area',
      isLogin: true,
      isNav:false,
      isSelect:false,
    }
  },
  {
    path: '/',
    name: 'parkList',
    component: parkList,
    meta: {
      title: '用户管理',
      icon: 'parkList',
      isLogin: true,
      isNav:true,
      isSelect:true,
    },
  },
  {
    path: '/regional',
    name: 'regional',
    component: regional,
    meta: {
      title: '商铺管理',
      icon: 'area',
      isLogin: true,
      isNav:true,
      isSelect:false,
    }
  },
  {
    path: '/device',
    name: 'device',
    component: device,
    meta: {
      title: '烟草管理',
      icon: 'device',
      isLogin: true,
      isNav:true,
      isSelect:false,
    },
  },
  {
    path: '/record',
    name: 'record',
    component: record,
    meta: {
      title: '库存管理',
      icon: 'device',
      isLogin: true,
      isNav:true,
      isSelect:false,
    },
  },
]

export default new Router({
  routes: routes
})
