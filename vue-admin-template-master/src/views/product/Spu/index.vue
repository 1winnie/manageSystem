<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示SPU列表结构 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            label="spu名称"
            prop="spuName"
            width="width"
          ></el-table-column>
          <el-table-column
            label="spu描述"
            prop="description"
            width="width"
          ></el-table-column>
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <HitButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></HitButton>
              <HitButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="editSpu(row)"
              ></HitButton>
              <HitButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></HitButton>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HitButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></HitButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-sixe="limit"
          layout="prev,pager,next,jumper,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizechange"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
      <el-dialog :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
        <el-table :data="skuList" style="width: 100%" border v-loading="loading">
          <el-table-column
            property="skuName"
            label="名称"
            width="width"
          ></el-table-column>
          <el-table-column
            property="price"
            label="价格"
            width="width"
          ></el-table-column>
          <el-table-column
            property="weight"
            label="重量"
            width="width"
          ></el-table-column>
          <el-table-column label="默认图片" width="width"  >
              <template slot-scope="{row,$index}">
                  <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
              </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, //分页器当前页码
      limit: 3, //每一页需要展示的数据
      records: [],
      total: 0, //分页器一共要展示数据的条数
      isShowTable: true,
      scene: 0, //0:展示SPU列表结构,1:添加或修改spu,2:添加sku
      dialogTableVisible:false,//控制查看按钮对话框的显示与隐藏
      spu:{},
      skuList:[],
      loading:true
    };
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 代表三级分类的id有了
        // 发请求获取平台属性
        this.getSpuList();
      }
    },
    // 获取spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      // 获取当前页的数据
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 点击分页器页码按钮的回调
    // handleCurrentchange(page){
    //   this.page = page;
    //   this.getSpuList();
    // },
    // 当分页器的某一页展示数据条数变化的回调
    handleSizechange(limit) {
      // 修改参数
      this.limit = limit;
      // 再次发请求
      this.getSpuList();
    },
    addSpu() {
      //  切换场景
      this.scene = 1;
      //  通知子组件spuform发请求--两个
      this.$refs.spu.addSpuData(this.category3Id);
    },
    editSpu(row) {
      this.scene = 1;
      //  获取子组件spuform子组件的所以属性
      // 在父组件当中可以通过$refs获取子组件数据
      this.$refs.spu.initSpuData(row);
    },
    // SpuForm自定义事件回调
    changeScene({ scene, flag }) {
      //切换场景
      this.scene = scene;
      // 子组件通知父组件切换场景，需要再次获取SPU列表的数据进行展示
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        // 逆序添加的，返回第一页即可
        this.getSpuList();
      }
    },
    // 删除按钮
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加Sku
    addSku(row) {
      this.scene = 2;
      // 通知子组件发三个请求
      this.$refs.sku.getDate(this.category1Id, this.category2Id, row);
    },
    // 切换场景
    changeScenes(scene) {
      this.scene = scene;
    },
    // 查看sku列表
   async handler(row){
      this.dialogTableVisible = true;
      this.spu = row;
      //获取sku列表的数据进行展示
      let result = await this.$API.sku.reqSkuList(row.id);
      if(result.code == 200){
        this.skuList = result.data;
        // 让loading隐藏
        this.loading = false;
      }
    },
    // 关闭对话框的回调
    close(done){
      // loading 属性再次变为真
      this.loading = true;
      // 清除sku列表的数据
      this.skuList = [];
      // 关闭对话框
      done();
    }
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>