<template>
  <div class="products-page">
    <AssortmentNav class="nav-bar"/>
    <div id="coffee" class="products">
      <div class="products__top-content">
        <h3 class="products__title">Кофе</h3>
      </div>
      <AssortmentItem
        v-for="drink in coffeeCatalog"
        :key="drink.article"
        :product_data="drink"
      />
    </div>
    <div id="tea" class="products">
      <div class="products__top-content">
        <h3 class="products__title">Чай</h3>
      </div>
      <AssortmentItem
        v-for="drink in teaCatalog"
        :key="drink.article"
        :product_data="drink"
      />
    </div>
    <div id="sweet" class="products">
      <div class="products__top-content">
        <h3 class="products__title">Сладости</h3>
      </div>
      <AssortmentItem
        v-for="drink in sweetCatalog"
        :key="drink.article"
        :product_data="drink"
      />
    </div>
    <div id="meal" class="products">
      <div class="products__top-content">
        <h3 class="products__title">Закуски</h3>
      </div>
      <AssortmentItem
        v-for="drink in mealCatalog"
        :key="drink.article"
        :product_data="drink"
      />
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import { mapActions, mapGetters } from 'vuex'
import AssortmentItem from './AssortmentItem.vue'
import AssortmentNav from './AssortmentNav.vue'

export default {
  name: "ProductsCoffeeshopsPage",
  components:{
    AssortmentItem,
    AssortmentNav
  },
  mounted() {
    this.GET_DRINKS_FROM_DB()
    this.GET_FOODS_FROM_DB()
  },
  created() {},
  data() {
    return {
      isItemModal: ref(false),
      type: ''
    }
  },
  props: {},
  computed: {
    ...mapGetters([
      'FOODS',
      'DRINKS',
      'USER'
    ]),
    teaCatalog(){
      var depart = this.USER.depart
      return this.DRINKS.filter(function(drink){
        return drink.type == "Чай" && drink.coffeeshops.includes(depart)
      })
    },
    coffeeCatalog(){
      var depart = this.USER.depart
      return this.DRINKS.filter(function(drink){
        return drink.type == "Кофе" && drink.coffeeshops.includes(depart)
      })
    },
    mealCatalog(){
      var depart = this.USER.depart
      return this.FOODS.filter(function(food){
        return food.type == "Сытное" && food.coffeeshops.includes(depart)
      })
    },
    sweetCatalog(){
      var depart = this.USER.depart
      return this.FOODS.filter(function(food){
        return food.type == "Сладкое" && food.coffeeshops.includes(depart)
      })
    }
  },
  methods: {
    ...mapActions([
      'GET_DRINKS_FROM_DB',
      'GET_FOODS_FROM_DB'
    ]),
    closeModal(){
      this.isItemModal = false
    },
    openAddModal(type){
      this.type = type
      this.isItemModal = true
    }
  }
}
</script>

<style lang="scss" scoped>
#coffee{
  margin-top: 150px;
}
.products{
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 50px;
  &__top-content{
    grid-column: span 2;
    margin-left: 25px;
    margin-bottom: 0;
    display: flex;
    align-items: center;
  }
  &__add{
    background-color: green;
    color: white;
    font-size: 20px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-left: 20px;
  }
  &__title{
    grid-column: span 2;
    font-size: 30px;
    font-weight: 700;
    text-align: left;
  }
}
.nav-bar{
  overflow-x: scroll;
  overflow: hidden;
  padding: 0.5rem 0;
  position: fixed;
  top: 4em;
  width: 100%;
}
@media (min-width: 1024px) {
  .products{
    grid-template-columns: 1fr 1fr 1fr;
    &__top-content{
      grid-column: span 3;
    }
  }
}
@media (max-width: 960px) {
  .products{
    &__title{
      font-size: 24px;
      margin: 5px;
    }
  }
  .delete-btn{
    font-size: 16px;
  }
}
@media (max-width: 576px) {
  .products{
    grid-template-columns: 1fr;
    &__title{
      margin: 10px 0 0;
      font-size: 20px;
    }
    &__top-content{
      grid-column: span 1;
    }
  }
}
</style>