<template>
  <div class="app-container">
    <div>
      <h1>Mercado Libre VENTAS</h1>
      <h3>Muestra por día del mes consultado la sumatoria de los valores cobrados o a depositar en dicho día.</h3>
    </div>
    <el-card class="box-card">
      <div class="grid-content bg-purple">{{ $t("msg.controls") }}</div>

      <div class="block">
        <el-select v-model="empresa" :placeholder="$t('form.select.company')">
          <el-option
            v-for="item in empresaOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          ></el-option>
        </el-select>

        <el-date-picker v-model="periodo" type="month" :placeholder="$t('form.select.month')"></el-date-picker>
        <el-button @click="actualizarDatos">{{ $t("btn.update") }}</el-button>
        <el-button @click="actualizarGrafico">{{ $t("btn.draw") }}</el-button>
        <el-button @click="limpiarGrafico">{{ $t("btn.clean-graph") }}</el-button>
        <el-button @click="imprimirDatos">{{ $t("btn.send-console") }}</el-button>
      </div>
    </el-card>

    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div>
              <el-table
                v-loading="listLoading"
                :data="list"
                show-summary
                :summary-method="getSumatoria"
                :element-loading-text="$t('msg.loading')"
                :empty-text="$t('msg.no-data')"
                border
                stripe
                fit
                highlight-current-row
              >
                <el-table-column align="center" prop="weekDay" :label="$t('tables.txt.weekDay')">
                  <template slot-scope="scope">
                    <span>{{ retornaSemana(scope.row.FECHA) }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" prop="fecha" :label="$t('tables.txt.date')">
                  <template slot-scope="scope">
                    <span>{{ formatearFecha(scope.row.FECHA) }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" prop="importe" :label="$t('tables.txt.subtot')">
                  <template slot-scope="scope">$ {{ formatearPeso(scope.row.TOTAL) }}</template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <div>
            <el-card class="box-card">
              <div>
                <highcharts :options="chartOptions"></highcharts>
              </div>
            </el-card>
          </div>
        </div>
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

export default {
  data() {
    return {
      list: [],
      listLoading: false,
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
  created() {
    //this.fetchData();
    // https://api.mercadolibre.com/orders/search?seller=205254255&access_token=APP_USR-4011635735897252-070520-f8c887f6654e655bf263795d4d92681a-205254255
    url: `${process.env.VUE_APP_MELI_API}orders/search?seller_id=${process.env.VUE_APP_ML_SELLER}${process.env.VUE_APP_ACCESS_TOKEN}`;
  },
  methods: {
    imprimirDatos() {
      console.log(this.list);
    },
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
    actualizarDatos() {
      if (this.periodo !== null) {
        this.list = [];
        let year = this.periodo.getFullYear();
        let month = this.periodo.getMonth() + 1;
        let empresa = this.empresa;
        let hoy = new Date();
        if (
          year > hoy.getFullYear() ||
          (year >= hoy.getFullYear() && month > hoy.getMonth() + 1)
        ) {
          Message({
            message:
              "El mes seleccionado no debe ser posterior a la fecha actual",
            type: "error",
            duration: 5 * 1000
          });
        } else {
          let para = `?annio=${year}&mes=${month}`;
          this.fetchData(para);
          Message({
            message: `Se solicito la actualizacion de datos para el mes ${month}/${year}`,
            type: "info",
            duration: 5 * 1000
          });
          this.list = [];
        }
      } else {
        Message({
          message: "Debe seleccionar un rango de fechas",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    actualizarGrafico() {
      if (this.periodo != null) {
        let fechas = [],
          valores = [];
        for (let item of this.list) {
          fechas.push(item.FECHA);
          valores.push(item.TOTAL);
        }
        this.chartOptions.series.push({
          name: `${this.periodo.getMonth() + 1}/${this.periodo.getFullYear()}`,
          data: valores
        });

        Message({
          message: `Se solicito la actualizacion del ploteo del Gráfico`,
          type: "success",
          duration: 5 * 1000
        });
      } else {
        Message({
          message: "Debe seleccionar un rango de fechas y presionar Actualizar",
          type: "info",
          duration: 5 * 1000
        });
      }
    },
    limpiarGrafico() {
      this.chartOptions.series = [];
    },
    fetchData(periodo) {
      const ENDPOINT = "WSCOBDIAP";
      this.listLoading = true;
      this.list = [];
      let fechas = "";
      if (!isUndefined(periodo)) fechas = periodo;
      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${fechas}`)
        .then(response => {
          this.list = this.limpiarLista(response.data.COBRANZAS);
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
          sums[index] = "Total";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          console.log(values);

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