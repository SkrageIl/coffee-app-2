<template>
  <div class="product-item">
    <div class="product-item__left-content">
      <img src="@/assets/glyase.png" alt="Фото товара" :class="classes">
    </div>
    <div class="product-item__right-content">
      <div class="details">
        <span class="details-bold">Название: </span>
        <span class="details__props">{{product_data.name}}</span>
      </div>
      <div class="details article">
        <span class="details-bold">Артикул: </span>
        <span class="details__props">{{product_data.article}}</span>
      </div>
      <div class="details" v-if="this.width > 1024">
        <span class="details-bold">Тип: </span>
        <span class="details__props">{{product_data.type}}</span>
      </div>
      <div class="details details__price" v-if="this.width > 1024">
        <span class="details-bold">Цена: </span>
        <span class="details__props">{{product_data.price}} &#8381;</span>
      </div>
      <div class="details__bot" v-else>
        <div class="details">
          <span class="details-bold">Тип: </span>
          <span class="details__props">{{product_data.type}}</span>
        </div>
        <div class="details details__price">
          <span class="details-bold">Цена: </span>
          <span class="details__props">{{product_data.price}} &#8381;</span>
        </div>
      </div>
    </div>
    <div class="details details__title">
      <span class="details-bold">Описание: </span>
      <span class="details__props">{{product_data.title}}</span>
    </div>
    <div class="buttons">
      <button class="delete-btn" @click="this.isDialog = true">Удалить из ассортимента</button>
    </div>
    <vue-final-modal
      v-model="isDialog"
      @click-outside="closeModal"
      :drag="false"
      classes="modal-container"
      content-class="modal-content dialog-container">
        <div class="dialog">
          <button @click="closeModal" class="dialog__close-popup-btn">X</button>
          <p>Вы уверены, что хотите удалить <strong>{{product_data.name}}({{ product_data.article }})</strong> из ассортимента кофейни?</p>
          <div class="dialog__buttons">
            <button class="agree" @click="deleteProductFromCoffeeshops">Да</button>
            <button class="cancel" @click="closeModal">Отмена</button>
          </div>
        </div>
    </vue-final-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "AssortmentItem",
  mounted() {
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
      isDialog: false
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
      'USER'
    ])
  },
  methods: {
    ...mapActions([
      'CHANGE_FOOD_ITEM_TO_DB',
      'CHANGE_DRINK_ITEM_TO_DB'
    ]),
    handleResize() {
      this.width = window.innerWidth
    },
    closeModal(){
      this.isDialog = false
    },
    deleteProductFromCoffeeshops(){
      var depart = this.USER.depart
      var productItem = this.product_data
      productItem.coffeeshops = productItem.coffeeshops.filter(coffeeshop => coffeeshop !== depart)
      if (["Кофе", "Чай"].includes(productItem.type))
      {
        this.CHANGE_DRINK_ITEM_TO_DB(productItem)
      } else if(["Сладкое", "Сытное"].includes(productItem.type)){
        this.CHANGE_FOOD_ITEM_TO_DB(productItem)
      }
      this.isDialog = false
    },
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
  width: fit-content;
  height: 100%;
  border-radius: 5px;
  font-size: 18px;
  background-color: #fa1616;
  color: #ffffff;
  cursor: pointer;
  margin: 0 10px;
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