<template>
  <div class="app-container">
    <div>
      <h1>Ventas</h1>
      <h3>Muestra por día del mes consultado la sumatoria de los valores facturados.</h3>
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
        element-loading-text="Cargando"
        border
        fit
        stripe
        highlight-current-row
        style="width: 50%"
      >
        <el-table-column align="center" prop="fecha" label="Fecha" sortable>
          <template slot-scope="scope">
            <span>{{ formatearFecha(scope.row.fecfactout) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="importe" label="Total Vendido" sortable>
          <template slot-scope="scope">$ {{ formatearPeso(scope.row.totfactout) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import { MessageBox, Message } from "element-ui";
import { isUndefined } from "util";

export default {
  data() {
    return {
      list: [],
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
          text: "Ventas"
        },
        series: [
          {
            name: "Ventas $",
            data: [] // sample data
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
    formatearPeso(valor) {
      return numeral(valor).format("0,0.00");
    },
    formatearFecha(fecha) {
      let fechaFormateada = "";
      if (fecha !== "")
        fechaFormateada = fecha.replace(
          /^(\d{4})-(\d{2})-(\d{2})$/g,
          "$3/$2/$1"
        );
      return fechaFormateada;
    },
    actualizarDatos() {
      if (this.periodo !== null) {
        let year = this.periodo.getFullYear();
        let month = this.periodo.getMonth() + 1;
        let para = `?AnoFacturacion=${year}&MesFacturacion=${month}`;
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
      const ENDPOINT = "WSFACDIAP";
      this.listLoading = true;
      let fechas = "";
      if (!isUndefined(periodo)) fechas = periodo;

      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${fechas}`)
        .then(response => {
          let lista = response.data.FACTUDIARIOOU;
          for (const elemento of lista) {
            if (elemento.PRODUCTO != "") this.list.push(elemento);
          }
        })
        .catch(error => {
          Message({
            message: "SE HA DETECTADO UN ERROR: " + error.message,
            type: "error",
            duration: 5 * 1000
          });
        })
        .finally(() => (this.listLoading = false));
    }
  }
};
</script>