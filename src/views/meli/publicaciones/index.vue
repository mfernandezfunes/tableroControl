<template>
  <div class="app-container">
    <div>
      <h1>Mercado Libre - Publicaciones</h1>
      <h3></h3>
    </div>
    <el-card class="box-card">
      <el-table
        :data="tableData"
        v-loading="listLoading"
        stripe
        :element-loading-text="$t('msg.loading')"
        :empty-text="$t('msg.no-data')"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-tabs type="border-card">
              <el-tab-pane>
                <span slot="label">Descripcion</span>
                <el-row :gutter="20">
                  <el-col :span="4">
                    <p>Categoria: {{ props.row.category_id }}</p>
                    <p>Fecha Creación: {{ props.row.category_id }}</p>
                    <p>Fecha Actualización: {{ props.row.category_id }}</p>
                    <p>{{ getDescription(props.row.id) }}</p>
                  </el-col>
                  <el-col :span="4"></el-col>
                  <el-col :span="8"></el-col>
                  <el-col :span="8"></el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="Envio">
                <el-row :gutter="20">
                  <el-col :span="4"></el-col>

                  <el-col :span="4">
                    <div class="grid-content bg-purple"></div>
                  </el-col>

                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <p>
                        <strong>Dirección:</strong>
                      </p>
                      <p>state_id: {{ props.row.address.state_id }}</p>
                      <p>state_name: {{ props.row.address.state_name }}</p>
                      <p>city_id: {{ props.row.address.city_id }}</p>
                      <p>city_name: {{ props.row.address.city_name }}</p>
                    </div>
                  </el-col>

                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <p>
                        <strong>Envío:</strong>
                      </p>
                      <p>
                        Envío Gratis:
                        <el-switch v-model="props.row.shipping.free_shipping"></el-switch>
                      </p>
                      <p>
                        Pickup en tienda:
                        <el-switch v-model="props.row.shipping.store_pick_up"></el-switch>
                      </p>
                      <p>Tipo de Logística: {{ props.row.shipping.logistic_type}}</p>
                      <p>dataObject: {{ props.row.shipping}}</p>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="Cargos">
                <el-row :gutter="20">
                  <el-col :span="4">
                    <p>Comisión x Venta: {{ props.row.installments.quantity}}%</p>
                    <p>Monto Comisionado: $ {{ props.row.installments.amount}}</p>
                    <p>Rate: {{ props.row.installments.rate}}</p>
                    <p>Id Moneda: {{ props.row.installments.currency_id}}</p>
                  </el-col>
                  <el-col :span="4"></el-col>
                  <el-col :span="8"></el-col>
                  <el-col :span="8"></el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="Fotos">
                <div class="grid-content bg-purple">
                  <el-carousel height="120px">
                    <el-carousel-item v-for="item in 4" :key="item">
                      <h3 class="small">{{ item }}</h3>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>

        <el-table-column label="Foto" width="120">
          <template slot-scope="props">
            <el-image style="width: 110px; height: 110px" :src="props.row.thumbnail"></el-image>
          </template>
        </el-table-column>

        <el-table-column label="Publicacion" prop="title">
          <template slot-scope="props">
            <p>{{ props.row.id }}</p>
            <p>
              <el-link :href="props.row.permalink" target="_blank">
                <strong>{{ props.row.title }}</strong>
              </el-link>
            </p>
          </template>
        </el-table-column>

        <el-table-column label="Precio" prop="price" width="120">
          <template slot-scope="props">
            <el-tag>{{"$ "+props.row.price}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Vendidos" prop="sold_quantity" width="120"></el-table-column>
        <el-table-column label="Disponibles" prop="available_quantity" width="120"></el-table-column>
        <el-table-column label="MP" prop="accepts_mercadopago" width="120"></el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="drawer = true">Editar</el-button>
            <el-button size="mini" type="info" @click="handleDelete(scope.$index, scope.row)">Pausar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer
      title="Detalle de Publicacion"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <span>gfgdfgdfg!</span>
    </el-drawer>

    <el-pagination :page-size="10" :pager-count="10" layout="prev, pager, next" :total="total"></el-pagination>
  </div>
</template>


<script>
import axios from "axios";
import numeral from "numeral";
import moment from "moment";
import { Message, DatePicker } from "element-ui";
import { isUndefined } from "util";

export default {
  data() {
    return {
      total: 0,
      tableData: [],
      listLoading: false,
      drawer: false,
      direction: "rtl"
    };
  },
  created() {
    this.traerData();
  },
  computed: {},
  methods: {
    traerData() {
      this.listLoading = true;
      this.tableData = [];

      let url = `${process.env.VUE_APP_ML_API}search?seller_id=${process.env.VUE_APP_ML_SELLER}&${process.env.VUE_APP_ACCESS_TOKEN}`;

      axios
        .get(url)
        .then(response => {
          this.tableData = response.data.results;
          this.total = response.data.paging.total;
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
    getDescription(item_id) {
      let url = `${process.env.VUE_APP_MELI_API}items/${item_id}/description?${process.env.VUE_APP_ACCESS_TOKEN}`;
      //https://api.mercadolibre.com/items/MLA640678202/description
      axios
        .get(url)
        .then(response => {
          //objDescripcion = {};
          let objDescripcion = response.data;
          return objDescripcion;
          //console.log(objDescripcion);
        })
        .catch(error => {
          Message({
            message: "SE HA DETECTADO UN ERROR: " + error.message,
            type: "error",
            duration: 5 * 1000
          });
        })
        .finally(() => {
          //return this.objDescripcion;
        });
    },
    getVisitas() {
      this.listLoading = true;
      this.tableData = [];

      let url = `${process.env.VUE_APP_ML_API}search?seller_id=${process.env.VUE_APP_ML_SELLER}${process.env.VUE_APP_ACCESS_TOKEN}`;

      console.log(url);

      axios
        .get(url)
        .then(response => {
          this.tableData = response.data.results;
          console.log(response.data.results);
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
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleClose(done) {
      this.$confirm("Are you sure you want to close this?")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    done() {
      console.log("CLOSED");
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

.box-card {
  padding: 10px, 10px, 10px, 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 120px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>