<template>
  <div class=" modal-worker-item">
    <div class=" modal-worker-item__top-content">
      <img src="@/assets/barista.png" alt="Фото товара">
    </div>
    <div class=" modal-worker-item__bot-content">
      <div class=" modal-details">
        <span class=" modal-details__bold">Имя: </span>
        <input type="text" v-model="this.name" placeholder="Имя..." @blur="v$.name.$touch()" class="change">
        <span v-if="v$.name.$error">
          <p v-if="v$.name.minLength.$invalid">Слишком короткое имя</p>
          <p v-else-if="v$.name.maxLength.$invalid">Слишком длинное имя</p>
          <p v-else-if="v$.name.alpha.$invalid">Имя должно содержать только буквы</p>
          <p v-else-if="v$.name.required.$invalid">Введите имя</p>
        </span>
      </div>
      <div class=" modal-details">
        <span class=" modal-details__bold">Телефон: </span>
        <input type="tel" v-model="this.tel" v-mask="'+7(###)###-##-##'" placeholder="+7(999)-999-99-99" @blur="v$.tel.$touch()" class="change">
        <span v-if="v$.tel.$error">
          <p>Введите номер телефона</p>
        </span>
      </div>
      <div class=" modal-details">
        <span class=" modal-details__bold">Кофейня: </span>
        <select v-model="this.depart" class="change select">
          <option 
            v-for="shop in SHOPS"
            :key="shop.id"
            class="select__item">
              {{ shop.address }}
          </option>
        </select>
        <span v-if="v$.depart.$error">
          <p>Выберите кофеточку</p>
        </span>
      </div>
      <div class=" modal-details">
        <span class=" modal-details__bold">Пароль: </span>
        <input type="password" v-model="this.password" placeholder="Пароль..." @blur="v$.password.$touch()" class="change">
        <span v-if="v$.password.$error">
          <p>Минимальная длина пароля 6 символов</p>
        </span>
      </div>
      <div class=" modal-details">
        <span class=" modal-details__bold">Подтвердите пароль: </span>
        <input type="password" v-model="this.confirmPassword" placeholder="Повторите пароль..." @blur="v$.confirmPassword.$touch()" class="change">
        <span v-if="v$.confirmPassword.$error">
          <p> Пароли не совпадают</p>
        </span>
      </div>
    </div>
    <button class="add-btn" :disabled="v$.$invalid" @click="addItemToDB">Добавить</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, sameAs } from '@vuelidate/validators'

export default {
  name: "ModalAddWorker",
  setup () {
    return { v$: useVuelidate() }
  },
  mounted() {
  },
  data() {
    return {
      name: "",
      tel: "",
      depart: "",
      password: "",
      confirmPassword: "",
    };
  },
  validations(){
    return {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(10),
        alpha: val => /^[а-яё]*$/i.test(val),
      },
      tel: {
        required,
        minLength: minLength(16)
      },
      depart: {
        required
      },
      password: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        required,
        sameAs: sameAs(this.password)
      }
    }
  },
  props: {},
  computed:{ 
    ...mapGetters([
      'SHOPS'
    ])
  },
  methods: {
    ...mapActions([
      'ADD_WORKER_ITEM_TO_DB'
    ]),
    addItemToDB(){
      let workerItem = {
          name: this.name,
          tel: this.tel.split("(").join("").split(")").join("").split("-").join(""),
          password: this.password,
          depart: this.depart
        }
        this.ADD_WORKER_ITEM_TO_DB(workerItem)
        this.name = "",
        this.tel = "",
        this.depart = "",
        this.password = "",
        this.confirmPassword = ""
    },
  },
};
</script>

<style lang="scss" scoped>
img{
  width: 100px;
}
.change{
  width: 90%;
  font-size: 15px;
  padding: 3px;
  margin-top: 5px;
}
.modal-worker-item{
  background-color: white;
  position: absolute;
  top: 20%;
  left: 40%;
  padding: 15px;
  border-radius: 10px;
  min-width: 250px;
}
.modal-details{
  display: grid;
  text-align: left;
  margin: 10px;
  font-size: 20px;
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
@media (max-width: 700px) {
  .modal-worker-item{
    left: 30%;
  }
}
@media (max-width: 576px) {
  .modal-worker-item{
    left: 25%;
    top: 15%;
  }
  .modal-details{
    font-size: 17px;
  }
}
@media (max-width: 415px) {
  .modal-worker-item{
    left: 17%;
  }
}
</style>