<template>
  <div>
    <div class="header">
        <span class="search-header">{{ title }}</span>
        <svg t="1674909223211" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1052" width="26" height="26"><path d="M510.12 961.63c-60.5 0-119.19-11.85-174.46-35.23-53.37-22.57-101.3-54.89-142.45-96.04s-73.47-89.08-96.04-142.45c-23.38-55.27-35.23-113.96-35.23-174.46 0-60.5 11.85-119.19 35.23-174.46 22.57-53.37 54.89-101.3 96.04-142.45s89.08-73.47 142.45-96.04c55.27-23.38 113.96-35.23 174.46-35.23s119.19 11.85 174.46 35.23c53.37 22.57 101.3 54.89 142.45 96.04S900.5 285.63 923.07 339c23.38 55.27 35.23 113.96 35.23 174.46 0 60.49-11.85 119.19-35.23 174.46-22.57 53.37-54.89 101.3-96.04 142.45s-89.08 73.47-142.45 96.04c-55.27 23.37-113.97 35.22-174.46 35.22z m0-858.04c-226 0-409.86 183.86-409.86 409.86 0 225.66 184.2 409.86 409.86 409.86 226 0 409.86-183.86 409.86-409.86 0-225.65-184.2-409.86-409.86-409.86z" p-id="1053" fill="#cdcdcd"></path><path d="M485.67 581.91l-16.96-166.32c-0.07-0.64-0.1-1.28-0.1-1.93v-73.25c0-10.49 8.51-19 19-19h44.78c10.49 0 19 8.51 19 19v73.27c0 0.64-0.03 1.27-0.1 1.9l-16.73 166.3c-0.98 9.71-9.15 17.1-18.91 17.1h-11.07c-9.75 0-17.92-7.38-18.91-17.07z" p-id="1054" fill="#cdcdcd"></path><path d="M488.92 628.75h42.16c10.49 0 19 8.51 19 19v37.46c0 10.49-8.51 19-19 19h-42.16c-10.49 0-19-8.51-19-19v-37.46c0-10.5 8.5-19 19-19z" fill="#cdcdcd" p-id="1055"></path></svg>
    </div>
    <div class="main">
        <span class="main-title">122</span>
        <span class="main-content">22</span>
        <svg t="1675186949701" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3956" width="16" height="16"><path d="M239.616 634.88 507.904 346.112 776.192 634.88Z" fill="#d81e06" p-id="3957"></path></svg>
        <svg t="1675187062351" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4895" width="5" height="5"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" fill="#1afa29" p-id="4896"></path></svg>
    </div>
    <div class="footer">
        <div class="charts" ref="charts"></div>
        
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name:'lineCharts',
    props:['title'],
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
      series: [
        {
          type: "line",
          data: [10, 2, 33, 44, 12, 88,33,87,65,44],
          smooth: true,
          // 拐点的样式设置
          itemStyle: {
            opacity: 0,
          },
          //线条样式
          lineStyle: {
            color: "skyblue",
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "skyblue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          //
        },
      ],
      // 布局调试
      grid:{
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
    .header{
        display: flex;
        align-items: center;
    }
    .search-header{
        margin-right: 20px}
        .main-title{
            margin-right: 30px;
        }
        .main-content{
            margin-right: 10px;
        }
        .charts{
            width: 100%;
            height: 50px;
        }
</style>