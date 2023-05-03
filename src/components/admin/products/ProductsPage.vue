<template>
  <div class="products-page">
    <ProductsNavBar class="nav-bar"/>
    <div id="coffee" class="products">
      <div class="products__top-content">
        <h3 class="products__title">Кофе</h3>
        <button class="products__add" @click="openAddModal('Кофе')">Добавить &#43;</button>
      </div>
      <ProductItem
        v-for="drink in coffeeCatalog"
        :key="drink.article"
        :product_data="drink"
      />
    </div>
    <div id="tea" class="products">
      <div class="products__top-content">
        <h3 class="products__title">Чай</h3>
        <button class="products__add" @click="openAddModal('Чай')">Добавить &#43;</button>
      </div>
      <ProductItem
        v-for="drink in teaCatalog"
        :key="drink.article"
        :product_data="drink"
      />
    </div>
    <div id="sweet" class="products">
      <div class="products__top-content">
        <h3 class="products__title">Сладости</h3>
        <button class="products__add" @click="openAddModal('Сладкое')">Добавить &#43;</button>
      </div>
      <ProductItem
        v-for="drink in sweetCatalog"
        :key="drink.article"
        :product_data="drink"
      />
    </div>
    <div id="meal" class="products">
      <div class="products__top-content">
        <h3 class="products__title">Закуски</h3>
        <button class="products__add" @click="openAddModal('Сытное')">Добавить &#43;</button>
      </div>
      <ProductItem
        v-for="drink in mealCatalog"
        :key="drink.article"
        :product_data="drink"
      />
    </div>
    <vue-final-modal
      v-model="isItemModal"
      @click-outside="closeModal"
      :drag="false"
      classes="modal-container"
      content-class="modal-content modal-item">
        <ModalAddProduct :typeProp="this.type"/>
    </vue-final-modal>
  </div>
</template>

<script>
import {ref} from 'vue'
import { mapActions, mapGetters } from 'vuex'
import ProductItem from './ProductItem.vue'
import ModalAddProduct from './ModalAddProduct.vue'
import ProductsNavBar from './ProductsNavBar.vue'

export default {
  name: "ProductsPage",
  components:{
    ProductItem,
    ModalAddProduct,
    ProductsNavBar
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
      'DRINKS'
    ]),
    teaCatalog(){
      return this.DRINKS.filter(function(drink){
        return drink.type == "Чай"
      })
    },
    coffeeCatalog(){
      return this.DRINKS.filter(function(drink){
        return drink.type == "Кофе"
      })
    },
    mealCatalog(){
      return this.FOODS.filter(function(food){
        return food.type == "Сытное"
      })
    },
    sweetCatalog(){
      return this.FOODS.filter(function(food){
        return food.type == "Сладкое"
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
  padding: 1.25em 0;
  position: fixed;
  top: 4em;
  width: 100%;
}
</style>