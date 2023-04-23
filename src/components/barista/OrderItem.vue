<template>
  <div class="order-comp">
    <ul class="orders">
      <li v-for="item in order_data.item" :key="item.id" class="orders-item">
        <img :src="item.img" alt="">
        <span class="order-item__names">
          <span class="order-item__name">{{item.name}}</span>
          <span class="order-item__size" v-if="item.size">({{item.size}}л)</span>
        </span>
        <span class="order-item__quantity">кол-во:  {{item.quantity}}</span>
        <span class="order-item__price">{{item.price}} &#8381;</span>
      </li>
    </ul>
    <div class="orders__bottom">
      <div class="orders__total">
        <div class="orders__total-left">
          <span class="orders__total-title">Итого:</span>
          <span>{{order_data.total}}&#8381;</span>
        </div>
        <button v-if="order_data.status !== 'Завершен'"
        @click="changeStatusOrder(order_data.id, order_data.status)"
          class="orders__total-btn" 
          :class="{cook: order_data.status == 'Готовим', ready: order_data.status == 'Готов', done: order_data.status == 'Завершен'}">
            {{nextStageStatusOrder(order_data.status)}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "OrderItem",
  created() {},
  data() {
    return {
      classes: {
        cook: this.order_data.status == 'Готовим',
        ready: this.order_data.status == 'Готов',
        done: this.order_data.status == 'Завершен'
      } 
    };
  },
  props: {
    order_data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    ...mapActions([
    'CHANGE_BARISTA_ORDER_STATUS'
  ]),
  nextStageStatusOrder(status){
    if (status == "Готовим") {
      return "Готов"
    }
    if (status == "Готов") {
      return "Завершен"
    }
  },
  changeStatusOrder(id,status){
    var nextStatus = this.nextStageStatusOrder(status)
    let order = {
      id: id,
      status: nextStatus
    }
    this.CHANGE_BARISTA_ORDER_STATUS(order)
  },
  },
};
</script>

<style lang="scss" scoped>
ul{
  list-style: none;
  padding-inline-start: 0;
}
li{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  font-size: 20px;
  justify-content: center;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  margin: 2em 0;
}
span{
  text-align: end;
  margin-bottom: 10px;
}
.order-item{
  &__names{
    display: grid;
  }
  &__name{
    margin: 0;
  }
}
.orders{
  &__total{
    font-weight: 900;
    font-size: 1.5em;
    display: flex;
    justify-content: space-around;
  }
  &__total-title{
    margin-right: 1em;
  }
  &__total-left{
    display: flex;
    align-items: center;
  }
  &__total-btn{
    margin-left: 1em;
    color: white;
    padding: 1em;
    font-size: 0.8em;
    width: 200px;
    font-weight: 800;
    border-radius: 22px;
    border: 0;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
  }
  &__total-btn:active{
    -webkit-box-shadow: 0px 5px 10px 12px rgba(34, 60, 80, 0.2) inset;
    -moz-box-shadow: 0px 5px 10px 12px rgba(34, 60, 80, 0.2) inset;
    box-shadow: 0px 5px 10px 12px rgba(34, 60, 80, 0.2) inset;
  }
}
.cook{
  background-color: #800000 !important;
}
.ready{
  background-color: green !important;
}

@media(max-width: 576px){
  li{
    font-size: 0.7em;
  }
  .orders{
    &__total{
      font-size: 1em;
    }
    &__total-title{
      margin-right: 0.5em;
    }
    &__total-btn{
      padding: 0.5em;
      font-size: 0.8em;
      width: 100px;
    }
  }
}
</style>