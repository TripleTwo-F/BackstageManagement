<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                    @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userList"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        >
        </el-table-column>
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <el-switch
              @change="userStateChange(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="Del"></el-button>
            <el-tooltip content="分配角色" placement="bottom" effect="light">
              <el-button type="primary" icon="el-icon-setting" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1, 2, 3, 4, 6]"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="queryInfo.pagesize"
          :total="total"
        >
        </el-pagination>
      </div>
      <div class="demo-input-suffix">
      </div>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form label-width="80px" :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="character">
          <el-input v-model="addForm.character"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getUsersList()
  },
  data () {
    // 自定义表达规则
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regPhone.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      // 验证手机号规则
      queryInfo: {
        // 查询用户条件
        query: '',
        // 当前页
        pagenum: 1,
        // 页面几条数据
        pagesize: 2
      },
      // 数据存储
      userList: [],
      // 共多少页
      total: 0,
      dialogVisible: false,
      // 添加用户
      addForm: {
        username: '',
        password: '',
        email: '',
        phone: '',
        character: ''
      },

      // 校验规则
      addFormRules: {
        username: [
          { require: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '用户名在5到10个字符内', trigger: 'blur' }
        ],
        password: [
          { require: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码在6到16个字符内', trigger: 'blur' }
        ],
        email: [
          { require: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        phone: [
          { require: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        character: [
          { require: true, message: '请输入角色', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 接口获取数据
    async getUsersList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听每页多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听页码
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    // 监听用户状态改变
    async userStateChange (ueseInfo) {
      // 请求的路径 users/:uid/state/:type
      // ${}模板字符串拼接
      const { data: res } = await this.$http.put(`users/${ueseInfo.id}/state/${ueseInfo.mg_state}`)
      if (res.meta.status !== 200) {
        ueseInfo.mg_state = !ueseInfo.mg_state
        return this.$message.error('用户状态更新失败')
      }
      return this.$message.success('用户状态更新成功')
    },
    // 监听添加用户对话框关闭清空
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 删除用户
    Del () {

    },
    // 添加用户
    addUser () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return valid
        // 与验证通过发请求
        console.log('11')
      })
    }
  },

  name: 'Users'
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-table {
  margin-top: 30px;
}

.block {
  margin-top: 20px;
}

.el-card {

}
</style>
