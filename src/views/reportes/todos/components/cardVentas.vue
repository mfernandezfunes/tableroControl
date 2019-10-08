<template>
  <div class="app-container">
    
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>VENTAS</span>
          <el-button style="float: right; padding: 3px 0" type="text">ir a Ventas</el-button>
        </div>
        <div>
          Total Acumulado:
          <strong>${{formatearPeso(objetoAnalisis.sumatoria.ventas)}}</strong>
        </div>
        <div>
          Promedio:
          <strong>${{formatearPeso(objetoAnalisis.promedios.ventas)}}</strong>
        </div>
        <div>En base a: {{objetoAnalisis.cantidad.ventas}} dias</div>
      </el-card>
    </div>
</template>

<script>
import numeral from "numeral";
import moment from "moment";

export default {
  data() {
    return{
      
    }
  }
  },
 created() {
    
  },
  methods: {
    
  }
};
</script>

<style>
.is-selected {
  color: #1989fa;
}

.item {
  padding: 18px 0;
}

.box-card {
  padding: 10px, 10px, 10px, 10px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>