<template>
  <div class="login-form">
    <h4 class="login-form__label">Вход</h4>
    <form class="content-form" @submit.prevent="Login">
      <div class="content-form__phone">
        <label class="content-form__label" for="tel" >Телефон</label>
        <input v-model="tel" type="tel" v-mask="'+7(###)###-##-##'" placeholder="+7(999)-999-99-99" @blur="v$.tel.$touch()">
        <span v-if="v$.tel.$error">
          <p>Введите номер телефона</p>
        </span>
      </div>
      <div class="content-form__password">
        <label class="content-form__label" for="password">Пароль</label>
        <input id="password" type="password" v-model="password" placeholder="Пароль..." @blur="v$.password.$touch()">
        <span v-if="v$.password.$error">
          <p>Минимальная длина пароля 6 символов</p>
        </span>
      </div>
      <div class="button-submit">
          <button type="submit" :disabled="v$.$invalid">Войти</button>
      </div>
      <div class="button-registry">
        <button id="registry" @click="OpenRegistrationForm">Регистрация</button>
      </div>
    </form>
  </div>
  
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength} from '@vuelidate/validators'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: "LoginPage",
  setup () {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      tel:"",
      password : ""
    }
  },
  validations(){
    return {
      tel: {
        required,
        minLength: minLength(16)
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  computed: {
    ...mapGetters([
      'isLoggedIn'
    ])
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    Login(){
      let tel = this.tel.split("(").join("").split(")").join("").split("-").join("")
      let password = this.password
      this.login({ tel, password })
      .then(() => {
        this.$router.push('/')
      })
      .catch(err => console.log(err + password))
      setTimeout(() => {
        if (!this.isLoggedIn){
          this.$notify({
            title: "Неправильно ввели номер телефона или пароль",
            type: "error"
          });
        }
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form{
  border-radius: 25px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 250px;
  padding: 25px;
  box-shadow: 0 0 3px #545454;
  &__label{
    font-size: 25px;
    font-weight: 600;
    text-align: center;
    margin-top: 4px;
    margin-bottom: 40px;
  }
  .close-popup-btn{
    position: absolute;
    top: 8px;
    right: 10px;
    font-size: 15px;
    padding: 5px 7px;
    color: #ffffff;
    background-color: #cccccc;
    border: none;
    border-radius: 25px;
    cursor: pointer;
  }
}
.content-form{
  margin-top: -20px;
  text-align: left;
  &__label{
    font-size: 15px;
    text-align: left;
  }
  &__password{
    height: 45px;
    width: 100%;
    margin: 25px 0;
  }
  &__phone{
    height: 45px;
    width: 100%;
    margin: 25px 0;
  }
  p{
    margin-top: 1px;
    color: red;
    font-size: 10px;
  }
  input{
    height: 70%;
    width: 100%;
    padding-left: 10px;
    font-size: 13px;
    border: 1px solid silver;
  }
  :focus{
    border-color: #ee7f00;
    border-bottom-width: 2px;
  }
  .button-submit{
    text-align: center;
    button{
      margin-top: 15px;
      padding: 5px;
      color: #fff;
      background: #3a3939;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
      border: none;
      border-radius: 12px;
      width: 40%;
    }
    button:hover{
      transform: scale(1.05);
      filter: brightness(1.2);
    }
    button:disabled{
      background: #3a393984;
      cursor: none;
      pointer-events: none;
    }
  }
  .button-registry{
    text-align: center;
    button{
      margin-top: 15px;
      padding: 5px;
      color: #fff;
      background: #3a3939;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
      border: none;
      border-radius: 12px;
      width: 75%;
    }
  }
}
@media(max-width: 576px){
  
}
</style>