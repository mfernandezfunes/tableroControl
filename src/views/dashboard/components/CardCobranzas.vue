<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-panel-title">
          <strong>COBRANZAS</strong>

          <el-tooltip
            effect="light"
            content="Los datos incluyen los valores a acreditar los días sábados y domingos"
            placement="bottom"
          >
            <span style="color:red">
              <i class="el-icon-warning-outline" type="danger"></i>
            </span>
          </el-tooltip>
        </span>
        <router-link :to="{name: 'Cobranzas'}">
          <el-button
            style="float: right; padding: 3px 3"
            size="medium"
            icon="el-icon-arrow-right"
          >Ir</el-button>
        </router-link>
      </div>
      <div class="card-panel-title">REAL ACREDITACION</div>
      <div class="card-panel-text">Total Acumulado:</div>
      <div class="card-panel-num">
        <strong>{{datos.sumatoria | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">Promedio:</div>
      <div class="card-panel-num">
        <strong>{{datos.promedio | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">(Calculo en base a {{datos.cantidad}} días)</div>
      <el-collapse>
        <el-collapse-item title="Ver resumen diario" name="1">
          <el-table
            :data="datos.datos"
            stripe
            fit
            height="400"
            style="width: 100%; magin-top: 20px"
          >
            <el-table-column prop="FECHA" sortable label="Fecha" :formatter="formatearFecha"></el-table-column>
            <el-table-column prop="TOTAL" sortable label="Importe" :formatter="conValor"></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <div class="card-panel-title">INDICADORES DE GESTION</div>
      <div class="card-panel-text">Total Acumulado:</div>
      <div class="card-panel-num">
        <strong>{{0 | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">Promedio Diario:</div>
      <div class="card-panel-num">
        <strong>{{0 | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">(Calculo en base a {{0}} días)</div>
      <el-collapse>
        <el-collapse-item title="Ver resumen diario" name="1"></el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import numeral from "numeral";
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
      return numeral(valor).format("$ 0,0[.]00");
    },
    indexMethod(index) {
      return index * 2;
    },
    conValor(row, column, cellValue, index) {
      return this.formatearPeso(cellValue);
    },
    formatearFecha(row, column, cellValue, index) {
      return cellValue.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
    }
  }
};
</script>


<style>
</style>