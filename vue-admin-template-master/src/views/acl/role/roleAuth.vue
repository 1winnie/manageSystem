<template>
  <div>
    <el-input disabled :value="$route.query.roleName"></el-input>
    <el-tree 
      style="margin: 20px 0"
      ref="tree"
      :data="allPermissions" 
      node-key="id"  
      show-checkbox 
      default-expand-all
      :props="defaultProps" 
    />
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="$router.replace({name: 'Role'})">取消</el-button>
  </div>
</template>
<script>

  export default {
    name: 'roleAuth',

    data() {
      return {
        loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
        allPermissions: [], // 所有
        // 配置选项
        defaultProps: {
          // 指定子树为节点对象的某个属性值
          children: 'children',
          // 指定节点标签为节点对象的某个属性值
          label: 'name'
        },
      };
    },

    created() {
      this.init()
    },

    methods: {
      /* 
      初始化
      */
      init() {
        const roleId = this.$route.params.id
        this.getPermissions(roleId)
      },

      /* 
      获取指定角色的权限列表
      */
      getPermissions(roleId) {
        this.$API.permission.toAssign(roleId).then(result => {
          const allPermissions = result.data.children
          this.allPermissions = allPermissions
          const checkedIds = this.getCheckedIds(allPermissions)
          // console.log('getPermissions() checkedIds', checkedIds)
          // setCheckedKeys:设置目前勾选的节点，使用此方法必须设置 node-key 属性
          this.$refs.tree.setCheckedKeys(checkedIds)
        })
      },

      /* 
      得到所有选中的id列表
      */
      getCheckedIds (auths, initArr = []) {
        return auths.reduce((pre, item) => {
          if (item.select && item.level===4) {
            pre.push(item.id)
          } else if (item.children) {
            this.getCheckedIds(item.children, initArr)
          }
          return pre
        }, initArr)
      },

      /* 
      保存权限列表
      */
      save() {
        // getCheckedKeys：返回目前被选中的节点的 key 所组成的数组
        var ids = this.$refs.tree.getCheckedKeys().join(",")
        /* 
        vue elementUI tree树形控件获取父节点ID的实例
        修改源码:
        情况1: element-ui没有实现按需引入打包
          node_modules\element-ui\lib\element-ui.common.js    25382行修改源码  去掉 'includeHalfChecked &&'
          // if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
          if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
        情况2: element-ui实现了按需引入打包
          node_modules\element-ui\lib\tree.js    1051行修改源码  去掉 'includeHalfChecked &&'
          // if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
          if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
        */
        this.loading = true
        this.$API.permission.doAssign(this.$route.params.id, ids).then(result => {
          this.loading = false
          this.$message.success(result.$message || '分配权限成功')
          // 必须在跳转前获取(跳转后通过this获取不到正确的数据了)
          const roleName = this.$route.query.roleName
          const roles = this.$store.getters.roles
          this.$router.replace('/acl/role/list', () => {
            console.log('replace onComplete')
            // 跳转成功后, 判断如果更新的是当前用户对应角色的权限, 重新加载页面以获得最新的数据
            if (roles.includes(roleName)) {
              window.location.reload()
            }
          })
        })
      }
    }
  };
</script>
