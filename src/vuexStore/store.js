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
        baristaCompletedOrders: []
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
        OPEN_MODAL(state) {
            state.isModal = true
        },
        CLOSE_MODAL(state) {
            state.isModal = false
        },
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
            console.log(order.status)
            console.log(order.id)
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
        }
    },
    getters: {
        BARISTA_CURRENT_ORDERS(state) {
            return state.baristaCurrentOrders
        },
        BARISTA_COMPLETED_ORDERS(state) {
            return state.baristaCompletedOrders
        },
        USER(state) {
            return state.user;
        },
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
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