import axios from 'axios'
import {
  Loading,
  Message,
  MessageBox
} from 'element-ui'
import {
  removeSessionItem,
  removeItem,
  delCookie
} from "@/api/function.js"

var baseURL = ''
if (process.env.NODE_ENV == 'production') {
  //axios 默认不让携带cookie 
  axios.defaults.withCredentials = true;
  baseURL = 'https://membert.chinajinmao.cn/cig'
}

const $ajax = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

var loadinginstace;

// 拦截请求
$ajax.interceptors.request.use(config => {
  loadinginstace = Loading.service({
    fullscreen: true
  })
  return config
}, error => {
  loadinginstace.close()
  Message.error({
    message: '加载超时'
  })
  return Promise.reject(error)
})

// 统一错误处理
$ajax.interceptors.response.use(
  response => {
    loadinginstace.close()
    if (response.data && response.data.code === '0001') {
      MessageBox.alert(response.data.msg,'登录超时',{
        confirmButtonText: '跳转登录页',
        type:'warning',
        callback:()=>{
          removeSessionItem('isLogin')
          removeItem('routes')
          delCookie('token')
          window.location.replace(`${window.location.href}login`)
        }
      })
    }
    else if(response.data && response.data.code === '0000') {
      return response.data
    }
    else{
      Message.error({
        message: response.data.msg
      })
    }

  },
  error => {
    console.log('error')
    if (error.response && error.response.status == 401) {
      router.replace('/login')
    } else if (error.response && error.response.data && error.response.data.message) {
      Message.error(error.response.data.message);
    }

    return Promise.reject(error)
  })

export default $ajax
