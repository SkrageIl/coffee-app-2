<template>
  <div class="shops-page">
    <div class="shops__top-content">
      <h3>Кофейни</h3>
      <button class="shops__add" @click="this.isModal = true">Добавить &#43;</button>
    </div>
    <div class="shops">
      <CoffeeshopItem
        v-for="shop in SHOPS"
        :key="shop.id"
        :shop_data="shop"
      />
    </div>
    <vue-final-modal
      v-model="isModal"
      @click-outside="this.isModal = false"
      :drag="false"
      classes="modal-container"
      content-class="modal-content modal-item">
        <ModalAddCoffeeshop/>
    </vue-final-modal>
  </div>
</template>

<script>
import {ref} from 'vue'
import { mapActions, mapGetters } from 'vuex'
import CoffeeshopItem from './CoffeeshopItem.vue'
import ModalAddCoffeeshop from './ModalAddCoffeeshop.vue'

export default {
  name: "CoffeeshopsPage",
  components:{
    CoffeeshopItem,
    ModalAddCoffeeshop
  },
  mounted() {
    this.GET_SHOPS_FROM_DB()
  },
  data() {
    return {
      isModal: ref(false),
    };
  },
  props: {},
  computed: {
    ...mapGetters([
      'SHOPS',
    ])
  },
  methods: {
    ...mapActions([
      'GET_SHOPS_FROM_DB'
    ])
  },
};
</script>

<style lang="scss" scoped>
.shops{
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  padding: 0 5% 5%;
  row-gap: 5%;
  &__top-content{
    display: flex;
    margin-left: 10%;
    font-size: 20px;
  }
  &__add{
    background-color: green;
    color: white;
    font-size: 20px;
    margin: 15px;
    padding: 0 15px;
    border: none;
    border-radius: 5px;
    margin-left: 20px;
  }
}
@media(min-width: 1024px){
  .shops{
    grid-template-columns: 1fr 1fr;
    row-gap: 10%;
  }
}
@media(max-width: 576px){
  .shops{
    grid-template-columns: 1fr;
  }
}
</style>