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
      element-loading-text="Cargando aguarde..."
      border
      empty-text="Sin Datos obtenidos"
      stripe
      show-summary
      :summary-method="getSumatoria"
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" prop="planta" label="Planta" sortable>
        <template slot-scope="scope">
          <span>{{ toFirstUp(scope.row.PLANTA) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="producto" label="Producto">
        <template slot-scope="scope">{{ toFirstUp(scope.row.PRODUCTO) }}</template>
      </el-table-column>

      <el-table-column align="center" prop="total" label="Total">
        <template slot-scope="scope">{{ scope.row.PRODUCCIONAC }}</template>
      </el-table-column>

      <el-table-column align="center" prop="unidad" label="U/M">
        <template slot-scope="scope">{{ toFirstUp(scope.row.UM) }}</template>
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
      for (const item of lista) {
        sumaTotal += item.PRODUCCIONAC;
      }
      return sumaTotal;
    },
    convertToNumberAndClean(lista) {
      const nuevaLista = [];
      for (const elemento of lista) {
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
          }, 0); // + " kg"
        } else {
          sums[index] = "N/A";
        }
      });
      //console.log(sums);
      return sums;
    }
  }
};
</script>
