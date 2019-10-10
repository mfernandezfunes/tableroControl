<template>
  <div class="app-container">
    <div>
      <h1>Resúmen Período Actual: {{objetoAnalisis.periodo}}</h1>

      <el-row shadow="always">
        <el-col :span="24">
          <div class="grid-content">
            <el-card class="box-card">
              <div class="tituloControles">{{ $t("msg.controls") }}</div>
              <el-select v-model="empresa" placeholder="Seleccione la Empresa">
                <el-option
                  v-for="item in empresaOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
              <el-date-picker v-model="periodo" type="month" placeholder="Seleccione un mes"></el-date-picker>
              <el-button @click="actualizarDatos">{{ $t("btn.update") }}</el-button>
              <h3></h3>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <CardVentas v-bind:datos="objetoVentas" />
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <CardCobranzas v-bind:datos="objetoCobranzas" />
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <CardProduccion v-bind:datos="objetoProduccion" />
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <CardRRHH v-bind:datos="objetoRRHH" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import moment from "moment";
import { Message, DatePicker } from "element-ui";
import { isUndefined } from "util";

import CardVentas from "./components/CardVentas";
import CardCobranzas from "./components/CardCobranzas";
import CardProduccion from "./components/CardProduccion";
import CardRRHH from "./components/CardRRHH";

export default {
  components: {
    CardVentas,
    CardProduccion,
    CardCobranzas,
    CardRRHH
  },
  data() {
    return {
      objetoAnalisis: {
        periodo: "",
        cantidad: { ventas: 0, cobranzas: 0 },
        promedios: { ventas: 0.0, cobranzas: 0.0 },
        sumatoria: { ventas: 0.0, cobranzas: 0.0 },
        datos: []
      },
      objetoProduccion: { datos: [] },
      objetoRRHH: { datos: [] },
      objetoCobranzas: {
        periodo: "",
        cantidad: 0,
        promedio: 0.0,
        sumatoria: 0.0,
        datos: []
      },
      objetoVentas: {
        periodo: "",
        cantidad: 0,
        promedio: 0.0,
        sumatoria: 0.0,
        datos: []
      },
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
      empresaOptions: [
        {
          value: "1",
          label: "VALOT S.A.",
          disabled: false
        },
        {
          value: "2",
          label: "HIGIENE 3000 S.A.",
          disabled: false
        }
      ],
      empresa: "1"
    };
  },
  async created() {
    this.inicializar();
  },
  methods: {
    actualizar2Datos() {
      if (this.periodo !== null) {
        this.list = null;
        let year = this.periodo.getFullYear();
        let month = this.periodo.getMonth() + 1;
        let empresa = this.empresa;
        let para = `?empresa=${empresa}&annio=${year}&mes=${month}`;

        this.fetchData(para);

        Message({
          message: `Se solicito la actualizacion de datos para el mes ${month}/${year}`,
          type: "info",
          duration: 5 * 1000
        });
        this.list = [];
      } else {
        Message({
          message: "Debe seleccionar un rango de fechas",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    async actualizarDatos() {
      let fecha = new Date();
      let year = fecha.getFullYear();
      let month = fecha.getMonth() + 1;
      let empresa = this.empresa;
      let params = `?empresa=${empresa}&annio=${year}&mes=${month}`;
      this.periodo = `${year}-${month}`;

      await this.getProduccion(params);
      await this.getRRHH(params);
      await this.getVentas(params);
      await this.getCobranzas(params);
      this.armarSabana();
    },
    formatearFecha(fecha) {
      return fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
    },
    toFirstUp(cadena) {
      if (typeof cadena == "string") {
        var pieces = cadena.split(" ");
        for (let i = 0; i < pieces.length; i++) {
          let j = pieces[i].charAt(0).toUpperCase();
          pieces[i] = j + pieces[i].substr(1).toLowerCase();
        }
        return pieces.join(" ");
      }
    },
    async inicializar() {
      //await this.getDatos();
      await this.getProduccion();
      await this.getRRHH();
      await this.getVentas();
      await this.getCobranzas();
    },
    async getRRHH(params) {
      this.listLoading = true;
      const ENDPOINT = "WSDOTACTP";
      let parametros = "";
      if (!isUndefined(params)) parametros = params;
      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${parametros}`)
        .then(response => {
          //this.objetoRRHH = response.data.RRHH;
          let items = response.data.RRHH;

          for (const item of items) {
            this.objetoRRHH.datos.push(item);
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
    },
    async getCobranzas(params) {
      const ENDPOINT = "WSCOBDIAP";
      let parametros = "";
      if (!isUndefined(params)) parametros = params;

      await axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${parametros}`)
        .then(response => {
          let listaCobranzas = response.data.COBRANZAS;
          let i = 0;
          let sumatoria = 0;
          for (const item of listaCobranzas) {
            if (item.TOTAL != 0) {
              sumatoria += item.TOTAL;
              i++;
            }
          }
          this.objetoCobranzas.datos = listaCobranzas;
          this.objetoCobranzas.promedio = sumatoria / parseFloat(i);
          this.objetoCobranzas.sumatoria = sumatoria;
          this.objetoCobranzas.periodo = this.periodo;
          this.objetoCobranzas.cantidad = parseInt(i);
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
      let parametros = "";
      if (!isUndefined(params)) parametros = params;

      await axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${parametros}`)
        .then(response => {
          let listaVentas = response.data.FACTURACION;
          let i = 0;
          let sumatoria = 0;
          for (const item of listaVentas) {
            if (item.TOTAL != 0) {
              sumatoria += item.TOTAL;
              i++;
            }
          }
          this.objetoVentas.datos = listaVentas;
          this.objetoVentas.promedio = sumatoria / parseFloat(i);
          this.objetoVentas.sumatoria = sumatoria;
          this.objetoVentas.periodo = this.periodo;
          this.objetoVentas.cantidad = parseInt(i);
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
    async getProduccion(params) {
      this.listLoading = true;
      const ENDPOINT = "WSPROMESP";
      let parametros = "";
      if (!isUndefined(params)) parametros = params;
      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${parametros}`)
        .then(response => {
          let items = response.data.PRODUCCION;
          for (const item of items) {
            this.objetoProduccion.datos.push(item);
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
.card-panel-text {
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 2px;
}
.card-panel-title {
  line-height: 36px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 24px;
  margin-bottom: 0px;
}
.card-panel-num {
  font-size: 22px;
  margin-bottom: 12px;
}
.card-panel-description {
  float: right;
  font-weight: bold;
  margin: 20px;
  margin-left: 0px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.tituloControles {
  line-height: 30px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 24px;
  margin-bottom: 5px;
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