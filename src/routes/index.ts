import { createRouter, createWebHashHistory } from "vue-router";
let routes = [
  {
    path: '/game',
    name: 'game',
    children: [
      {
        path: 'snake',
        name: 'snake',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('@/views/game/snake/index.vue')
      },
      {
        path: 'chess',
        name: 'chess',
        component: () => import('@/views/game/fiveChess/double.vue')
      },
    ]
  },
  {
    path: '/',
    name: 'practice',
    component: () => import('@/views/practice/index.vue')
  },
  {
    path: '/waterfallWall',
    name: 'waterfallWall',
    component: () => import('@/views/practice/waterfallWall.vue')
  },
  {
    path: '/vue3',
    name: 'vue3',
    children: [
      {
        path: 'computed',
        name: 'computed',
        component: () => import('@/views/vue3/computed.vue')
      },
      {
        path: 'father',
        name: 'father',
        component: () => import('@/views/vue3/father.vue')
      },
      {
        path: 'treeComponent',
        name: 'treeComponent',
        component: () => import('@/views/vue3/treeComponent.vue')
      },
    ]
  },
  {
    // 配置404页面
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/404.vue'),
  }
]
// 路由
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, from, next) => {

// })
// 导出
export default router 