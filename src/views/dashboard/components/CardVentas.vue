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
          <el-table :data="vector" border height="400" style="width: 100%; magin-top: 20px">
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
  name: "CardVentas",
  data() {
    return {
      vector: []
    };
  },
  props: {
    datos: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.regenerarObjeto(this.datos.datos);
  },
  methods: {
    regenerarObjeto(objeto) {
      for (const item of objeto) {
        item.FECHA = formatearFecha(item.FECHA);
        item.TOTAL = convertImporte(item.FECHA);
        console.log(item);
        this.vector.push(item);
      }
    },
    convertImporte(importe) {
      return importe.numeralFormat("$ 0,0[.]00");
    },
    formatearFecha(fecha) {
      return fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
    }
  }
};
</script>


<style>
</style>