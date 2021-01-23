<template>
  <div id="app" v-loading="loading"
       element-loading-text="系统正在加载，请稍候..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <h3 style="margin: 0 0 10px 0">压缩机条码打印登记系统</h3>
    <router-view v-if="isRouterAliveApp"/>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="notes-o" @click="toAdd">条码打印登记</van-tabbar-item>
      <van-tabbar-item icon="search" @click="applyList">条码打印记录</van-tabbar-item>
      <van-tabbar-item icon="manager-o" @click="toDelete">条码记录管理</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide() {
      return {
        reloadTable: this.reloadTable
      }
    },
    data() {
      return {
        isRouterAliveApp: true,
        loading: true,
        active: null,
      }
    },
    mounted() {
      // let url = this.$route.fullPath
      // let str = url.split('?')
      // let codeAll = str[1].split('&')
      // let codeValue = codeAll[0].split('=')
      // this.ajaxVue
      //   .get(this.ajaxVue + '/weixin/getUserId?code=' + codeValue[1])
      //   .then(res => {
      //     if (res.status === 200) {
      //       alert('欢迎用户： ' + res.data.UserId + ' 进入铭牌打印登记系统')
      //       sessionStorage.setItem('userId', res.data.UserId)
            // sessionStorage.setItem('userId', 'test')
            this.$router.push('/layout')
            this.loading = false
        //   }
        // })
        // .catch(function (error) {
        //   console.log(error)
        // })
    },
    methods: {
      reloadTable() {
        this.isRouterAliveApp = false
        this.$nextTick(function () {
          this.isRouterAliveApp = true
        })
      },
      applyList() {
        this.$router.push('/applyList');
      },
      toAdd() {
        this.$router.push('/addRercode')
      },
      toDelete() {
        this.$router.push('/delete')
      },
    }
  }
</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }

  #app {
    background: rgba(54, 175, 232, 0.5);
    padding: 5px 0 0 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 750px;
  }
</style>
