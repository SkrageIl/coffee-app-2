<template>
  <div class="shop-item" v-click-outside="onClickOutside">
    <div class="shop-item__top-content">
      <img src="@/assets/coffeeshop1.jpg" alt="Фото товара">
      <div class="shop-item__right">
        <div class="details">
          <span class="details__bold">Адрес: </span>
          <span v-if="!isChange" class="details__props">{{shop_data.address}}</span>
          <input type="text" v-if="isChange" v-model="this.address" class="change">
        </div>
        <div class="details">
          <span class="details__bold">Время работы: </span>
          <span v-if="!isChange" class="details__props">{{shop_data.time}}</span>
          <input type="tel" v-if="isChange" v-model="this.time" v-mask="'##:## - ##:##'" class="change">
        </div>
      </div>
    </div>
    <div class="shop-item__bot-content">
      <div class="details">
        <span class="details__bold">Телефон: </span>
        <span v-if="!isChange" class="details__props">{{shop_data.phone}}</span>
        <input type="tel" v-if="isChange" v-model="this.phone" v-mask="'+7(###)###-##-##'" class="change">
      </div>
    </div>
    <div class="buttons">
      <button class="delete-btn btn" @click="this.isDialog = true">Удалить</button>
      <button class="change-btn btn" @click="changeItems">Изменить</button>
    </div>
    <vue-final-modal
      v-model="isDialog"
      @click-outside="closeModal"
      :drag="false"
      classes="modal-container dialog-modal"
      content-class="modal-content dialog-container">
        <div class="dialog">
          <button @click="closeModal" class="dialog__close-popup-btn">X</button>
          <p>Вы уверены, что хотите удалить кофейню <strong>{{shop_data.address}}</strong> из списка?</p>
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
  name: "CoffeeshopItem",
  directives: {
    clickOutside: vClickOutside.directive
    },
  created() {},
  data() {
    return {
      isChange: false,
      isDialog: false,
      address: this.shop_data.address,
      time: this.shop_data.time,
      phone: this.shop_data.phone
    }
  },
  props: {
    shop_data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed:{
    ...mapGetters([
      'SHOPS'
    ])
  },
  methods: {
    ...mapActions([
      'DELETE_SHOP_ITEM_FROM_DB',
      'CHANGE_SHOP_ITEM_TO_DB'
    ]),
    closeModal(){
      this.isDialog = false
    },
    deleteItem(){
      this.DELETE_SHOP_ITEM_FROM_DB(this.shop_data.id)
      this.isDialog = false
    },
    changeItems(){
      if (this.isChange) {
        this.isChange = false
        let shopItem = {
          id: this.shop_data.id,
          address: this.address,
          time: this.time,
          phone: this.phone
        }
        if(shopItem.address !== this.shop_data.address 
          || shopItem.time !== this.shop_data.time
          || shopItem.phone !== this.shop_data.phone){
            this.CHANGE_SHOP_ITEM_TO_DB(shopItem)
          }
      } else this.isChange = true
    },
    onClickOutside() {
      this.isChange = false
      this.address = this.shop_data.address,
      this.time = this.shop_data.time,
      this.phone = this.shop_data.phone
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
.dialog{
  background-color: white;
  padding: 1% 6% 3%;
  border-radius: 10px;
  width: 100%;
  font-size: 20px;
  &__close-popup-btn{
    position: absolute;
    top: 5px;
    right: 5px;
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
      display: flex;
      justify-content: center;
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
.shop-item{
  margin: 20px;
  width: 380px;
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
.details{
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
input{
  width: 100%;
}
.buttons{
  margin: 25px 0 10px 0;
  display: flex;
  justify-content: center;
}
.change-btn{
  margin-left: 10px;
  background-color: #096aba;
}
.delete-btn{
  background-color: #fa1616;
}
.btn{
  font-size: 18px;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
}
.change{
  width: 90%;
  font-size: 20px;
  padding: 3px;
  margin-top: 5px;
}
.select{
  width: 94%;
  &__item{
    padding: 5px;
  }
}
@media(max-width: 576px){
  .shop-item{
    width: 200px;
  }
}
</style>