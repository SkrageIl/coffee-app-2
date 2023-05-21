<template>
  <div class="rbc">
    <div class="rbc__top-content">
      <div class="rbc__top-content__coffeeshop">
        <p>Кофейня</p>
        <div class="select-input">
          <div class="select-input__content">
            <select v-model="this.coffeeshop">
              <option v-for="shop in SHOPS" :key="shop.id" :value="shop.address">{{shop.address}}</option>
            </select>
            <button @click="this.coffeeshop = ''" class="material-icons">close</button>
          </div>
        </div>
      </div>
      <div class="rbc__top-content__worker">
        <p>Сотрудник</p>
        <div class="select-input">
          <div class="select-input__content">
            <select v-model="this.worker">
              <option v-for="worker in WORKERS" :key="worker.id" :value="worker">{{worker.name}}({{worker.tel}})</option>
            </select>
            <button @click="this.worker = null" class="material-icons">close</button>
          </div>
        </div>
      </div>
      <div class="rbc__top-content__user">
        <p>Клиент</p>
        <div class="search">
          <span class="material-icons search-icon">search</span>
          <input v-model="searchUser" type="search" placeholder="Поиск клиента...">
        </div>
      </div>
      <div class="rbc__top-content__calendar">
        <p>Дата</p>
        <v-date-picker class="calendar" v-model="date">
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
              <button @click="this.date = null" class="material-icons close">close</button>
            </div>
          </template>
        </v-date-picker>
      </div>
    </div>
    <div class="rbc__bot-content orders">
      <AccordionList open-multiple-items>
        <AccordionItem v-for="ordersDetails in completedOrders" :key="ordersDetails.id" class="accord-order__item">
          <template #summary>
            <div class="accord-order__title orders__sum">
              <div class="orders__sum__details details__client">
                <p>Клиент:</p>
                <p>{{ ordersDetails.client.name }}({{ ordersDetails.client.tel }})</p>
              </div>
              <div class="orders__sum__details details__worker">
                <p>Сотрудник:</p>
                <p>{{ordersDetails.worker.name}}({{ ordersDetails.worker.tel }})</p>
              </div>
              <div class="orders__sum__details details__coffeeshop">
                <p>Кофейня:</p>
                <p>{{ordersDetails.address}}</p>
              </div>
              <div class="orders__sum__details details__date">
                <p>Дата:</p>
                <p>{{ ordersDetails.time }}</p>
              </div>
              <div class="orders__sum__details details__total">
                <p>Сумма:</p>
                <p class="accord-order__days-earning">{{ ordersDetails.total }}&#8381;</p>
              </div>
            </div>
          </template>
          <OrderItem :order_data="ordersDetails" class="accord-order__details-item"/>
        </AccordionItem>
      </AccordionList>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import moment from 'moment'
import { AccordionList, AccordionItem } from 'vue3-rich-accordion'
import OrderItem from '@/components/barista/orders/OrderItem.vue'

export default {
  name: "OrdersStatsPage",
  components:{
    AccordionList,
    AccordionItem,
    OrderItem
  },
  mounted() {
    this.GET_SHOPS_FROM_DB()
    this.GET_ORDERS_FROM_DB()
    this.GET_WORKERS_FROM_DB()
  },
  data() {
    return {
      date: null,
      shops: [],
      searchUser: "",
      coffeeshop: "",
      worker: null
    };
  },
  props: {},
  computed: {
    ...mapGetters([
      'SHOPS',
      'COMPLETED_ORDERS',
      'CURRENT_ORDERS',
      'SHOPS',
      'WORKERS'
    ]),
    checkSelectAll(){
      if (this.shops.length == this.SHOPS.length) {
        return true
      } else return false
    },
    completedOrders(){
    let user = this.searchUser
    let worker = this.worker
    let coffeeshop = this.coffeeshop
    let selectedTimeFormat = moment(this.date).format('DD-MM-YYYY')

    return this.COMPLETED_ORDERS.filter(function(order){
      let timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY')
      return ((timeOrderFormat == selectedTimeFormat || selectedTimeFormat == 'Invalid date') 
              && (user == "" || order.client.name.toLowerCase().includes(user.toLowerCase()) || order.client.tel.slice(-4) == user)
              && (worker == null || order.worker.tel == worker.tel)
              && (coffeeshop == "" || order.address == coffeeshop))
    }).sort((a,b) => this.formatTime(a.time) < this.formatTime(b.time) ? 1 : -1)
  },
  },
  methods: {
    ...mapActions([
      'GET_SHOPS_FROM_DB',
      'GET_ORDERS_FROM_DB',
      'GET_WORKERS_FROM_DB'
    ]),
    formatDate(date){
      if (date != null) {
        return moment(date).format('DD-MM-YYYY')
      } else return ""
    },
    deleteDate(){
      this.range.start = null
      this.range.end = null
    },
    selectAll(){
      if(this.shops.length == this.SHOPS.length){
        this.shops = []
      } else this.shops = this.SHOPS.map(shop => shop.address)
    },
    formatTime(time){
      return moment(time, 'DD-MM-YYYY HH:mm').format('HH:mm')
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-select-all{
  font-size: 1em;
  width: 1em;
  height: 1em;
}
.search{
  display: flex;
  margin: 0 15px 30px 5%;
  border: 1px;
  border-style: solid;
  border-radius: 5px;
  width: fit-content;
  input{
    font-size: 20px;
    padding: 10px;
    width: 15em;
    border-radius: 5px;
    border: none;
  }
  .search-icon{
    font-size: 40px;
    color: #757575;
    margin: 5px;
  }
}
.orders{
  &__sum{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: baseline;
    padding: 15px 5px;
    &__details{
      display: grid;
      grid-template-rows: 1fr 1fr;
      margin: 5px;
      p{
        padding: 0;
        margin: 5px 10px;
        font-size: 18px;
      }
    }
  }
}
.coffeeshops-accord{
  margin-top: 32px;
}
.coffeeshops-selection{
  &__btn{
    grid-column: span 2
  }
  &__selected{
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  &__list{
    text-align: left;
    margin: 20px;
  }
  &__item{
    margin: 10px;
    display: flex;
    input{
      font-size: 1em;
      width: 1em;
      height: 1em;
    }
    label{
      margin-left: 5px;
    }
  }
  &__input{
    cursor: pointer;
    display: flex;
    margin: 0 5%;
    flex-wrap: wrap;
    width: fit-content;
    padding: 16px 10px;
    border-radius: 10px;
    font-size: 20px;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
  }
  &__input-list-item{
    margin: 5px 5px;
    background-color: #ff900070;
    color: #3a3939;
    font-weight: 600;
    font-size: 18px;
    border-radius: 5px;
    padding: 5px;
  }
}
.details-orders{
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  font-weight: 600;
  font-size: 22px;
  &__quan{
    margin-left: 10px;
  }
  p{
    font-size: 20px;
  }
}
p{
  font-size: 25px;
  font-weight: 600;
  text-align: left;
  margin: 20px 5%;
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
    margin: 0 15px 0 3%;
    .close{
      padding: 10px;
      border: none;
      border-radius: 50%;
      background-color: white;
      cursor: pointer;
      box-shadow: 0px 0px 10px -2px rgba(34, 60, 80, 0.2) inset;
    }
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
    cursor: pointer;
  }
  &__btn{
    border: 0;
    margin-right: 10px;
    background-color: transparent;
    cursor: pointer;
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
.rbc{
  &__top-content{
    select{
      width: 15em;
      font-size: 1.5em;
      padding: 5px;
      text-align: left;
      display: flex;
      margin: 0 15px 30px 5%;
      height: 60px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  &__center-content{
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
  }
  &__sumAll{
    white-space: nowrap;
  }
  &__quantityAll{
    white-space: nowrap;
  }
}
.accord-order{
  &__days{
    margin: 30px 10%;
    padding: 20px;
    text-align: left;
    border-radius: 10px;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  }
  &__days-title{
    font-weight: 600;
    font-size: 22px;
  }
  &__days-earning{
    font-weight: 700;
    font-size: 22px;
    color: #228B22;
    padding: 10px;
    width: fit-content;
    text-align: end;
  }
  &__item{
    margin: 25px;
    font-size: 20px;
    font-weight: 600;
    border-radius: 10px;
    -webkit-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
  }
  &__details-item{
    font-size: 15px;
    padding: 0 10%;
  }
}
.earning-selected{
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 20px;
  background-color: #10f9333b;
  padding: 20px 12%;
}
.select-input{
  &__content{
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    button{
      padding: 10px;
      border: none;
      border-radius: 50%;
      background-color: white;
      cursor: pointer;
      box-shadow: 0px 0px 10px -2px rgba(34, 60, 80, 0.2) inset;
    }
  }
}
@media(min-width: 576px){
  .rbc{
    &__top-content{
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
}
@media(max-width: 1024px){
  .orders{
    &__sum{
      &__details{
        p{
          font-size: 15px;
        }
      }
    }
  }
}
@media(max-width: 900px){
  p{
    font-size: 18px;
  }
  .rbc{
    &__top-content{
      select{
        font-size: 16px;
        margin: 0 15px 0 5%;
        height: fit-content;
        width: 15em;
      }
      &__calendar{
        p{
          margin-bottom: 7px;
        }
      }
    }
  }
  .calendar{
    &__icon{
      font-size: 25px;
    }
    &__input{
      font-size: 20px;
    }
    &__input-block{
      margin: 0 15px 0 5%;
      .close{
        font-size: 15px;
      }
    }
  }
  .search{
    margin: 0 15px 0 5%;
    width: 15em;
    .search-icon{
      font-size: 25px;
    }
    input{
      font-size: 16px;
      padding: 5px;
    }
  }
  .select-input{
    &__content{
      button{
        font-size: 15px;
      }
    }
  }
  .details{
    &__client{
      grid-column: 1/2;
      grid-row: 1/2;
    }
    &__worker{
      grid-column: 1/2;
      grid-row: 2/2;
    }
    &__coffeeshop{
      grid-column: 2/3;
      grid-row: 1/2;
    }
    &__date{
      grid-column: 2/3;
      grid-row: 2/2;
    }
    &__total{
      grid-column: 3/3;
      grid-row: 1/2;
    }
  }
  .orders{
    &__sum{
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: 1fr 1fr;
      justify-content: stretch;
    }
  }
}
@media(max-width: 576px){
  .orders{
    &__sum{
      padding: 5px 5px;
      &__details{
        p{
          font-size: 12px;
          margin: 2px;
        }
      }
    }
  }
}
@media(max-width: 450px){
  .orders{
    &__sum{
      padding: 5px 5px;
      grid-template-columns: auto auto;
      grid-template-rows: 1fr 1fr 1fr;
      &__details{
        p{
          font-size: 12px;
          margin: 2px;
        }
      }
    }
  }
  .details{
    &__total{
      grid-column: 1/2;
      grid-row: 3/3;
    }
  }
}
@media(max-width: 576px){
  .calendar{
    &__inputs{
      display: flex;
      align-items: center;
    }
    &__content{
      margin-right: 1em;
    }
    &__input{
      width: 90px;
      height: fit-content;
      padding: 5px;
      margin: 0 5px;
      font-size: 1em;
    }
    &__input-block{
      margin: 0 15px 0 4%;
      .close{
        font-size: 12px;
        padding: 7px;
      }
    }
    &__icon{
      font-size: 22px;
      padding: 4px 5px 5px;
    }
    &__btn{
      font-size: 50px;
      width: fit-content;
      display: flex;
      margin-right: 0;
    }
  }
  .accord-order{
    &__days-title{
      font-size: 10px;
    }
    &__days-earning{
      font-size: 1em;
      padding: 10px 10px 10px 5px;
    }
    &__item{
      font-size: 1em;
    }
    &__days{
      padding: 10px;
    }
  }
  .earning-selected{
    font-size: 1em;
  }
  .rbc{
    &__top-content{
      display: grid;
      select{
        font-size: 13px;
        margin: 0 5px 5px 5%;
      }
      p{
        font-size: 15px;
        margin: 10px 5% 5px;
      }
    }
    &__center-content{
      grid-template-columns: 1fr;
      justify-items: baseline;
      p{
        margin: 5px 20px;
        font-size: 15px
      }
    }
  }
  p{
    font-size: 100%;
  }
  .details-orders{
    font-size: 12px;
    p{
      font-size: 10px;
    }
  }
  .orders{
    &__sum{
      padding: 5px 5px;
      &__details{
        p{
          font-size: 12px;
          margin: 2px;
        }
      }
    }
  }
  .search{
    width: 12em;
    input{
      font-size: 13px;
      width: 100%;
    }
    .search-icon{
      font-size: 20px;
    }
  }
  .select-input{
    &__content{
      align-items: baseline;
      button{
        font-size: 12px;
        padding: 7px;
      }
    }
  }
}
@media(max-width: 400px){
  .rbc{
    &__top-content{
      p{
        font-size: 12px;
      }
      select{
        font-size: 12px;
      }
    }
  }
  .calendar{
    &__icon{
      font-size: 17px;
    }
    &__input{
      font-size: 13px;
    }
    &__input-block{
      .close{
        font-size: 10px;
        padding: 5px;
      }
    }
  }
  .search{
    width: 11em;
    .search-icon{
      font-size: 15px;
    }
  }
  .select-input{
    &__content{
      button{
        font-size: 10px;
        padding: 5px;
      }
    }
  }
  .orders{
    &__sum{
      &__details{
        p{
          font-size: 10px;
        }
      }
    }
  }
}
</style>