<template>
  <div class="app-container">
    <div>
      <h1>Recursos Humanos</h1>
      <h3>Muestra por planta operativa la cantidad de empleados activos a la fecha de petición</h3>
    </div>
    <el-card class="box-card">
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
    </el-card>
    <el-card class="box-card">
      <div class="Success">PERIODO {{periodo}}</div>
    </el-card>
    <el-card class="box-card">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Cargando"
        :summary-method="getSumatoria"
        border
        fit
        show-summary
        empty-text="No se han recuperado datos del servidor"
        stripe
        highlight-current-row
        style="width: 50%"
      >
        <el-table-column align="center" prop="planta" label="PLANTA">
          <template slot-scope="scope">
            <span>{{ toFirstUp(scope.row.PLANTA) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="dotacion" label="DOTACION">
          <template slot-scope="scope">{{ scope.row.DOTACION }}</template>
        </el-table-column>

        <el-table-column align="center" prop="dotacion" label="AUSENTES">
          <template slot-scope="scope">{{ scope.row.AUSENTES }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import { MessageBox, Message } from "element-ui";

export default {
  data() {
    return {
      list: [],
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
          disabled: false
        }
      ],
      listLoading: false
    };
  },
  created() {
    this.fetchData('');
  },
  methods: {
    fetchData(parametros) {
      const ENDPOINT = "WSDOTACTP";
      this.listLoading = true;
      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${parametros}`)
        .then(response => {
          this.list = response.data.RRHH;
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
    actualizarDatos() {
      if (this.periodo !== null) {
        const year = this.periodo.getFullYear();
        const month = this.periodo.getMonth() + 1;
        const empresa = this.empresa;
        //const parametros = `?empresa=${empresa}&annio=${year}&mes=${month}`;
        const parametros = "";
        this.fetchData(parametros);
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
    }
  }
};
</script>
