<template>
  <div id="app">
    <img src="./assets/logo.png">
    <d3-geo-static class="d3-geo-static" topojson-path="https://s3-ap-northeast-1.amazonaws.com/angular-example/tokyo_23_blocks_districts_final.json"></d3-geo-static>
    
    <d3-geo-double-layer id="01" topojson-path="https://s3-ap-northeast-1.amazonaws.com/angular-example/tokyo_23_blocks_districts_final.json"></d3-geo-double-layer>
  </div>
</template>

<script>
import D3GeoStatic from './components/D3GeoStatic'
import D3GeoDoubleLayer from './components/D3GeoDoubleLayer'

export default {
  name: 'app',
  components: {
    D3GeoStatic,
    D3GeoDoubleLayer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
