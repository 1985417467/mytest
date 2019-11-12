<template>
  <div>
    <div class="toolbar">
      <el-button size="medium" type="success" plain round icon="el-icon-plus">添加</el-button>
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
      <el-button size="medium" @click="load" type="primary" plain round icon="el-icon-refresh">刷新</el-button>
    </div>
    <div style="padding:10px;">
      <el-table
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
            {{scope.row.Title}}
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
              @click="editRow(scope.row)"
              type="warning"
              size="small"
              round
              plain
              icon="el-icon-edit-outline"
            >修改</el-button>
            <el-button
              @click="deleteRow(scope.row)"
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
      {{form}}
      <el-form :model="form" ref="form" label-width="80px">
        <el-container>
          <el-container>
            <el-header>
              <el-form-item label="门票名">
                <el-input v-model="form.title" placeholder></el-input>
              </el-form-item>

              <!-- Header content -->
            </el-header>
            <el-main>
              <el-container>
                <el-aside style="width:50%;">
                  <!-- Aside content -->
                  <el-form-item label="门票名">
                    <el-input v-model="form.title" placeholder></el-input>
                  </el-form-item>
                </el-aside>
                <el-container>
                  <el-main style="padding:0;">
                    <el-form-item label="商户地址">
                      <baiduMap
                        @click="onClick"
                        ref="map"
                        @suggestSelect="onSelect"
                        map-style="width:100%;height:300px;"
                        suggestId="abc"
                      >
                        <el-form-item>
                          <el-input id="abc" v-model="form.shopAddress"></el-input>
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
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import baiduMap from "./baidumap";
export default {
  data() {
    return {
      form: {},
      list: [],
      title: "添加",
      dialogShow: true,
      total: 0,
      size: 10,
      page: 1,
      keyword: ""
    };
  },
  methods: {
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
    load() {
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
    this.$root.subTitle = "门票管理";
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