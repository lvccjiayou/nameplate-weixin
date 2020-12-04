<template>
  <div id="layout" v-if="this.flag">
    <el-container>
      <el-header style="text-align: center">
        <h2>铭牌打印记录系统</h2>
      </el-header>
      <el-container>
        <!--        <el-container >-->
        <el-menu default-active="2-1" style="height: 600px; width: 100%; text-align: center;">
          <el-submenu index="2">
            <template slot="title">微信端打印记录管理</template>
            <!--              <el-menu-item-group>-->
            <!--            <el-menu-item index="1-1">系统首页</el-menu-item>-->
            <el-menu-item index="2-1" @click="toAdd">新增条码记录</el-menu-item>
            <el-menu-item index="2-2" @click="toDelete">删除条码记录</el-menu-item>
            <el-menu-item index="2-3" @click="applyList">条码使用情况更新</el-menu-item>
            <!--            <el-menu-item index="2-1" @click="spApply" v-if="this.tableDataValue.jurisdiction.indexOf('1') !== -1">条码申请审批</el-menu-item>-->
            <!--              </el-menu-item-group>-->
          </el-submenu>
        </el-menu>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'layout',
    data() {
      return {
        tableData: [],
        tableDataValue: {
          jurisdiction: '',
          username: '',
          admin: ''
        },
        userID: null,
        isRouterAlive: true,
        flag: true,
      }
    },
    mounted() {
      //根据权限获取菜单栏显示
      // this.$router.push('/namePlate/index');
      // let result = null;
      // this.$axios
      //   .get(this.baseSystemUrl + '/nameplate/getUser', {
      //     params: {
      //       userID: 'lvgang',
      //     }
      //   })
      //   .then(response => (
      //     result = response.data,
      //       this.loginUser = result,
      //       this.loginUser.forEach(item => {
      //         this.tableData.push(item)
      //         this.tableData.forEach(itemValue => {
      //           this.tableDataValue.jurisdiction = itemValue.jurisdiction;
      //           console.log(this.tableDataValue.jurisdiction);
      //
      //           this.loadBody();
      //         })
      //       })
      //   ))
      //   .catch(function (error) {
      //     console.log(error);
      //   })

      //根据路径获取code
      let url = this.$route.fullPath
      let code = url.split('&')
      let code1 = code[1]
      let codeValue = code1.split('=')
      console.log(codeValue[1])
      this.ajaxVue
        .get(this.requestUrl + '/weixin/getUser', {
          params: {
            code: codeValue[1],
          }
        })
        .then(response => (
          this.userID = response.data,
            alert(this.userID)
        ))
    },
    methods: {
      applyList() {
        this.$router.push('/applyList');
      },
      toAdd() {
        this.$router.push('/addRercode')
      },
      toDelete() {
        this.$router.push('/delete')
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header {
    display: inline-block;
    background-color: #B3C0D1;
    color: #333;
    line-height: 30px;
    font-size: 12px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
