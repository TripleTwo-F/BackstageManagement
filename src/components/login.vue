<template>
  <div class="login_box">
    <div class="login_form">
      <div class="logo">
        <img src="../assets/logo.png" height="200" width="200"/></div>
      <!--      登陆表单-->
      <div class="login_InputBox">
        <el-form label-width="0" :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input placeholder="请输入账号" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="resetLogin">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // 校验是否输入账号密码，长度是否足够
      rules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          {
            min: 3,
            message: '账号至少3个数字、字符以上',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '密码至少6个数字、字符以上',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 登录
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 发请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res.data)
        if (res.meta.status === 200) {
          this.$message({
            message: '登陆成功',
            type: 'success'
          })
        } else {
          this.$message.error('登录失败')
        }
        // 保存token
        window.sessionStorage.setItem('token', res.data.token)
        await this.$router.push('/home')
      })
    },
    // 重置表单
    resetLogin () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}

</script>
<style lang="less" scoped>
.login_box {
  height: 100%;
  background-color: #42b983;
  //background: red;
}

.login_form {
  width: 450px;
  height: 300px;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;

  .logo {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    padding: 10px;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 0 20px #ddd;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .login_InputBox {
    width: 400px;
    position: absolute;
    top: 30%;
    transform: translate(28px);

    .btns {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
