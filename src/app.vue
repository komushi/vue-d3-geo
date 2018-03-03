<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
<!--     <d3-geo-static class="d3-geo-static" topojson-path="https://s3-ap-northeast-1.amazonaws.com/angular-example/tokyo_23_blocks_districts_final.json"></d3-geo-static> -->
    

    <d3-geo-double-layer 
      id="01" 
      topojson-path="https://s3-ap-northeast-1.amazonaws.com/angular-example/tokyo_23_blocks_districts_final.json"
      on-receive-events="subTaxiEventsFrom"
      on-stop-events="unsubTaxiEvents"
      >    
    </d3-geo-double-layer>
  </div>
</template>

<script>
// import D3GeoStatic from './components/D3GeoStatic'
import D3GeoDoubleLayer from './components/D3GeoDoubleLayer'

export default {
  name: 'app',
  components: {
    // D3GeoStatic,
    D3GeoDoubleLayer
  },
  data() {
    return {
      districtRank: null
    };
  },
  methods: {
    subTaxiEventsFrom() {
      console.log('subTaxiEventsFrom');
    },
    unsubTaxiEvents() {
      console.log('unsubTaxiEvents');
    },
    generateData() {
      let districtRank = {};
      let rank = 1;
      let i;
      for (i = 101; i <= 123; i++){

        const min = 0;
        const max = 10;
        
        let count = Math.floor(Math.random() * (max - min + 1)) + min;


        districtRank[i.toString()] = {district:i, dropoffCount:count, rank: rank};
        rank++;
      }

      console.log(this.districtRank);
      this.districtRank = districtRank;
      console.log(this.districtRank);
    }
  },
  mounted() {
    this.generateData();
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
