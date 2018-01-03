<template>
  <div class="login-container">
    <el-form class="card-box login-form" name="loginForm" ref="loginForm" :rules="rules" :model="loginForm" autoComplete="on"
      label-position="left">
      <h2 class="title">元宝铺子 数据中心</h2>
      <el-card class="box-card">
        <div class="loginHeader">登录元宝铺数据中心</div>
        <div class="loginBody">
          <el-form-item label="用户名" prop="username">
            <el-input class="inputStyle" name="username" type="text" v-model="loginForm.username" placeholder="请输入你的用户名" @keyup.enter.native="handleLogin"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input class="inputStyle" name="password" type="password" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter.native="handleLogin"></el-input>
          </el-form-item>
          <el-button type="primary" class="loginBtn" @click.native.prevent="handleLogin">登 录</el-button>
        </div>
      </el-card>
      </el-form>
  </div>
</template>

<script>
  import { md5For16, setToken } from '@/utils/util'
  export default {
    name: 'login',
    data() {
      const validateAccount = (rule, value, callback) => {
        if (!value.trim()) {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      const validatePwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [{ required: true, trigger: 'blur', validator: validateAccount }],
          password: [{ required: true, trigger: 'blur', validator: validatePwd }]
        }
      }
    },
    methods: {
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            var params = {
              loginName: this.loginForm.username,
              password: md5For16(this.loginForm.password)
            }

            this.http.doLogin('login', params).then(res => {
              if (res) {
                const token = res.data
                setToken(token)
                this.Cookies.set('username', params.loginName)
                this.$store.dispatch('GetMenus').then(menus => {
                  this.$store.dispatch('GenerateRoutes', { menus }).then((accessMenus) => {
                    this.$router.addRoutes(accessMenus);
                    if (!accessMenus || accessMenus.length == 0) {
                      this.$message.warning('当前账户无可用权限')
                      return
                    }
                    var path = accessMenus[0].path + '/' + accessMenus[0].children[0].path
                    this.$router.push(path)
                  })
                })
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $light_gray:#f5f5f5;
  .login-container {
    @include relative;
    height: 100vh;
    background: url('../../assets/img/login-bg.jpg') no-repeat top center;
    .el-form-item.is-required .el-form-item__label:before {
      content: '';
    }
    input {
      background: transparent;
      border: none;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #555;
      width: 100%;
    }
    .el-input {
      display: inline-block;
      height: 37px;
      width: 100%;
      border-radius: 5px;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .title {
      font-size: 30px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 35%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
      .box-card {
        background-color: rgba(250, 250, 250, 0.1);
        border-color: #8c96a4;
        padding-bottom: 50px;
        .el-card__body {
          padding: 0px;
        }
        .loginHeader {
          color: #f5f5f5;
          background: none;
          border-bottom: 1px solid #8c96a4;
          text-align: center;
          line-height: 45px;
          font-size: 16px;
          font-weight: bold;
        }
        .loginBody {
          padding: 20px 40px 28px 40px;
          .el-form-item {
            font-size: 14px;
            margin-bottom: 15px;
            label {
              color: #f5f5f5;
            }
            .inputStyle {
              background-color: #fff;
              background-image: none;
              border: 1px solid #ccc;
            }
          }
          .loginBtn {
            width: 30%;
            background: #00b8ee;
            border: none;
            border-radius: 5px;
            margin-top: 20px;
            color: #fff;
            float: right;
          }
        }
      }
    }
  }
</style>
