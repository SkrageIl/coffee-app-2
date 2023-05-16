<template>
  <div class="reports-page">
    <div class="reports-page__nav">
      <router-link :to="{name:'byCoffeeshops'}" class="admin-menu__btn">По кофеточкам</router-link>
      <router-link :to="{name:'byWorker'}" class="admin-menu__btn">По сотрудникам</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "ReportsPage",
  created() {},
  data() {
    return {};
  },
  props: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.reports-page{
  &__nav{
    font-weight: 600;
    display: flex;
    justify-content: center;
    a{
      font-size: 18px;
      text-decoration: none;
      padding: 10px;
      margin: 0 10px 20px;
      border-radius: 10px;
      color: rgb(128, 128, 128);
      -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.05);
      -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.05);
      box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.05);
    }
  }
}
.router-link-active{
  font-size: 22px !important;
  color: black !important;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) !important;
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) !important;
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) !important;
}
</style>