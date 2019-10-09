<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-panel-title">
          <strong>COBRANZAS</strong>
        </span>
        <router-link :to="{name: 'Cobranzas'}">
          <el-button
            style="float: right; padding: 3px 3"
            size="medium"
            icon="el-icon-arrow-right"
          >Ir</el-button>
        </router-link>
      </div>
      <div class="card-panel-text">Dia hábil anterior:</div>
      <div class="card-panel-num">
        <strong>$ -</strong>
      </div>
      <div class="card-panel-text">Total Acumulado:</div>
      <div class="card-panel-num">
        <strong>${{formatearPeso(objetoAnalisis.sumatoria.cobranzas)}}</strong>
      </div>
      <div class="card-panel-text">Promedio:</div>
      <div class="card-panel-num">
        <strong>${{formatearPeso(objetoAnalisis.promedios.cobranzas)}}</strong>
      </div>
      <div class="card-panel-text">(Calculo en base a {{objetoAnalisis.cantidad.cobranzas}} días)</div>
      <div></div>

      <el-collapse>
        <el-collapse-item title="Resumen diario" name="1">
          <el-table
            :data="objetoAnalisis.datos"
            border
            height="400"
            style="width: 100%; magin-top: 20px"
          >
            <el-table-column prop="fecha" label="Fecha"></el-table-column>
            <el-table-column prop="formatearPeso(cobranzas)" label="Valor"></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CardCobranzas",
  data() {
    return {};
  }
};
</script>


<style>
</style>