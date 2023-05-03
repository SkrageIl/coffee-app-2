<template>
  <div class=" modal-shop-item">
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
</template>

<script>
import { mapActions } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

export default {
  name: "ModalAddCoffeeshop",
  setup () {
    return { v$: useVuelidate() }
  },
  mounted() {
  },
  data() {
    return {
      img: "",
      address: "",
      time: "",
      phone: ""
    };
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
  },
  methods: {
    ...mapActions([
      'ADD_SHOP_ITEM_TO_DB'
    ]),
    addItemToDB(){
      let shopItem = {
          address: this.address,
          time: this.time,
          phone: this.phone
        }
        this.ADD_SHOP_ITEM_TO_DB(shopItem)
        this.address = "",
        this.time = "",
        this.phone = ""
    },
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
  border-radius: 10px;
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
@media(max-width: 576px){
  .modal-shop-item{
    width: 200px;
  }
}
@media(min-width: 1024px){
  .modal-shop-item{
    left: 35%;
  }
}
</style>