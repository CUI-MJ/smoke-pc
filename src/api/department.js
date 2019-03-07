import ajax from '@/utils/ajax'

const baseUrl = '/visitor-manager/api/company'

function getList(params) {
  return ajax({
    url: baseUrl,
    method: 'get',
    params: params
  })
}
function update(id, data) {
  return ajax({
    url: baseUrl + '/' + id,
    method: 'put',
    data: data,
    handle: true
  })
}
function remove(id) {
  return ajax({
    url: baseUrl + '/' + id,
    method: 'delete'
  })  
}
function multiRemove(data) {
  return ajax({
    url: baseUrl + '/batchDelCompany',
    method: 'post',
    data: data
  })
}
function create(data) {
  return ajax({
    url: baseUrl,
    method: 'post',
    data: data,
    handle: true
  })
}
export default {
  create: create,
  getList: getList,
  update: update,
  delete: remove,
  multiDelete: multiRemove
}
