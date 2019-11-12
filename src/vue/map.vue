<template>
  <div>
    <div class="toolbar">
      <el-button size="medium" type="success" plain round icon="el-icon-plus" @click="add">添加轮播图</el-button>
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

        <el-table-column label="图片地址" prop="Src">
          <template slot-scope="scope">
            <el-image
              style="width:40px;height:40px;vertical-align: middle;"
              fit="contain"
              :src="scope.row.Src"
            ></el-image>
            {{scope.row.Src}}
          </template>
        </el-table-column>
        <el-table-column label="排序号" prop="SortNum"></el-table-column>
        <el-table-column label="状态" prop="Enable">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Enable?'success':'danger'">{{scope.row.Enable?'启用':"禁用"}}</el-tag>
          </template>
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
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="图片">
          <el-input
            id="file"
            type="file"
            @change="selectfile($event)"
             v-model="form.file"
            style="opacity:0;position:absolute;width:100%;height:40px;z-index:999;"
          ></el-input>
          <el-input placeholder="点击选择要上传的图片" v-model="form.Src"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="form.SortNum"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.Enable" style="width:100%;">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  <script>
    export default {
  data() {
    return {
      options:{},  
      keyword: "",
      title: "",
      visible: false,
      list: [],
      form:{
      }
    };
  },
  methods: {
        selectfile:function(event){
      if(event){
        this.form.Src=document.getElementById('file').files[0].name
      }
      else{
        this.form.Src=""
      }
    },
    // getname: function() {
    //     this.axios.get("/api/map/getname").then(result=>{ 
    //         this.options=result.data.rows
    //     })

    // },
    load: function() {
      
      this.$loading({
        text: "加载中"
      });
      //.get('url',{配置对象})
      this.axios
        .get("/api/map/get", {
          //通过params指定地址上的查询字符串内容
          params: {
            //如果值为undefined，这不会加入到查询字符串中
            keyword: this.keyword
          }
        })
        .then(result => {
          this.list = result.data.rows;
          setTimeout(() => {
            this.$loading().close();
          }, 200);
        });
        
    },
    deleteRow: function(index) {
      console.log(index);
      this.axios
        .post("/api/category/remove", {
          id: this.list[index].Id
        })
        .then(result => {
          if (!result.data.success) {
            this.$message({
              type: "error",
              message: result.data.message
            });
          }
           this.load();
        });
     
    },
    editRow: function(index) {
      console.log(index);
      var row=this.list[index]
       this.visible = true;
      this.title = "修改  ";
        this.$nextTick(()=>{
          document.getElementById("file").value="";
      })
      this.form={
       Id: row.Id,
        SortNum: row.SortNum,
        Enable: row.Enable,
        Src: row.Src
      }
    },
    deleteRow: function(index) {
      console.log(this.list[index].Id);
      this.axios
        .post("/api/map/delete", {
          id: this.list[index].Id
        })
        .then(result => {
          if (!result.data.success) {
            this.$message({
              type: "error",
              message: result.data.message
            });
          }
           this.load();
        });
     
    },
    save: function() {
      var formData=new FormData();
      formData.append("id",this.form.Id);
      formData.append("enable",this.form.Enable)
      formData.append("sortnum",this.form.SortNum);
      if(document.getElementById("file").files.length>0){
         formData.append("file",document.getElementById("file").files[0]);
      }
      
      var url="";
      if(this.form.Id==0){
        //添加
        url="/api/map/add";
      }else{
        url="/api/map/edit";
      }
        this.axios.post(url,formData).then(result=>{
        this.load(); //重新加载表格
        this.visible=false; //关闭对话框
        if(!result.data.success){
          //出错报错
          this.$message({
            type:"error",
            message:result.data.message
          })
        }
      })
    },
    add: function() {
      this.visible = true;
      this.title = "添加";
        this.$nextTick(()=>{
          document.getElementById("file").value="";
      })
     
      this.form={
           Id: 0,
        Name: "",
        SortNum: "",
        Enable: 1,
        Src: ""
      }
    }
    
  },
  mounted() {
    this.$parent.subtitle = "轮播图管理";
    this.load();
    // this.getname();
  }
};
  </script>