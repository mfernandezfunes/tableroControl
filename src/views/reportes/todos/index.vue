<template>
  <div class="app-container">
    <div>
      <h1>Resúmen Período Actual: {{objetoAnalisis.periodo}}</h1>
      <el-date-picker v-model="periodo" type="month" placeholder="Seleccione un mes"></el-date-picker>
      <el-button @click="actualizarDatos" disabled>{{ $t("btn.update") }}</el-button>
      <h3></h3>
    </div>

    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-panel-title">
                <strong>VENTAS</strong>
              </span>
              <router-link :to="{name: 'Ventas'}">
                <el-button
                  style="float: right; padding: 3px 3"
                  size="medium"
                  icon="el-icon-arrow-right"
                >Ir</el-button>
              </router-link>
            </div>
            <div class="card-panel-text">Dia hábil anterior:</div>
            <div class="card-panel-num">
              <strong>$ -</strong>
            </div>
            <div class="card-panel-text">Total Acumulado:</div>
            <div class="card-panel-num">
              <strong>${{formatearPeso(objetoAnalisis.sumatoria.ventas)}}</strong>
            </div>
            <div class="card-panel-text">Promedio:</div>
            <div class="card-panel-num">
              <strong>${{formatearPeso(objetoAnalisis.promedios.ventas)}}</strong>
            </div>
            <div class="card-panel-text">(Calculo en base a {{objetoAnalisis.cantidad.ventas}} días)</div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-panel-title">
                <strong>COBRANZAS</strong>
              </span>
              <router-link :to="{name: 'Cobranzas'}">
                <el-button
                  style="float: right; padding: 3px 3"
                  size="medium"
                  icon="el-icon-arrow-right"
                >Ir</el-button>
              </router-link>
            </div>
            <div class="card-panel-text">Dia hábil anterior:</div>
            <div class="card-panel-num">
              <strong>$ -</strong>
            </div>
            <div class="card-panel-text">Total Acumulado:</div>
            <div class="card-panel-num">
              <strong>${{formatearPeso(objetoAnalisis.sumatoria.cobranzas)}}</strong>
            </div>
            <div class="card-panel-text">Promedio:</div>
            <div class="card-panel-num">
              <strong>${{formatearPeso(objetoAnalisis.promedios.cobranzas)}}</strong>
            </div>
            <div
              class="card-panel-text"
            >(Calculo en base a {{objetoAnalisis.cantidad.cobranzas}} días)</div>
            <div></div>

            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="Resumen diario" name="1">
                <el-table
                  :data="objetoAnalisis.datos"
                  border
                  height="400"
                  style="width: 100%; magin-top: 20px"
                >
                  <el-table-column prop="fecha" label="Fecha"></el-table-column>
                  <el-table-column prop="formatearPeso(cobranzas)" label="Valor"></el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-panel-title">
                <strong>PRODUCCION</strong>
              </span>
              <router-link :to="{name: 'Produccion'}">
                <el-button
                  style="float: right; padding: 3px 3"
                  size="medium"
                  icon="el-icon-arrow-right"
                >Ir</el-button>
              </router-link>
            </div>
            <span class="card-panel-title">BERNAL</span>
            <div class="card-panel-text">Total Acumulado:</div>
            <div class="card-panel-num">
              <strong>- Kg</strong>
            </div>
            <span class="card-panel-title">CAMPANA</span>
            <div class="card-panel-text">Total Acumulado:</div>
            <div class="card-panel-num">
              <strong>- Kg</strong>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-panel-title">
                <strong>RRHH</strong>
              </span>
              <router-link :to="{name: 'RRHH'}">
                <el-button
                  style="float: right; padding: 3px 3"
                  size="medium"
                  icon="el-icon-arrow-right"
                >Ir</el-button>
              </router-link>
            </div>
            <span class="card-panel-title">BELGRANO</span>
            <div class="card-panel-text">Plantel Activo:</div>
            <div class="card-panel-num">
              <strong>127</strong>
            </div>
            <div class="card-panel-text">Ausentes:</div>
            <div class="card-panel-num">
              <strong>-</strong>
            </div>
            <div class="card-panel-text">Presentes:</div>
            <div class="card-panel-num">
              <strong>-</strong>
            </div>
            <span class="card-panel-title">BERNAL</span>
            <div class="card-panel-text">Plantel Activo:</div>
            <div class="card-panel-num">
              <strong>113</strong>
            </div>
            <div class="card-panel-text">Ausentes:</div>
            <div class="card-panel-num">
              <strong>-</strong>
            </div>
            <div class="card-panel-text">Presentes:</div>
            <div class="card-panel-num">
              <strong>-</strong>
            </div>
            <span class="card-panel-title">CAMPANA</span>
            <div class="card-panel-text">Plantel Activo:</div>
            <div class="card-panel-num">
              <strong>79</strong>
            </div>
            <div class="card-panel-text">Ausentes:</div>
            <div class="card-panel-num">
              <strong>-</strong>
            </div>
            <div class="card-panel-text">Presentes:</div>
            <div class="card-panel-num">
              <strong>-</strong>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!--div v-for="i in 30">
      <el-card class="box-card">{{listaCompleta[i-1]}}</el-card>
    </div-->
  </div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import moment from "moment";
import cardGroup from "./components/cardGroup";
import { Message, DatePicker } from "element-ui";
import { isUndefined } from "util";

export default {
  data() {
    return {
      objetoAnalisis: {
        periodo: "",
        cantidad: { ventas: 0, cobranzas: 0 },
        promedios: { ventas: 0.0, cobranzas: 0.0 },
        sumatoria: { ventas: 0.0, cobranzas: 0.0 },
        datos: []
      },
      listaCobranzas: [],
      listaVentas: [],
      greaterTen: [],
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
      ]
    };
  },
  async created() {
    await this.getDatos();
    this.armarSabana();

    console.log(this.listaCompleta);
  },
  methods: {
    formatearPeso(valor) {
      return numeral(valor).format("0,0.00");
    },
    formatearFecha(fecha) {
      return fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
    },
    armarSabana() {
      let objDato = { fecha: "", cobranzas: 0, ventas: 0 };

      for (let i = 0; i < this.listaCobranzas.length; i++) {
        let fecha = new Date(this.listaCobranzas[i].FECHA);
        objDato.fecha = fecha.toISOString();
        //objDato.dia = this.retornaSemana(this.listaCobranzas[i].FECHA);
        objDato.cobranzas = this.listaCobranzas[i].TOTAL;
        objDato.ventas = this.listaVentas[i].TOTAL;
        this.listaCompleta.push(objDato);
        this.objetoAnalisis.datos.push(objDato);
        objDato = { fecha: "", cobranzas: 0, ventas: 0 };
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
          let i = 0;
          let sumatoria = 0;
          for (const item of this.listaCobranzas) {
            if (item.TOTAL != 0) {
              sumatoria += item.TOTAL;
              i++;
            }
          }
          this.objetoAnalisis.promedios.cobranzas = sumatoria / parseFloat(i);
          this.objetoAnalisis.sumatoria.cobranzas = sumatoria;
          this.objetoAnalisis.cantidad.cobranzas = parseInt(i);
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
          let i = 0;
          let sumatoria = 0;
          for (const item of this.listaVentas) {
            if (item.TOTAL != 0) {
              sumatoria += item.TOTAL;
              i++;
            }
          }
          this.objetoAnalisis.promedios.ventas = sumatoria / parseFloat(i);
          this.objetoAnalisis.sumatoria.ventas = sumatoria;
          this.objetoAnalisis.cantidad.ventas = parseInt(i);
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
      this.objetoAnalisis.periodo = `${year}-${month}`;
      await this.getCobranzas(params);
      await this.getVentas(params);
    },
    limpiarLista(lista) {
      let nuevaLista = [];
      for (let elemento of lista) {
        if (elemento.FECHA != "") {
          nuevaLista.push(elemento);
        }
      }
      return nuevaLista;
    },
    actualizarDatos() {
      return 0;
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
  line-height: 40px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 24px;
  margin-bottom: 5px;
}
.card-panel-num {
  font-size: 24px;
  margin-bottom: 12px;
}
.card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;
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