import axios from 'axios'
import store from '@/store'
import {Message} from 'element-ui';
import Cookies from 'js-cookie'
import {removeSessionItem,removeItem} from "@/api/function.js"
console.log(process.env.NODE_ENV)
var baseURL = ''
if(process.env.NODE_ENV == 'production'){
  //axios 默认不让携带cookie 
  axios.defaults.withCredentials = true;
  baseURL = 'https://membert.chinajinmao.cn/cig'
}

const $ajax = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

function objectToParams(obj) {
  if (obj) {
    let paramStr = ''
    Object.keys(obj).forEach((item) => {
      paramStr += '&' + item + '=' + obj[item]
    })
    return '?' + paramStr.slice(1)
  } else {
    return ''
  }
}
// 拦截请求
$ajax.interceptors.request.use(config => {
  
  console.log(config)
  // if (config.method == 'get') {
  //
  // } else {
  //
  // }
  return config
}, error => {
  Promise.reject(error)
})
let vm = window.vm;
// 统一错误处理
$ajax.interceptors.response.use(
  response =>{
    console.log(response,333333)
    if(response.data && response.data.code === '0001'){
      removeSessionItem('isLogin')
      removeItem('routes')
      vm.$cookie.delete('token');
      window.location.replace('/#/login'); 
    }
    return response.data
  },
  error => {
    if (error.response && error.response.status == 401) {
      router.replace('/login')
    } else if (error.response && error.response.data && error.response.data.message) {
      Message.error(error.response.data.message);
    }
    
    return Promise.reject(error)
  })

export default $ajax
