<template>
  <div class="app-container">
    <div>
      <h1>Recursos Humanos</h1>
      <h3>Muestra por planta operativa la cantidad de empleados activos a la fecha de petición</h3>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Cargando"
      :summary-method="getSumatoria"
      border
      fit
      stripe
      highlight-current-row
      style="width: 50%"
    >
      <el-table-column align="center" prop="planta" label="Planta">
        <template slot-scope="scope">
          <span>{{ scope.row.PLANTA }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="dotacion" label="Dotacion Actual">
        <template slot-scope="scope">{{ scope.row.DOTACION }}</template>
      </el-table-column>

      <el-table-column align="center" prop="dotacion" label="Ausentes">
        <template slot-scope="scope">{{ scope.row.AUSENTES }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import { MessageBox, Message } from "element-ui";

export default {
  data() {
    return {
      list: null,
      listLoading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      axios
        .get(process.env.VUE_APP_AS400_API + "WSDOTACTP")
        .then(response => {
          this.list = response.data.DOTACIONACTOU;
          console.log(this.list);
        })
        .catch(error => {
          //console.log("err" + error); // for debug
          Message({
            message: "SE HA DETECTADO UN ERROR: " + error.message,
            type: "error",
            duration: 5 * 1000
          });
          //return Promise.reject(error);
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