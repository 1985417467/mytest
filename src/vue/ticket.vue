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
        size="medium"
        @click="load"
        type="primary"
        plain 
        round
        icon="el-icon-refresh"
        id="zzz"
      >刷新</el-button>
    </div>
    <div style="padding:10px;">
      <el-table
        lazy
        :data="list"
        row-key="Id"
        default-expand-all
        :tree-props="{children: 'children'}"
        :row-class-name="rowClass"
      >
        <el-table-column prop="Title" label="名称">
          <template slot-scope="scope">
            <el-image
              style="max-width:80px;height:40px;vertical-align: middle;"
              fit="contain"
              :src="scope.row.Src"
            ></el-image>
            {{scope.row.Title}} {{scope.row.Name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="Price"
          width="150"
          label="单价"
          :formatter="(row, column, cellValue, index)=> row.Id>0&&'￥'+cellValue"
        ></el-table-column>
        <el-table-column prop="Stock" label="库存" width="100"></el-table-column>
        <el-table-column label="商户信息" width="240">
          <template slot-scope="scope" v-if="scope.row.Id>0">
            <el-popover placement="left" title="店铺信息" width trigger="hover" content>
              <p>电话：{{scope.row.ShopPhone?scope.row.ShopPhone:"未填写"}}</p>
              <p>地址：{{scope.row.ShopAddress?scope.row.ShopAddress:"未填写"}}</p>
              <div style="float:left;" slot="reference">
                <el-tag type="danger" v-if="!scope.row.ShopName" size="small">-未填写-</el-tag>
                <el-tag type="success" v-if="scope.row.ShopName" size="small">{{scope.row.ShopName}}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Enable?'success':'danger'">{{scope.row.Enable?'启用':"禁用"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序号" prop="SortNum" width="100"></el-table-column>
        <el-table-column label="操作" width="180">
          <template v-if="scope.row.Id>0" slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              type="warning"
              size="small"
              round
              plain
              icon="el-icon-edit-outline"
            >修改</el-button>
            <el-button
              @click="open(scope.row)"
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
    <div style="padding:10px;">
      <el-pagination
        @size-change="load"
        @current-change="load"
        :current-page.sync="page"
        :page-sizes="[10,20, 40, 80, 100]"
        :page-size.sync="size"
        layout=" total,sizes, prev, pager, next, jumper,slot"
        :total="total"
        background
      ></el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="dialogShow" width="1000px">
      <!-- {{form}} -->
      <el-form :model="form" ref="form" label-width="80px" size="mini">
        <el-container>
          <el-container>
            <el-header style="height:125px">
              <div>
                <div style="width:45%;display:inline-block">
                  <el-form-item style="width:100%;" label="门票名">
                    <el-input v-model="form.Title" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="单价" style="width:100%">
                    <el-input v-model="form.Price" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="库存" style="width:100%">
                    <el-input v-model="form.Stock" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="图片">
                    <el-input
                      type="file"
                      id="file"
            
                      @change="selectfile($event)"
                      v-model="form.file"
                      style="opacity:0;position:absolute;width:100%;height:40px;z-index:999"
                     ></el-input>
                    <el-input placeholder="点击选择要上传的图片" v-model="form.Src"></el-input>
                  </el-form-item>
                  <el-form-item label="排序号">
                    <el-input v-model="form.SortNum"></el-input>
                  </el-form-item>
                </div>
                <div style="width:50%;float:right">
                  <el-form-item style="width:100%" label="电话">
                    <el-input v-model="form.ShopPhone" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="状态" style="width:100%">
                    <el-select size="small" v-model="form.Enable" style="width:100%;">
                      <el-option label="启用" :value="1" style="height:40px"></el-option>
                      <el-option label="禁用" :value="0" style="height:50px"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="商户名" style="width:100%">
                    <el-input v-model="form.ShopName" placeholder></el-input>
                  </el-form-item>
        
                  <el-form-item label="门票类型" style="width:100%">
                    <el-select size="small" v-model="categorys.Id" style="width:100%;">
                      
                      <el-option
                        style="text-align:left;height:45px"
                        v-for="item in categorys"
                        :key="item.Id"
                        :label="item.Name"
                        :value="item.Id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <!-- Header content -->
            </el-header>
            <el-main style="margin-top:90px">
              <el-container>
                <el-aside style="width:50%;">
                  <!-- Aside content -->
                  <el-form-item label="门票描述" style="width:90%;"  prop="Content">
                   <wangEditor ref="editor" v-model="form.Content"></wangEditor>
                  </el-form-item>
                  
                </el-aside>
                <el-container>
                  <el-main style="padding:0;width:55%">
                    <el-form-item label="商户地址">
                      <baiduMap
                        @click="onClick"
                        ref="map"
                        @suggestSelect="onSelect"
                        map-style="width:100%;height:300px;"
                        suggestId="abc"
                      >
                        <el-form-item>
                          <el-input id="abc" v-model="form.ShopAddress"></el-input>
                        </el-form-item>
                      </baiduMap>
                    </el-form-item>
                  </el-main>
                </el-container>
              </el-container>
            </el-main>
          </el-container>
        </el-container>
      </el-form>

      <span slot="footer">
        <el-button @click=" dialogShow= false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import baiduMap from "./baidumap";
import wangEditor from "./wangEditor";
export default {
  data() {
    return {
      categorys:{},
      options: {},
      form: {},
      list: [{ Name: "" }, { Name: "" }, { Name: "" }],
      title: "添加",
      dialogShow: false,
      total: 0,
      size: 10,
      page: 1,
      keyword: ""
    };
  },
  methods: {
    selectfile: function(event) {
      if (event) {
        this.form.Src = document.getElementById("file").files[0].name;
      } else {
        this.form.Src = "";
      }
    },
     getcategory: function() {
      this.axios.get("/api/ticket/getcategory").then(result => {
        this.categorys = result.data.rows;
        console.log(result.data.rows)
      });
    },
    get: function() {
      this.axios.get("/api/ticket/getticket").then(result => {
        this.options = result.data.rows;
        console.log(result.data.rows)
      });
    },
    add: function() {
      this.title="添加"
      this.dialogShow = true;
      this.$nextTick(() => {
        document.getElementById("file").value = "";
      });
      this.form = {};
    },
    edit: function(row) {
      
      this.dialogShow = true;
      this.title = "修改";
      this.form = {
        Title: row.Title,
        Price: row.Price,
        Stock: row.Stock,
        ShopPhone: row.ShopPhone,
        Enable: row.Enable,
        SortNum: row.SortNum,
        ShopAddress: row.ShopAddress
      }; 
    },
    open:function(row){
       
      this.$confirm('确定要删除该类门票吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.remove(row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    remove:function(row){
     
         this.axios
        .post("/api/ticket/delete", {
          id: row.Id
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
      var formData = new FormData();
      formData.append("title", this.form.Title);
      formData.append("price", this.form.Price);
      formData.append("stock", this.form.Stock);
      formData.append("lat", this.form.lat);
      formData.append("lng", this.form.lng);
      formData.append("shopname", this.form.ShopName);
      formData.append("shopaddress", this.form.shopAddress);
      formData.append("shopphone", this.form.ShopPhone);
      formData.append("content", this.form.Content);
      formData.append("src", this.form.Src);
      formData.append("categoryid", this.categorys.Id);
      formData.append("enable", this.form.Enable);
      formData.append("sortnum", this.form.SortNum);
      if (document.getElementById("file").files.length > 0) {
        formData.append("file", document.getElementById("file").files[0]);
      }
      var url = "";
      if (this.title == "添加") {
        //添加
        url = "/api/ticket/add";
      } else {
        url = "/api/ticket/edit";
      }
      if (!this.form.Title == "") {
        this.axios.post(url, formData).then(result => {
          this.load(); //重新加载表格
          this.dialogShow = false; //关闭对话框
          if (!result.data.success) {
            //出错报错
            this.$message({
              type: "error",
              message: result.data.message
            });
          }
        });
      } else {
        this.$message({
          type: "error",
          message: "门票名不能为空"
        });
      }
    },
    onClick: function(event) {
      var point = event.point;
      this.form.lng = point.lng;
      this.form.lat = point.lat;
      this.$refs.map.clearMarker();
      this.$refs.map.addMarker(point);
    },
    onSelect: function(address, addressObj) {
      this.form.shopAddress = address;
      this.$refs.map.getSuggessPoint({
        address: address,
        success: point => {
          console.log(point);
          this.form.lng = point.lng;
          this.form.lat = point.lat;
          this.$refs.map.clearMarker();
          point.level = 18;
          this.$refs.map.center(point);
          this.$refs.map.addMarker(point);
        }
      });
    },
    load: function() {
      this.$loading({
        text: "加载中"
      });
      this.axios
        .get("/api/ticket/get", {
          params: {
            keyword: this.keyword,
            page: this.page,
            size: this.size
          }
        })
        .then(res => {
          setTimeout(() => {
            this.$loading().close();
          }, 100);
          this.list = res.data.rows;
          this.total = res.data.total;
        });
    },
    rowClass(obj) {
      if (obj.row.Id < 0) {
        return "gray";
      }
    }
  },
  mounted() {
    this.load();
    this.get();
    this.getcategory();
    this.$parent.subtitle = "门票管理";
  },
  watch: {},
  components: {
    baiduMap: baiduMap
  }
};
</script>
<style>
tr.gray td {
  background: #fafafa !important;
}
.tangram-suggestion-main {
  z-index: 99999;
}
</style>