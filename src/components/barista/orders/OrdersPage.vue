<template>
<div class="orders-page">
  <div class="barista-earn">
    <v-date-picker class="calendar" v-model="date" v-if="!isCurrent">
      <template v-slot="{ inputValue, togglePopover }">
        <div class="calendar__input-block">
          <button
              class="calendar__btn"
              @click="togglePopover()"
            >
              <span class="material-icons calendar__icon">
                calendar_month
              </span>
            </button>
          <input
            :value="inputValue"
            class="calendar__input"
            @click="togglePopover()"
            readonly
          />
        </div>
      </template>
    </v-date-picker>
    <span>
      <span>
        Заработок сегодня: 
      </span>
      {{baristaEarning}} &#8381;
    </span>
  </div>
  <nav class="nav-orders">
    <button @click="this.isCurrent = true" class="nav-orders__btn" :class="{selected: this.isCurrent == true}">Текущие</button>
    <button @click="this.isCurrent = false" class="nav-orders__btn" :class="{selected: this.isCurrent == false}">Выполненные</button>
  </nav>
  <div class="current-orders" v-if="isCurrent">
    <h2>Текущие заказы</h2>
    <div class="search">
      <span class="material-icons search-icon">search</span>
      <input v-model="searchCurrent" type="search" placeholder="Поиск клиента...">
    </div>
    <AccordionList open-multiple-items>
      <AccordionItem v-for="baristaOrder in currentOrders" :key="baristaOrder.id" class="accor-order__item">
        <template #summary>
          <span class="accor-order__title">
            {{ baristaOrder.client.name }}  {{ baristaOrder.client.tel }}  {{ this.formatTime(baristaOrder.time) }}
          </span>
          <span class="accor-order__status" 
          :class="{cook: baristaOrder.status == 'Готовим', ready: baristaOrder.status == 'Готов', done: baristaOrder.status == 'Завершен'}">
            {{ baristaOrder.status }}
          </span>
        </template>
        <OrderItem :order_data="baristaOrder"/>
      </AccordionItem>
    </AccordionList>
  </div>
  <div class="comleted-orders" v-else>
    <h2>Выполненные заказы</h2>
    <div class="search">
      <span class="material-icons search-icon">search</span>
      <input v-model="searchCompleted" type="search" placeholder="Поиск клиента...">
    </div>
    <AccordionList open-multiple-items>
      <AccordionItem v-for="baristaOrder in completedDateOrders" :key="baristaOrder.id" class="accor-order__item">
        <template #summary>
          <span class="accor-order__title">
            {{ baristaOrder.client.name }}  {{ baristaOrder.client.tel }}  {{ this.formatTime(baristaOrder.time) }}
            <span class="earningPercent">
              + {{ baristaOrder.total * 0.05 }}&#8381;
            </span>
          </span>
          <span class="accor-order__status" 
          :class="{cook: baristaOrder.status == 'Готовим', ready: baristaOrder.status == 'Готов', done: baristaOrder.status == 'Завершен'}">
            {{ baristaOrder.status }}
          </span>
        </template>
        <OrderItem :order_data="baristaOrder"/>
      </AccordionItem>
    </AccordionList>
  </div>
</div>
</template>

<script>
import { ref } from 'vue'
import { AccordionList, AccordionItem } from 'vue3-rich-accordion'
import { mapActions, mapGetters } from 'vuex'
import OrderItem from './OrderItem.vue'
import moment from 'moment'

export default {
name: "OrdersPage",
components:{
  AccordionList,
  AccordionItem,
  OrderItem
},
mounted() {
  this.GET_BARISTA_CURRENT_ORDERS_FROM_DB()
  this.GET_BARISTA_COMPLETED_ORDERS_FROM_DB()
  this.startTimer()
},
beforeUnmount () {
  this.stopTimer()
},
data() {
  return {
    interval: null,
    isCurrent: true,
    date: ref(new Date()),
    searchCurrent: '',
    searchCompleted: ''
  }
},
computed: {
  ...mapGetters([
    'BARISTA_CURRENT_ORDERS',
    'BARISTA_COMPLETED_ORDERS'
  ]),
  currentOrders(){
    let search = this.searchCurrent
    return this.BARISTA_CURRENT_ORDERS.filter(function(order){
      if (order.status != "Завершен") {
        if (search == "" || order.client.name.toLowerCase().includes(search.toLowerCase())
            || order.client.tel.slice(-4) == search){
          return true
        }
      } else return false
    }).sort((a,b) => this.formatTime(a.time) > this.formatTime(b.time) ? 1 : -1)
  },
  currentCompletedOrders(){
    return this.BARISTA_CURRENT_ORDERS.filter(function(order){
      return (order.status == "Завершен")
    })
  },
  completedDateOrders(){
    let search = this.searchCompleted
    let selectedTimeFormat = moment(this.date).format('DD-MM-YYYY')
    let nowTimeFormat = moment().format('DD-MM-YYYY')

    if (selectedTimeFormat == nowTimeFormat || selectedTimeFormat == 'Invalid date') {
      return this.currentCompletedOrders.filter(function(order){
        let timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY')
        return ((timeOrderFormat == selectedTimeFormat || 
                (selectedTimeFormat == 'Invalid date' && timeOrderFormat == nowTimeFormat)) 
                && (search == "" || order.client.name.toLowerCase().includes(search.toLowerCase()) || order.client.tel.slice(-4) == search))
    }).sort((a,b) => this.formatTime(a.time) > this.formatTime(b.time) ? 1 : -1)
    } else {
        return this.BARISTA_COMPLETED_ORDERS.filter(function(order){
          let timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY')
          return (timeOrderFormat == selectedTimeFormat  
                  && (search == "" || order.client.name.toLowerCase().includes(search.toLowerCase())))
        }).sort((a,b) => this.formatTime(a.time) < this.formatTime(b.time) ? 1 : -1)
    }
  },
  baristaEarning(){
    let rate = 1500
    let percent = 0.05
    var initialValue = 0
    return this.currentCompletedOrders.reduce(
        (sum, order) => sum + order.total * percent,
        initialValue) + rate
  }
},
methods: {
  ...mapActions([
    'GET_BARISTA_CURRENT_ORDERS_FROM_DB',
    'GET_BARISTA_COMPLETED_ORDERS_FROM_DB',
    'CHANGE_BARISTA_ORDER_STATUS',
    'logout'
  ]),
  formatTime(time){
    return moment(time, 'DD-MM-YYYY HH:mm').format('HH:mm')
  },
  stopTimer () {
    if (this.interval) {
      window.clearInterval(this.interval)
    }
  },
  startTimer () {
    this.stopTimer()
    this.interval = window.setInterval(() => {
      this.GET_BARISTA_CURRENT_ORDERS_FROM_DB(),
      this.GET_BARISTA_COMPLETED_ORDERS_FROM_DB()
    }, 5000)
  },
  logOut(){
      this.logout()
      this.$router.push('/')
  },
  currentOrdersBySearch(searchString){
    if(searchString != ""){
      return this.currentOrders.filter(function(order){
        return order.client.name.toLowerCase().includes(searchString.toLowerCase())
      })
    }else {
      return this.currentOrders
    }
  },
  completedDateOrdersBySearch(searchString){
    if(searchString != ""){
      return this.completedDateOrders.filter(function(order){
        return order.client.name.toLowerCase().includes(searchString.toLowerCase())
      })
    }else {
      return this.completedDateOrders
    }
  }
}
}
</script>

<style lang="scss" scoped>
.nav-orders{
  display: flex;
  justify-content: center;
  &__btn{
    text-decoration: none;
    font-weight: 600;
    font-size: 1.25em;
    cursor: pointer;
    background-color: #17171742;
    color: #ffffffa6;
    border: 0;
    border-radius: 22px;
    margin: 1em;
    width: 15em;
    height: 2em;
  }
}
.barista-earn{
  display: flex;
  justify-content: space-around;
  margin-right: 1em;
  font-weight: 600;
  font-size: 1.5em;
  align-items: center;
}
.selected{
  background-color: #3a3939;
  color: white;
}
ul{
  list-style: none;
}
.accor-order{
  &__item{
    text-align: left;
    margin: 30px;
    cursor: pointer;
    border-radius: 22px;
    padding: 20px;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 5px 10px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 5px 10px 2px rgba(0, 0, 0, 0.2);
  }
  &__title{
    font-weight: 600;
    font-size: 1.5em;
    color: rgb(58, 57, 57);
  }
  &__status{
    font-weight: 800;
    margin-left: 20px;
    font-size: 20px;
  }
}
.calendar{
  display: flex;
  justify-content: center;
  justify-items: center;
  margin: 20px;
  &__input-block{
    display: flex;
    align-items: center;
    padding: 2px;
  }
  &__content{
    display: flex;
    justify-content: center;
    justify-items: center;
    margin-right: 90px;
  }
  &__inputs{
    display: flex;
  }
  &__input{
    width: 150px;
    padding: 5px;
    margin: 10px;
    font-size: 25px;
  }
  &__btn{
    border: 0;
    margin-right: 10px;
    background-color: transparent;
  }
  &__icon{
    font-size: 40px;
    color: #3a3939;
    padding: 6px 10px 10px;
    border-radius: 22px;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  }
}
.earningPercent{
  font-weight: 700;
  font-size: 25px;
  color: #228B22;
  padding: 10px;
  text-align: end;
}
.cook{
  color: #d7b509 !important;
}
.ready{
  color: #800000 !important;
}
.done{
  color: green !important;
}
.search{
  display: flex;
  margin: 0 30px;
  border: 2px;
  border-style: solid;
  border-radius: 5px;
  width: 50%;
  input{
    font-size: 20px;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    border: none;
  }
  .search-icon{
    font-size: 40px;
    color: #757575;
    margin: 5px;
  }
}
@media(max-width: 576px){
  h2{
    font-size: 18px;
  }
  .accor-order{
    &__title{
      font-size: 15px;
      width: 100px;
    }
    &__status{
      font-size: 0.9em;
    }
  }
  .barista-earn{
    font-size: 1em;
  }
  .nav-orders{
    &__btn{
      font-size: 0.8em;
    }
  }
  .earningPercent{
    font-size: 1em;
    padding: 0;
  }
  .calendar{
    &__btn{
      margin-right: 0;
    }
    &__icon{
      font-size: 2em;
      padding: 4px 5px 5px;
    }
    &__input{
      width: 85px;
      padding: 5px;
      margin: 10px;
      margin-left: 0;
      font-size: 1em;
    }
    &__input-block{
      margin-left: 1em;
    }
  }
  .search{
    width: auto;
    input{
      width: 100%;
      font-size: 15px;
    }
    .search-icon{
      font-size: 24px;
    }
  }
}
@media (max-width: 460px) {
  .accor-order{
    &__title{
      font-size: 12px;
      width: 100px;
    }
    &__status{
      font-size: 14px;
    }
  }
  .img-item{
    width: 25px;
    margin: 0 5px;
    img{
      width: 25px;
    }
  }
  li{
    font-size: 9px;
  }
  .orders{
    &__total{
      font-size: 14px;
    }
  }
}
</style>