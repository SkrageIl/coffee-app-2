<template>
  <div class="main-page">
    <div class="main-menu">
      <button class="main-menu__btn" @click="this.$router.push('/barista')">Бариста</button>
      <button class="main-menu__btn" @click="this.$router.push('/admin')">Администратор</button>
      <button class="main-menu__btn exit" @click="this.logout">Выйти</button>
    </div>
  </div>
</template>

<script>

export default {
  name: "MainWrapper",
  created() {
  },
  data() {
    return {};
  },
  props: {},
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/login')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.main-page{
  display: grid;
  margin-top: 50%;
  justify-content: center;
}
.main-menu{
  display: grid;
  margin-top: 30px;
  padding: 30px;
  max-width: 300px;
  min-width: 250px;
  border-radius: 22px;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  &__btn{
    font-size: 20px;
    cursor: pointer;
    border-radius: 22px;
    border: 0;
    margin: 15px;
    padding: 20px;
    font-weight: 800;
    color: #fbfbfb;
    background-image: linear-gradient(to right, #232526 0%, #414345  51%, #232526  100%);
    -webkit-box-shadow: 10px 10px 10px -7px rgba(255, 144, 0, 0.2);
    -moz-box-shadow: 10px 10px 10px -7px rgba(255, 144, 0, 0.2);
    box-shadow: 10px 10px 10px -7px rgba(255, 144, 0, 0.2);
  }
}
.exit{
  font-size: 15px;
  padding: 5px 5px 8px;
  margin-bottom: 0;
  width: 100px;
  justify-self: center;
}
</style>