<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
       <el-table style="width: 100%" border :data="attrList">
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="attrName"
          label="属性名称"
          width="150"
        ></el-table-column>
        <el-table-column prop="prop" label="属性列表" width="width">
          <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" style="margin:0px 10px">{{ attrValue.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{row,$index}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
       </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名" >
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width:100%;margin:20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里结构需要用到span与input相互切换 -->
                <el-input :ref="$index" v-model="row.valueName" placeholder="请输入属性名称" size="mini" v-if="row.flag"
                 @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
                <span v-if="!row.flag" @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
               <el-button  slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  // data中的属性是响应书数据，vue可以监测到
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接收平台属性
      attrList: [],
      // 控制table表格显示与隐藏
      isShowTable: true,
      // 收集新增属性or修改属性名称
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          // {
          //   attrId: 0,//属性的id
          //   valueName:'',//属性值
          // },
        ],
        categoryId: 0, //三级分类id
        categoryLevel: 3, //因为服务器也需要区分是几级id
      },
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
        this.getAttrList();
      }
    },
    // 获取平台属性的数据
    // 当用户确定了三级分类时，获取数据在平台进行展示
    async getAttrList() {
      // 获取分类的ID
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );

      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值回调
    addAttrValue() {
      //向属性值数组里面添加元素的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有属性值基础上新增新的属性值，需要把已有的属性的id带上
        // 对于添加时，没有id属性，则为undefined。
        valueName: "",
        flag: true, //给每一个属性值添加flag，用户切换查看模式与编辑模式，好处：每一个属性值可以控制自己的模式切换
        // 当前flag属性是响应式数据
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false;
      // 清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          // {
          //   attrId: 0,//属性的id
          //   valueName:'',//属性值
          // },
        ],
        categoryId: this.category3Id, //三级分类id
        categoryLevel: 3, //因为服务器也需要区分是几级id
      };
    },
    // 修改某一个属性
    updateAttr(row) {
      // 显示与隐藏
      this.isShowTable = false;
      // 将选中的属性赋值给attrInfo
      // 由于数据结构当中存在对象里面有数据，数组里面有对象，因此需要使用深拷贝解决这类问题
      this.attrInfo = cloneDeep(row);
      // 在修改某一个属性的时候，将对应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach((item) => {
        // item.flag = flase;这样书写flag不是响应式数据
        // 因为vue无法探测普通的新增property，这样书写的属性并非响应式数据
        // 所以使用$set可以使flag变为响应式数据
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点变span
    toLook(row) {
      // row形参是当前用户最新添加的属性值
      //如果属性值为空不能作为新的属性值，需要给用户提示，让它输入一个新的属性值
      //trim() 方法用于删除字符串的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      // 新增的属性值不能与已经有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        // 需要将row从数组中判断属性值是否相同
        if (row != item) {
          return row.valueName == item.valueName; //false||true
        }
      });
      if (isRepat) {
        this.$message("请不要输入重复的属性值");
        return;
      }
      row.flag = false;
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点，实现自动聚焦
      // 需要注意：点击span的时候，切换为input为编辑模式，但是需要注意，页面重绘与重排是耗时间的
      // 因此不可能一点击span立马获取到input节点
      //$nextTick,当节点渲染完毕，会执行一次
      this.$nextTick(() => {
        // 获取相应的input表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    // 气泡确认框的确定按钮的回调
    // 我的Element-ui版本不是最新的，所以确认用onConfirm，最新版本使用confirm
    deleteAttrValue(index){
      // 当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index,1);
    },
    // 保存按钮
   async addOrUpdateAttr(){
      // 整理参数:
      // 1.如果用户添加了很多属性值，且属性值为空的不应该提交给服务器
      // 2.属性值的flag不应该提供给服务器
     this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        // 过滤掉属性值不是空
        if(item.valueName!=''){
          // 删除掉flag属性
          delete item.flag;
          return true;
        }
      })
      try {
        // 发请求
      await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
      // 展示平台属性的信号量进行切换
      this.isShowTable = true;
      // 提示消息
      this.$message({type:'success',message:'保存成功'})
      // 保存成功以后需要再次获取平台属性进行展示
      this.getAttrList()

      } catch (error) {
        // this.$message({type:'error',message:'保存失败'})
      }
    }
  },
};
</script>

<style>
</style>