  <template>  
  <div style="height:100%">
    <div class="toolbar">
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
  <div style="padding:10px;height:570px">
    <el-scrollbar style="height:100%;">
  <el-table :data="list" highlight-current-row stripe
    style="width: 100%">
    <el-table-column
      label="昵称"
      width="120">
      <template slot-scope="scope">
        <span>{{ scope.row.NickName }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="头像地址"
      width="200">
      <template slot-scope="scope">
        <el-image
              style="width:40px;height:40px;vertical-align: middle;"
              fit="contain"
              :src="scope.row.AvatarUrl"
            ></el-image>
        <span>{{ scope.row.AvatarUrl }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="性别"
      width="80">
      <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.Sex==2" size="small">女</el-tag>
            <el-tag type="success" v-if="scope.row.Sex==1" size="small">男</el-tag>
            <el-tag type="info" v-if="scope.row.Sex==0" size="small" >未知</el-tag>
         </template>
    </el-table-column>
        <el-table-column
      label="国家"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.Country }}</span>
      </template>
    </el-table-column>
        <el-table-column
      label="省份"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.Province }}</span>
      </template>
    </el-table-column>
        <el-table-column
      label="城市"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.City }}</span>
      </template>
    </el-table-column>
        <el-table-column
      label="手机号"
      width="180">
      <template slot-scope="scope">
        <span>{{ scope.row.WeChatBindPhone }}</span>
      </template>
    </el-table-column>
        <el-table-column
      label="账户余额"
      width="150">
      <template slot-scope="scope">
        <span>{{ scope.row.Account }}</span>
      </template>
    </el-table-column>
        <el-table-column
      label="状态"
      width="100">
      <template slot-scope="scope">
            <el-tag :type="scope.row.Status?'success':'danger'">{{scope.row.Status?'启用':"禁用"}}</el-tag>
          </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-switch @change="edit(scope.row,scope.$index)"
          v-model="scope.row.Status" :active-value="1" :inactive-value="0">
        </el-switch> </template>
    </el-table-column>
  </el-table>
    <el-pagination
      @size-change="load"
      @current-change="load"
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 20, 40, 80, 100]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum" background>
    </el-pagination>
 </el-scrollbar>
  </div>
  </div>
</template>

<script>
  export default {
     mounted () {
        this.$parent.subtitle="客户信息管理"
        this.load();
      },
    data() {
      return {
         currentPage:1,
     pageSize:5,
     totalNum:100,
         keyword: "",
         list: [],
          form:{
      }
      }
    },
    methods: {
      edit:function(row,index){
        console.log(row,index)
        this.axios.post("/api/customer/editstatus", {
          Id:this.list[index].Id,
          Status:this.list[index].Status
        })
        .then(result => {
        
           this.load();
        });
      },
     load: function() {
      this.$loading({
        text: "加载中"
        
      });
      //.get('url',{配置对象})
      this.axios
        .get("/api/customer/get", {
          //通过params指定地址上的查询字符串内容
          params: {
            //如果值为undefined，这不会加入到查询字符串中
            keyword: this.keyword,
            size:this.pageSize,
          page:this.currentPage
          }
        })
        .then(result => {
           this.totalNum=result.data.total;
          this.list = result.data.rows;
          setTimeout(() => {
            this.$loading().close();
          }, 200);
        });
    },
    }
  }
</script>