import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter ,anyRouters,asyncRouters,constantRoutes} from '@/router'
import { use } from 'echarts';
import router from '@/router';

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes:[],
    buttons:[],
    roles:[],
    // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行比较】最终需要展示的路由
    resultAsyncRoutes:[],
    // 用户最终需要展示的全部路由
    resultAllRoutes:[],
    info:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
//  存儲用戶信息
  SET_USERINFO:(state,userInfo)=>{
    state.info = userInfo
    // 用戶名
    state.name = userInfo.name;
    // 用戶頭像
    state.avatar = userInfo.avatar;
    // 菜单权限标记
    state.routes = userInfo.routes;
    // 按钮权限标记
    state.buttons = userInfo.buttons;
    // 角色信息
    state.roles = userInfo.roles;
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES:(state,asyncRouters)=>{
    // vuex保存当前用户的异步路由，注意：一个用户需要完成路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRouters;
    // 计算出当前用户需要展示的所有路由
    state.resultAllRoutes =  constantRoutes.concat(state.resultAsyncRoutes,anyRouters)
    // 给路由添加新的路由
    router.addRoutes(state.resultAllRoutes);
  }

}
 const computedAsyncRoutes = (asyncRouters,routes)=>{
  //  过滤出当前用户
   return asyncRouters.filter(item=>{
      if(routes.indexOf(item.name!=-1)){
        // 递归
        if(item.children&&item.children.length){
          item.children = computedAsyncRoutes(item.children,routes);
        }
        return true;
      }
    })
}
const actions = {
  // user login
 async login({ commit }, userInfo) {
    // 解构出用户名与密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // 注意：当前登录请求现在使用的是mock数据，mock数据code是20000
    if(result.code == 20000){
        commit('SET_TOKEN', result.data.token)
        setToken(result.data.token);
        return 'ok';
    }else{
      return Promise.reject(new Error('faile'))
    }

    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        
        const { data } = response
        console.log(data)
        // console.log(data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // vuex存儲用戶全部信息
        commit('SET_USERINFO',data);
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRouters,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

