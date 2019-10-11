<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-panel-title">
          <strong>RRHH</strong>
          <el-tooltip
            effect="light"
            content="La información mostrada corresponde a la carga diaria realizada por RRHH en AS400"
            placement="bottom"
          >
            <span style="color:red">
              <i class="el-icon-warning-outline" type="danger"></i>
            </span>
          </el-tooltip>
        </span>

        <router-link :to="{name: 'RRHH'}">
          <el-button
            style="float: right; padding: 3px 3"
            size="medium"
            icon="el-icon-arrow-right"
          >Ir</el-button>
        </router-link>
      </div>
      <div class="card-panel-title">BELGRANO</div>
      <div>
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="card-panel-text">Plantel:</div>
            <div class="card-panel-num">
              <span style="color:blue">
                <strong>{{datos.datos[1].DOTACION}}</strong>
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-panel-text">Ausentes:</div>
            <div class="card-panel-num">
              <span style="color:red">
                <strong>{{datos.datos[1].AUSENTES}}</strong>
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-panel-text">Presentes:</div>
            <div class="card-panel-num">
              <span style="color:green">
                <strong>{{datos.datos[1].DOTACION-datos.datos[1].AUSENTES}}</strong>
              </span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="card-panel-title">CAMPANA</div>
      <div>
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="card-panel-text">Plantel:</div>
            <div class="card-panel-num">
              <span style="color:blue">
                <strong>{{datos.datos[2].DOTACION}}</strong>
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-panel-text">Ausentes:</div>
            <div class="card-panel-num">
              <span style="color:red">
                <strong>{{datos.datos[2].AUSENTES}}</strong>
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-panel-text">Presentes:</div>
            <div class="card-panel-num">
              <span style="color:green">
                <strong>{{datos.datos[2].DOTACION-datos.datos[2].AUSENTES}}</strong>
              </span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="card-panel-title">BERNAL</div>
      <div>
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="card-panel-text">Plantel:</div>
            <div class="card-panel-num">
              <span style="color:blue">
                <strong>{{datos.datos[3].DOTACION}}</strong>
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-panel-text">Ausentes:</div>
            <div class="card-panel-num">
              <span style="color:red">
                <strong>{{datos.datos[3].AUSENTES}}</strong>
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-panel-text">Presentes:</div>
            <div class="card-panel-num">
              <span style="color:green">
                <strong>{{datos.datos[3].DOTACION-datos.datos[3].AUSENTES}}</strong>
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CardRRHH",
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