<template>
  <div class="app-container">
    <div>
      <h1>Producción Mensual Acumulada</h1>
      <h3>Muestra por planta operativa el acumulado mensual en kilos de la producción de productos en papel. Para el caso del mes corriente recupera el acumulado a la fecha/hora de petición.</h3>
    </div>
    <el-card class="box-card">
      <div class="block">
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
        <el-button @click="actualizarDatos">Actualizar</el-button>
        <el-button @click="imprimirDatos">Imprimir datos</el-button>
      </div>
    </el-card>

    <el-card class="box-card">
      <div>
        <el-table
          v-loading="listLoading"
          :data="list"
          :default-sort="{prop: 'planta', order: 'ascending'}"
          element-loading-text="Cargando aguarde..."
          border
          empty-text="No se han recuperado datos del servidor"
          stripe
          show-summary
          :summary-method="getSumatoria"
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column align="center" prop="planta" label="PLANTA" sortable>
            <template slot-scope="scope">
              <span>{{ toFirstUp(scope.row.PLANTA) }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="producto" label="PRODUCTO">
            <template slot-scope="scope">{{ toFirstUp(scope.row.PRODUCTO) }}</template>
          </el-table-column>

          <el-table-column align="center" prop="total" label="TOTAL">
            <template slot-scope="scope">{{ formatearPeso(scope.row.PRODUCCIONAC) }}</template>
          </el-table-column>

          <el-table-column align="center" prop="unidad" label="U/M">
            <template slot-scope="scope">{{ toFirstUp(scope.row.UM) }}</template>
          </el-table-column>
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

export default {
  data() {
    return {
      list: [],
      sumaTotal: 0,
      listLoading: true,
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
  },
  methods: {
    formatearPeso(valor) {
      return numeral(valor).format("0,0.00");
    },
    imprimirDatos() {
      console.log(this.list);
    },
    actualizarDatos() {
      if (this.periodo !== null) {
        this.list = null;
        let year = this.periodo.getFullYear();
        let month = this.periodo.getMonth() + 1;
        let empresa = this.empresa;
        let para = `?CodigoEmpresa=${empresa}&AnoProduccion=${year}&MesProduccion=${month}`;

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
    fetchData(param) {
      this.listLoading = true;
      const ENDPOINT = "WSPROMESP";
      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${param}`)
        .then(response => {
          let lista = response.data.PRODUCCIONACOU;
          this.list = this.convertToNumberAndClean(lista);
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
        sumaTotal += item.PRODUCCIONAC;
      }
      return sumaTotal;
    },
    convertToNumberAndClean(lista) {
      const nuevaLista = [];
      for (let elemento of lista) {
        elemento.PRODUCCIONAC = parseFloat(
          elemento.PRODUCCIONAC.replace(",", ".")
        );
        if (elemento.PRODUCTO != "") nuevaLista.push(elemento);
      }
      return nuevaLista;
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
    getSumatoria(param) {
      var { columns, data } = param;
      var sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "TOTAL";
          return;
        }
        var values = data.map(item => Number(item[column.property]));
        console.log();
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            var value = Number(curr);
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
    }
  }
};
</script>
