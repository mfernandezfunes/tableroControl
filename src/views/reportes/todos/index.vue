<template>
  <div class="app-container">
    <div>
      <h1>Paneles</h1>
      <h3></h3>
    </div>
    <div v-for="i in 30">
      <el-card class="box-card">{{listaCobranzas[i-1]}}</el-card>
      <el-card class="box-card">{{listaVentas[i-1]}}</el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import moment from "moment";
import { Message, DatePicker } from "element-ui";
import { isUndefined } from "util";

export default {
  data() {
    return {
      listaCobranzas: [],
      listaVentas: [],
      listaCompleta: [],
      listLoading: false,
      empresa: 1,
      periodo: null,
      diaSemana: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
      ],
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
        xAxis: {
          categories: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31
          ],
          title: {
            text: "Fecha"
          }
        }
      }
    };
  },
  async created() {
    this.getDatos();
  },
  methods: {
    formatearPeso(valor) {
      return numeral(valor).format("0,0.00");
    },
    retornaSemana(fecha) {
      let dia = moment(fecha).day();
      return this.diaSemana[dia];
    },
    formatearFecha(fecha) {
      return fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
    },
    limpiarGrafico() {
      this.chartOptions.series = [];
    },
    armarSabana() {
      let objDato = { fecha: "", dia: "", cobranzas: "", ventas: "" };

      for (let i = 0; i < this.listaCobranzas.length; i++) {
        objDato.fecha = this.listaCobranzas[i].FECHA;
        objDato.dia = this.retornaSemana(this.listaCobranzas[i].FECHA);
        objDato.cobranzas = this.listaCobranzas[i].TOTAL;

        objDato.ventas = this.listaVentas[i].TOTAL;
        console.log(i);
        
        this.listaCompleta.push(objDato);
      }
    },
    async getCobranzas(params) {
      const ENDPOINT = "WSCOBDIAP";

      this.listLoading = true;
      this.listaCobranzas = [];
      let parametros = "";

      if (!isUndefined(params)) parametros = params;
      await axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${parametros}`)
        .then(response => {
          this.listaCobranzas = this.limpiarLista(response.data.COBRANZAS);
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
    async getVentas(params) {
      const ENDPOINT = "WSFACDIAP";

      this.listLoading = true;
      this.listaVentas = [];
      let parametros = "";

      if (!isUndefined(params)) parametros = params;
      await axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${parametros}`)
        .then(response => {
          this.listaVentas = response.data.FACTURACION;
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
    async getDatos() {
      let fecha = new Date();
      let year = fecha.getFullYear();
      let month = fecha.getMonth() + 1;
      let empresa = this.empresa;
      let params = `?empresa=${empresa}&annio=${year}&mes=${month}`;

      await this.getCobranzas(params);
      await this.getVentas(params);
      this.armarSabana();
      console.log(this.listaCobranzas);
      console.log(this.listaVentas);
      console.log(this.listaCompleta);
    },
    limpiarLista(lista) {
      let nuevaLista = [];
      for (let elemento of lista) {
        if (elemento.FECHA != "") {
          nuevaLista.push(elemento);
        }
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

.item {
  padding: 18px 0;
}

.box-card {
  padding: 10px, 10px, 10px, 10px;
}
</style>