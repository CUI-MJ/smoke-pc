import ajax from '@/utils/ajax'
const baseUrl = '/visitor-manager/api/enum/'

function getAuditType() {
  return ajax({
    url: baseUrl + 'setting/audit',
    method: 'get'
  })
}

function getValidType() {
  return ajax({
    url: baseUrl + 'setting/valid',
    method: 'get'
  })
}

function getTargetType() {
  return ajax({
    url: baseUrl + 'setting/owner',
    method: 'get'
  })
}

function getDebounceType() {
  return ajax({
    url: baseUrl + 'setting/delay',
    method: 'get'
  })
}

function getDurationType() {
  return ajax({
    url: baseUrl + 'setting/permission',
    method: 'get'
  })
}
function getPersonInfoType() {
  return ajax({
    url: baseUrl + 'setting/person',
    method: 'get'
  })  
}
function getCredentialType() {
  return ajax({
    url: baseUrl + 'setting/credentials',
    method: 'get'
  })
}
function getFollowerType() {
  return ajax({
    url: baseUrl + 'setting/entourage',
    method: 'get'
  })
}
export default {
  getAuditType: getAuditType,
  getValidType: getValidType,
  getTargetType: getTargetType,
  getDebounceType: getDebounceType,
  getDurationType: getDurationType,
  getPersonInfoType: getPersonInfoType,
  getCredentialType: getCredentialType,
  getFollowerType: getFollowerType
}
