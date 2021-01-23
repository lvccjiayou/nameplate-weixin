<template>
  <div class="deleteList">
    <h3 style="margin: 0 0 10px 0">删除登记记录</h3>
    <el-container>
      <el-main id="content">
          <el-table :data="tableData" style="width: 100%;font-size: 13px;" border size="mini" v-loading="loading"
                    element-loading-text="拼命加载中" height="560px">
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
            <el-table-column prop="" label="操作" fixed="right">
              <template slot-scope="scope">
                <a href="javascript:" @click="rowDelete(scope.$index, scope.row)" v-if="scope.row.statusSp === '待使用'">
                  <i class="el-icon-close" style="color: red">撤销登记</i></a>
                <p v-else>不可撤销</p>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="page.pageSizes"
            :page-size="page.pageSize"
            layout="prev, pager, next"
            :total="page.total">
          </el-pagination>
      </el-main>
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
          pageSize: 6,
        }
      }
    },
    mounted() {
      let result = null;
      this.ajaxVue
        .get(this.requestUrl+'/nameplate/getGroupListForPage', {
          params: {
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
        this.loading = true
        let result = null;
        this.ajaxVue
          .get(this.requestUrl+'/nameplate/getGroupListForPage', {
            params: {
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
              this.page.total = this.resultResponse.total,
            this.loading = false
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
    },

  }
</script>

<style scoped>
  .deleteList{
    padding: 5px 0 0 0;
    width: 100%;
    height: 740px;
    background-color: #B3C0D1;
  }
  .el-main {
    background: #B3C0D1;
    text-align: center;
    padding: 5px;
  }
</style>
