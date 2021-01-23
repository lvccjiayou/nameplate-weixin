<template>
  <div id="AddRercode">
    <div id="inputForm">
      <h3 style="margin: 0 0 20px 0">条码打印登记</h3>
      <div id="content">
        <van-field v-model="ruleForm.minBarCode" type="text" label="物料编码" placeholder="请输入">
          <template #button>
            <van-button style="width: 60px;" size="mini" type="primary" @click="scannerMin">扫 码</van-button>
          </template>
        </van-field>
        <van-field v-model="ruleForm.maxBarCode" type="text" label="量仪名称" placeholder="请输入">
          <template #button>
            <van-button style="width: 60px;" size="mini" type="primary" @click="scannerMax">扫 码</van-button>
          </template>
        </van-field>
        <br>
        <van-button type="primary" @click="openPopup">查询</van-button>
        <van-button type="default" @click="resetForm">重置</van-button>
      </div>
    </div>
    <div id="popup">
      <el-dialog title="铭牌登记情况" :visible.sync="dialogTableVisible" border width="90%" top="5vh">
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
              <a href="javascript:" @click="rowDisplay(scope.$index, scope.row)" v-if="scope.row.statusSp === '待使用'">
                <i class="el-icon-check" style="color: deepskyblue">登记</i></a>
              <p v-else>已登记</p>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button id="popupButton1" @click="dialogTableVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="条码登记信息" :visible.sync="dialogSPRForm" border width="90%" top="5vh">
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
        <van-field readonly v-model="rowList.statusSp" type="text" label="当前状态" placeholder="请输入"/>
        <!--          <el-form-item label="审批人" prop="spr">-->
          <!--            <el-select v-model="sprForm.spr" placeholder="审批人">-->
          <!--              <el-option label="周" value="周"></el-option>-->
          <!--              <el-option label="王" value="王"></el-option>-->
          <!--              <el-option label="李" value="李"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <van-button type="primary" @click="submitRecord">提 交</van-button>
<!--        </el-form>-->
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'

  export default {
    name: "AddRercode",
    data() {
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

        saomaResult: null,
      };
    },
    mounted() {
      // 注入weixinjs接口验证
      let qrurl = location.href;
      this.ajaxVue
        .post(this.requestUrl + '/weixin/getJsapi?url=' + qrurl)
        .then(function (res) {
          if (res.status === 200) {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: res.data.appId, // 必填，企业微信的corpID
              timestamp: res.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
              signature: res.data.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
              jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
            });
          }
        })
    },
    methods: {
      scannerMin() {
        wx.ready(function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              alert("扫描结果：" + result);
              this.minBarCode = result.split(',')[1]
            }
          });
        })
        wx.error(function (res) {
          alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        });
      },
      scannerMax() {
        wx.ready(function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              alert("扫描结果：" + result);
              this.maxBarCode = result.split(',')[1]
            }
          });
        })
        wx.error(function (res) {
          alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        });
      },
      resetForm() {
        this.ruleForm.minBarCode = ''
        this.ruleForm.maxBarCode = ''
      },
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
        if (row.statusSp === '已使用') {
          alert("该条码已有打印记录，请根据已有打印记录条码的最大值修改输入的条码值或选择其他记录进行打印并登记!\n" +
            "当前已打印记录的条码最大值为：" + row.maxBarCode);
        } else {
          this.rowList = row;
          // this.submitRecord();
          this.dialogSPRForm = true;
        }
      }
    }
  }
</script>

<style scoped>
  #AddRercode{
    padding: 5px 0 0 0;
    width: 100%;
    height: 740px;
    background-color: #B3C0D1;
  }
  #inputForm {
    margin: 0 10px 0 10px;
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
