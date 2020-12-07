<template>
  <div id="AddRercode">
    <h3>条码登记</h3>
    <div id="inputForm">
      <div id="header">
        <el-button type="primary" icon="el-icon-arrow-left" size="small" @click="returnList">返 回</el-button>
      </div>
      <div id="content">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="条码最小值" prop="minBarCode">
            <el-input type="text" v-model="ruleForm.minBarCode" maxlength="15"></el-input>
                        <a @click="minSao"><i class="el-icon-full-screen"> 扫一扫</i></a>
            <p>扫码结果：{{saomaResult}}</p>
          </el-form-item>
          <el-form-item label="条码最大值" prop="maxBarCode">
            <el-input type="text" v-model="ruleForm.maxBarCode" maxlength="15"></el-input>
<!--                        <el-button @click="sao">扫一扫</el-button>-->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div id="popup">
      <el-dialog title="铭牌扫描记录" :visible.sync="dialogTableVisible" border width="90%">
        <el-table :data="tableData" style="font-size: 13px" border size="mini">
          <el-table-column prop="displayDate" label="打印日期"></el-table-column>
          <el-table-column prop="minBarCode" label="条码最小值"></el-table-column>
          <el-table-column prop="maxBarCode" label="条码最大值"></el-table-column>
          <el-table-column prop="codeNum" label="打印条码数量"></el-table-column>
          <!--          <el-table-column prop="unitCode" label="单元码"></el-table-column>-->
          <!--          <el-table-column prop="lineType" label="线别"></el-table-column>-->
          <!--          <el-table-column prop="printOrNot" label="是否已扫描"></el-table-column>-->
          <!--          <el-table-column prop="model" label="型号"></el-table-column>-->
          <!--          <el-table-column prop="customerCode" label="客户代码"></el-table-column>-->
          <!--          <el-table-column prop="statusSp" label="状态"></el-table-column>-->
          <el-table-column prop="" label="操作" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:" @click="rowDisplay(scope.$index, scope.row)" v-if="scope.row.printOrNot === '否'">
                <i class="el-icon-check" style="color: deepskyblue">提交</i></a>
              <p v-else>已登记</p>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button id="popupButton1" @click="dialogTableVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="打印信息" :visible.sync="dialogSPRForm" border width="90%">
        <el-form :model="sprForm" status-icon ref="sprForm" label-width="100px" class="demo-ruleForm">
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
          <!--          <el-form-item label="审批人" prop="spr">-->
          <!--            <el-select v-model="sprForm.spr" placeholder="审批人">-->
          <!--              <el-option label="周" value="周"></el-option>-->
          <!--              <el-option label="王" value="王"></el-option>-->
          <!--              <el-option label="李" value="李"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-button id="popupButton2" type="primary" @click="submitRecord">提 交</el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AddRercode",
    data() {
      const validateMin = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入最小条码'));
        } else {
          callback();
        }
      };
      const validateMax = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入最大条码'));
        } else {
          callback();
        }
      };
      return {
        dialogTableVisible: false,
        dialogSPRForm: false,
        tableData: null,
        successReq: '',
        rowList: {
          displayDate: '',
          printOrNot: '',
          codeNum: '',
          lineType: '',
          maxBarCode: '',
          minBarCode: '',
          statusSp: '',
          unitCode: '',
          customerCode: '',
          model: '',
        },
        ruleForm: {
          minBarCode: '',
          maxBarCode: '',
        },
        sprForm: {
          spr: '',
        },
        rules: {
          minBarCode: [
            {validator: validateMin, trigger: 'blur'}
          ],
          maxBarCode: [
            {validator: validateMax, trigger: 'blur'}
          ],
        },
        saomaResult:null,
      };
    }
    ,
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
      ,
      returnList() {
        this.$router.push('/layout');
      }
      ,
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.openPopup();
          } else {
            alert("条码不能为空！")
            return false;
          }
        });
      }
      ,
      openPopup() {
        this.ajaxVue
          .get(this.requestUrl + '/nameplate/getScanningList', {
            params: {
              minbarcode: this.ruleForm.minBarCode,
              maxbarcode: this.ruleForm.maxBarCode,
            }
          })
          .then(response => (
            this.tableData = response.data
          ))
          .catch(function (error) {
            console.log(error);
          })

        this.dialogTableVisible = true;
      }
      ,
      submitRecord() {
        console.log(this.rowList)
        if (this.ruleForm.minBarCode !== '' && this.ruleForm.maxBarCode !== '') {
          this.ajaxVue
            .get(this.requestUrl + '/nameplate/add', {
              params: {
                displaydate: this.rowList.displayDate,
                minbarcode: this.rowList.minBarCode,
                maxbarcode: this.rowList.maxBarCode,
                codenum: this.rowList.codeNum,
                unitcode: this.rowList.unitCode,
                linetype: this.rowList.lineType,
                printornot: this.rowList.printOrNot,
                statusSp: this.rowList.statusSp,
                // spr: this.sprForm.spr,
              }
            })
            .then(response => (
              this.successReq = response,
                this.$router.push('/applyList')
            ))
          this.dialogSPRForm = false;
          this.dialogTableVisible = false;
          alert("提交成功！")
        } else {
          alert("条码不能为空！");
        }
      }
      ,
      rowDisplay(index, row) {
        if (row.printOrNot === '是') {
          alert("该条码已有打印记录，请根据已有打印记录条码的最大值修改输入的条码值或选择其他记录进行打印并登记!\n" +
            "当前已打印记录的条码最大值为：" + row.maxBarCode);
        } else {
          this.rowList = row;
          // this.submitRecord();
          this.dialogSPRForm = true;
        }
      }
      ,
      minSao(){
        console.log("调用扫一扫接口")
        wx.config({
          beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: '', // 必填，企业微信的corpID
          timestamp: '', // 必填，生成签名的时间戳
          nonceStr: '', // 必填，生成签名的随机串
          signature: '',// 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: [] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });
        wx.ready(function(){
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
        wx.error(function(res){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
        wx.checkJsApi({
          jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function(res) {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          }
        });
        this.wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是条形码（一维码），默认二者都有
          success: function(res) {
            this.saomaResult = res.resultStr
            console.log("扫码成功" + res)
          },
          error: function(res) {
            if (res.errMsg.indexOf('function_not_exist') > 0) {
              alert('版本过低请升级')
            }
          }
        });
      }
    }
  }
</script>

<style scoped>
  #inputForm {
    margin: 0 10px 0 10px;
  }

  #header {
    text-align: left;
    margin-bottom: 10px;
  }

  #content {
    border: #B3C0D1 solid 1px;
    padding: 2px;
  }

  .dialog-footer {
    height: 100px;
  }

  p {
    color: red;
  }
</style>
