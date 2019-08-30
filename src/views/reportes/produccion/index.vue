<template>
  <div class="app-container">
    <div>
      <h1>Produccion</h1>
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

      <el-table-column align="center" prop="producto" label="Producto" sortable>
        <template slot-scope="scope">{{ scope.row.PRODUCTO }}</template>
      </el-table-column>

      <el-table-column align="center" prop="total" label="Total" sortable>
        <template slot-scope="scope">{{ formatearPeso(scope.row.PRODUCCIONAC) }}</template>
      </el-table-column>

      <el-table-column align="center" prop="unidad" label="Unidad de Medida">
        <template slot-scope="scope">{{ scope.row.UM }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import { MessageBox, Message } from "element-ui";
import { formatearPeso } from "@/utils/";

export default {
  data() {
    return {
      list: [],
      listLoading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatearPeso(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    fetchData() {
      this.listLoading = true;
      axios
        .get(process.env.VUE_APP_AS400_API + "WSPROMESP")
        .then(response => {
          let lista = response.data.PRODUCCIONACOU;
          for (const elemento of lista) {
            if (elemento.PRODUCTO != "") this.list.push(elemento);
          }
        })
        .catch(error => {
          //console.log("err" + error); // for debug
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
          sums[index] = "Cantidad Total";
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
