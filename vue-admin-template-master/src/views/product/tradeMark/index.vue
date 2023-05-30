<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px"
      @click="showDialog"
    >
      添加
    </el-button>
    <!-- 表格组件 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名字" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <!-- row,$index字段不能瞎写，row回传的是对象，通过key解构出value，$index则是索引号 -->
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
           @click="deleteTradeMark(row)" >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev,pager,next,jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 对话框 -->
    <!-- :visible.sync 对话框的显示与隐藏 -->
    <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加名牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 展示表单元素，动态数组 -->
      <!-- model:代表的是你把表单的数据收集到哪个对象身上 将来表单验证，也需要这个属性-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据，不能使用v-model，因为不是表单元素
            action：设置图片上传的地址
            :on-success:可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload：可以在图片上传之前，会执行一次
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义效验规则
    var validateTmName = (rule,value,callback) => {
      // 自定义效验规则
      if(value.length<2||value.length>10){
        callback(new Error('品牌名称需2-10位'))
      }else{
        callback()
      }
    }
    return {
      // 代表当前分页器页码
      page: 1,
      // 当前页数战术数据条数
      limit: 3,
      // 总数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      // 收集品牌信息:对象身上的属性，不能瞎写，需要看文档的，否则k对应不了v
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证的规则
      rules: {
        // 品牌名称的验证规则
        // required:必须要效验字段（与前面*有关）
        // message：提示信息
        // trigger：用户行为设置（事件的设置：blur（失去焦点）、change（当文本发生变化）
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // {
          //   min: 2, max: 10,message: "长度在 2 到 10 个字符",trigger: "change",
          // },
          // 自定义效验规则，重点！！！
          {
            validator:validateTmName,trigger:'change'
          }
        ],
        // 品牌logo的验证规则
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  // 组件一挂载就发送请求
  mounted() {
    this.getPageList() || {};
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      // 解构出参数
      this.page = pager;
      const { page, limit } = this;
      let reslut = await this.$API.trademark.reqTradeMarkList(page, limit);
      console.log(reslut);
      if (reslut.code == 200) {
        this.total = reslut.data.total;
        this.list = reslut.data.records;
      }
    },
    //
    // handleCurrentChange(pager){
    //   this.page= pager
    //   getPageList()
    // }
    // 当前分页器某一页需要展示数据发生变化时会触发
    handleSizeChange() {
      // 整理参数
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      // 清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 点击修改某一个品牌按钮
    updateTradeMark(row) {
      // row：当前用户选中的信息
      // 显示对话框
      this.dialogFormVisible = true;
      // 将服务器返回的品牌信息，直接赋值给了tmForm进行展示
      // 也就是tmForm存储即为服务器返回品牌信息，所以即使按取消按钮，信息也会改变
      // 使用浅拷贝
      this.tmForm = { ...row };
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res:上传成功之后返回给前端的数据（包括真实的地址）
      // file:上传成功之后服务器返回给前端的数据
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加按钮（添加/修改）
    addOrUpdateTradeMark() {
      //  当全部验证字段通过,再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false;
          // 发请求（添加品牌\修改品牌)
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
          if (result.code == 200) {
            // 弹出一个信息：添加品牌成功、修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 添加或者修改品牌成功以后，需要再次获取品牌列表进行展示
            this.getPageList(
              this.tmForm.id
                ? this.page
                : Math.ceil((this.total + 1) / this.limit)
            );
          }
        }else{
          console.log('error submit!!');
            return false;
        }
      });
    },
    // 删除品牌操作
    deleteTradeMark(row){
      // 弹框
      this.$confirm(`你确定删除${row.tmName}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 当用户点击确定按钮时会触发
          // 向服务器发送请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if(result.code ==200){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 再次传参
            this.getPageList(this.list.length>1?this.page:this.page -1);
          }
        }).catch(() => {
          // 当用户点击取消按钮时会触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
