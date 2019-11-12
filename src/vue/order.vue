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
        <el-table-column label="客户ID" width="100" prop="CustomerId"></el-table-column>
        <el-table-column label="门票ID" width="100" prop="TicketId"></el-table-column>
        <el-table-column label="门票价格" width="100" prop="Price"></el-table-column>
        <el-table-column label="数量" width="100" prop="Quantity"></el-table-column>
        <el-table-column label="总金额" width="100" prop="Total"></el-table-column>
        <el-table-column label="手机号" width="150" prop="Mobile"></el-table-column>
        <el-table-column label="联系人" width="100" prop="ContactName"></el-table-column>
        <el-table-column label="使用时间" width="120" prop="UseDate"></el-table-column>
       <el-table-column
      label="状态"
      width="150">
      <template slot-scope="scope">
        <el-tag type="danger" v-if="scope.row.Status==3" size="small">交易关闭</el-tag>
            <el-tag type="danger" v-if="scope.row.Status==2" size="small">已消费</el-tag>
            <el-tag type="success" v-if="scope.row.Status==1" size="small">付款成功</el-tag>
            <el-tag type="info" v-if="scope.row.Status==0" size="small" >已下单未付款</el-tag>
         </template>
    </el-table-column>
        <el-table-column label="操作" width="200">
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
    <!-- <el-dialog :title="title" :visible.sync="visible" width="30%">
     <el-form ref="form" label-width="80px" >
  <el-form-item label="分类名">
    <el-input placeholder="请输入分类名" v-model="form.Name"></el-input>
  </el-form-item>
  <el-form-item label="排序号" >
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
    </el-dialog> -->
  </div>
</template>

  <script>
    export default {
      data () {
        return {
          list:{},
          keyword:"",

        }
      },
      mounted () {
        this.$parent.subtitle="订单管理"
        this.load()
      },methods: {
        load: function() {
      this.$loading({
        text: "加载中"
      });
      //.get('url',{配置对象})
      this.axios
        .get("/api/order/get", {
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
            console.log(this.list)
          }, 200);
        });
    },
    add:function(){

    },
    editRow:function(){

    },
    deleteRow:function(){

    }
  }
};
  </script>