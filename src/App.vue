<template>
  <div id="app">
    <router-view v-if="isRouterAliveApp"/>
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
      }
    },
    mounted() {
      this.$router.push('/layout')
    },
    methods: {
      reloadTable() {
        this.isRouterAliveApp = false
        this.$nextTick(function () {
          this.isRouterAliveApp = true
        })
      },
    }
  }
</script>

<style>
  body{
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
