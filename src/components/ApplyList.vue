<template>
  <div id="ExaminationList">
    <h3 style="margin: 0 0 20px 0">条码打印记录</h3>
    <el-main id="content">
      <template>
        <el-table :data="tableData" style="width: 100%;font-size: 13px" border size="mini"
                  v-loading="loading" stripe height="560px"
                  element-loading-text="拼命加载中">
          <el-table-column prop="displayDate" label="打印日期"></el-table-column>
          <el-table-column prop="minBarCode" label="条码最小值"></el-table-column>
          <el-table-column prop="maxBarCode" label="条码最大值"></el-table-column>
          <el-table-column prop="codeNum" label="打印条码数量"></el-table-column>
          <el-table-column prop="unitCode" label="单元码"></el-table-column>
          <el-table-column prop="customerCode" label="客户代码"></el-table-column>
          <el-table-column prop="printOrNot" label="历史是否打印"></el-table-column>
          <el-table-column prop="" label="状态" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:" @click="openPrint(scope.$index, scope.row)" v-if="scope.row.statusSp !== '已使用'">
                <i class="el-icon-check" style="color: deepskyblue">使用</i></a>
              <p v-else>已使用</p>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-main>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      layout="prev, pager, next"
      :total="page.total">
    </el-pagination>
    <el-dialog title="条码登记信息" :visible.sync="showPopup" border width="90%" top="5vh">
      <!--        <el-form :model="sprForm" status-icon ref="sprForm" label-width="100px" class="demo-ruleForm">-->
      <van-field readonly v-model="rowList.displayDate" type="text" label="打印日期" placeholder="请输入"/>
      <van-field readonly v-model="rowList.minBarCode" type="text" label="最小条码" placeholder="请输入"/>
      <van-field readonly v-model="rowList.maxBarCode" type="text" label="最大条码" placeholder="请输入"/>
      <van-field readonly v-model="rowList.codeNum" type="text" label="打印张数" placeholder="请输入"/>
      <van-field readonly v-model="rowList.unitCode" type="text" label="单元码" placeholder="请输入"/>
      <van-field readonly v-model="rowList.lineType" type="text" label="线别" placeholder="请输入"/>
      <van-field readonly v-model="rowList.model" type="text" label="型号" placeholder="请输入"/>
      <van-field readonly v-model="rowList.customerCode" type="text" label="客户代码" placeholder="请输入"/>
      <van-field readonly v-model="rowList.printOrNot" type="text" label="历史是否打印" placeholder="请输入"/>
      <van-field readonly v-model="rowList.statusSp" type="text" label="当前条码状态" placeholder="请输入"/>
      <!--          <el-form-item label="审批人" prop="spr">-->
      <!--            <el-select v-model="sprForm.spr" placeholder="审批人">-->
      <!--              <el-option label="周" value="周"></el-option>-->
      <!--              <el-option label="王" value="王"></el-option>-->
      <!--              <el-option label="李" value="李"></el-option>-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <van-button type="primary" @click="rowDisplay">提 交</van-button>
      <!--        </el-form>-->
    </el-dialog>
<!--    <el-dialog title="条码信息" :visible.sync="showPopup" border width="80%">-->
<!--      打印日期: <p>{{rowList.displayDate}}</p>-->
<!--      最小一维码: <p>{{rowList.minBarCode}}</p>-->
<!--      最大一维码: <p>{{rowList.maxBarCode}}</p>-->
<!--      打印张数: <p>{{rowList.codeNum}}</p>-->
<!--      单元码: <p>{{rowList.unitCode}}</p>-->
<!--      线别: <p>{{rowList.lineType}}</p>-->
<!--      &lt;!&ndash;      历史是否打印: <span>{{rowList.printOrNot}}</span>&ndash;&gt;-->
<!--      型号: <p>{{rowList.model}}</p>-->
<!--      客户代码: <p>{{rowList.customerCode}}</p>-->
<!--      当前状态: <p>{{rowList.statusSp}}</p><br>-->
<!--      <el-button type="primary" @click="rowDisplay" size="mini">使 用</el-button>-->
<!--    </el-dialog>-->
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
        page: {
          currentPage: 1,
          total: null,
          pageSize: 6,
        }
      }
    },
    mounted() {
      let result = null;
      this.ajaxVue
        .get(this.requestUrl + '/nameplate/getApplyRecord', {
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
        this.onSubmit();
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.onSubmit();
      },
      onSubmit() {
        this.loading = true
        let result = null;
        this.ajaxVue
          .get(this.requestUrl + '/nameplate/getApplyRecord', {
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
      openPrint(index, row) {
        this.rowList = row;
        this.showPopup = true;
      },
      rowDisplay() {
        console.log(this.rowList)
        if (this.rowList !== null) {
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
    }
  }
</script>

<style scoped>
  #ExaminationList {
    padding: 5px 0 0 0;
    width: 100%;
    height: 740px;
    background-color: #B3C0D1;
  }

  #content {
    background: #B3C0D1;
    text-align: left;
    padding: 2px;
  }

  p {
    color: red;
  }
</style>
