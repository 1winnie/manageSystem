// 获取品牌管理分页列表
import request from '@/utils/request';
export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

// 处理添加品牌的操作
// 新增品牌，post 携带两个参数：品牌名称、品牌logo
// 切记：对于新增的品牌，给服务器不需要传递id，ID是由服务器生成的

// 修改品牌（服务器已经有了该品牌,已经有了id，要告诉服务器，修改哪个品牌） put 携带 三个参数：id 、品牌名称、品牌logo
// 传递的参数基本相同，除了id，可以把请求封装为一个函数
export const reqAddOrUpdateTradeMark = (tradeMark)=>{
    // 带给服务器数据携带ID--修改
    if(tradeMark.id){
        return request({url: '/admin/product/baseTrademark/update',method:'put',data: tradeMark})
    }else{
        return request({url: '/admin/product/baseTrademark/save',method:'post',data: tradeMark})
    }
}
// 删除品牌
export const reqDeleteTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'});
