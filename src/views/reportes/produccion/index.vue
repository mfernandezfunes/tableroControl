<template>
  <div class="app-container">
    <div>
      <h1>Producción Mensual Acumulada</h1>
      <h3>Muestra por planta operativa el acumulado mensual en kilos de la producción de productos en papel. Para el caso del mes corriente recupera el acumulado a la fecha/hora de petición.</h3>
    </div>

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
            <el-button @click="imprimirDatos">{{ $t("btn.send-console") }}</el-button>
            <h3></h3>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <CardProduccion v-bind:datos="list" />

    <el-card class="box-card">
      <div>
        <el-table
          v-loading="listLoading"
          :data="list"
          :default-sort="{prop: 'planta', order: 'ascending'}"
          :summary-method="getSummaries"
          show-summary
          element-loading-text="Cargando aguarde..."
          border
          empty-text="No se han recuperado datos del servidor"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            align="center"
            prop="PLANTA"
            label="PLANTA"
            sortable
            :formatter="conFirstUp"
          ></el-table-column>
          <el-table-column align="center" prop="PRODUCTO" label="PRODUCTO" :formatter="conFirstUp"></el-table-column>
          <el-table-column align="center" prop="TOTAL" label="TOTAL" :formatter="conValor"></el-table-column>
          <el-table-column align="center" prop="UM" label="U/M" :formatter="conFirstUp"></el-table-column>
        </el-table>
      </div>
      {{ formatearPeso(sumaTotal) }}
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import { MessageBox, Message } from "element-ui";
import { formatearPeso } from "@/utils/";
import CardProduccion from "../../dashboard/components/CardProduccion";

export default {
  components: {
    CardProduccion
  },
  data() {
    return {
      objetoProduccion: { datos: [] },
      date: null,
      sumaTotal: 0,
      listLoading: false,
      periodo: null,
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
  created() {
    this.fetchData("");
    this.date = new Date();
    this.date.setDate(this.date.getDate() - 1);
    while (!this.isBusinessDay(this.date)) {
      this.date.setDate(this.date.getDate() - 1);
    }

    console.log(this.date); //date always between monday to friday
  },
  methods: {
    formatearPeso(valor) {
      return numeral(valor).format("0,0.00");
    },
    imprimirDatos() {
      console.log(this.list);
    },
    retornaSemana(fecha) {
      let dia = moment(fecha).day();
      return this.diaSemana[dia];
    },
    actualizarDatos() {
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
    fetchData(param) {
      this.listLoading = true;
      const ENDPOINT = "WSPROMESP";
      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${param}`)
        .then(response => {
          this.list = this.limpiarLista(response.data.PRODUCCION);
          this.sumaTotal = this.sumatoria(this.list);
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
    sumatoria(lista) {
      let sumaTotal = 0;
      for (const item of lista) {
        sumaTotal += item.TOTAL;
      }
      return sumaTotal;
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Total";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
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
        if (elemento.PRODUCTO != "") {
          nuevaLista.push(elemento);
        }
      }
      return nuevaLista;
    },
    isBusinessDay(date) {
      var day = date.getDay();
      if (day == 0 || day == 6) {
        return false;
      }
      return true;
    },
    conValor(row, column, cellValue, index) {
      return this.formatearPeso(cellValue);
    },
    conFirstUp(row, column, cellValue, index) {
      return this.toFirstUp(cellValue);
    },
    formatearPeso(valor) {
      return numeral(valor).format("0.0");
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