<template>
  <div>
    <el-container class="home_box">
      <!--      侧边栏-->
      <el-aside :width="!isCollapse?'200px':'64px'" style="transition: all 0.2s">
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <el-col :span="24">
          <el-menu
            default-active="2"
            background-color="#eeeeee"
            text-color="#808080"
            active-text-color="#2c2c2c"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <el-submenu :index="item.id+''" v-for=" item in menusList" :key="item.id">
              <template slot="title">
                <i :class="iocnsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item :index="sbuItem.path" v-for="sbuItem in item.children" :key="sbuItem.id">
                <template slot="title">
                  <i class="el-icon-more"></i>
                  <span slot="title">{{ sbuItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-container>
        <!--        页面头部区域-->
        <el-header>
          <div>
            <img src="../assets/logo.png" alt="">
            <span>后台管理系统</span>
          </div>
          <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <!--        内容区域-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script>
export default {
  data () {
    return {
      // 侧边栏的菜单数据
      menusList: [],
      iocnsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-check',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-menu'
      },
      isCollapse: false
    }
  },
  created () {
    this.getMenusList()
  },
  methods: {
    logout () {
      // 销毁本地token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenusList () {
      // get请求 请求路径menus
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取菜单列表失败')
      this.menusList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}

</script>

<style scoped lang="less">
.home_box {
  height: 100%;
}

.el-header {
  background-color: #eeeeee;
  border-bottom: 1px solid white;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 20px;
      font-size: 20px;
      color: #808080;
    }

    img {
      width: 60px;
    }
  }
}

.el-aside {
  background-color: #e4e4e4;
  height: 100vh;

  .el-menu {
    border-right: none;
  }
}

.toggle_button {
  background-color: #e4e4e4;
  text-align: center;
  font-size: 10px;
  cursor: pointer;
  line-height: 24px;
  letter-spacing: 0.2em;
}

.el-main {
  background-color: #eeeeee;
}
</style>
