import ajax from '@/utils/ajax'

const baseUrl = '/ihome-owner/api/person/property'

function getPropertyList(data) {
  return ajax({
    url: `${baseUrl}/list`,
    method: 'post',
    data
  })
}
function addProperty(data) {
  return ajax({
    url: `${baseUrl}/add`,
    method: 'post',
    data: data,
    // handle: true
  })
}
function editProperty(data) {
  return ajax({
    url: `${baseUrl}/edit`,
    method: 'post',
    data
  })
}
function multiDeleteProperty(params) {
  return ajax({
    url: `${baseUrl}/delete`,
    method: 'delete',
    params
  })
}

export default {
  getPropertyList,
  addProperty,
  editProperty,
  multiDeleteProperty
}
