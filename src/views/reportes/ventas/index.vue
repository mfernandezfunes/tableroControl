<template>
  <div class="app-container">
    <div>
      <h1>Ventas</h1>
      <h3>Muestra por día del mes consultado la sumatoria de los valores facturados.</h3>
    </div>
    <el-card class="box-card">
      <div class="block">
        <el-select v-model="empresa" placeholder="Seleccione la empresa">
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
          collapse-tags
          style="margin-left: 20px;"
          placeholder="Seleccione el canal"
        >
          <el-option
            v-for="item in canalVentasOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-date-picker v-model="periodo" type="month" placeholder="Seleccione un mes" />
        <el-button @click="actualizarDatos">Actualizar</el-button>
        <el-button @click="actualizarGrafico">Graficar</el-button>
        <el-button @click="limpiarGrafico">Limpiar Grafico</el-button>
        <el-button @click="imprimirDatos">Imprimir Datos en Consola</el-button>
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
                :default-sort="{prop: 'fecha', order: 'ascending'}"
                :summary-method="getSumatoria"
                show-summary
                element-loading-text="Cargando"
                empty-text="No se han recuperado datos del servidor"
                border
                fit
                stripe
                highlight-current-row
                height="400"
              >
                <el-table-column align="center" prop="fecha" label="FECHA">
                  <template slot-scope="scope">
                    <span>{{ formatearFecha(scope.row.FECFACTOUT) }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" prop="importe" label="MONTO">
                  <template slot-scope="scope">$ {{ formatearPeso(scope.row.TOTFACTOUT) }}</template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card">
            <div>
              <highcharts :options="chartOptions" />
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
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
      listLoading: false,
      periodo: null,
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
          text: "Histórico de Facturación"
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
        yAxis: {
          title: {
            text: "$ Pesos"
          }
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
    formatearPeso(valor) {
      return numeral(valor).format("0,0.00");
    },
    formatearFecha(fecha) {
      let fechaFormateada = "";
      if (fecha !== "") {
        fechaFormateada = fecha.replace(
          /^(\d{4})-(\d{2})-(\d{2})$/g,
          "$3/$2/$1"
        );
      }
      return fechaFormateada;
    },
    limpiarGrafico() {
      this.chartOptions.series = [];
    },
    actualizarDatos() {
      if (this.periodo !== null) {
        const year = this.periodo.getFullYear();
        const month = this.periodo.getMonth() + 1;
        const empresa = this.empresa;
        const para = `?CodigoEmpresa=${empresa}&AnoFacturacion=${year}&MesFacturacion=${month}`;
        this.fetchData(para);
        Message({
          message: `Se solicito la actualizacion de datos para el mes ${month}/${year}`,
          type: "success",
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
    actualizarGrafico() {
      if (this.periodo != null) {
        let fechas = [],
          valores = [];
        for (let dia of this.list) {
          fechas.push(dia.FECFACTOUT);
          valores.push(dia.TOTFACTOUT);
        }
        this.chartOptions.series.push({
          name: `${this.periodo.getMonth() + 1}/${this.periodo.getFullYear()}`,
          data: valores
        });
        console.log(valores);

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
    fetchData(periodo) {
      const ENDPOINT = "WSFACDIAP";
      this.listLoading = true;
      let fechas = "";
      if (!isUndefined(periodo)) fechas = periodo;

      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${fechas}`)
        .then(response => {
          let lista = response.data.FACTUDIARIOOU;
          this.list = this.convertToNumberAndClean(lista);
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
          sums[index] = "TOTAL";
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
    convertToNumberAndClean(lista) {
      let nuevaLista = [];
      console.log(lista);
      for (let elemento of lista) {
        elemento.TOTFACTOUT = parseFloat(elemento.TOTFACTOUT.replace(",", "."));
        nuevaLista.push(elemento);
      }
      return nuevaLista;
    }
  }
};
</script>
<style>
.item {
  padding: 18px 0;
}

.box-card {
  padding: 18px 0;
  weight: 50%;
}
</style>