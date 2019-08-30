
<template>
  <div class="app-container">
    <div>
      <h1>Dolar Histórico</h1>
    </div>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      periodo: null,
      error: null,
      chartOptions: {
        title: {
          text: "Cotización Histórica"
        },
        series: [
          {
            name: "Dolar Oficial",
            data: [42.5, 58.1, 62] // sample data
          }
        ],
        subtitle: {
          text: "Fuente: Ambito Financiero"
        },
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
    this.list = this.convertir2(this.list);
  },
  methods: {
    convertirJson: function() {
      let headers = lista.shift();
      let result = lista.map(a =>
        headers.reduce((r, k, i) => Object.assign(r, { [k]: a[i] }), {})
      );
      return JSON.stringify(result);
    },
    convertir2: function(lista) {
      let headers = lista.shift();
      result = lista.map(function(a) {
        var object = {};
        headers.forEach(function(k, i) {
          object[k] = a[i];
        });
        return object;
      });

      console.log(JSON.stringify(result));
      console.log(result);
    },
    fetchData: function() {
      this.listLoading = true;
      axios
        .get(process.env.VUE_APP_DOLAR_API)
        .then(response => {
          this.list = response.data;
          console.log(response.data);
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
    }
  }
};
</script>
<style>
.is-selected {
  color: #1989fa;
}
</style>