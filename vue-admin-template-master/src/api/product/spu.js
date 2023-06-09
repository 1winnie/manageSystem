import request from '@/utils/request';

// 获取spu列表数据的接口
export const reqSpuList = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

//获取spu信息的接口
export const reqSpu = (spuId) =>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'});

// 获取品牌信息
export const reqTradeMarkList = () => request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'});

// 获取spu图标的接口
export const reqSpuImageList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});

// 获取平台全部销售属性---整个平台销售属性一共三个
export const reqBaseSaleAttrList = ()=>request({url:`/admin/product/baseSaleAttrList`,method:'get'});

// 修改SPU||添加SPU：对于修改或者添加，携带给服务器参数大致是一样的，唯一的区别就是携带的参数是否带id
export const reqAddOrUpdateSpu = (spuInfo)=>{
    // 携带的参数带有id---->修改spu
    if(spuInfo.id){
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo});
    }else{
        //携带的参数不带id--添加SPU
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo});
    }
}

// 删除spu
export const reqDeleteSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})