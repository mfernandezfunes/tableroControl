
<template>
  <div class="app-container">
    <div>
      <h1>Dolar Anual</h1>
    </div>
    <el-card class="box-card">
      <highcharts :options="chartOptions" />
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import { Message, Loading } from "element-ui";

export default {
  data() {
    return {
      list: null,
      error: null,
      fullscreenLoading: false,

      chartOptions: {
        title: {
          text: "Cotización Anual"
        },
        legend: {
          shadow: true,
          verticalAlign: "bottom"
        },
        tooltip: {
          shared: true,
          followPointer: true
        },
        plotOptions: {
          column: {
            grouping: true,
            shadow: false,
            borderWidth: 0
          }
        },
        credits: {
          enabled: false
        },
        series: [],
        subtitle: {
          text: "Fuente: Ambito Financiero"
        },
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
    fetchData: function() {
      const loading = this.$loading({
        lock: true,
        text: "Cargando..",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      axios
        .get(process.env.VUE_APP_DOLAR_API)
        .then(response => {
          this.list = response.data;
          this.getSeries();
        })
        .catch(error => {
          Message({
            message: "SE HA DETECTADO UN ERROR: " + error.message,
            type: "error",
            duration: 5 * 1000
          });
          return Promise.reject(error);
        })
        .finally(() => loading.close());
    },
    getSeries() {
      let resultados = [];
      resultados = this.list;
      let fechas = [],
        serie1 = [],
        serie2 = [];
      for (let item of resultados) {
        fechas.push(item["0"]);
        serie1.push(item["1"]);
        serie2.push(item["2"]);
      }
      fechas.shift();
      serie1.shift();
      serie2.shift();

      this.chartOptions.xAxis.categories.push(...fechas);

      this.chartOptions.series.push(
        JSON.parse(
          `{ "name": "Dólar Oficial", "data": [ ${serie1} ], "color": "#00FF00" }`
        )
      );
      this.chartOptions.series.push(
        JSON.parse(
          `{ "name": "Dólar Informal", "data": [ ${serie2} ], "color": "#FF0000" }`
        )
      );
    }
  }
};
</script>
<style>
.is-selected {
  color: #1989fa;
}
</style>
