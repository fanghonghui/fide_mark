<template>
  <el-menu class="navbar" mode="horizontal">
    <h3 style="display:inline-block;padding-left:15px;margin-right:25px;float: left;">金融大数据平台</h3>
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <icon-svg icon-class="home" class="home"></icon-svg>{{username}}
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item>
          <router-link style="display: inline-block;width:100px;height:35px;"
                       to="/personalCenter/orgPersonalCenter">个人中心
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item divided><span @click="logout" style="display:block;">退出</span></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Hamburger from '@/components/Hamburger'
  import { removeToken } from '@/utils/util'

  export default {
    data() {
      return {
        username: ''
      }
    },
    components: {
      Hamburger
    },
    computed: {
    ...mapGetters([
      'sidebar'
    ])
    },
    created() {
      this.username = this.Cookies.get('username')
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        var that = this

        this.$confirm('确认退出吗?', '提示').then(() => {
          removeToken()
          this.$store.dispatch('ClearMenus')
          this.Cookies.remove('username')
          that.$router.push('/')
        })
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-menu {
    background-color: #2B333C;
    color: #f5f5f5;
  }

  .navbar {
    position: fixed;
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    z-index:999;
  .hamburger-container {
      line-height: 58px;
      height: 50px;
      padding: 0 10px;
      color: #f5f5f5;
      display: inline-block;
    }
    .errLog-container {
      display: inline-block;
      position: absolute;
      right: 150px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        color: #fff;
        padding-right: 40px;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .svg-icon {
          vertical-align: middle;
          margin: 0 15px 0 4px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: 1px;
          top: 21px;
          font-size: 12px;
        }
      }
      .home {
        font-size: 34px;
        color: #b0c3d8;
      }
    }
  }
</style>
