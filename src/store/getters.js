const getters = {
  sidebar: state => state.app.sidebar,
  menus: state => state.permission.menus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
