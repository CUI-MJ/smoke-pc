<template>
  <div class="device">
    <!--<img src="../assets/logo.png"/>-->
    <div>{{path}}</div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      path:'设备管理'
    }
  },
  mounted(){
    // console.log(this.$route.path);
  }
}
</script>

<style scoped>

</style>
