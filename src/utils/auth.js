const TENANTID_KEY = 'tenantId'

export function setTenantId(tenantId) {
  return sessionStorage.setItem(TENANTID_KEY, tenantId)
}

export function getTenantId() {
  return sessionStorage.getItem(TENANTID_KEY)
}

export function removeTenantId() {
  return sessionStorage.removeItem(TENANTID_KEY)
}
