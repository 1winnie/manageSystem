<template>
  <div>
    <el-form ref="form" label-width="80px">
        <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
        <el-form-item label="SKU名称">
            <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)">
            <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
            <el-input type="textarea" rows="4" v-model=skuInfo.skuDesc></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true" label-width="80px">
                <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
                    <el-select  placeholder="请选择" v-model="attr.attrIdAndValueId" >
                      <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true" label-width="80px">
                <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
                    <el-select  placeholder="请选择" v-model="saleAttr.attrIdValueId">
                      <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片列表">
            <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectChange">
                <el-table-column type="selection" width="80px"></el-table-column>
                <el-table-column label="图片" width="width">
                    <template slot-scope="{row,$index}">
                        <img :src="row.imgUrl" style="width:100px;height:100px">
                    </template>
                </el-table-column>
                <el-table-column label="名称" width="width" prop="imgName"></el-table-column>
                <el-table-column label="操作" width="width">
                    <template slot-scope="{row,$index}">
                        <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认属性</el-button>
                        <el-button type="success" v-else >默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name:'SkuForm',
    data(){
        return {
            //存储图片数据
            spuImageList:[],
            // 存储销售属性
            spuSaleAttrList:[],
            // 存储平台属性的数据
            attrInfoList:[],
            // 收集sku数据字段（点击保存发请求需要传递的数据，也决定着数据展示获取）
            skuInfo:{
                // 第一类收集的数据：父组件给的数据
                category3Id:0,
                spuId:0,
                tmId:0,
                // 第二类需要通过双向绑定获取数据
                price:0,
                skuName:"", 
                weight:'',
                skuDesc:"",
                // 第三类需要自己书写代码
                skuImageList:[],
                skuSaleAttrValueList:[],
                skuAttrValueList:[],
                skuDefaultImg:"",
            },
            spu:{},
            // 收集图片的数据字段[目前缺少isdefault（发请求需要）]
            imageList:[]
        }
    },
    methods:{
        // 获取skuForm数据
       async getDate(category1Id,category2Id,spu){
            // 收集父组件给予的数据
            this.skuInfo.category3Id = spu.category3Id;
            this.skuInfo.spuId = spu.id;
            this.skuInfo.tmId = spu.tmId;
            this.spu = spu;
            // 获取图片数据
           let result1 = await this.$API.sku.reqSpuImageList(spu.id);
           if(result1.code == 200){
                let list = result1.data;
                list.forEach(item=>{
                    item.isDefault = 0;
                });
                this.spuImageList = list;
           }
            // 获取销售属性的数据
            let result2 = await this.$API.sku.reqSpuSaleAttrList(spu.id);
            if(result2.code == 200){
                this.spuSaleAttrList = result2.data;
            }
            // 获取平台属性的数据
            let result3 = await this.$API.sku.reqAttrInfoList(category1Id,category2Id,spu.category3Id);
            if(result3.code == 200){
                this.attrInfoList = result3.data
            }
        },
        // table表格，当选项发生变化会触发事件
        handleSelectChange(selection){
            // selection:数组，收集选择的属性，但是需要注意当前数组当中，缺少isdefault
            this.imageList = selection;
            // console.log(selection)
        },
        // 排他操作
        changeDefault(row){
            this.spuImageList.forEach(item=>{
                item.isDefault = 0;
            })
            row.isDefault = 1;
            this.skuInfo.skuDefaultImg = row.imgUrl;
        },
        // 取消按钮
        cancel(){
            // 自定义事件，让父组件切换场景为0
            this.$emit('changeScenes',0);
            // 清除数据
            Object.assign(this._data,this.$options.data())
        },
        // 保存按钮
       async save(){
            // 整理参数
            const {attrInfoList,skuInfo,spuSaleAttrList} = this;
            // 整理平台属性的数据方法一：
            // // 新建数组
            // let arr = []
            // attrInfoList.forEach(item=>{
            //     //当前平台属性用户进行选择
            //     if(item.attrIdAndValueId){
            //        const [attrId,valueId]  = item.attrIdAndValueId.split(':');
            //         // 携带给服务器的参数应该为一个对象
            //         let obj = {attrId,valueId};
            //         arr.push(obj);
            //     }
            // });
            // skuInfo.skuAttrValueList = arr;、
            // 整理平台属性的数据方法二：
            skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
                if(item.attrIdAndValueId){
                    const [attrId,valueId]  = item.attrIdAndValueId.split(':');
                    prev.push({attrId,valueId});
                }
                return prev;
            },[]);
            // 整理销售属性
            skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
                if(item.attrIdValueId){
                    const [saleAttrId,saleAttrValueId]  = item.attrIdValueId.split(':');
                    prev.push({saleAttrId,saleAttrValueId});
                }
                return prev;
            },[]);
            // 整理图片的数据
            skuInfo.skuImageList = this.imageList.map(item=>{
                return {
                    imgName:item.imgName,
                    imgUrl:item.imgUrl,
                    isDefault:item.isDefault,
                    spuImgId:item.id,
                }
            });
            // 发请求
          let result = await this.$API.sku.reqAddSku(skuInfo);
          console.log(result)
          if(result.code == 200){
            this.$message({type:'success',message:'添加SKU成功'})
            this.$emit('changeScenes',0);
          }
        }
    }   
}
</script>

<style>

</style>