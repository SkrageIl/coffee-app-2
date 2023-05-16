<template>
  <div class="worker-item" v-click-outside="onClickOutside">
    <div class="worker-item__top-content">
      <img src="@/assets/barista.png" alt="Фото товара">
    </div>
    <div class="worker-item__bot-content">
      <div class="details__name">
        <span v-if="!isChange" class="details__props">{{worker_data.name}}</span>
        <input type="text" v-if="isChange" v-model="this.name" class="change">
      </div>
      <div class="details">
        <span class="details__bold">Телефон: </span>
        <span v-if="!isChange" class="details__props">{{worker_data.tel}}</span>
        <input type="tel" v-if="isChange" v-model="this.tel" class="change">
      </div>
      <div class="details">
        <span class="details__bold">Кофейня: </span>
        <span v-if="!isChange" class="details__props">{{worker_data.depart}}</span>
        <select v-if="isChange" v-model="this.depart" class="change select">
          <option 
            v-for="shop in SHOPS"
            :key="shop.id"
            class="select__item">
              {{ shop.address }}
          </option>
        </select>
      </div>
    </div>
    <div class="buttons">
      <button class="delete-btn btn" @click="this.isDialog = true">Удалить</button>
      <button class="change-btn btn" @click="changeItems()">Изменить</button>
    </div>
    <vue-final-modal
      v-model="isDialog"
      @click-outside="closeModal"
      :drag="false"
      classes="modal-container"
      content-class="modal-content dialog-container">
        <div class="dialog">
          <button @click="closeModal" class="dialog__close-popup-btn">X</button>
          <p>Вы уверены, что хотите удалить сотрудника <strong><span>{{worker_data.name}}</span><span>({{ worker_data.tel }})</span></strong> из списка?</p>
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
  name: "WorkerItem",
  directives: {
    clickOutside: vClickOutside.directive
    },
  created() {},
  data() {
    return {
      isChange: false,
      isDialog: false,
      name: this.worker_data.name,
      tel: this.worker_data.tel,
      depart: this.worker_data.depart
    }
  },
  props: {
    worker_data: {
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
      'DELETE_WORKER_ITEM_FROM_DB',
      'CHANGE_WORKER_ITEM_TO_DB'
    ]),
    closeModal(){
      this.isDialog = false
    },
    deleteItem(){
      this.DELETE_WORKER_ITEM_FROM_DB(this.worker_data.id)
      this.isDialog = false
    },
    changeItems(){
      if (this.isChange) {
        this.isChange = false
        let workerItem = {
          id: this.worker_data.id,
          name: this.name,
          tel: this.tel,
          depart: this.depart
        }
        if(workerItem.name !== this.worker_data.name 
          || workerItem.tel !== this.worker_data.tel
          || workerItem.depart !== this.worker_data.depart){
            this.CHANGE_WORKER_ITEM_TO_DB(workerItem)
          }
      } else this.isChange = true
    },
    onClickOutside () {
      this.isChange = false
      this.name = this.worker_data.name,
      this.tel = this.worker_data.tel,
      this.depart = this.worker_data.depart
    }
  },
};
</script>

<style lang="scss" scoped>
img{
  width: 100px;
  margin-top: 10px;
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
.worker-item{
  margin: 20px;
  max-width: 300px;
  border-radius: 10px;
  padding: 10px;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  &__bot-content{
    display: grid;
    margin: 10px;
  }
}
.details{
  margin: 10px 0 0 10px;
  text-align: left;
  font-size: 18px;
  &__name{
    font-size: 20px;
    font-weight: 600;
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
  font-size: 18px;
  padding: 3px;
  margin-top: 5px;
}
.select{
  width: 94%;
  &__item{
    padding: 5px;
  }
}
</style>