<template>
  <div class="header">
    <div class="coffee-header">
      <img src="@/assets/logo.png" alt="logo" class="header__logo">
      <button @click="this.logout" v-if:="isLoggedIn" class="header__exit">
        <span class="material-icons logout">
          logout
        </span>
      </button>
    </div>
  </div>
</template>
  
<script>
import {mapActions, mapGetters} from 'vuex'
  
export default {
  name: "CoffeeHeader",
  components:{
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'CART_TOTAL_QUANTITY',
      'isLoggedIn'
    ])
  },
  methods: {
    ...mapActions([
      'logout',
      'OPEN_MODAL'
    ]),
    openModal(){
      this.OPEN_MODAL()
    },
    goBack(){
      if (this.$route.path.includes('profile')) {
        this.$router.push('/')
      }
      else this.$router.go(-1)
    }
  }
}

</script>
  
<style lang="scss" scoped>
.menu{
  position: fixed;
  left: 50px;
  top: 20px;
  &__items{
    list-style: none;
    color: rgb(255, 255, 255);
    font-size: 45px;
    font-weight: 800;
  }
  &__item{
    display: grid;
    background-color: white;
    border-radius: 22px;
    padding: 20px;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  }
  &__btn{
    text-decoration: none;
    color: black;
    font-size: 25px;
    font-weight: 800;
    padding: 10px;
    margin: 10px;
    border-radius: 22px;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  }
}
.logout{
  color: white;
  font-size: 45px;
  font-weight: 800;
  position: fixed;
    right: 20px;
    top: 20px;
}
.back-popup-btn{
  position: fixed;
  top: 0.7em;
  left: 1em;
  font-size: 1.7em;
  color: #ffffff;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.header{
  position: fixed;
  width: 100%;
  height: 5em;
  margin-top: 0;
  background-color: #3a3939;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  padding-top: 0;
  top: 0;
  z-index: 2;
  &__logo{
    width: auto;
    height: 3.2em;
    margin-top: 1em;
    margin-right: 20px;
  }
  &__logo-title{
    width: 6em;
    height: auto;
  }
  &__login{
    position: fixed;
    right: 4em;
    top: 1.5em;
  }
  &__exit{
    position: fixed;
    right: 2em;
    top: 2em;
    border: 0;
    background-color: transparent;
    color: white;
  }
}
.coffee-header{
  display: flex;
  width: 100%;
  justify-content: center;
}

@media(min-width: 576px){
  .header{
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>