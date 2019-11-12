<template>
  <div>
    <div id="left">
      <el-col :span="12">
        <el-menu
          :router ="true"
          :default-active="defaultIndex"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
        >
          <el-menu-item index="/layout/admin">
            <i class="el-icon-setting"></i>
            <span slot="title">后台账号管理</span>
          </el-menu-item>
          <el-menu-item index="/layout/map">
            <i class="el-icon-document"></i>
            <span slot="title">轮播图管理</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-setting"></i>
            <span slot="title">客户信息</span>
          </el-menu-item>
          <el-menu-item index="/layout/category">
            <i class="el-icon-setting"></i>
            <span slot="title">门票分类</span>
          </el-menu-item>
            <el-menu-item index="/layout/ticket">
              <i class="el-icon-setting"></i>
              <span slot="title">门票管理</span>
            </el-menu-item>
          <el-menu-item index="/layout/order">
            <i class="el-icon-setting"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </div>
    <div id="main">
      <div id="topbar">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="/">{{subtitle}}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown>
          <span class="el-dropdown-link">
            <div style="float:left">
              <div class="demo-image">
                <el-image style="width: 50px; height: 50px" src="/upload/1.jpg"></el-image>
              </div>
            </div>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <button class="ooo" href="admin"><a>修改密码</a></button>
            </el-dropdown-item>
            <el-dropdown-item>
              <button @click="logout" class="ooo">安全退出</button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <router-view></router-view>
    </div>

    
  </div>
</template>

<script>
import "../css/1.less";
export default {
 
  data() {
    return { 
      defaultIndex:"",
      
      subtitle: "客户管理"
    };
  },
  mounted () {
    window.addEventListener('resize',()=>
    {
    
    })
    this.defaultIndex=this.$route.path
  },
  methods: {
    logout: function() {
      document.cookie =
        "auth= ;Path=/;Expires=" + new Date(1970, 0, 1).toUTCString();
      location.reload();
    }
  }
};
</script>

