<template>
  <div class="workers-page">
    <div class="workers__top-content">
      <h3>Сотрудники</h3>
      <button class="workers__add" @click="this.isModal = true">Добавить &#43;</button>
    </div>
    <div class="workers">
      <WorkerItem
        v-for="worker in WORKERS"
        :key="worker.id"
        :worker_data="worker"
      />
    </div>
    <vue-final-modal
      v-model="isModal"
      @click-outside="this.isModal = false"
      :drag="false"
      classes="modal-container"
      content-class="modal-content modal-item">
        <ModalAddWorker/>
    </vue-final-modal>
  </div>
</template>

<script>
import {ref} from 'vue'
import { mapActions, mapGetters } from 'vuex'
import WorkerItem from './WorkerItem.vue'
import ModalAddWorker from './ModalAddWorker.vue'

export default {
  name: "WorkersPage",
  components:{
    WorkerItem,
    ModalAddWorker
  },
  mounted() {
    this.GET_WORKERS_FROM_DB()
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
      'WORKERS',
    ])
  },
  methods: {
    ...mapActions([
      'GET_WORKERS_FROM_DB',
      'GET_SHOPS_FROM_DB'
    ])
  },
};
</script>

<style lang="scss" scoped>
.workers{
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  .workers{
    grid-template-columns: 1fr 1fr 1fr;
    row-gap: 10%;
  }
}
@media(max-width: 576px){
  .workers{
    grid-template-columns: 1fr;
    row-gap: 1%;
    &__top-content{
      font-size: 18px;
    }
    &__add{
      font-size: 15px;
      margin: 15px 0;
      margin-left: 10px;
      padding: 0 5px;
    }
  }
}
</style>