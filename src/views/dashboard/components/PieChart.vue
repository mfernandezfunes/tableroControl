<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          bottom: "10",
          data: ["Industries", "Technology", "Forex", "Gold", "Forecasts"]
        },
        series: [
          {
            name: "Presentismo",
            type: "pie",
            roseType: "radius",
            radius: [5, 100],
            center: ["1%", "1%"],
            data: [
              { value: 1, name: "San Juan" },
              { value: 127, name: "Belgrano" },
              { value: 79, name: "Campana" },
              { value: 113, name: "Bernal" }
            ],
            animationEasing: "cubicInOut",
            animationDuration: 1600
          }
        ]
      });
    }
  }
};
</script>
