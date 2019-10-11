<template>
  <div class="app-container">
    <div>
      <h1>Cobranzas</h1>
      <h3>Muestra por día del mes consultado la sumatoria de los valores cobrados o a depositar en dicho día.</h3>

      <el-row shadow="always">
        <el-col :span="24">
          <div class="grid-content">
            <el-card class="box-card">
              <div class="tituloControles">{{ $t("msg.controls") }}</div>

              <el-select v-model="empresa" :placeholder="$t('form.select.company')">
                <el-option
                  v-for="item in empresaOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
              <el-select
                v-model="canalVenta"
                multiple
                disabled="true"
                collapse-tags
                style="margin-left: 20px;"
                :placeholder="$t('form.select.channel')"
              >
                <el-option
                  v-for="item in canalVentasOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-date-picker v-model="periodo" type="month" :placeholder="$t('form.select.month')"></el-date-picker>
              <el-button @click="actualizarDatos">{{ $t("btn.update") }}</el-button>
              <el-button @click="actualizarGrafico">{{ $t("btn.draw") }}</el-button>
              <el-button @click="limpiarGrafico">{{ $t("btn.clean-graph") }}</el-button>
              <el-button @click="imprimirDatos">{{ $t("btn.send-console") }}</el-button>
              <h3></h3>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div>
              <el-table
                v-loading="listLoading"
                :data="list"
                show-summary
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
                <el-table-column
                  align="center"
                  prop="FECHA"
                  :label="$t('tables.txt.date')"
                  :formatter="formatearFecha"
                ></el-table-column>
                <el-table-column align="center" prop="TOTAL" :label="$t('tables.txt.subtot')"></el-table-column>
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
numeral.locale("en");

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
      ],
      empresa: "1",
      empresaOptions: [
        {
          value: "1",
          label: "VALOT S.A.",
          disabled: false
        },
        {
          value: "2",
          label: "HIGIENE 3000 S.A.",
          disabled: true
        }
      ],
      canalVenta: [],
      canalVentasOptions: [
        {
          value: "1",
          label: "Institucionales Vendedores MoBiles",
          disabled: false
        },
        {
          value: "2",
          label: "Grandes Clientes del Interior",
          disabled: false
        },
        {
          value: "3",
          label: "Licitaciones",
          disabled: false
        },
        {
          value: "4",
          label: "Exportaciones",
          disabled: false
        },
        {
          value: "5",
          label: "Punto de Venta - Local Belgrano 1250",
          disabled: true
        },
        {
          value: "6",
          label: "Consumo Interno",
          disabled: true
        },
        {
          value: "7",
          label: "Institucionales CALL CENTER",
          disabled: true
        },
        {
          value: "8",
          label: "Institucionales San Juan",
          disabled: true
        },
        {
          value: "9",
          label: "Convertidores de Bobinas Industriales",
          disabled: true
        },
        {
          value: "10",
          label: "Bienes de Uso",
          disabled: true
        },
        {
          value: "11",
          label: "Personal",
          disabled: true
        },
        {
          value: "12",
          label: "Canjes",
          disabled: true
        },
        {
          value: "13",
          label: "La Bernalesa-PILB",
          disabled: true
        },
        {
          value: "14",
          label: "Gdes. Clientes del Interior Cuentas R9*",
          disabled: true
        },
        {
          value: "15",
          label: "PROMO VENTAS",
          disabled: true
        }
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
  created() {
    //this.fetchData();
  },
  methods: {
    imprimirDatos() {
      console.log(this.list);
    },
    retornaSemana(fecha) {
      let dia = moment(fecha).day();
      return this.diaSemana[dia];
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
    },
    formatearPeso(valor) {
      return numeral(valor).format("0.0");
    },
    conValor(row, column, cellValue, index) {
      return this.formatearPeso(cellValue);
    },
    formatearFecha(row, column, cellValue, index) {
      return cellValue.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
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
.tituloControles {
  line-height: 30px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 24px;
  margin-bottom: 5px;
}
.box-card {
  padding: 10px, 10px, 10px, 10px;
}
</style>