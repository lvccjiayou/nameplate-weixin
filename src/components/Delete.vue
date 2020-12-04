<template>
  <div class="deleteList">
    <h3>删除登记记录</h3>
    <el-container>
      <el-header id="search">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
          <el-form-item label="打印日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.displaydate"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getNamePlate" >查询</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-header id="button">
        <!--        <el-button id="addList" type="primary" size="mini" @click="addList">新建扫描</el-button>-->
        <el-button id="excel" type="primary" size="mini" @click="fanhui">返 回</el-button>
        <!--        <el-upload-->
        <!--          class="upload-demo"-->
        <!--          :action="uploadUrl"-->
        <!--          name="file"-->
        <!--          accept=".xls, .xlsx"-->
        <!--          :show-file-list="false"-->
        <!--          :on-success="uploadSuccess">-->
        <!--          <el-button size="mini" type="primary">点击上传</el-button>-->
        <!--        </el-upload>-->
      </el-header>
      <el-main id="content">
        <template>
          <el-table :data="tableData" style="width: 100%;font-size: 13px;" border size="mini" v-loading="loading"
                    element-loading-text="拼命加载中">
            <el-table-column prop="displayDate" label="打印日期"></el-table-column>
            <el-table-column prop="minBarCode" label="条码最小值"></el-table-column>
            <el-table-column prop="maxBarCode" label="条码最大值"></el-table-column>
            <el-table-column prop="codeNum" label="打印条码数量"></el-table-column>
<!--            <el-table-column prop="unitCode" label="单元码"></el-table-column>-->
<!--            <el-table-column prop="lineType" label="线别"></el-table-column>-->
<!--            <el-table-column prop="printOrNot" label="历史是否打印"></el-table-column>-->
<!--            <el-table-column prop="model" label="型号"></el-table-column>-->
<!--            <el-table-column prop="customerCode" label="客户代码"></el-table-column>-->
<!--            <el-table-column prop="statusSp" label="状态"></el-table-column>-->
            <el-table-column prop="" label="操作">
              <template slot-scope="scope">
                <a href="javascript:" @click="rowDelete(scope.$index, scope.row)" v-if="scope.row.statusSp === '待使用'">
                  <i class="el-icon-close" style="color: red">撤销记录</i></a>
                <p v-else>不可撤销</p>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <el-footer id="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="page.total">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  export default {
    inject: ['reloadTable'],
    name: "deleteList",
    data() {
      return {
        loading: true,
        resultResponse: {
          current: '',
          orders: '',
          pages: '',
          records: '',
          searchCount: '',
          size: '',
          total: '',
        },
        responseArray: null,
        tableData: [],
        successReq: '',
        uploadUrl: this.requestUrl +'/nameplate/importExcel',
        searchForm: {
          displaydate: '',
          printornot: '',
          statusSp: '',
        },
        rowList: {
          id: '',
          displayDate: '',
          printOrNot: '',
          codeNum: '',
          lineType: '',
          maxBarCode: '',
          minBarCode: '',
          statusSp: '',
          unitCode: '',
          spr: '',
        },
        page: {
          currentPage: 1,
          total: null,
          pageSizes: ['10', '20', '30'],
          pageSize: 10,
        }
      }
    },
    mounted() {
      let result = null;
      this.ajaxVue
        .get(this.requestUrl+'/nameplate/getGroupListForPage', {
          params: {
            displaydate: this.searchForm.displaydate,
            // printornot: this.searchForm.printornot,
            // statusSp: this.searchForm.statusSp,
            currentPage: this.page.currentPage,
            pageSize: this.page.pageSize,
          }
        })
        .then(response => (
          result = response.data,
            this.resultResponse = result,
            this.responseArray = this.resultResponse.records,
            this.responseArray.forEach(item => {
              if (item !== null) {
                item.forEach(itemArray => {
                  this.tableData.push(itemArray);
                })
              }
            }),
            this.loading = false,
            this.page.total = this.resultResponse.total
        ))
        .catch(function (error) {
          console.log(error);
        })
    },
    methods: {
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.getNamePlate();
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.getNamePlate();
      },
      getNamePlate() {
        let result = null;
        this.ajaxVue
          .get(this.requestUrl+'/nameplate/getGroupListForPage', {
            params: {
              displaydate: this.searchForm.displaydate,
              // printornot: this.searchForm.printornot,
              // statusSp: this.searchForm.statusSp,
              currentPage: this.page.currentPage,
              pageSize: this.page.pageSize,
            }
          })
          .then(response => (
            result = response.data,
              this.resultResponse = result,
              this.responseArray = this.resultResponse.records,
              this.responseArray.forEach(item => {
                if (item !== null) {
                  this.tableData = [];
                  item.forEach(itemArray => {
                    this.tableData.push(itemArray);
                  })
                }
              }),
              this.page.total = this.resultResponse.total
          ))
          .catch(function (error) {
            console.log(error);
          })
      },
      // addList() {
      //   this.$router.push('/namePlate/add');
      // },
      rowDelete(index, row) {
        this.rowList = row;
        if (row !== null && row.statusSp === '待使用') {
          this.ajaxVue
            .get(this.requestUrl+'/nameplate/deleteRecord', {
              params: {
                id: this.rowList.id,
              }
            })
            .then(response => (
              response = this.successReq,
                this.reloadTable()
            ))
            .catch(function (error) {
              console.log(error);
            })
        } else {
          alert("该记录无法删除!")
        }
      },
      fanhui() {
        this.$router.push('/layout')
      },
    },

  }
</script>

<style scoped>
  .deleteList{
    margin: 10px 10px 0 10px;
    padding: 0;
  }
  .el-header {
    text-align: left;
    padding: 0;
  }

  #addList,
  #excel,
  #input {
    margin: 15px 20px 0 0;
    float: left;
  }

  .el-main {
    background: #B3C0D1;
    text-align: left;
    padding: 5px;
  }

  #button {
    text-align: left;
    background: #ffffff;
    border-top: #9ba5af solid 1px;
    border-bottom: #9ba5af solid 1px;
  }

  .el-form-item {
    margin: 0;
    line-height: 25px;
  }

  .el-pagination {
    line-height: 30px;
  }

  .el-pager {
    line-height: 30px;
  }

  .upload-demo {
    margin-top: 2px;
    height: 50px;
    line-height: 50px;
    float: left;
  }
  .el-footer {
    text-align: center;
  }

</style>
