<template>
  <div class="earn-page">
    <div class="earn-page__header">
      <div class="header__details">
        <span class="header__block">
          <p class="header__title">Заработано:</p>
          <p class="header__title">{{EarningsAll.sum}}</p>
        </span>
        <span class="header__block">
          <p class="header__title">Выполнено заказов: </p>
          <p class="header__title">{{EarningsAll.quantity}}</p>
        </span>
      </div>
    </div>
    <div class="calendar">
      <v-date-picker v-model="range" is-range>
        <template v-slot="{ inputValue, togglePopover }">
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
                :value="inputValue.start"
                class="calendar__input"
                @click="togglePopover()"
              />
              <span class="material-icons calendar__arrow">arrow_forward</span>
              <input
                :value="inputValue.end"
                class="calendar__input"
                @click="togglePopover()"
              />
            </div>
          </div>
        </template>
      </v-date-picker>
    </div>
    <div class="bottom-content">
      <div class="earning-selected" v-if="EarningsByRange.quantity != 0">
        <span>
          Заработано: {{EarningsByRange.sum}}&#8381;
        </span>
        <span>
          Выполнено заказов: {{EarningsByRange.quantity}}
        </span>
      </div>
      <AccordionList>
        <AccordionItem v-for="earnByDay in DaysSelectedDetails" :key="earnByDay.id" class="accord-order__days" @click="this.date = earnByDay.date">
          <template #summary>
            <span class="accord-order__days-title">
              {{ earnByDay.date }}
            </span>
            <span class="accord-order__days-earning">
              + {{ earnByDay.sum * 0.05 +1500 }}&#8381;
            </span>
          </template>
          <AccordionList open-multiple-items>
            <AccordionItem v-for="baristaOrder in ordersByDate" :key="baristaOrder.id" class="accord-order__item">
              <template #summary>
                <span class="accord-order__title">
                  {{ baristaOrder.client.name }}
                  ({{ baristaOrder.client.tel }})
                  {{ this.formatTime(baristaOrder.time) }}
                  <span class="accord-order__days-earning">
                    + {{ baristaOrder.total * 0.05 }}&#8381;
                  </span>
                </span>
              </template>
              <OrderItem :order_data="baristaOrder" class="accord-order__details-item"/>
            </AccordionItem>
          </AccordionList>
        </AccordionItem>
      </AccordionList>
    </div>
  </div>
</template>

<script>
import { AccordionList, AccordionItem } from 'vue3-rich-accordion'
import { mapActions, mapGetters } from 'vuex'
import OrderItem from './OrderItem.vue'
import moment from 'moment'

export default {
  name: "EarnPage",
  components:{
    AccordionList,
    AccordionItem,
    OrderItem
  },
  mounted(){
    this.GET_BARISTA_COMPLETED_ORDERS_FROM_DB()
  },
  data() {
    return {
      range: {
        start: new Date(),
        end: new Date()
      },
      date: '',
    }
  },
  computed: {
    ...mapGetters([
    'BARISTA_COMPLETED_ORDERS'
  ]),
    completedDateOrders(){
      let selectedStartTimeFormat = moment(this.range.start).format('DD-MM-YYYY')
      let selectedEndTimeFormat = moment(this.range.end).format('DD-MM-YYYY')
      selectedStartTimeFormat = moment(selectedStartTimeFormat, 'DD-MM-YYYY')
      selectedEndTimeFormat = moment(selectedEndTimeFormat, 'DD-MM-YYYY')

      return this.BARISTA_COMPLETED_ORDERS.filter(function(order){
            let timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY')
            timeOrderFormat = moment(timeOrderFormat, 'DD-MM-YYYY')
            return (timeOrderFormat.isBetween(selectedStartTimeFormat, selectedEndTimeFormat, 'day', '[]'))
          }).sort((a,b) => this.formatTime(a.time) < this.formatTime(b.time) ? 1 : -1)
    },
    DaysSelectedDetails(){
      let selectedStartTimeFormat = moment(this.range.start).format('DD-MM-YYYY')
      let selectedEndTimeFormat = moment(this.range.end).format('DD-MM-YYYY')
      selectedStartTimeFormat = moment(selectedStartTimeFormat, 'DD-MM-YYYY')
      selectedEndTimeFormat = moment(selectedEndTimeFormat, 'DD-MM-YYYY')
      
      let DaysSelectedDetails = this.BARISTA_COMPLETED_ORDERS.reduce((arr, order) => {
        const timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').startOf('day')
        if (timeOrderFormat.isBetween(selectedStartTimeFormat, selectedEndTimeFormat, 'day', '[]')) {
          const date = timeOrderFormat.format('DD-MM-YYYY')
          const foundItem = arr.find(item => item.date === date)
          if(foundItem) {
            foundItem.sum += order.total
          } else {
            arr.push({ date, sum: order.total })
          }
        }
        return arr
      }, [])
      return DaysSelectedDetails.sort((a,b) => a.date < b.date ? 1 : -1)
    },
    ordersByDate(){
      let dateFormat = moment(this.date, 'DD-MM-YYYY').format('DD-MM-YYYY')

      return this.BARISTA_COMPLETED_ORDERS.filter(function(order) {
        let timeOrderFormat = moment(order.time, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY')
        return timeOrderFormat == dateFormat
      }).sort((a,b) => a.time < b.time ? 1 : -1)
    },
    EarningsByRange(){
      var initialValue = 0;
      let earn = {}
      earn.sum =  this.DaysSelectedDetails.reduce(
        (sum, item) => sum + item.sum*0.05 + 1500,
        initialValue
      )
      earn.quantity = this.completedDateOrders.length
      return earn
    },
    EarningsAll(){
      let rate = 1500
      let percent = 0.05
      var initialValue = 0
      let earn = {}
      
      earn.sum =  this.BARISTA_COMPLETED_ORDERS.reduce(
        (sum, item) => sum += item.total * percent,
        initialValue
      ) + this.workDays().length * rate
      earn.quantity = this.BARISTA_COMPLETED_ORDERS.length
      return earn
    },
  },
  props: {},
  methods: {
    ...mapActions([
      'GET_BARISTA_COMPLETED_ORDERS_FROM_DB'
    ]),
    formatTime(time){
      return moment(time, 'DD-MM-YYYY HH:mm').format('HH:mm')
    },
    formatStringToDate(date) {
      return moment(date, 'DD-MM-YYYY')
    },
    formatDateTimeToString(date) {
      return moment(date, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY');
    },
    workDays(){
      return this.BARISTA_COMPLETED_ORDERS.reduce((days, order) => {
        let orderTime = this.formatDateTimeToString(order.time)
        if (!days.includes(orderTime)) {
          days.push(orderTime)
        }
        return days
      }, [])
    }
  }
}

</script>

<style lang="scss" scoped>
.header{
  &__details{
    display: flex;
    justify-content: space-around;
    font-weight: 700;
    font-size: 1.5em;
    padding: 20px;
  }
  &__block{
    width: 30%;
    display: grid;
    align-content: center;
    background-color: rgb(255, 255, 255);
    border-radius: 22px;
    padding: 30px;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  }
  &__title{
    margin: 10px 0 0;
  }
}
.calendar{
  display: flex;
  justify-content: center;
  justify-items: center;
  margin: 20px;
  margin-bottom: 40px;
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
    padding: 10px;
    margin: 10px;
    font-size: 25px;
    border-color: #3a3939;
    border-radius: 10px;
    border-style: double;
    text-align: center;
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
    font-size: 30px;
  }
  &__days-earning{
    font-weight: 700;
    font-size: 25px;
    color: #228B22;
    padding: 10px;
    width: 5em;
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
</style>