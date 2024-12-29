import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/index.vue'
import { useUser } from '@/stores/useUser'
import { storeToRefs } from 'pinia'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'index',
            component: HomeView,
            redirect: '/',
            children: [
                {
                    path: '/ChangePwd',
                    name: '修改密码',
                    component: () => import('@/views/Home/ChangePwd.vue'),
                    meta: {
                        auth: true,
                    },
                },
                {
                    path: '/ConsRecord',
                    name: '消费记录',
                    component: () => import('@/views/Home/ConsRecord.vue'),
                    meta: {
                        auth: true,
                    },
                },
                {
                    path: '/MemberList',
                    name: '会员列表',
                    component: () => import('@/views/Home/MemberList.vue'),
                    meta: {
                        auth: true,
                    },
                },
                {
                    path: '/MgmtAgent',
                    name: '代理管理',
                    component: () => import('@/views/Home/MgmtAgent.vue'),
                    meta: {
                        auth: false,
                    },
                },
                {
                    path: '/RechRecord',
                    name: '充值记录',
                    component: () => import('@/views/Home/RechRecord.vue'),
                    meta: {
                        auth: true,
                    },
                },
                {
                    path: '/',
                    name: '系统首页',
                    component: () => import('@/views/Home/System.vue'),
                    meta: {
                        auth: true,
                    },
                },
            ],
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue'),
        },
        {
            path: '/:error*',
            name: 'error',
            redirect: '/',
        },
    ],
})

router.beforeEach((to, from, next) => {
    const { Token } = storeToRefs(useUser())
    if (to.meta?.auth) {
        if (Token.value) {
            next()
            return
        }
        next('/login')
    } else {
        if (to.name === 'login' && Token.value) {
            next('/')
            return
        }
        next()
    }
})

export default router
