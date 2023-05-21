<template>
  <sidebar-menu :menu="menu"  :collapsed="true" v-if="this.$route.path != '/admin'"/>
  <CoffeeHeader/>
<div class="admin-page" v-if="this.$route.path == '/admin'">
  <div class="admin-menu">
    <div class="handling-btn">
      <router-link :to="{name:'products'}" class="admin-menu__btn">Каталог</router-link>
      <router-link :to="{name:'workers'}" class="admin-menu__btn">Сотрудники</router-link>
      <router-link :to="{name:'coffeeshops'}" class="admin-menu__btn">Кофеточки</router-link>
    </div>
    <div class="reports-btn">
      <router-link :to="{name:'ordersStats'}" class="admin-menu__btn">Заказы</router-link>
      <router-link :to="{name:'byCoffeeshops'}" class="admin-menu__btn">Отчёты</router-link>
    </div>
    <button @click="this.logout" class="admin-menu__btn exit">Выйти</button>
  </div>
</div>
<router-view class="wrapper-admin"></router-view>
</template>

<script>
import CoffeeHeader from '../CoffeeHeader.vue'

export default {
  name: "AdminPage",
  components:{
    CoffeeHeader
  },
  created() {},
  data() {
    return {
      menu: 
    [
      {
        header: 'Меню',
        hiddenOnCollapse: true
      },
      {
        href: '/admin/products',
        title: 'Каталог',
        icon: {
          element: 'span',
          class: 'material-icons',
          text: 'coffee'
        }
      },
      {
        href: '/admin/workers',
        title: 'Сотрудники',
        icon: {
          element: 'span',
          class: 'material-icons',
          text: 'groups'
        }
      },
      {
        href: '/admin/coffeeshops',
        title: 'Кофеточки',
        icon: {
          element: 'span',
          class: 'material-icons',
          text: 'store'
        }
      },
      {
        href: '/admin/orders-stats',
        title: 'Заказы',
        icon: {
          element: 'span',
          class: 'material-icons',
          text: 'receipt_long'
        }
      },
      {
        title: 'Отчёты',
        icon: {
          element: 'span',
          class: 'material-icons',
          text: 'summarize'
        },
        child: [
              {
                href: '/admin/reports/byCoffeeshops',
                title: 'По кофеточкам',
              },
              {
                href: '/admin/reports/byWorker',
                title: 'По сотрудникам',
              },
            ],
      },
    ]
    };
  },
  props: {},
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/')
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.admin-page{
  margin-top: 10rem;
  display: flex;
  justify-content: center;
}
.admin-menu{
  width: fit-content;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  border-radius: 15px;
  padding: 10px;
  -webkit-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
  &__btn{
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    color: white;
    background-color: black;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    margin: 0.5rem;
  }
}
.wrapper-admin{
  margin-top: 6em;
  margin-left: 55px;
}
@media(min-width: 900px){
}
@media(max-width: 576px){
  .admin-menu{
    &__btn{
      font-size: 0.8em;
      padding: 0.5rem 1rem;
    }
  }
}
</style>