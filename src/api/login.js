import ajax from '@/utils/ajax'

const baseUrl = '/ihome-village/doLogin'

function submit(params) {
  return ajax({
    url: baseUrl,
    method: 'post',
    params
  })
}
export default {
  submit
}
