<template>
  <div class="rbc">
    <div class="rbc__top-content">
      <div class="rbc__top-content__calendar">
        <p>Период</p>
        <v-date-picker v-model="range" is-range>
          <template v-slot="{ togglePopover }">
            <div class="calendar__content">
              <button
                class="calendar__btn"
                @click="togglePopover()"
              >
                <span class="material-icons calendar__icon">
                  calendar_month
                </span>
              </button>
              <div class="calendar__inputs">
                <input
                  :value="this.formatDate(this.range.start)"
                  class="calendar__input"
                  @click="togglePopover()"
                />
                <span class="material-icons calendar__arrow">arrow_forward</span>
                <input
                  :value="this.formatDate(this.range.end)"
                  class="calendar__input"
                  @click="togglePopover()"
                />
              </div>
              <span class="calendar__close-btn">
                <button @click="deleteDate()" class="material-icons">close</button>
              </span>
            </div>
          </template>
        </v-date-picker>
      </div>
      <div class="rbc__top-content__coffeeshops">
        <p>Кофейня</p>
        <AccordionList class="coffeeshops-accord">
          <AccordionItem class="coffeeshops-selection__input">
            <template #summary>
              <span class="coffeeshops-selection__selected">
                <span class="coffeeshops-selection__btn" v-if="this.shops.length == 0">Выберите кофейню</span>
                <span class="coffeeshops-selection__input-list-item" v-for="shop in this.shops" :key="shop.id">
                  {{shop}}
                </span>
              </span>
            </template>
            <div class="coffeeshops-selection__list">
              <input class="btn-select-all" type="checkbox" @click="selectAll()" v-model="checkSelectAll" id="selectAll">
              <label for="selectAll">Все</label>
              <div class="coffeeshops-selection__item" v-for="shop in SHOPS" :key="shop.id">
                <input v-model="this.shops" 
                type="checkbox" 
                :name="shop.address" :id="shop.address" :value="shop.address">
                <label :for="shop.address">{{shop.address}}</label>
              </div>
            </div>
          </AccordionItem>
        </AccordionList>
      </div>
    </div>
    <div class="rbc__center-content">
      <div class="rbc__quantityAll">
        <p>Выполнено заказов: {{summaryAll.quantity}}</p>
      </div>
      <div class="rbc__sumAll">
        <p>Выручка: {{summaryAll.summ}}&#8381;</p>
      </div>
    </div>
    <div class="rbc__bot-content">
      <AccordionList>
        <AccordionItem v-for="ordersByCoffeeshops in completedOrdersByCoffeeshops" :key="ordersByCoffeeshops.id" class="accord-order__days">
          <template #summary>
            <span class="accord-order__days-title">
              {{ ordersByCoffeeshops.coffeeshop }}
            </span>
            <span class="details-orders">
              <p>Заказов:</p>
              <span class="details-orders__quan">
                {{ ordersByCoffeeshops.quantity }}
              </span>
            </span>
            <span class="details-orders">
              <p>Выручка:</p>
              <span class="accord-order__days-earning">
                {{ ordersByCoffeeshops.sum  }}&#8381;
              </span>
            </span>
          </template>
          <AccordionList open-multiple-items>
            <AccordionItem v-for="ordersMonthDetails in this.completedOrdersByCoffeeshopsMonthDetails(ordersByCoffeeshops)" :key="ordersMonthDetails.id" class="accord-order__item">
              <template #summary>
                <span class="accord-order__days-title">
                  {{ ordersMonthDetails.date }}
                </span>
                <span class="details-orders">
                  <p>Заказов:</p>
                  <span class="details-orders__quan">
                    {{ ordersMonthDetails.quantity }}
                  </span>
                </span>
                <span class="details-orders">
                  <p>Выручка:</p>
                  <span class="accord-order__days-earning">
                    {{ ordersMonthDetails.sum  }}&#8381;
                  </span>
                </span>
              </template>
              <AccordionList open-multiple-items>
                <AccordionItem v-for="ordersDaysDetails in this.completedOrdersByCoffeeshopsDaysDetails(ordersByCoffeeshops)" :key="ordersDaysDetails.id" class="accord-order__item">
                  <template #summary>
                    <span class="accord-order__days-title">
                      {{ ordersDaysDetails.date }}
                    </span>
                    <span class="details-orders">
                      <p>Заказов:</p>
                      <span class="details-orders__quan">
                        {{ ordersDaysDetails.quantity }}
                      </span>
                    </span>
                    <span class="details-orders">
                      <p>Выручка:</p>
                      <span class="accord-order__days-earning">
                        {{ ordersDaysDetails.sum  }}&#8381;
                      </span>
                    </span>
                  </template>
                  <AccordionList open-multiple-items>
                    <AccordionItem v-for="ordersDetails in this.completedOrdersByCoffeeshopsDetails({coffeeshop: ordersByCoffeeshops.coffeeshop, date: ordersDaysDetails.date})" :key="ordersDetails.id" class="accord-order__item">
                      <template #summary>
                        <span class="accord-order__title">
                          {{ ordersDetails.client.name }}
                          ({{ ordersDetails.client.tel }})
                          {{ this.formatTime(ordersDetails.time) }}
                          <span class="accord-order__days-earning">
                            {{ ordersDetails.total }}&#8381;
                          </span>
                        </span>
                      </template>
                      <OrderItem :order_data="ordersDetails" class="accord-order__details-item"/>
                    </AccordionItem>
                  </AccordionList>
                </AccordionItem>
              </AccordionList>
            </AccordionItem>
          </AccordionList>
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
  name: "ReportByCoffeeshop",
  components:{
    AccordionList,
    AccordionItem,
    OrderItem
  },
  mounted() {
    this.GET_SHOPS_FROM_DB()
    this.GET_ORDERS_FROM_DB()
  },
  data() {
    return {
      range: {
        start: null,
        end: null
      },
      shops: []
    };
  },
  props: {},
  computed: {
    ...mapGetters([
      'SHOPS',
      'COMPLETED_ORDERS'
    ]),
    checkSelectAll(){
      if (this.shops.length == this.SHOPS.length) {
        return true
      } else return false
    },
    completedOrdersByCoffeeshops(){
      let selectedStartTimeFormat = moment(this.range.start).format('DD-MM-YYYY')
      let selectedEndTimeFormat = moment(this.range.end).format('DD-MM-YYYY')
      selectedStartTimeFormat = moment(selectedStartTimeFormat, 'DD-MM-YYYY')
      selectedEndTimeFormat = moment(selectedEndTimeFormat, 'DD-MM-YYYY')
      let shops = this.shops

      let OrdersByCoffeeshops = this.COMPLETED_ORDERS.reduce((arr, order) => {
        const timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').startOf('day')
        const coffeeshop = order.address
        if ((timeOrderFormat.isBetween(selectedStartTimeFormat, selectedEndTimeFormat, 'day', '[]')
          || this.range.start == null || this.range.end == null)
          && (shops.includes(order.address) || shops.length == 0)) {
          const foundItem = arr.find(item => item.coffeeshop == coffeeshop)
          if(foundItem) {
            foundItem.sum += order.total
            foundItem.quantity++
          } else {
            arr.push({ coffeeshop, sum: order.total, quantity: 1 })
          }
        }
        return arr
      }, [])
      return OrdersByCoffeeshops
    },
    summaryAll(){
      let selectedStartTimeFormat = moment(this.range.start).format('DD-MM-YYYY')
      let selectedEndTimeFormat = moment(this.range.end).format('DD-MM-YYYY')
      selectedStartTimeFormat = moment(selectedStartTimeFormat, 'DD-MM-YYYY')
      selectedEndTimeFormat = moment(selectedEndTimeFormat, 'DD-MM-YYYY')
      let shops = this.shops

      let summaryAll = this.COMPLETED_ORDERS.reduce((summary, order) => {
        const timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').startOf('day')
        if ((timeOrderFormat.isBetween(selectedStartTimeFormat, selectedEndTimeFormat, 'day', '[]')
          || this.range.start == null || this.range.end == null)
          && (shops.includes(order.address) || shops.length == 0)) {
            summary.quantity++
            summary.summ += order.total
        }
        return summary
      }, { quantity: 0, summ: 0})
      return summaryAll
    }
  },
  methods: {
    ...mapActions([
      'GET_SHOPS_FROM_DB',
      'GET_ORDERS_FROM_DB'
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
    completedOrdersByCoffeeshopsMonthDetails(orders){
      let selectedStartTimeFormat = moment(this.range.start).format('DD-MM-YYYY')
      let selectedEndTimeFormat = moment(this.range.end).format('DD-MM-YYYY')
      selectedStartTimeFormat = moment(selectedStartTimeFormat, 'DD-MM-YYYY')
      selectedEndTimeFormat = moment(selectedEndTimeFormat, 'DD-MM-YYYY')
      let coffeeshop = orders.coffeeshop

      let OrdersByCoffeeshops = this.COMPLETED_ORDERS.reduce((arr, order) => {
        const timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').startOf('day')
        if ((timeOrderFormat.isBetween(selectedStartTimeFormat, selectedEndTimeFormat, 'day', '[]')
          || this.range.start == null || this.range.end == null)
          && (order.address == coffeeshop)) {
          moment.locale('ru');
          const date = timeOrderFormat.format('YYYY MM (MMMM)')
          const foundItem = arr.find(item => item.date === date)
          if(foundItem) {
            foundItem.sum += order.total
            foundItem.quantity++
          } else {
            arr.push({ date, sum: order.total, quantity: 1 })
          }
        }
        return arr
      }, [])
      return OrdersByCoffeeshops.sort((a,b) => a.date < b.date ? 1 : -1)
    },
    completedOrdersByCoffeeshopsDaysDetails(orders){
      let selectedStartTimeFormat = moment(this.range.start).format('DD-MM-YYYY')
      let selectedEndTimeFormat = moment(this.range.end).format('DD-MM-YYYY')
      selectedStartTimeFormat = moment(selectedStartTimeFormat, 'DD-MM-YYYY')
      selectedEndTimeFormat = moment(selectedEndTimeFormat, 'DD-MM-YYYY')
      let coffeeshop = orders.coffeeshop

      let OrdersByCoffeeshops = this.COMPLETED_ORDERS.reduce((arr, order) => {
        const timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').startOf('day')
        if ((timeOrderFormat.isBetween(selectedStartTimeFormat, selectedEndTimeFormat, 'day', '[]')
          || this.range.start == null || this.range.end == null)
          && (order.address == coffeeshop)) {
          const date = timeOrderFormat.format('DD-MM-YYYY')
          const foundItem = arr.find(item => item.date === date)
          if(foundItem) {
            foundItem.sum += order.total
            foundItem.quantity++
          } else {
            arr.push({ date, sum: order.total, quantity: 1 })
          }
        }
        return arr
      }, [])
      return OrdersByCoffeeshops.sort((a,b) => a.date < b.date ? 1 : -1)
    },
    completedOrdersByCoffeeshopsDetails(details){
      let date = moment(details.date, 'DD-MM-YYYY').format('DD-MM-YYYY')
      let coffeeshop = details.coffeeshop

      return this.COMPLETED_ORDERS.filter(function(order) {
        let timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY')
        return timeOrderFormat == date && order.address == coffeeshop
      }).sort((a,b) => a.time < b.time ? 1 : -1)
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
  margin-bottom: 40px;
  &__close-btn{
    display: flex;
    align-items: center;
    button{
      padding: 10px;
      border: none;
      border-radius: 50%;
      background-color: white;
      -webkit-box-shadow: 0px 0px 10px -2px rgba(34, 60, 80, 0.2) inset;
      -moz-box-shadow: 0px 0px 10px -2px rgba(34, 60, 80, 0.2) inset;
      box-shadow: 0px 0px 10px -2px rgba(34, 60, 80, 0.2) inset;
    }
  }
  &__content{
    display: flex;
    justify-content: flex-start;
    justify-items: center;
    margin: 0 5%;
  }
  &__inputs{
    display: flex;
  }
  &__input{
    width: 150px;
    padding: 10px;
    margin: 10px;
    font-size: 25px;
    border: none;
    border-radius: 10px;
    text-align: center;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
  }
  &__btn{
    font-size: 50px;
    border: 0;
    padding: 5px;
    margin-right: 10px;
    background-color: transparent;
  }
  &__arrow{
    display: grid;
    align-items: center;
  }
  &__icon{
    font-size: 50px;
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
      font-size: 1.5em;
      padding: 5px;
      text-align: left;
      display: flex;
      margin: 30px 5%;
      height: 60px;
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
    margin: 20px;
    font-size: 20px;
    font-weight: 600;
  }
  &__details-item{
    font-size: 15px;
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

@media(max-width: 576px){
  p{
    font-size: 13px !important;
  }
  .calendar{
    &__inputs{
      display: flex;
      align-items: center;
    }
    &__content{
      margin-right: 0 1em;
    }
    &__input{
      width: 75px;
      height: fit-content;
      padding: 5px;
      margin: 0;
      font-size: 14px;
    }
    &__icon{
      font-size: 22px;
      padding: 5px 5px 4px;
    }
    &__btn{
      font-size: 50px;
      width: fit-content;
      display: flex;
      margin-right: 5px;
    }
    &__close-btn{
      button{
        padding: 5px;
        font-size: 14px;
        margin-left: 5px;
      }
    }
    &__arrow{
      font-size: 16px;
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
      font-size: 10px;
      margin: 5px;
      img{
        width: 50px;
      }
    }
    &__days{
      padding: 0 10px 10px;
      margin: 15px 10%;
    }
  }
  .earning-selected{
    font-size: 1em;
  }
  .rbc{
    &__top-content{
      select{
        font-size: 1em;
        margin: 0 5% 20px 5%;
      }
      p{
        margin-bottom: 10px;
      }
    }
    &__center-content{
      grid-template-columns: 1fr;
      justify-items: baseline;
      margin-top: 15px;
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
    font-size: 10px;
    p{
      font-size: 10px;
    }
  }
  .coffeeshops-accord{
    margin-top: 0;
  }
  .coffeeshops-selection{
    &__input{
      padding: 10px;
      font-size: 14px;
    }
    &__item{
      margin: 2px 10px;
    }
    &__list{
      margin: 5px;
    }
  }
  .accordion-item{
    &__summary-title{
      p{
        font-size: 10px !important;
      }
    }
  }
}
@media(min-width: 1024px){
  .rbc{
    &__top-content{
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 20px;
    }
  }
}
</style>