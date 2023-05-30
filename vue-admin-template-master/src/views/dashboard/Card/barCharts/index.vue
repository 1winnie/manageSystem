<template>
    <div class="charts" ref="charts"></div>
  </template>
  
  <script>
  import * as echarts from "echarts";
  export default {
    name: "barChart",
    mounted() {
      // 初始化echarts实例
      let lineCharts = echarts.init(this.$refs.charts);
      lineCharts.setOption({
        xAxis: {
          // 隐藏x
          show: false,
          type: "category",
          
        },
        yAxis: {
          show: false,
        },
        // 系列
        series:[
            {
                type:'bar',
                data:[30,40,10,50,80,12,34,12,34,56,23,46],
                color:'pink'
              }
        ],
        // 布局调试
        grid:{
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        },
        tooltip:{

        }
      });
    },
  };
  </script>
  
  <style scoped>
    .charts{
      width: 100%;
      height: 100%;
    }
  </style>