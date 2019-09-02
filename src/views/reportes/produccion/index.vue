<template>
  <div class="app-container">
    <div>
      <h1>Producción Mensual Acumulada</h1>
      <h3>Muestra por planta operativa el acumulado mensual en kilos de la producción de productos en papel. Para el caso del mes corriente recupera el acumulado a la fecha/hora de petición.</h3>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      :default-sort="{prop: 'planta', order: 'ascending'}"
      :summary-method="getSumatoria"
      element-loading-text="Cargando"
      border
      fit
      stripe
      show-summary
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" prop="planta" label="Planta" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.PLANTA }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="producto" label="Producto">
        <template slot-scope="scope">{{ scope.row.PRODUCTO }}</template>
      </el-table-column>

      <el-table-column align="center" prop="total" label="Total">
        <template slot-scope="scope">{{ formatearPeso(scope.row.PRODUCCIONAC) }}</template>
      </el-table-column>

      <el-table-column align="center" prop="unidad" label="U/M">
        <template slot-scope="scope">{{ scope.row.UM }}</template>
      </el-table-column>
    </el-table>
    {{ formatearPeso(sumaTotal) }}
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
      listLoading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatearPeso(valor) {
      return numeral(valor).format("0,0.00");
    },
    fetchData() {
      this.listLoading = true;
      axios
        .get(process.env.VUE_APP_AS400_API + "WSPROMESP")
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
      for (let item of lista) {
        sumaTotal += item.PRODUCCIONAC;
      }
      return sumaTotal;
    },
    convertToNumberAndClean(lista) {
      let nuevaLista = [];
      for (let elemento of lista) {
        elemento.PRODUCCIONAC = parseFloat(
          elemento.PRODUCCIONAC.replace(",", ".")
        );
        if (elemento.PRODUCTO != "") nuevaLista.push(elemento);
      }
      return nuevaLista;
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
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0); // + " kg"
        } else {
          sums[index] = "N/A";
        }
      });
      console.log(sums);
      return sums;
    }
  }
};
</script>
