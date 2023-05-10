<template>
  <div class="login-section">
    <div class="login-header">陕西移动防疫管理系统</div>
    <div class="login-content">
      <div class="login-main">
        <van-tabs v-model="activeName">
          <van-tab title="登录" name="login">
            <div class="login">
              <div class="login-name">
                <van-field v-model="username" placeholder="请输入账号" />
              </div>
              <div class="login-pwd">
                <van-field v-model="password" placeholder="请输入密码" />
              </div>
              <div class="remember-btn">
                <van-checkbox shape="square" v-model="isRemember">记住密码</van-checkbox>
                <van-checkbox shape="square" v-model="isAuto">自动登录</van-checkbox>
              </div>
            </div>
          </van-tab>
          <van-tab title="注册" name="register">
            <div class="register"></div>
          </van-tab>
        </van-tabs>
      </div>
      <div class="footer">
        <van-button class="submit-btn" type="info" @click="handleLogin">登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        activeName: "login",
        username: "",
        password: "",
        isRemember: false,
        isAuto: false,
      };
    },
    activated() {},
    methods: {
      handleLogin() {
        this.$router.replace({
          path: "/home",
        });
      },
    },
  };
</script>
<style scoped lang="scss">
  @import "../../assets/style/variable.scss";
  .login-section {
    height: 100%;
    // @include flexCenter;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    .submit-btn {
      width: 80%;
    }
    .login {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
      margin-top: 50px;
    }
    .remember-btn {
      display: flex;
      justify-content: space-around;
    }
  }
  .login-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 2px solid #ccc;
    border-radius: 20px;
    padding: 20px;
    width: 86%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .login-header {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    padding-top: 25vh;
  }
  .footer {
    display: flex;
    justify-content: center;
    // margin-top: 10px;
    // position: absolute;
    // bottom: 60px;
    width: 100%;
    margin-top: 10vh;
  }
  .login-main {
    margin-top: 35px;
    ::v-deep .van-tabs__line {
      background-color: #1989fa;
      height: 4px;
      background-image: linear-gradient(to right, #84b3e2, #1989fa);
    }
    ::v-deep .van-field__control {
      resize: none;
      border: 1px solid #ccc;
      border-radius: 10px;
      height: 42px;
      padding-left: 10px;
    }
  }
</style>
