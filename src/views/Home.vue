<template>
  <div class="home">
    <h2 class="mt-0">MV 列表 (更新时间：{{ parseTime(updateTime) }})</h2>
    <div class="flex items-center">
      <p>地区：</p>
      <el-radio-group v-model="areaType" @change="handleAreaChange">
        <el-radio-button :label="null">全部</el-radio-button>
        <el-radio-button label="内地" />
        <el-radio-button label="港台" />
        <el-radio-button label="欧美" />
        <el-radio-button label="日本" />
        <el-radio-button label="韩国" />
      </el-radio-group>
      <p class="ml-8">aria2 下载地址：</p>
      <el-input
        v-model="downloadPath"
        placeholder="aria2 下载地址"
        style="width: 300px"
      />
    </div>
    <div class="flex items-center">
      <p>排序：</p>
      <el-radio-group v-model="orderType" @change="handleOrderChange">
        <el-radio-button :label="null">上升最快</el-radio-button>
        <el-radio-button label="最热" />
        <el-radio-button label="最新" />
      </el-radio-group>
      <p class="ml-8">已选：{{ multipleSelection.length }}</p>
      <el-button
        type="primary"
        class="ml-8"
        v-if="multipleSelection.length > 0"
        @click="handleMultipleDownload"
        >批量下载</el-button
      >
    </div>
    <el-table
      border
      :data="data"
      style="width: 100%"
      class="mt-8"
      @selection-change="handleSelectionChange"
      v-loading="isLoading"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="260"> </el-table-column>
      <el-table-column prop="artistName" label="作者" width="120">
      </el-table-column>
      <el-table-column label="封面" width="200" align="center">
        <template slot-scope="scope">
          <el-image
            class="el-avatar"
            :src="scope.row.cover"
            :preview-src-list="[scope.row.cover]"
            fit="contain"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="playCount" label="Play Count" />
      <el-table-column prop="score" label="Score" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-download"
            circle
            @click="download(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mt-16"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100, 1000]"
      :page-size="limitPage"
      layout="prev, pager, next, jumper,sizes"
    >
    </el-pagination>
  </div>
</template>

<script>
// @ is an alias to /src
import request from "@/utils/request";
import { parseTime } from "@/utils";
const Aria2 = require("aria2");
const aria2 = new Aria2({
  host: "localhost",
  port: 16800,
  secure: false,
  secret: "",
  path: "/jsonrpc"
});
export default {
  name: "home",
  data() {
    return {
      data: [],
      downloadPath: "/Users/limy/Downloads/mv",
      isLoading: false,
      currentPage: 0,
      limitPage: 10,
      updateTime: null,
      orderType: null,
      areaType: null,
      multipleSelection: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    parseTime,
    init() {
      this.isLoading = true;
      request
        .get("/mv/all", {
          params: {
            order: this.orderType,
            limit: this.limitPage,
            area: this.areaType,
            offset: this.currentPage * this.limitPage
          }
        })
        .then(res => {
          this.updateTime = res.updateTime;
          this.data = res.data;
          this.isLoading = false;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAreaChange() {
      this.currentPage = 0;
      this.init();
    },
    handleOrderChange() {
      this.currentPage = 0;
      this.init();
    },
    handleSizeChange(val) {
      this.limitPage = val;
      this.currentPage = 0;
      this.init();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleMultipleDownload() {
      this.multipleSelection.forEach(row => {
        this.download(row);
      });
    },
    download(row) {
      const loading = this.$loading({
        lock: true,
        text: "下载请求中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      request
        .get("/mv/url", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          const name = row.name + " - " + row.artistName + ".mp4";
          const url = res.data.url;
          aria2.call("addUri", [url], {
            dir: this.downloadPath,
            out: name
          });
          loading.close();
        });
    }
  }
};
</script>
