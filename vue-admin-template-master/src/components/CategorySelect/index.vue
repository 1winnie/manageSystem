<template>
  <div>
    <!-- inline:代表行内表单（一行可以放置多个表单元素） -->
    <el-form :inline="true"  class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!-- el-select双向绑定，v-model收集到的是value -->
        <el-select  placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in List1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select  placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in List2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select  placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in List3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['show'],
  data(){
    return {
      // 一级分类数据
      List1:[],
      // 二级分类数据
      List2:[],
      // 三级分类数据
      List3:[],

      // 收集相应的一级二级三级id
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:'',

      }
    }
  },
  mounted(){
    // 获取一级分类数据的方法
    this.getCategory1List();
  },
  methods:{
    // 获取一级分类数据的方法
    async getCategory1List(){
     let result = await this.$API.attr.reqCategory1List();
     if(result.code == 200){
        this.List1 = result.data;
      }
    },
    // 一级分类的select事件回调（当一级分类的option发生变化的时候获取相应的二级分类的数据）
    async handler1(){
      // 清除数据
      this.List2 = [];
      this.List3 = [];
      this.cForm.category2Id = '';
      this.cForm.category3Id = '';
      // 解构出一级分类的id
      const {category1Id} = this.cForm;
      this.$emit('getCategoryId',{categoryId:category1Id,level:1})
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if(result.code == 200){
        this.List2 = result.data;
      }
    },
    // 二级分类的select事件回调（当二级分类的option发生变化的时候获取相应的二级分类的数据）
    async handler2(){
      // 清除数据
      this.List3 = [];
      this.cForm.category3Id = '';
      // 解构出一级分类的id
      const {category2Id} = this.cForm;
      this.$emit('getCategoryId',{categoryId:category2Id,level:2})
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if(result.code == 200){
        this.List3 = result.data;
      }
    },
    // 三级分类事件回调
    handler3(){
      const {category3Id} = this.cForm;
      this.$emit('getCategoryId',{categoryId:category3Id,level:3})
    }
  }
};
</script>

<style>
</style>