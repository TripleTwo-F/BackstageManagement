<template>
<div>
主页
  <el-button type="info" @click="logout">退出登录</el-button>
</div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    logout () {
      // 销毁本地token
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  name: 'Home'
}
</script>

<style scoped lang="less">

</style>
