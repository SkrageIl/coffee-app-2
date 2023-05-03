<template>
  <sidebar-menu :menu="menu"  :collapsed="true" v-if="this.$route.path != '/admin'"/>
  <CoffeeHeader/>
<div class="admin-page" v-if="this.$route.path == '/admin'">
  <div class="admin-menu">
    <router-link :to="{name:'products'}" class="admin-menu__btn">Каталог</router-link>
    <router-link :to="{name:'workers'}" class="admin-menu__btn">Сотрудники</router-link>
    <router-link :to="{name:'coffeeshops'}" class="admin-menu__btn">Кофеточки</router-link>
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
      }
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
  display: grid;
  margin-top: 50%;
  justify-content: center;
}
.admin-menu{
  display: grid;
  margin-top: 30px;
  padding: 30px;
  max-width: 300px;
  min-width: 250px;
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
  padding: 5px;
  margin-bottom: 0;
  width: 100px;
  justify-self: center;
}
.wrapper-admin{
  margin-top: 6em;
  margin-left: 55px;
}
@media(min-width: 900px){
  .admin-page{
    margin-top: 200px;
  }
}
</style>