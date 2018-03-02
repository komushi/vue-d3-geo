<template>
  <div id="app">
    <img src="./assets/logo.png">
    <d3-geo class="d3-geo-static" topojson-path="./assets/tokyo_23_blocks_districts_final.json"></d3-geo>
  </div>
</template>

<script>
import D3GeoStatic from './components/D3GeoStatic'

export default {
  name: 'app',
  components: {
    D3GeoStatic
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
