<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-panel-title">
          <strong>RRHH</strong>
        </span>
        <router-link :to="{name: 'RRHH'}">
          <el-button
            style="float: right; padding: 3px 3"
            size="medium"
            icon="el-icon-arrow-right"
          >Ir</el-button>
        </router-link>
      </div>
      <span class="card-panel-title" style="float: right;">BELGRANO</span>
      <div class="card-panel-text">Plantel Activo:</div>
      <div class="card-panel-num">
        <strong>{{objetoRRHH.datos[1].DOTACION}}</strong>
      </div>
      <div class="card-panel-text">Ausentes:</div>
      <div class="card-panel-num">
        <strong>-</strong>
      </div>
      <div class="card-panel-text">Presentes:</div>
      <div class="card-panel-num">
        <strong>-</strong>
      </div>
      <span class="card-panel-title">BERNAL</span>
      <div class="card-panel-text">Plantel Activo:</div>
      <div class="card-panel-num">
        <strong>{{objetoRRHH.datos[3].DOTACION}}</strong>
      </div>
      <div class="card-panel-text">Ausentes:</div>
      <div class="card-panel-num">
        <strong>-</strong>
      </div>
      <div class="card-panel-text">Presentes:</div>
      <div class="card-panel-num">
        <strong>-</strong>
      </div>
      <span class="card-panel-title">CAMPANA</span>
      <div class="card-panel-text">Plantel Activo:</div>
      <div class="card-panel-num">
        <strong>{{objetoRRHH.datos[2].DOTACION}}</strong>
      </div>
      <div class="card-panel-text">Ausentes:</div>
      <div class="card-panel-num">
        <strong>-</strong>
      </div>
      <div class="card-panel-text">Presentes:</div>
      <div class="card-panel-num">
        <strong>-</strong>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CardRRHH",
  data() {
    return {};
  }
};
</script>


<style>
</style>