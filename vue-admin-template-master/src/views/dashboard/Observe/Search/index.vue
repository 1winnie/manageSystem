<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>

        <el-dropdown size="mini">
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <lineCharts title="搜索用户数"></lineCharts>
        </el-col>
        <el-col :span="12">
          <lineCharts title="人均搜索次数"></lineCharts>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="排名" width="80" type="index">
        </el-table-column>
        <el-table-column label="搜索关键字" width="180"> </el-table-column>
        <el-table-column label="用户数" sortable> </el-table-column>
        <el-table-column label="周涨幅" sortable> </el-table-column>
      </el-table>
      <div>
        <el-pagination layout="prev, pager, next" :total="1000" class="pagination">
        </el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
import lineCharts from "./lineCharts";
export default {
  name: "Search",
  data() {
    return {
      tableData: [{}],
    };
  },
  components: {
    lineCharts,
  },
};
</script>

<style scope>
.search-header {
  display: flex;
  justify-content:space-between;
}
.header {
  border-bottom: 1px solid #eee;
  padding: 5px 0;
}
.pagination{
  float: right;
  height: 50px;
  margin-top: 20px;
}
</style>