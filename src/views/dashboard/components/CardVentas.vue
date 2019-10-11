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
      <div class="card-panel-title">REAL FACTURADO</div>
      <div class="card-panel-text">Total Acumulado:</div>
      <div class="card-panel-num">
        <strong>{{datos.sumatoria | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">Promedio:</div>
      <div class="card-panel-num">
        <strong>{{datos.promedio | numeralFormat('$ 0,0[.]00') }}</strong>
      </div>
      <div class="card-panel-text">(Calculo en base a {{datos.cantidad }} días)</div>
      <el-collapse>
        <el-collapse-item title="Ver resumen diario" name="1">
          <el-table :data="datos.datos" border height="400" style="width: 100%; magin-top: 20px">
            <el-table-column prop="FECHA" label="Fecha" formatter="cell => alert(cell)"></el-table-column>
            <el-table-column prop="TOTAL" label="Importe"></el-table-column>
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
  },
  methods: {
    convertImporte(importe) {
      return importe.numeralFormat("$ 0,0[.]00");
    },
    formatearFecha(fecha) {
      return fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
    },
    formatAuthority(value) {
      return `ITEM ${value}`;
    }
  }
};
</script>


<style>
</style>