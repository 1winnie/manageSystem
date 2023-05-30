<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="box">
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let mycharts = echarts.init(this.$refs.charts);
    mycharts.setOption({
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          title: {
            show:true,
            text: "Search Engine",
            subtext: "1048",
            left:'center',
            top:'center'
          },
          name: "Access From",
          type: "pie",
          radius: ["60%", "80%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },

          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    // 绑定事件
    mycharts.on("mouseover", (params) => {
      // 获取鼠标移上去的那条数据
      const { name, value } = params.data;
      // 重新设置标题
      mycharts.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scope>
.header {
  border-bottom: 1px solid #eee;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box .charts {
  width: 100%;
  height: 200px;
}
.box {
  width: 100%;
  height: 239px;
}
</style>