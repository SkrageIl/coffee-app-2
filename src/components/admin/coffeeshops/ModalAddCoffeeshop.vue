<template>
  <div class=" modal-shop-item">
    <div class="shop-top-nav">
      <button @click="this.isContacts = true" :class="{active: isContacts}">Контакты</button>
      <button @click="this.isContacts = false" :class="{active: !isContacts}">Товары</button>
    </div>
    <div class="contacts-block" v-show="isContacts">
      <div class="modal-shop-item__top-content">
        <img src="@/assets/coffeeshop1.jpg" alt="Фото товара">
        <div class="modal-shop-item__right">
          <div class="modal-details">
            <span class="modal-details__bold">Адрес: </span>
            <input type="text" v-model="this.address" placeholder="ул. 'Адрес', 'дом'" @blur="v$.address.$touch()" class="change">
          </div>
          <div class="modal-details">
            <span class="modal-details__bold">Время работы: </span>
            <input type="tel" v-model="this.time" v-mask="'##:## - ##:##'" placeholder="09:00 - 21:00" @blur="v$.time.$touch()" class="change">
          </div>
        </div>
      </div>
      <div class="modal-shop-item__bot-content">
        <div class="modal-details">
          <span class="modal-details__bold">Телефон: </span>
          <input type="tel" v-model="this.phone" v-mask="'+7(###)###-##-##'" placeholder="+7(999)-999-99-99" @blur="v$.phone.$touch()" class="change">
        </div>
      </div>
    <button class="add-btn" :disabled="v$.$invalid" @click="addItemToDB">Добавить</button>
    </div>
    <div class="products-block" v-show="!isContacts">
      <div class="products-block__nav">
        <ul>
          <li @click="this.productTypeForAdd = 'Кофе'" :class="{active: productTypeForAdd == 'Кофе'}">Кофе</li>
          <li @click="this.productTypeForAdd = 'Чай'" :class="{active: productTypeForAdd == 'Чай'}">Чай</li>
          <li @click="this.productTypeForAdd = 'Сладкое'" :class="{active: productTypeForAdd == 'Сладкое'}">Сладости</li>
          <li @click="this.productTypeForAdd = 'Сытное'" :class="{active: productTypeForAdd == 'Сытное'}">Закуски</li>
        </ul>
      </div>
      <button @click="this.isAddingProduct = true">Добавить &#43;</button>
      <div class="products-block__coffee products-block__list-products" v-show="this.productTypeForAdd == 'Кофе'">
        <ul>
          <li v-for="coffee in productByType" :key="coffee.id">
            {{ coffee.name }}({{ coffee.article }})  {{coffee.price}} &#8381;
          </li>
        </ul>
      </div>
      <div class="products-block__tea products-block__list-products" v-show="this.productTypeForAdd == 'Чай'">
        <ul>
          <li v-for="tea in productByType" :key="tea.id">
            {{ tea.name }}({{ tea.article }})  {{tea.price}} &#8381;
          </li>
        </ul>
      </div>
      <div class="products-block__sweet products-block__list-products" v-show="this.productTypeForAdd == 'Сладкое'">
        <ul>
          <li v-for="sweet in productByType" :key="sweet.id">
            {{ sweet.name }}({{ sweet.article }})  {{sweet.price}} &#8381;
          </li>
        </ul>
      </div>
      <div class="products-block__meal products-block__list-products" v-show="this.productTypeForAdd == 'Сытное'">
        <ul>
          <li v-for="meal in productByType" :key="meal.id">
            {{ meal.name }}({{ meal.article }})  {{meal.price}} &#8381;
          </li>
        </ul>
      </div>
      <div class="products-block__add-product" v-if="isAddingProduct" v-click-outside="closeAddingProduct">
        <div class="type-product">
          <input class="btn-select-all" type="checkbox" @click="this.selectAll()" v-model="checkSelectAll" id="selectAll">
          <label for="selectAll">Все</label>
          <div class="type-product__list-item" v-for="product in productsForAdd" :key="product.id">
            <input v-model="this.products" 
            type="checkbox" 
            :name="product.id" :id="product.id" :value="product">
            <label :for="product.id">{{product.name}}({{ product.article }})  {{product.price}} &#8381;</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import vClickOutside from 'click-outside-vue3'

export default {
  name: "ModalAddCoffeeshop",
  directives: {
    clickOutside: vClickOutside.directive
    },
  setup () {
    return { v$: useVuelidate() }
  },
  mounted() {
    this.GET_DRINKS_FROM_DB()
    this.GET_FOODS_FROM_DB()
  },
  data() {
    return {
      isContacts: true,
      isAddingProduct: false,
      productTypeForAdd: 'Кофе',
      img: "",
      address: "",
      time: "",
      phone: "",
      products: []
    }
  },
  validations(){
    return {
      address: {
        required,
        minLength: minLength(12)
      },
      time: {
        required,
        minLength: minLength(13)
      },
      phone: {
        required,
        minLength: minLength(16)
      }
    }
  },
  props: {},
  computed:{
    ...mapGetters([
      'DRINKS',
      'FOODS'
    ]),
    checkSelectAll(){
      if (this.productByType.length == this.productsForAdd.length) {
        return true
      } else return false
    },
    productsForAdd(){
      var type = this.productTypeForAdd
      return this.DRINKS.concat(this.FOODS).filter(function(product){
        return product.type == type
      })
    },
    productByType(){
      var type = this.productTypeForAdd
      return this.products.filter(function(product){
        return product.type == type
      })
    }
  },
  methods: {
    ...mapActions([
      'GET_FOODS_FROM_DB',
      'GET_DRINKS_FROM_DB',
      'ADD_SHOP_ITEM_TO_DB',
      'CHANGE_FOOD_ITEM_TO_DB',
      'CHANGE_DRINK_ITEM_TO_DB'
    ]),
    selectAll(){
      if(this.checkSelectAll){
        this.deleteAllProducts()
      } else this.addAllProducts()
    },
    addItemToDB(){
      var shopItem = {
          address: this.address,
          time: this.time,
          phone: this.phone
        }
        this.products.forEach(product => {
          product.coffeeshops.push(shopItem.address)
          if (product.type == "Кофе" || product.type == "Чай") {
            this.CHANGE_DRINK_ITEM_TO_DB(product)
          } else if(product.type == "Сладкое" || product.type == "Сытное"){
            this.CHANGE_FOOD_ITEM_TO_DB(product)
          }
        })
        this.ADD_SHOP_ITEM_TO_DB(shopItem)
        this.address = "",
        this.time = "",
        this.phone = ""
    },
    closeAddingProduct(){
      this.isAddingProduct = false
    },
    addAllProducts(){
      var type = this.productTypeForAdd
      this.products = this.products.filter(function(product){
        return product.type !== type
      })
      this.products = this.products.concat(this.productsForAdd)
    },
    deleteAllProducts(){
      var type = this.productTypeForAdd
      this.products = this.products.filter(function(product){
        return product.type !== type
      })
    }
  },
};
</script>

<style lang="scss" scoped>
img{
  width: 125px;
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 10px;
}
.shop-top-nav{
  position: absolute;
  top: -43px;
  left: 0px;
  button{
    font-size: 20px;
    font-weight: 600;
    padding: 10px;
    background-color: white;
    border: none;
    border-radius: 10px 10px 0 0;
  }
  button.active{
    background-color: #3a3939;
    color: white;
  }
}
.contacts-block{
  height: 290px;
}
.products-block{
  height: 290px;
  &__nav{
    ul{
      display: flex;
      padding: 0;
      margin: 0 0 10px;
      li{
        list-style: none;
        margin: 5px;
        padding: 5px;
        border-radius: 5px;
        width: 75px;
        -webkit-box-shadow: 0px 5px 10px -1px rgba(34, 60, 80, 0.2);
        -moz-box-shadow: 0px 5px 10px -1px rgba(34, 60, 80, 0.2);
        box-shadow: 0px 5px 10px -1px rgba(34, 60, 80, 0.2);
      }
      li.active{
        background-color: #3a3939;
        color: white;
      }
    }
  }
  button{
    display: flex;
    background-color: green;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    font-size: 15px;
  }
  &__add-product{
    .type-product{
      position: absolute;
      text-align: left;
      top: 30%;
      background-color: white;
      border-radius: 5px;
      padding: 10px;
      -webkit-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
      -moz-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
      box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
      &__list-item{
        margin: 5px;
      }
    }
  }
  &__list-products{
    text-align: left;
    ul{
      li{
        list-style: decimal;
        margin: 10px;
      }
    }
  }
}
.change{
  width: 90%;
  font-size: 20px;
  padding: 3px;
  margin-top: 5px;
}
.modal-shop-item{
  width: 380px;
  background-color: white;
  position: absolute;
  top: 20%;
  left: 28%;
  padding: 15px;
  border-radius: 0 10px 10px 10px;
  padding: 10px;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  &__right{
    margin-left: 5px;
  }
  &__top-content{
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: flex-end;
  }
  &__bot-content{
    display: grid;
    margin: 10px;
  }
}
.modal-details{
  display: grid;
  margin: 10px 0 0 10px;
  text-align: left;
  font-size: 20px;
  &__props{
    margin: 5px;
  }
  &__bold{
    font-weight: 600;
  }
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
p{
  margin-top: 4px;
  color: red;
  font-size: 13px;
}
.select{
  width: 94%;
  &__item{
    padding: 5px;
  }
}
@media(min-width: 1024px){
  .modal-shop-item{
    left: 35%;
  }
}
@media (max-width: 760px) {
  .modal-shop-item{
    left: 22%;
  }
}
@media (max-width: 576px) {
  .modal-shop-item{
    width: 290px;
    height: 250px;
    left: 23%;
  }
  .modal-details{
    font-size: 14px;
  }
  .shop-top-nav{
    top: -36px;
    button{
      font-size: 14px;
    }
  }
  .change{
    font-size: 14px;
  }
  img{
    width: 90px;
    margin-bottom: 15px;
  }
  .products-block{
    ul{
      font-size: 14px;
      li{
        margin: 5px;
      }
    }
    button{
      font-size: 12px;
      margin-left: 5px;
    }
    .type-product{
      font-size: 14px;
    }
  }
}
@media (max-width: 415px) {
  .modal-shop-item{
    left: 12%;
  }
}
</style>