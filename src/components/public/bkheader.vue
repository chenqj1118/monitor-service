<template>
  <el-header height="60px" style="line-height: 60px;">
    <el-row :gutter="20">
      <el-col :span="12">
        <router-link to="/" class="logo">
          <img src="../../assets/images/logo.png"/>
        </router-link>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><a href="/">日志监控</a></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
  </el-header>
</template>
<script>
export default {
  name: 'bkheader',
  data () {
    return {}
  },
  mounted () {},
  methods: {
    handleCollapse (v) {
      this.$store.commit('setLeftNavIsCollapse', v);
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
