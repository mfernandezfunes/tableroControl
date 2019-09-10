
<template>
  <div class="app-container">
    <div>
      <h1>Riesgo País</h1>
    </div>
    <el-card class="box-card">
      <highcharts :options="chartOptions" />
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";

export default {
  data() {
    return {
      list: null,
      error: null,
      chartOptions: {
        title: {
          text: "Riesgo País Anual"
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
          text: "Fuente: EMBI, elaborado por JP Morgan"
        },
        yAxis: {
          title: {
            text: "Puntos"
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
      axios
        .get(process.env.VUE_APP_RIESGO_API)
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
        .finally(() => (this.listLoading = false));
    },
    getSeries() {
      let resultados = [];
      resultados = this.list;
      let fechas = [],
        serie1 = [];
      for (let item of resultados) {
        fechas.push(item["0"]);
        serie1.push(item["1"]);
      }
      fechas.shift();
      serie1.shift();

      this.chartOptions.xAxis.categories.push(...fechas);

      this.chartOptions.series.push(
        JSON.parse(
          `{ "name": "Riesgo País", "type": "area","data": [ ${serie1} ], "color": "#bbb" }`
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
