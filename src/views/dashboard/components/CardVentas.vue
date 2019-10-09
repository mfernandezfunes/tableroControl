<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-panel-title">
          <strong>VENTAS</strong>
        </span>
        <router-link :to="{name: 'Ventas'}">
          <el-button
            style="float: right; padding: 3px 3"
            size="medium"
            icon="el-icon-arrow-right"
          >Ir</el-button>
        </router-link>
      </div>
      <div class="card-panel-text">Dia hábil anterior:</div>
      <div class="card-panel-num">
        <strong>-</strong>
      </div>
      <div class="card-panel-text">Total Acumulado:</div>
      <div class="card-panel-num">
        <strong>{{datos.sumatoria.ventas | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">Promedio:</div>
      <div class="card-panel-num">
        <strong>{{datos.promedios.ventas | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">(Calculo en base a {{datos.cantidad.ventas}} días)</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CardVentas",
  data() {
    return {};
  },
  props: {
    datos: {
      type: Object,
      required: true
    }
  }
};
</script>


<style>
</style>