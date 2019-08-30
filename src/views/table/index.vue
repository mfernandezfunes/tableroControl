<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Cargando"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" prop="created_at" label="Fecha">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.FECCOBROUT }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Total Cobrado">
        <template v-slot="slot">{{ scope.TOTCOBROUT }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from "@/api/table";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
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
      getList().then(response => {
        this.list = response.COBRODIARIOOU.items;
        this.listLoading = false;
      });
    }
  }
};
</script>
