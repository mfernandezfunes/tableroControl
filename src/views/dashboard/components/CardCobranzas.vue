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

      <div class="card-panel-text">Total Acumulado:</div>
      <div class="card-panel-num">
        <strong>{{datos.sumatoria | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">Promedio:</div>
      <div class="card-panel-num">
        <strong>{{datos.promedio | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">(Calculo en base a {{datos.cantidad}} días)</div>
      <div></div>

      <el-collapse>
        <el-collapse-item title="Ver resumen diario" name="1">
          <el-table :data="datos.datos" border height="400" style="width: 100%; magin-top: 20px">
            <el-table-column prop="FECHA" label="Fecha"></el-table-column>
            <el-table-column prop="TOTAL" label="Importe"></el-table-column>
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
  },
  props: {
    datos: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatearPeso(valor) {
      return numeral(valor).format("0,0.00");
    }
  }
};
</script>


<style>
</style>