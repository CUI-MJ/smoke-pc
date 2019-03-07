const getters = {
  loading: state => state.app.loading,
  getRouters: state => state.route.routes,
  isLogin: state => state.app.isLogin,
  tenantId: state => state.app.tenantId,
  parkName: state => state.app.parkName
};
export default getters
