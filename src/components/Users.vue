<template>
  <div>
    <!--面包屑区域-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--搜索区域-->
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
      <!--数据表格列表区域-->
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
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="bottom" effect="light" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle size="mini"
                         @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" effect="light" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="Del(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="bottom" effect="light" :enterable="false">
              <el-button type="primary" icon="el-icon-setting" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
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
    </el-card>
    <!--添加用户模态框-->
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
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改用户模态框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form label-width="80px" :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
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
    // 自定义表单验证规则 验证手机号规则
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regPhone.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      queryInfo: {
        query: '', // 查询用户条件
        pagenum: 1, // 当前页
        pagesize: 2// 页面几条数据
      },
      userList: [], // 数据存储
      total: 0, // 共多少页
      dialogVisible: false, // 添加模态框显示隐藏
      editDialogVisible: false, // 修改模态框显示隐藏
      // 添加用户
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户
      editForm: {},
      // 添加表单校验规则
      addFormRules: {
        username: [
          {
            require: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 10,
            message: '用户名在5到10个字符内',
            trigger: 'blur'
          }
        ],
        password: [
          {
            require: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码在6到16个字符内',
            trigger: 'blur'
          }
        ],
        email: [
          {
            require: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            require: true,
            message: '请输入电话号码',
            trigger: 'blur'
          },
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ]
      },
      // 修改表单校验规则
      editFormRules: {
        email: [
          {
            require: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            require: true,
            message: '请输入电话号码',
            trigger: 'blur'
          },
          {
            validator: checkPhone,
            trigger: 'blur'
          }
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
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 删除用户
    async Del (id) {
      const res = await this.$confirm('确认删除该用户？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res === 'cancel') {
        return this.$message.info('已取消删除')
      }
      // 发送删除请求
      const { data: res2 } = await this.$http.delete(`users/${id}`)
      if (res2.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      await this.getUsersList()
    },
    // 添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return valid
        // 预验证通过发请求 post请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // 重新发请求获取数据
        await this.getUsersList()
        // 隐藏对话框
        this.dialogVisible = false
      })
    },
    // 修改用户
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return valid
        // 发送修改用户信息的清秀
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('该用户信息更新失败')
        }
        // 关闭模态框
        this.editDialogVisible = false
        // 刷新数据
        await this.getUsersList()
        this.$message.success('用户数据更新成功')
      })
    },
    // 显示修改用户对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
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

.el-breadcrumb {
  margin-top: 20px;
  margin-left: 20px;
  font-weight: bold;
}
</style>
