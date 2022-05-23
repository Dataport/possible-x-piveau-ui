import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { Test } from '../modules';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'test',
    component: Test
  },
  {
    path: '/test2',
    name: 'test2',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "test2" */ '../modules/test2/Test2.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
