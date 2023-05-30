<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        width="width"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        width="width"
      ></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量(KG)"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="价格(元)"
        width="80"
      ></el-table-column>
      <el-table-column prop="" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <HitButton
          title="下架"
            v-if="row.isSale == 0"
            type="success"
            icon="el-icon-bottom"
            siz="mini"
            @click="sale(row)"
          ></HitButton>
          <HitButton
            v-else
            title="上架"
            type="info"
            icon="el-icon-top"
            siz="mini"
            @click="cancel(row)"
          ></HitButton>
          <HitButton
          title="编辑"
            type="primary"
            icon="el-icon-edit"
            siz="mini"
            @click="edit"
          ></HitButton>
          <HitButton
          title="查看列表"
            type="info"
            icon="el-icon-info"
            siz="mini"
            @click="getSkuInfo(row)"
          ></HitButton>
          <HitButton title="删除" type="danger" icon="el-icon-delete" siz="mini"></HitButton>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-sixe="limit"
      layout="prev,pager,next,jumper,->,sizes,total"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizechange"
    >
    </el-pagination>
    <!-- 抽屉项目 -->
    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      size="45%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              v-for="(attr, index) in skuInfo.skuAttrValueList"
              :key="attr.id"
              style="margin-left: 10px"
              >{{ attr.attrId }}--{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="290px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" >
            </el-carousel-item>
          </el-carousel></el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      records: [],
      skuInfo: {}, //sku详情数据存储
      drawer: false,
    };
  },
  mounted() {
    // 获取sku列表数据的方法
    this.getSkuList();
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuLists(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleSizechange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    // 下架
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    edit() {
      this.$message("正在开发中");
    },
    // 获取sku详情的方法
    async getSkuInfo(row) {
      // 展示抽屉
      this.drawer = true;
      // 获取SKU详情数据
      let result = await this.$API.sku.reqskuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .el-carousel__item img{
    width:100%;
    height: 100%;
    background-size: cover;
    }
  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

  
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}

>>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background: purple;
    border-radius: 50%;
}
</style>