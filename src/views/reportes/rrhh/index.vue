<template>
  <div class="app-container">
    <div>
      <h1>Recursos Humanos</h1>
      <h3>Muestra por planta operativa la cantidad de empleados activos a la fecha de petición</h3>
    </div>

    <el-row shadow="always">
      <el-col :span="24">
        <div class="grid-content">
          <el-card class="box-card">
            <div class="tituloControles">{{ $t("msg.controls") }}</div>

            <el-select v-model="empresa" placeholder="Seleccione la Empresa" disabled>
              <el-option
                v-for="item in empresaOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
            <el-date-picker v-model="periodo" type="month" placeholder="Seleccione un mes" disabled></el-date-picker>
            <el-button @click="actualizarDatos" disabled>{{ $t("btn.update") }}</el-button>

            <h3></h3>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-card class="box-card">
      <div class="Success">PERIODO: ACTUAL {{ }}</div>
    </el-card>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Cargando"
            :summary-method="getSummaries"
            border
            fit
            show-summary
            empty-text="No se han recuperado datos del servidor"
            stripe
            highlight-current-row
            style="width: 100%"
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
        </el-col>
        <el-col :span="10">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import { MessageBox, Message } from "element-ui";
import PieChart from "@/views/dashboard/components/PieChart";

export default {
  components: {
    PieChart
  },
  data() {
    return {
      list: [],
      periodo: "",
      empresa: "1",
      empresaOptions: [
        {
          value: "1",
          label: "VALOT S.A.",
          disabled: true
        },
        {
          value: "2",
          label: "HIGIENE 3000 S.A.",
          disabled: true
        }
      ],
      listLoading: false
    };
  },
  created() {
    this.inicializar("");
  },
  methods: {
    async inicializar(param) {
      await this.fetchData(param);
      await this.procesarDatos(this.list);
    },
    async fetchData(param) {
      this.listLoading = true;
      const ENDPOINT = "WSDOTACTP";
      axios
        .get(`${process.env.VUE_APP_AS400_API}${ENDPOINT}${param}`)
        .then(response => {
          this.list = response.data.RRHH;
          //console.log("Proceso 1 - OK");
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
    async procesarDatos(lista) {
      return new Promise(resolve => {
        setTimeout(() => resolve("I did something"), 3000);
        console.log("Proceso 2 - OK");
        console.log(lista);
      });
    },
    actualizarDatos() {
      if (this.periodo !== null) {
        let year = this.periodo.getFullYear();
        let month = this.periodo.getMonth() + 1;
        let empresa = this.empresa;
        //const parametros = `?empresa=${empresa}&annio=${year}&mes=${month}`;
        let para = "";
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
          type: "info",
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
        console.log(values);
        if (values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            console.log("Pre: " + Number(prev) + " Cur: " + Number(curr));
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
<style>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
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
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
</style>