<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-panel-title">
          <strong>PRODUCCION</strong>
        </span>
        <router-link :to="{name: 'Produccion'}">
          <el-button
            style="float: right; padding: 3px 3"
            size="medium"
            icon="el-icon-arrow-right"
          >Ir</el-button>
        </router-link>
      </div>
      <span class="card-panel-title">BERNAL</span>
      <div class="card-panel-text">Total Acumulado:</div>
      <div class="card-panel-num">
        <strong>- Kg</strong>
      </div>
      <span class="card-panel-title">CAMPANA</span>
      <div class="card-panel-text">Total Acumulado:</div>
      <div class="card-panel-num">
        <strong>- Kg</strong>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CardProduccion",
  data() {
    return {};
  }
};
</script>


<style>
</style>