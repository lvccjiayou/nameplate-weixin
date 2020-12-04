<template>
  <div id="ExaminationList">
    <h3>更新使用记录</h3>
    <el-container>
      <el-header id="search">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
          <el-form-item label="打印日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.displaydate"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查 询</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-header id="button">
        <el-button id="fanhui" icon="el-icon-arrow-left" type="primary" size="mini" @click="fanhui">返 回</el-button>
        <!--        <el-button id="excel" type="primary" size="mini">导出记录</el-button>-->
      </el-header>
      <el-main id="content">
        <template>
          <el-table :data="tableData" style="width: 100%;font-size: 13px" border size="mini"
                    v-loading="loading"
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
            <el-table-column prop="" label="操作" fixed="right">
              <template slot-scope="scope">
                <a href="javascript:" @click="openPrint(scope.$index, scope.row)" v-if="scope.row.statusSp !== '已使用'">
                  <i class="el-icon-check" style="color: deepskyblue">更新</i></a>
                <p v-else>已使用</p>
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
          layout="sizes, prev, pager, next"
          :total="page.total">
        </el-pagination>
      </el-footer>
      <el-dialog title="条码信息" :visible.sync="showPopup" border width="80%">
        打印日期: <p>{{rowList.displayDate}}</p>
        最小一维码: <p>{{rowList.minBarCode}}</p>
        最大一维码: <p>{{rowList.maxBarCode}}</p>
        打印张数: <p>{{rowList.codeNum}}</p>
        单元码: <p>{{rowList.unitCode}}</p>
        线别: <p>{{rowList.lineType}}</p>
        <!--      历史是否打印: <span>{{rowList.printOrNot}}</span>-->
        型号: <p>{{rowList.model}}</p>
        客户代码: <p>{{rowList.customerCode}}</p>
        当前状态: <p>{{rowList.statusSp}}</p><br>
        <el-button type="primary" @click="rowDisplay" size="mini">使 用</el-button>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
  export default {
    inject: ['reloadTable'],
    name: "ExaminationList",
    data() {
      return {
        loading: true,
        showPopup: false,
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
          model: '',
          customerCode: '',
          spr: '',
        },
        searchForm: {
          displaydate: '',
          // printornot: '',
          statusSp: ''
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
        .get(this.requestUrl + '/nameplate/getApplyRecord', {
          params: {
            displaydate: this.searchForm.displaydate,
            // printornot: this.searchForm.printornot,
            statusSp: this.searchForm.statusSp,
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
        this.onSubmit();
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.onSubmit();
      },
      onSubmit() {
        let result = null;
        this.ajaxVue
          .get(this.requestUrl + '/nameplate/getApplyRecord', {
            params: {
              displaydate: this.searchForm.displaydate,
              // printornot: this.searchForm.printornot,
              statusSp: this.searchForm.statusSp,
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
      openPrint(index, row) {
        this.rowList = row;
        this.showPopup = true;
      },
      rowDisplay() {
        console.log(this.rowList)
        if (this.rowList !== null ) {
          this.ajaxVue
            .get(this.requestUrl + '/nameplate/updateRecord', {
              params: {
                id: this.rowList.id,
                displaydate: this.rowList.displayDate,
                minbarcode: this.rowList.minBarCode,
                maxbarcode: this.rowList.maxBarCode,
                codenum: this.rowList.codeNum,
                unitcode: this.rowList.unitCode,
                linetype: this.rowList.lineType,
                printornot: '是',
                statusSp: '已使用',
                spr: this.rowList.spr,
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
          alert("该申请待审批或被驳回，无法打印!")
        }
      },
      fanhui() {
        this.$router.push('/layout')
      },
    }
  }
</script>

<style scoped>
  #ExaminationList {
    margin: 10px 10px 0 10px;
    padding: 0;
  }

  .el-header {
    text-align: left;
    height: auto;
    padding: 0;
  }

  #excel {
    margin: 15px 20px 0 0;
    float: left;
  }

  #fanhui {
    margin: 15px 20px 0 0;
    float: left;
  }

  #button {
    text-align: left;
    background: #ffffff;
    border-top: #9ba5af solid 1px;
    border-bottom: #9ba5af solid 1px;
  }

  #content {
    background: #B3C0D1;
    text-align: left;
    padding: 5px;
  }

  .el-form-item {
    margin: 0;
    line-height: 25px;
  }

  #footer {
    margin: 0 auto;
  }

  .el-pagination {
    line-height: 30px;
  }

  p {
    color: red;
  }

  /*.el-pager {*/
  /*  line-height: 30px;*/
  /*}*/
</style>
