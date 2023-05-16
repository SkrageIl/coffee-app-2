<template>
  <div class="product-item" v-click-outside="onClickOutside">
    <div class="product-item__left-content">
      <img src="@/assets/glyase.png" alt="Фото товара" :class="classes">
    </div>
    <div class="product-item__right-content">
      <div class="details">
        <span class="details-bold">Название: </span>
        <span v-if="!isChange" class="details__props">{{product_data.name}}</span>
        <input type="text" v-if="isChange" v-model="this.name" class="change">
      </div>
      <div class="details article">
        <span class="details-bold">Артикул: </span>
        <span v-if="!isChange" class="details__props">{{product_data.article}}</span>
        <input type="text" v-if="isChange" v-model="this.article" class="change">
      </div>
      <div class="details" v-if="this.width > 1024">
        <span class="details-bold">Тип: </span>
        <span v-if="!isChange" class="details__props">{{product_data.type}}</span>
        <select v-model="this.type" v-if="isChange" placeholder="Тип..." class="change select">
          <option>Кофе</option>
          <option>Чай</option>
          <option>Сладкое</option>
          <option>Сытное</option>
        </select>
      </div>
      <div class="details details__price" v-if="this.width > 1024">
        <span class="details-bold">Цена: </span>
        <span v-if="!isChange" class="details__props">{{product_data.price}} &#8381;</span>
        <input type="text" v-if="isChange" v-model="this.price" class="change">
      </div>
      <div class="details__bot" v-else>
        <div class="details">
          <span class="details-bold">Тип: </span>
          <span v-if="!isChange" class="details__props">{{product_data.type}}</span>
          <select v-model="this.type" v-if="isChange" placeholder="Тип..." class="change select">
            <option>Кофе</option>
            <option>Чай</option>
            <option>Сладкое</option>
            <option>Сытное</option>
          </select>
        </div>
        <div class="details details__price">
          <span class="details-bold">Цена: </span>
          <span v-if="!isChange" class="details__props">{{product_data.price}} &#8381;</span>
          <input type="number" v-if="isChange" v-model="this.price" class="change">
        </div>
      </div>
    </div>
    <div class="details coffeeshops-selection" v-click-outside="onClickOutsideShops">
      <span class="details-bold">Кофейни: </span>
      <div class="coffeeshops-selection__selected" v-if="!isChange">
        <div class="coffeeshops-selection__list-input">
          <span class="coffeeshops-selection__input-list-item" v-for="shop in this.shops" :key="shop.id">
            {{shop}}
          </span>
        </div>
      </div>
      <div class="coffeeshops-selection__selected__change" v-if="isChange" @click="openShopsList()">
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
    <div class="details details__title">
      <span class="details-bold">Описание: </span>
      <span v-if="!isChange" class="details__props">{{product_data.title}}</span>
      <textarea type="text" v-if="isChange" v-model="this.title" class="change__title"></textarea>
    </div>
    <div class="buttons">
      <button class="delete-btn" @click="this.isDialog = true">Удалить</button>
      <button class="change-btn" @click="changeItems">Изменить</button>
    </div>
    <vue-final-modal
      v-model="isDialog"
      @click-outside="closeModal"
      :drag="false"
      classes="modal-container"
      content-class="modal-content dialog-container">
        <div class="dialog">
          <button @click="closeModal" class="dialog__close-popup-btn">X</button>
          <p>Вы уверены, что хотите удалить <strong>{{product_data.name}}({{ product_data.article }})</strong> из списка?</p>
          <div class="dialog__buttons">
            <button class="agree" @click="deleteItem">Да</button>
            <button class="cancel" @click="closeModal">Отмена</button>
          </div>
        </div>
    </vue-final-modal>
  </div>
</template>

<script>
import vClickOutside from 'click-outside-vue3'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "ProductItem",
  directives: {
    clickOutside: vClickOutside.directive
    },
  mounted() {
    this.GET_SHOPS_FROM_DB()
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  data() {
    return {
      width: 0,
      classes: {
        tea: this.product_data.type == 'Чай',
        coffee: this.product_data.type == 'Кофе',
        sweet: this.product_data.type == 'Сладкое',
        meal: this.product_data.type == 'Сытное'
      },
      isChange: false,
      isShopsList: false,
      isDialog: false,
      name: this.product_data.name,
      article: this.product_data.article,
      type: this.product_data.type,
      price: this.product_data.price,
      title: this.product_data.title,
      shops: this.product_data.coffeeshops
    }
  },
  props: {
    product_data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters([
      'SHOPS'
    ]),
    checkSelectAll(){
      if (this.shops.length == this.SHOPS.length) {
        return true
      } else return false
    },
  },
  methods: {
    ...mapActions([
      'DELETE_FOOD_ITEM_FROM_DB',
      'DELETE_DRINK_ITEM_FROM_DB',
      'CHANGE_FOOD_ITEM_TO_DB',
      'CHANGE_DRINK_ITEM_TO_DB',
      'GET_SHOPS_FROM_DB'
    ]),
    closeModal(){
      this.isDialog = false
    },
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
    handleResize() {
      this.width = window.innerWidth
    },
    deleteItem(){
      if(["Кофе", "Чай"].includes(this.product_data.type)){
        this.DELETE_DRINK_ITEM_FROM_DB(this.product_data.id)
      } else if(["Сладкое", "Сытное"].includes(this.product_data.type)){
        this.DELETE_FOOD_ITEM_FROM_DB(this.product_data.id)
      }
      this.isDialog = false
    },
    changeItems(){
      if (this.isChange) {
        this.isChange = false
        this.isShopsList = false
        let productItem = {
          id: this.product_data.id,
          name: this.name,
          article: this.article,
          image: this.product_data.image,
          price: this.price,
          quantity: this.product_data.quantity,
          type: this.type,
          title: this.title,
          coffeeshops: this.shops
        }
        if (["Кофе", "Чай"].includes(this.type) && JSON.stringify(productItem) !== JSON.stringify(this.product_data))
        {
          this.CHANGE_DRINK_ITEM_TO_DB(productItem)
        } else if(["Сладкое", "Сытное"].includes(this.type) && JSON.stringify(productItem) !== JSON.stringify(this.product_data)){
          this.CHANGE_FOOD_ITEM_TO_DB(productItem)
        }
      } else this.isChange = true
    },
    onClickOutside () {
      this.isChange = false
      this.isShopsList = false
      this.name = this.product_data.name,
      this.article = this.product_data.article,
      this.type = this.product_data.type,
      this.price = this.product_data.price,
      this.title = this.product_data.title,
      this.shops = this.product_data.coffeeshops
    },
    onClickOutsideShops(){
      this.isShopsList = false
    }
},
}
</script>

<style lang="scss" scoped>
.coffee{
  background-color: #FFB21C !important;
  border-radius: 5px;
}
.tea{
  background-color: #69af60 !important;
  border-radius: 5px;
}
.sweet{
  background-color: #f6a9f9 !important;
  border-radius: 5px;
}
.meal{
  background-color: #f57878  !important;
  border-radius: 5px;
}
img{
  width: 100px;
}
.dialog{
  background-color: white;
  padding: 1% 6% 3%;
  border-radius: 10px;
  width: 50%;
  font-size: 20px;
  &__close-popup-btn{
    position: absolute;
    top: 5px;
    right: 20%;
    font-size: 15px;
    padding: 5px 7px;
    color: #ffffff;
    background-color: #cccccc;
    border: none;
    border-radius: 25px;
    cursor: pointer;
  }
  p{
    font-weight: 700;
    strong{
      background-color: #ffa34c;
      padding: 0 5px;
    }
  }
  &__buttons{
    display: flex;
    justify-content: center;
    margin-top: 30px;
    button{
      width: 100px;
      font-size: 20px;
      margin: 0 5px;
      border-radius: 5px;
      border: none;
      padding: 5px;
      font-weight: 800;
      color: white;
      cursor: pointer;
    }
    .cancel{
      background-color: #888888;
    }
    .agree{
      background-color: #fa1616;
    }
  }
}
.coffeeshops-selection{
  text-align: left;
  grid-column: span 2;
  &__selected{
    background-color: white;
    width: 90%;
    margin: 5px 0;
    border: 1px;
    font-size: 18px;
    padding: 5px;
    &__change{
      border-radius: 2px;
      border-color: #767676;
      border-width: 1px;
      border-style: inset;
      border-image: initial;
      height: fit-content;
    }
  }
  &__btn{
    color: #828482;
  }
  &__input-list-item{
    margin-bottom: 5px;
  }
  &__list-input{
    display: grid;
    grid-template-columns: 1fr;
    text-align: left;
  }
  &__list{
    text-align: left;
    width: fit-content;
    margin: 0 10% 0 0;
    position: absolute;
    margin-top: 60px;
    background-color: white;
    padding: 10px;
    border-radius: 0 0 10px 10px;
    -webkit-box-shadow: 0px 10px 10px 2px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 10px 10px 2px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 10px 10px 2px rgba(34, 60, 80, 0.2);
    input{
    }
  }
}
.product-item{
  display: grid;
  grid-template-columns: auto 1fr;
  margin: 20px;
  min-height: 300px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  &__left-content{
    display: grid;
    max-width: 100px;
    padding: 10px;
    justify-items: center;
    margin-top: 25px;
    grid-template-rows: auto auto 1fr;
  }
  &__right-content{
    text-align: left;
    margin: 35px 5px 0 0;
  }
}
.delete-btn{
  border: none;
  width: 50%;
  max-width: 100px;
  height: 100%;
  border-radius: 5px;
  font-size: 18px;
  background-color: #fa1616;
  color: #ffffff;
  cursor: pointer;
  margin-right: 15px;
  padding: 10px;
}
.change-btn{
  border: none;
  width: 100%;
  max-width: 200px;
  height: 100%;
  border-radius: 5px;
  font-size: 18px;
  background-color: #096aba;
  color: #ffffff;
  cursor: pointer;
  padding: 10px;
}
.details{
  font-size: 17px;
  padding: 0 5px;
  display: grid;
  grid-template-rows: auto 1fr;
  text-align: left;
  margin-left: 15px;
  &__props{
    padding: 5px;
    padding-left: 0;
  }
  &__title{
    grid-column: span 2;
  }
  &__price{
    margin-left: 0;
    margin-right: 8px;
  }
  &__bot{
    display: flex;
  }
}
.details-bold{
  font-weight: 700;
}
.change{
  width: 90%;
  font-size: 18px;
  padding: 3px;
  margin-top: 5px;
  &__title{
    height: 108px;
    resize: none;
    width: 95%;
  }
}
.buttons{
  display: flex;
  grid-column: span 2;
  align-items: baseline;
  justify-content: space-around;
  margin-bottom: 10px;
  padding: 0 10px;
  height: 40px;
}
.select{
  padding: 1.25px;
  width: 100px;
}

@media(min-width: 1024px){
  .article{
    margin-right: 9px;
  }
  .product-item{
    &__right-content{
      grid-template-columns: 1fr 1fr;
      display: grid;
      margin-top: 35px;
    }
  }
  .buttons{
    justify-content: flex-start;
  }
  .details{
    &__price{
      margin-left: 15px;
    }
  }
  .select{
    width: auto;
    margin-right: 5%;
  }
}
@media(max-width: 576px){
  .details{
    &__price{
      margin-left: 15px;
    }
    &__props{
      padding: 5px;
      padding-left: 0;
      padding-right: 0;
      display: flex;
    }
  }
}
@media(min-width: 576px) and (max-width: 760px){
  .details{
    &__props{
      padding: 5px;
      padding-left: 0;
      padding-right: 0;
      display: flex;
    }
  }
}
</style>