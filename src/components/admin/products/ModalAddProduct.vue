<template>
  <div class="modal-product-item" :class="classes">
    <div class="modal-product-item__left-content">
      <img src="@/assets/glyase.png" alt="Фото товара" >
    </div>
    <div class="modal-product-item__right-content">
      <div class="modal-details">
        <span class="modal-details__title">Название: </span>
        <input required type="text" v-model="this.name" placeholder="Название..." class="change">
      </div>
      <div class="modal-details">
        <span class="modal-details__title">Артикул: </span>
        <input required type="text" v-model="this.article" placeholder="Артикул(A1)..." class="change">
      </div>
      <div class="modal-details">
        <span class="modal-details__title">Тип: </span>
        <select v-model="this.type" placeholder="Тип..." class="change select">
          <option>Кофе</option>
          <option>Чай</option>
          <option>Сладкое</option>
          <option>Сытное</option>
        </select>
      </div>
      <div class="modal-details modal-details__price">
        <span class="modal-details__title">Цена: </span>
        <input required type="number" v-model="this.price" class="change" placeholder="Цена...">
      </div>
    </div>
    <div class="details coffeeshops-selection">
      <span class="modal-details__title">Кофейни: </span>
      <div class="coffeeshops-selection__selected" @click="openShopsList()">
        <span class="coffeeshops-selection__btn" v-if="this.shops.length == 0">Выберите кофейню</span>
        <div class="coffeeshops-selection__list-input">
          <span class="coffeeshops-selection__input-list-item" v-for="shop in this.shops" :key="shop.id">
            {{shop}}
          </span>
        </div>
      </div>
      <div class="coffeeshops-selection__list" v-if="this.isShopsList">
        <input class="btn-select-all" type="checkbox" @click="selectAll()" v-model="checkSelectAll" id="selectAll">
        <label for="selectAll">Все</label>
        <div class="coffeeshops-selection__item" v-for="shop in SHOPS" :key="shop.id">
          <input v-model="this.shops" 
          type="checkbox" 
          :name="shop.address" :id="shop.address" :value="shop.address">
          <label :for="shop.address">{{shop.address}}</label>
        </div>
      </div>
    </div>
    <div class="modal-details modal-details__text">
      <span class="modal-details__title">Описание: </span>
      <textarea required type="text" v-model="this.title" placeholder="Описание товара..." class="change__title text-title"></textarea>
    </div>
    <button class="add-btn" @click="addItemToDB" :disabled="!validCheck">Добавить</button>
  </div>  
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "ModalAddItem",
  mounted() {
    this.GET_SHOPS_FROM_DB()
  },
  data() {
    return {
      classes: {
        tea: false,
        coffee: false,
        sweet: false,
        meal: false
      },
      name: "",
      article: "",
      image: "",
      price: 0,
      quantity: 0,
      type: "",
      title: "",
      isShopsList: false,
      shops: []
    }
  },
  props: {
    typeProp: String
  },
  computed:{
    ...mapGetters([
      'SHOPS'
    ]),
    validCheck(){
      if (this.name != "" && this.article != "" && this.price != 0 && this.type != "" && this.title != "" ) {
        return true
      } else {
        return false
      }
    },
    checkSelectAll(){
      if (this.shops.length == this.SHOPS.length) {
        return true
      } else return false
    },
  },
  watch:{
    typeProp(){
      this.type = this.typeProp
    },
    type(){
      if (this.type == "Чай") {
        this.classes.tea = true
        this.classes.coffee = false
        this.classes.sweet = false
        this.classes.meal = false
      } else if (this.type == "Кофе") {
        this.classes.tea = false
        this.classes.coffee = true
        this.classes.sweet = false
        this.classes.meal = false
      } else if (this.type == "Сладкое") {
        this.classes.tea = false
        this.classes.coffee = false
        this.classes.sweet = true
        this.classes.meal = false
      } else if (this.type == "Сытное") {
        this.classes.tea = false
        this.classes.coffee = false
        this.classes.sweet = false
        this.classes.meal = true
      } else {
        this.classes.tea = false
        this.classes.coffee = false
        this.classes.sweet = false
        this.classes.meal = false
      }
    }
  },
  methods: {
    ...mapActions([
      'ADD_FOOD_ITEM_TO_DB',
      'ADD_DRINK_ITEM_TO_DB',
      'GET_SHOPS_FROM_DB'
    ]),
    selectAll(){
      if(this.shops.length == this.SHOPS.length){
        this.shops = []
      } else this.shops = this.SHOPS.map(shop => shop.address)
    },
    openShopsList(){
      if (this.isShopsList) {
        this.isShopsList = false
      } else this.isShopsList = true
    },
    addItemToDB(){
      let productItem = {
          name: this.name,
          article: this.article,
          image: "img" + this.article + ".jpg",
          price: this.price,
          quantity: this.quantity,
          type: this.type,
          title: this.title,
          coffeeshops: this.shops
        }
        if (["Кофе", "Чай"].includes(this.type)) {
          this.ADD_DRINK_ITEM_TO_DB(productItem)
        } else if(["Сладкое", "Сытное"].includes(this.type)){
          this.ADD_FOOD_ITEM_TO_DB(productItem)
        }
        this.name = "",
        this.article = "",
        this.price = 0,
        this.title = "",
        this.shops = []
    },
  },
}
</script>

<style lang="scss" scoped>
img{
  width: 100px;
}
.coffeeshops-selection{
  text-align: left;
  &__selected{
    background-color: white;
    width: 90%;
    max-height: 65px;
    overflow-y: scroll;
    margin: 10px 0;
    border: 1px;
    font-size: 18px;
    padding: 5px;
    border-radius: 2px;
    border-color: #767676;
    border-width: 1px;
    border-style: inset;
    border-image: initial;
  }
  &__btn{
    color: #828482;
  }
  &__input-list-item{
    margin-bottom: 10px;
  }
  &__list-input{
    display: grid;
    grid-template-columns: 1fr;
    text-align: left;
  }
  &__list{
    text-align: left;
    width: -webkit-fill-available;
    margin: 0 10% 0 0;
    position: absolute;
    bottom: 66px;
    background-color: white;
    padding: 10px;
    border-radius: 0 0 10px 10px;
    border-style: solid;
    border-color: #989898;
    border-width: 1px;
    input{
    }
  }
}
.modal-product-item{
  background-color: white;
  position: absolute;
  top: 20%;
  left: 40%;
  padding: 15px;
  border-radius: 10px;
  min-width: 250px;
  &__right-content{
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: initial;
    column-gap: 20px;
    row-gap: 10px;
    padding: 20px 20px 20px 0;
  }
}
.modal-details{
  display: grid;
  text-align: left;
  &__title{
    font-size: 20px;
    font-weight: 600;
    padding: 5px 10px 5px 0;
  }
  &__text{
    padding-right: 3px !important;
  }
}
.change{
  width: 125px;
  font-size: 18px;
  padding: 5px;
}
.add-btn{
  margin-top: 10px;
  width: 100%;
  border: none;
  padding: 10px;
  background-color: green;
  color: white;
  font-size: 15px;
  cursor: pointer;
}
.add-btn:disabled{
  background-color: #3a393966 !important;
  cursor: none;
}
.select{
  padding: 1.25px;
  width: 100%;
}
.text-title{
  height: 75px;
  font-size: 18px;
}
.coffee{
  background-color: #FFB21C !important;
}
.tea{
  background-color: #69af60 !important;
}
.sweet{
  background-color: #f6a9f9 !important;
}
.meal{
  background-color: #f57878  !important;
}

@media(max-width: 1024px){
  .modal-product-item{
    left: 30%
  }
}
</style>