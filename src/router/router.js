import { createRouter, createWebHistory } from 'vue-router'
import store from '../vuexStore/store'
import LoginPage from '@/components/LoginPage.vue'
import MainWrapper from '@/components/MainWrapper.vue'
import BaristaPage from '@/components/barista/BaristaPage.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import OrdersPage from '@/components/barista/OrdersPage.vue'
import EarnPage from '@/components/barista/EarnPage.vue'

const router = createRouter({
    routes: [{
            path: '/',
            name: 'home',
            component: MainWrapper,
            props: true,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            props: true,
        },
        {
            path: '/barista',
            name: 'barista',
            component: BaristaPage,
            props: true,
            meta: {
                requiresAuth: true,
                requiresRoleBarista: true
            },
            children: [{
                    path: 'orders',
                    name: 'orders',
                    component: OrdersPage
                },
                {
                    path: 'earning',
                    name: 'earning',
                    component: EarnPage
                }
            ]
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminPage,
            props: true,
            meta: {
                requiresAuth: true,
                requiresRoleAdmin: true
            }
        },
        // {
        //     path: '/barista',
        //     name: 'barista',
        //     component: BaristaPage,
        //     props: true,
        //     meta: {
        //         requiresRole: true
        //     }
        // },
    ],
    history: createWebHistory()
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.isLoggedIn) {
            next('/login')
            return
        } else if (to.matched.some(record => record.meta.requiresRoleBarista)) {
            if (store.getters.USER.role == "barista") {
                next()
                return
            } else next('/')
        } else if (to.matched.some(record => record.meta.requiresRoleAdmin)) {
            if (store.getters.USER.role == "admin") {
                next()
                return
            } else next('/')
        } else next()
    } else next()
})


export default router