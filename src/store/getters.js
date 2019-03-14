const getters = {
  loading: state => state.app.loading,
  getRouters: state => state.route.routes,
  isLogin: state => state.app.isLogin,
  tenantId: state => state.app.tenantId,
  parkName: state => state.app.parkName,
  currentPath: state => state.route.routes.filter(ele => ele.meta.isSelect)
};
export default getters
