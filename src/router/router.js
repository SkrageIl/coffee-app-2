import { createRouter, createWebHistory } from 'vue-router'
import store from '../vuexStore/store'
import LoginPage from '@/components/LoginPage.vue'
import MainWrapper from '@/components/MainWrapper.vue'
import BaristaPage from '@/components/barista/BaristaPage.vue'
import OrdersPage from '@/components/barista/OrdersPage.vue'
import EarnPage from '@/components/barista/EarnPage.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import CoffeeshopsPage from '@/components/admin/CoffeeshopsPage.vue'
import ProductsPage from '@/components/admin/ProductsPage.vue'
import WorkersPage from '@/components/admin/WorkersPage.vue'

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
            },
            children: [{
                    path: 'coffeeshops',
                    name: 'coffeeshops',
                    component: CoffeeshopsPage
                },
                {
                    path: 'products',
                    name: 'products',
                    component: ProductsPage
                },
                {
                    path: 'workers',
                    name: 'workers',
                    component: WorkersPage
                }
            ]
        },
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