<template>
  <div class="app-container">
    <div>
      <h1>Cobranzas</h1>
      <h3>Muestra por día del mes consultado la sumatoria de los valores cobrados o a depositar en dicho día.</h3>
    </div>
    <div class="block">
      <span class="demonstration">Mes</span>
      <el-date-picker v-model="periodo" type="month" placeholder="Seleccione un mes"></el-date-picker>
      <el-button @click="actualizarDatos">Actualizar</el-button>
      <el-button @click="actualizarGrafico">Actualizar Grafico</el-button>
      <el-button @click="limpiarGrafico">Limpiar Grafico</el-button>
      <el-button @click="imprimirDatos">Imprimir Datos en Consola</el-button>
    </div>
    <highcharts :options="chartOptions"></highcharts>
    <div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :default-sort="{prop: 'fecha', order: 'ascending'}"
        :summary-method="getSumatoria"
        show-summary
        element-loading-text="Cargando"
        border
        fit
        stripe
        highlight-current-row
        style="width: 50%"
      >
        <el-table-column align="center" prop="fecha" label="Fecha">
          <template slot-scope="scope">
            <span>{{ formatearFecha(scope.row.FECCOBROUT) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="importe" label="Total Cobrado">
          <template slot-scope="scope">$ {{ formatearPeso(scope.row.TOTCOBROUT) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import { Message, DatePicker } from "element-ui";
import { isUndefined } from "util";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      periodo: null,
      pickerOptions: {
        shortcuts: [
          {
            text: "Ult. Semana",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Ult. mes",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Ult. 3 meses",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      chartOptions: {
        title: {
          text: "Histórico de Cobranzas"
        },
        series: [],
        yAxis: {
          title: {
            text: "$ Pesos"
          }
        },
        xAxis: {
          categories: [],
          title: {
            text: "Fecha"
          }
        }
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    imprimirDatos() {
      console.log(this.list);
    },
    formatearPeso(valor) {
      return numeral(valor).format("0,0.00");
    },
    formatearFecha(fecha) {
      return fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
    },
    actualizarDatos() {
      if (this.periodo !== null) {
        this.list = null;
        let year = this.periodo.getFullYear();
        let month = this.periodo.getMonth() + 1;
        let para = `?AnoCobranza=${year}&MesCobranza=${month}`;
        this.fetchData(para);

        Message({
          message: `Se solicito la actualizacion de datos para el mes ${month}/${year}`,
          type: "success",
          duration: 3 * 1000
        });
        this.list = [];
      } else {
        Message({
          message: "Debe seleccionar un rango de fechas",
          type: "error",
          duration: 3 * 1000
        });
      }
    },
    actualizarGrafico() {
      let fechas = [],
        valores = [];
      for (let dia of this.list) {
        fechas.push(dia.FECCOBROUT);
        valores.push(dia.TOTCOBROUT);
      }
      this.chartOptions.series.push({
        name: `${this.periodo.getMonth() + 1}/${this.periodo.getFullYear()}`,
        data: valores
      });
      console.log(valores);

      Message({
        message: `Se solicito la actualizacion del ploteo del Gráfico`,
        type: "success",
        duration: 3 * 1000
      });
    },
    limpiarGrafico() {
      for (let iterator of this.chartOptions.series) {
        this.chartOptions.series = [];
      }
    },
    fetchData(periodo) {
      const ENDPOINT = "WSCOBDIAP";
      this.listLoading = true;
      this.list = null;
      let fechas = "";
      if (!isUndefined(periodo)) fechas = periodo;

      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${fechas}`)
        .then(response => {
          let lista = response.data.COBRODIARIOOU;
          this.list = this.convertToNumberAndClean(lista);
          //console.log(this.list);
        })
        .catch(error => {
          Message({
            message: "SE HA DETECTADO UN ERROR: " + error.message,
            type: "error",
            duration: 5 * 1000
          });
        })
        .finally(() => (this.listLoading = false));
    },
    getSumatoria(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "TOTAL";
          return;
        }
        const values = data.map(item => Number(item[column.property]));

        if (!values.every(value => isNaN(value))) {
          sums[index] =
            "$ " +
            values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
        } else {
          sums[index] = "N/A";
        }
      });
      return sums;
    },
    convertToNumberAndClean(lista) {
      let nuevaLista = [];
      for (let elemento of lista) {
        elemento.TOTCOBROUT = parseFloat(elemento.TOTCOBROUT.replace(",", "."));
        if (elemento.PRODUCTO != "") nuevaLista.push(elemento);
      }
      return nuevaLista;
    }
  }
};
</script>

<style>
.is-selected {
  color: #1989fa;
}
</style>