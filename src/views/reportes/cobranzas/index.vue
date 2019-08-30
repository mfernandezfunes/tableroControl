<template>
  <div class="app-container">
    <div>
      <h1>Cobranzas</h1>
    </div>
    <div class="block">
      <span class="demonstration">Mes</span>
      <el-date-picker v-model="periodo" type="month" placeholder="Seleccione un mes"></el-date-picker>
      <el-button @click="actualizarDatos">Actualizar</el-button>
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
        <el-table-column align="center" prop="fecha" label="Fecha" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.FECCOBROUT }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="importe" label="Total Cobrado" sortable>
          <template slot-scope="scope">$ {{ scope.row.TOTCOBROUT }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
        series: [
          {
            name: "Cobrado $",
            data: [120244.5, 455455.1, 545778] // sample data
          }
        ],
        yAxis: {
          title: {
            text: "$ Pesos"
          }
        },
        xAxis: {
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
    formatearPeso(value) {
      if (value) value = parseFloat(value);
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    actualizarDatos() {
      if (this.periodo !== null) {
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
    fetchData(periodo) {
      const ENDPOINT = "WSCOBDIAP";
      this.listLoading = true;
      let fechas = "";
      if (!isUndefined(periodo)) fechas = periodo;

      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${fechas}`)
        .then(response => {
          this.list = response.data.COBRODIARIOOU;
          //console.log(this.list);
        })
        .catch(error => {
          //console.log("err" + error); // for debu
          Message({
            message: "SE HA DETECTADO UN ERROR: " + error.message,
            type: "error",
            duration: 5 * 1000
          });
          //return Promise.reject(error);
        })
        .finally(() => (this.listLoading = false));
    },
    getSumatoria(param) {
      const { columns, data } = param;
      const sums = [];
      console.log(param);
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Total";
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
    getPromedio(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Promedio";
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
    }
  }
};
</script>

<style>
.is-selected {
  color: #1989fa;
}
</style>