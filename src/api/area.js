import ajax from '@/utils/ajax'

const baseUrl = '/ihome-village/api/area'

//区域级联查询
function getAreaOptions(params) {
  return ajax({
    url: `${baseUrl}/getIhAreaChildListByParentForRelation`,
    method: 'get',
    params
  })
}

//一次查询所有关联区域
function getAreaAllOptions(params) {
  return ajax({
    url: `${baseUrl}/ihAreaListForRelation`,
    method: 'get',
    params
  })
}


export default {
  getAreaOptions,
  getAreaAllOptions
}
