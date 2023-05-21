<template>
  <nav class="catalog-nav">
    <ul class="catalog-nav__wrapper">
      <li class="catalog-nav__item">
        <router-link
          to="/barista/products-in-coffeeshops#coffee"
          class="catalog-nav__btn"
          :class="{selected: navActive == 'coffee'}"
          @click="this.navActive = 'coffee'"
          >Кофе
        </router-link>
      </li>
      <li class="catalog-nav__item">
        <router-link to="/barista/products-in-coffeeshops#tea"
          class="catalog-nav__btn"
          :class="{selected: navActive == 'tea'}"
          @click="this.navActive = 'tea'"
          >Чай
        </router-link>
      </li>
      <li class="catalog-nav__item">
        <router-link
          to="/barista/products-in-coffeeshops#sweet"
          class="catalog-nav__btn"
          :class="{selected: navActive == 'sweet'}"
          @click="this.navActive = 'sweet'"
          >Сладости
        </router-link>
      </li>
      <li class="catalog-nav__item">
        <router-link
          to="/barista/products-in-coffeeshops#meal"
          class="catalog-nav__btn"
          :class="{selected: navActive == 'meal'}"
          @click="this.navActive = 'meal'"
          >Закуски
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "AssortmentNav",
  mounted() {
  },
  created() {},
  data() {
    return {
      navActive: 'coffee',
    };
  },
  props: {},
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.catalog-nav{
  display: flex;
  justify-content: flex-start;
  &__wrapper{
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  }
  &__btn{
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    color: #cbcbcbd8;
    padding: 5px 18px;
    margin-left: 15px;
    border: 0;
    border-radius: 24px;
    background-color: #979797c8;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    transition: background .2s, color .2s;
  }
  &__btn.selected{
    background-color: #3a3939;
    color: #ffffff;
    text-decoration: none;
  }
  &__btn:active{
    border: none;
  }
  &__btn:not(.selected):hover{
    background-color: #676564;
    color: white;
  }
}


@media(max-width: 576px){

  .catalog-nav{
    display: flex;
    justify-content: flex-start;
    &__wrapper{
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      width: 100%;
      overflow-x: scroll;
      -ms-overflow-style: none;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      li:last-child {
        margin-right: 80px;
      }
    }
    &__wrapper::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
}
</style>