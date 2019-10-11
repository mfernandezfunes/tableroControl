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

      <div class="card-panel-title">BERNAL</div>

      <div class="card-panel-text">Total Acumulado {{toFirstUp(datos.datos[3].PRODUCTO)}}:</div>
      <div class="card-panel-num">
        <strong>{{datos.datos[3].TOTAL | numeralFormat('0,0[.]00') }} Kg</strong>
      </div>

      <div class="card-panel-title">CAMPANA</div>
      <div class="card-panel-text">Total Acumulado {{toFirstUp(datos.datos[2].PRODUCTO)}}:</div>
      <div class="card-panel-num">
        <strong>{{datos.datos[2].TOTAL | numeralFormat('0,0[.]00') }} Kg</strong>
      </div>
      <el-divider></el-divider>
      <div class="card-panel-title">TOTAL {{toFirstUp(datos.datos[2].PRODUCTO)}}:</div>
      <div class="card-panel-num">
        <span style="color:green">
          <strong>{{ datos.datos[2].TOTAL + datos.datos[3].TOTAL | numeralFormat('0,0[.]00') }} Kg</strong>
        </span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CardProduccion",
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
    toFirstUp(cadena) {
      if (typeof cadena == "string") {
        var pieces = cadena.split(" ");
        for (let i = 0; i < pieces.length; i++) {
          let j = pieces[i].charAt(0).toUpperCase();
          pieces[i] = j + pieces[i].substr(1).toLowerCase();
        }
        return pieces.join(" ");
      }
    }
  }
};
</script>

<style>
</style>