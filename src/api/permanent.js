import ajax from '@/utils/ajax'

const baseUrl = '/ihome-owner/api/person/permanent'

function getdetailDialog(id) {
  return ajax({
    url: '/ihome-owner/api/person/findByHouseId' + '/' + id,
    method: 'get'
  })
}
function getPermanentList(data) {
  return ajax({
    url: `${baseUrl}/list`,
    method: 'post',
    data
  })
}
function addPermanent(data) {
  return ajax({
    url: `${baseUrl}/add`,
    method: 'post',
    data: data,
    // handle: true
  })
}
function editPermanent(data) {
  return ajax({
    url: `${baseUrl}/edit`,
    method: 'post',
    data
  })
}
function multiDeletePermanent(params) {
  return ajax({
    url: `${baseUrl}/delete`,
    method: 'delete',
    params
  })
}

export default {
  getPermanentList,
  addPermanent,
  editPermanent,
  multiDeletePermanent,
  getdetailDialog
}
