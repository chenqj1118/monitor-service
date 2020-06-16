<template>
  <div id="app">
    <el-container>
      <bkHeader></bkHeader>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import bkHeader from './components/public/bkheader'
export default {
  name: 'App',
  components: {bkHeader}
}
</script>

<style>
</style>
