<template>
  <sidebar-menu :menu="menu" :collapsed="true" v-if="this.$route.path != '/barista'"/>
  <CoffeeHeader/>
<div class="barista-page" v-if="this.$route.path == '/barista'">
  <div class="barista-menu">
    <router-link :to="{name:'orders'}" class="barista-menu__btn">Заказы</router-link>
    <router-link :to="{name:'productsInCoffeeshops'}" class="barista-menu__btn">Ассортимент</router-link>
    <router-link :to="{name:'earning'}" class="barista-menu__btn">Заработок</router-link>
    <button @click="this.logout" class="barista-menu__btn exit">Выйти</button>
  </div>
</div>
<router-view class="wrapper-barista"></router-view>
</template>

<script>
import CoffeeHeader from '../CoffeeHeader.vue'


export default {
name: "BaristaPage",
components:{
    CoffeeHeader
  },
mounted() {
},
beforeUnmount () {
},
data() {
  return {
    menu: 
    [
      {
        header: 'Меню',
        hiddenOnCollapse: true
      },
      {
        href: '/barista/orders',
        title: 'Заказы',
        icon: {
          element: 'span',
          class: 'material-icons',
          text: 'assignment'
        }
      },
      {
        href: '/barista/products-in-coffeeshops',
        title: 'Ассортимент',
        icon: {
          element: 'span',
          class: 'material-icons',
          text: 'storefront'
        }
      },
      {
        href: '/barista/earning',
        title: 'Заработок',
        icon: {
          element: 'span',
          class: 'material-icons',
          text: 'payments'
        }
      }
    ]
  }
},
computed: {
},
methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.barista-page{
  display: grid;
  margin-top: 175px;
  justify-content: center;
}
.barista-menu{
  display: grid;
  margin-top: 30px;
  padding: 30px;
  min-width: 325px;
  border-radius: 22px;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  &__btn{
    font-size: 20px;
    text-decoration: none;
    background-image: linear-gradient(to right, #232526 0%, #414345  51%, #232526  100%);
    cursor: pointer;
    border-radius: 22px;
    border: 0;
    margin: 15px;
    padding: 20px;
    font-weight: 800;
    color: #fbfbfb;
    -webkit-box-shadow: 10px 10px 10px -7px rgba(255, 144, 0, 0.2);
    -moz-box-shadow: 10px 10px 10px -7px rgba(255, 144, 0, 0.2);
    box-shadow: 10px 10px 10px -7px rgba(255, 144, 0, 0.2);
  }
}
.exit{
  font-size: 15px;
  padding: 10px;
  margin-bottom: 0;
  width: 125px;
  justify-self: center;
}
.wrapper-barista{
  margin-top: 6em;
  margin-left: 55px;
}
@media(min-width: 900px){
  .admin-page{
    margin-top: 200px;
  }
}
@media(max-width: 576px){
  .barista-page{
    margin-top: 25%;
  }
  .barista-menu{
    justify-content: center;
    min-width: fit-content;
    &__btn{
      font-size: 15px;
      margin: 10px;
      width: auto;
      padding: 10px;
    }
  }
  .exit{
    padding: 5px 10px;
  }
}
</style>