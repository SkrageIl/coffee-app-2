import { createRouter, createWebHistory } from 'vue-router'
import store from '../vuexStore/store'
import LoginPage from '@/components/LoginPage.vue'
import BaristaPage from '@/components/barista/BaristaPage.vue'
import OrdersPage from '@/components/barista/orders/OrdersPage.vue'
import EarnPage from '@/components/barista/EarnPage.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import CoffeeshopsPage from '@/components/admin/coffeeshops/CoffeeshopsPage.vue'
import ProductsPage from '@/components/admin/products/ProductsPage.vue'
import WorkersPage from '@/components/admin/workers/WorkersPage.vue'
import ReportsPage from '@/components/admin/reports/ReportsPage.vue'
import ReportByCoffeeshop from '@/components/admin/reports/ReportByCoffeeshop.vue'
import ReportByWorker from '@/components/admin/reports/ReportByWorker.vue'
import productsInCoffeeshopsPage from '@/components/barista/assortment/ProductsInCoffeeshopsPage.vue'

const router = createRouter({
    scrollBehavior: function(to) {
        if (to.hash) {
            return {
                el: to.hash,
                top: 120,
                behavior: 'smooth'
            }
        }
    },
    routes: [{
            path: '/',
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
                },
                {
                    path: 'products-in-coffeeshops',
                    name: 'productsInCoffeeshops',
                    component: productsInCoffeeshopsPage
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
                },
                {
                    path: 'reports',
                    name: 'reports',
                    component: ReportsPage,
                    children: [{
                            path: 'byCoffeeshops',
                            name: 'byCoffeeshops',
                            component: ReportByCoffeeshop
                        },
                        {
                            path: 'byWorker',
                            name: 'byWorker',
                            component: ReportByWorker
                        }
                    ]
                }
            ]
        },
    ],
    history: createWebHistory()
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.isLoggedIn) {
            next(from)
            return
        } else if (to.matched.some(record => record.meta.requiresRoleBarista)) {
            if (store.getters.USER.role == "barista") {
                next()
                return
            } else next(from)
        } else if (to.matched.some(record => record.meta.requiresRoleAdmin)) {
            if (store.getters.USER.role == "admin") {
                next()
                return
            } else next(from)
        } else next()
    } else if (to.name == 'login' && store.getters.isLoggedIn) {
        if (store.getters.USER.role == "barista") {
            next('/barista')
            return
        } else if (store.getters.USER.role == "admin") {
            next('/admin')
            return
        }
    } else next()
})


export default router