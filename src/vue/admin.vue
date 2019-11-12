<template>
  <div>
    <div class="toolbar">
      <el-button size="medium" type="success" plain round icon="el-icon-plus" @click="add">添加</el-button>
      <div class="searchinput">
        <el-input
          @keypress.native.13="load"
          v-model="keyword"
          size="medium"
          placeholder="请输入要搜索的内容"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="load"></el-button>
        </el-input>
      </div>
      <el-button
        id="zzz"
        size="medium"
        @click="load"
        type="primary"
        plain
        round
        icon="el-icon-refresh"
      >刷新</el-button>
    </div>
    <div style="padding:10px;">
      <el-table :data="list" highlight-current-row stripe>
        <el-table-column label="编号" width="100" prop="Id"></el-table-column>

        <el-table-column label="用户名" prop="LoginName">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="editRow(scope.$index)"
              type="warning"
              size="small"
              round
              plain
              icon="el-icon-edit-outline"
            >修改</el-button>
            <el-button
              @click="deleteRow(scope.$index)"
              type="danger"
              size="small"
              round
              plain
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible.sync="visible" width="30%">
     <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="用户名" prop="name">
    <el-input v-model.number="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="pass">
    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      var checkname = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }}
      return {
          list:[],
          form:{},
          keyword:"",
          visible:false,
          title:"添加账号",
          ruleForm: {
          pass: '',
          checkPass: '',
          name: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          name: [
            { validator: checkname, trigger: 'blur' }
          ]
        }

      };
    },
    methods: {
      add:function(){
        this.visible=true
        this.title="添加账号"
      },
      save:function(){},
        load:function(){
            this.$loading({
        text: "加载中"
      });
      this.axios
        .get("/api/admin/get", {
          params: {
            keyword: this.keyword
          }
        })
        .then(res => {
          setTimeout(() => {
            this.$loading().close();
          }, 100);
          console.log(res.data.rows)
          this.list = res.data.rows
        })
        },
    },
     mounted() {
    this.load()
        this.$parent.subtitle = "后台账号管理";
  }
  }
</script>