import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
  
export default new Router({
  routes: [
    {
      path: '/*',
      redirect: { name: 'tree' }
    },
    {
      path: '/tree',
      name: 'tree',
      component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
      children: [
        {
          path: '/m',
          component: () => import(/* webpackChunkName: "modal" */ '../components/Modal.vue'),
          children: [
            { 
              path: 'login',
              name: 'login',
              component: () => import(/* webpackChunkName: "login" */ '../components/auth/LogIn.vue')
            },
            {
              path: 'signup',
              name: 'signup',
              component: () => import(/* webpackChunkName: "signup" */ '../components/auth/SignUp.vue')
            },
            {
              path: 'add',
              name: 'add',
              component: () => import(/* webpackChunkName: "addedit" */ '../components/AddEdit.vue')
            },
            {
              path: 'edit/:id',
              name: 'edit',
              props: true,
              component: () => import(/* webpackChunkName: "addedit" */ '../components/AddEdit.vue')
            }
          ]
        }
      ]
    }
  ]
})
