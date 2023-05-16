import { createStore } from 'vuex'
import axios from 'axios'
import moment from 'moment'

let store = createStore({
    state: {
        isModal: false,
        status: '',
        token: localStorage.getItem('tokenWorker') || '',
        user: JSON.parse(localStorage.getItem('userWorker')) || {},
        shops: [],
        order: {},
        baristaCurrentOrders: [],
        baristaCompletedOrders: [],
        drinks: [],
        foods: [],
        workers: [],
        completedOrders: []
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading'
        },
        auth_success(state, user) {
            state.status = 'success'
            state.token = user.token
            state.user = user
        },
        auth_error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = ''
            state.token = ''
            state.user = {}
        },
        ADD_CURRENT_ORDER_FOR_BARISTA: (state, baristaOrders) => {
            state.baristaCurrentOrders = baristaOrders
        },
        ADD_COMPLETED_ORDER_FOR_BARISTA: (state, baristaOrders) => {
            state.baristaCompletedOrders = baristaOrders
        },
        COMPLETE_ORDER(state, order) {
            state.baristaCurrentOrders.forEach(function(item) {
                if (item.id === order.id) {
                    item.status = order.status
                }
            })
        },
        SET_DRINKS_TO_STATE: (state, drinks) => {
            state.drinks = drinks;
        },
        SET_FOODS_TO_STATE: (state, foods) => {
            state.foods = foods;
        },
        OPEN_MODAL(state) {
            state.isModal = true
        },
        CLOSE_MODAL(state) {
            state.isModal = false
        },
        SET_WORKERS_TO_STATE(state, workers) {
            state.workers = workers
        },
        SET_SHOPS_TO_STATE: (state, shops) => {
            state.shops = shops
        },
        SET_COMPLETED_ORDERS_TO_STATE: (state, orders) => {
            state.completedOrders = orders
        }
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios('http://localhost:3000/users', {
                        method: 'GET'
                    })
                    .then((resp) => {
                        resp.data.find((item) => {
                            if (item.tel == user.tel && item.password == user.password && (item.role == "barista" || item.role == "admin")) {
                                axios.defaults.headers.common['Authorization'] = item.token
                                localStorage.setItem('tokenWorker', item.token)
                                localStorage.setItem('userWorker', JSON.stringify(item));
                                commit('auth_success', item)
                                resolve(resp)
                            }
                        })
                    })
                    .catch(err => {
                        commit('auth_error')
                        localStorage.removeItem('tokenWorker')
                        reject(err)
                    })
            })
        },
        logout({ commit }) {
            return new Promise((resolve, reject) => {
                try {
                    commit('logout')
                    localStorage.removeItem('tokenWorker')
                    localStorage.removeItem('userWorker')
                    delete axios.defaults.headers.common['Authorization']
                    resolve()
                } catch (err) {
                    commit('auth_error', err)
                    localStorage.removeItem('tokenWorker')
                    reject(err)
                }
            })
        },
        GET_BARISTA_CURRENT_ORDERS_FROM_DB({ commit, getters }) {
            return axios('http://localhost:3000/orders', {
                    method: "GET"
                })
                .then((orders) => {
                    var baristaOrders = []
                    orders.data.forEach(function(order) {
                        let timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY')
                        if (order.address == getters.USER.depart && timeOrderFormat == moment().format('DD-MM-YYYY')) {
                            baristaOrders.push(order)
                        }
                    })
                    commit('ADD_CURRENT_ORDER_FOR_BARISTA', baristaOrders)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        GET_BARISTA_COMPLETED_ORDERS_FROM_DB({ commit, getters }) {
            return axios('http://localhost:3000/orders', {
                    method: "GET"
                })
                .then((orders) => {
                    var baristaOrders = []
                    orders.data.forEach(function(order) {
                        let timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY')
                        if (order.address == getters.USER.depart &&
                            order.status == "Завершен" &&
                            timeOrderFormat != moment().format('DD-MM-YYYY')) {
                            baristaOrders.push(order)
                        }
                    })
                    commit('ADD_COMPLETED_ORDER_FOR_BARISTA', baristaOrders)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        CHANGE_BARISTA_ORDER_STATUS({ commit }, order) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/orders/' + order.id, {
                        data: {
                            "status": order.status
                        },
                        method: 'PATCH'
                    })
                    .then(() => {
                        commit('COMPLETE_ORDER', order)
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        DELETE_FOOD_ITEM_FROM_DB({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/foods/' + id, {
                        method: 'DELETE'
                    })
                    .then(() => {
                        dispatch('GET_FOODS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        DELETE_DRINK_ITEM_FROM_DB({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/drinks/' + id, {
                        method: 'DELETE'
                    })
                    .then(() => {
                        dispatch('GET_DRINKS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        CHANGE_DRINK_ITEM_TO_DB({ dispatch }, product) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/drinks/' + product.id, {
                        data: {
                            "id": product.id,
                            "name": product.name,
                            "article": product.article,
                            "image": product.image,
                            "price": product.price,
                            "quantity": product.quantity,
                            "type": product.type,
                            "title": product.title,
                            "coffeeshops": product.coffeeshops
                        },
                        method: 'PATCH'
                    })
                    .then(() => {
                        dispatch('GET_DRINKS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        CHANGE_FOOD_ITEM_TO_DB({ dispatch }, product) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/foods/' + product.id, {
                        data: {
                            "id": product.id,
                            "name": product.name,
                            "article": product.article,
                            "image": product.image,
                            "price": product.price,
                            "quantity": 0,
                            "type": product.type,
                            "title": product.title,
                            "coffeeshops": product.coffeeshops
                        },
                        method: 'PATCH'
                    })
                    .then(() => {
                        dispatch('GET_FOODS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        ADD_FOOD_ITEM_TO_DB({ dispatch }, product) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/foods/', {
                        data: {
                            "id": product.id,
                            "name": product.name,
                            "article": product.article,
                            "image": product.image,
                            "price": product.price,
                            "quantity": 0,
                            "type": product.type,
                            "title": product.title,
                            "coffeeshops": product.coffeeshops
                        },
                        method: 'POST'
                    })
                    .then(() => {
                        dispatch('GET_FOODS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        ADD_DRINK_ITEM_TO_DB({ dispatch }, product) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/drinks/', {
                        data: {
                            "id": product.id,
                            "name": product.name,
                            "article": product.article,
                            "image": product.image,
                            "price": product.price,
                            "quantity": 0,
                            "type": product.type,
                            "title": product.title,
                            "coffeeshops": product.coffeeshops
                        },
                        method: 'POST'
                    })
                    .then(() => {
                        dispatch('GET_DRINKS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        GET_DRINKS_FROM_DB({ commit }) {
            return axios('http://localhost:3000/drinks', {
                    method: "GET"
                })
                .then((drinks) => {
                    commit('SET_DRINKS_TO_STATE', drinks.data);
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        GET_FOODS_FROM_DB({ commit }) {
            return axios('http://localhost:3000/foods', {
                    method: "GET"
                })
                .then((foods) => {
                    commit('SET_FOODS_TO_STATE', foods.data);
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        GET_WORKERS_FROM_DB({ commit }) {
            return axios('http://localhost:3000/users', {
                    method: "GET"
                })
                .then((workers) => {
                    workers = workers.data.filter(worker => worker.role == "barista")
                    commit('SET_WORKERS_TO_STATE', workers)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        DELETE_WORKER_ITEM_FROM_DB({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/users/' + id, {
                        method: 'DELETE'
                    })
                    .then(() => {
                        dispatch('GET_WORKERS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        CHANGE_WORKER_ITEM_TO_DB({ dispatch }, worker) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/users/' + worker.id, {
                        data: {
                            "name": worker.name,
                            "tel": worker.tel,
                            "depart": worker.depart
                        },
                        method: 'PATCH'
                    })
                    .then(() => {
                        dispatch('GET_WORKERS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        ADD_WORKER_ITEM_TO_DB({ dispatch }, worker) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/users/', {
                        data: {
                            "name": worker.name,
                            "tel": worker.tel,
                            "password": worker.password,
                            "role": "barista",
                            "depart": worker.depart,
                            "token": "SomeToken1"
                        },
                        method: 'POST'
                    })
                    .then(() => {
                        dispatch('GET_WORKERS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        GET_SHOPS_FROM_DB({ commit }) {
            return axios('http://localhost:3000/shops', {
                    method: "GET"
                })
                .then((shops) => {
                    commit('SET_SHOPS_TO_STATE', shops.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        DELETE_SHOP_ITEM_FROM_DB({ dispatch }, id) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/shops/' + id, {
                        method: 'DELETE'
                    })
                    .then(() => {
                        dispatch('GET_SHOPS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        CHANGE_SHOP_ITEM_TO_DB({ dispatch }, shop) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/shops/' + shop.id, {
                        data: {
                            "address": shop.address,
                            "time": shop.time,
                            "phone": shop.phone
                        },
                        method: 'PATCH'
                    })
                    .then(() => {
                        dispatch('GET_SHOPS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        ADD_SHOP_ITEM_TO_DB({ dispatch }, shop) {
            return new Promise((resolve, reject) => {
                axios('http://localhost:3000/shops/', {
                        data: {
                            "address": shop.address,
                            "time": shop.time,
                            "phone": shop.phone
                        },
                        method: 'POST'
                    })
                    .then(() => {
                        dispatch('GET_SHOPS_FROM_DB')
                        resolve()
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        GET_ORDERS_FROM_DB({ commit }) {
            return axios('http://localhost:3000/orders', {
                    method: "GET"
                })
                .then((orders) => {
                    var completedOrders = []
                    orders.data.forEach(function(order) {
                        if (order.status == "Завершен") {
                            completedOrders.push(order)
                        }
                    })
                    commit('SET_COMPLETED_ORDERS_TO_STATE', completedOrders)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    },
    getters: {
        BARISTA_CURRENT_ORDERS: state => state.baristaCurrentOrders,
        BARISTA_COMPLETED_ORDERS: state => state.baristaCompletedOrders,
        COMPLETED_ORDERS: state => state.completedOrders,
        USER: state => state.user,
        DRINKS: state => state.drinks,
        FOODS: state => state.foods,
        WORKERS: state => state.workers,
        SHOPS: state => state.shops,
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        ROLE: state => state.user.role,
        isBarista: state => {
            if (state.user.role == "barista") {
                return true
            }
        },
        isAdmin: state => {
            if (state.user.role == "admin") {
                return true
            }
        }
    }
})

export default store;