<template>
  <div id="app">



<!-- 
    <d3-geo-double-layer 
      id="01" 
      topojson-path="data/tokyo_23_blocks_districts_final.json"
      :layer1-event-data="districtRankList"
      :layer2-event-data="circleData"
      layer1-event-count-tag="dropoffCount"
      @on-receive-events="subTaxiEventsFrom"
      @on-stop-events="unsubTaxiEvents"
      >    
    </d3-geo-double-layer>
-->
<!--      
     <d3-geo-events 
      id="02" 
      topojson-path="data/tokyo_23_blocks_districts_final.json"
      :layer-event-data="matrixJson"
      >    
    </d3-geo-events> 
 -->
<!-- 
    <d3-geo-static
      id="03" 
      topojson-path="data/tokyo_23_blocks_districts_final.json"
      color-range='#6f97d9,#6f97d9'
      >    
    </d3-geo-static>

  -->
<!--     <d3-geo-static
      id="03" 
      topojson-path="data/states.topojson"
      layer-objects="states"
      layer-feature-name="properties.STUSPS"
      layer-feature-code="properties.NAME"
      color-range='#6f97d9,#6f97d9'
      >    
    </d3-geo-static> -->
 

    <div>
      <button @click="clearHandler">clear</button>
      <div v-for="item in apiResponse">
        <input type="radio" v-model="geojsonString" name="time_window" :value="item.geojson"> {{item.window_start}}
      </div>
    </div>



    <div style="width: 100%; height: 800px">
      <d3-geo-leaf
        tile-provider="Stamen.TonerLite"
        :geojson-object="featureStatistics"
        color-range="#0000ff,#e623e4,#ff0000"
        :auto-fit-bounds="true"
        @dragend="onDragEnd"
        @zoomend="onZoomEnd"
        @initmap="onInit"
        >    
      </d3-geo-leaf>     
    </div>
    
  
<!-- 
    <div>
      <button @click="clearHandler">clear</button>
      <div v-for="item in apiResponse">
        <input type="radio" v-model="geojsonString" name="area" :value="item.geojson"> {{item.area}}
      </div>
      <button @click="highlightHandler">highlight</button>
    </div>

     <div style="width: 100%; height: 800px">
      <d3-geo-leaf-polygon
        tile-provider="Stamen.TonerLite"
        :geojson-object="featureStatistics"
        color="#FF6600"
        :auto-fit-bounds="true"
        :highlighted-meshes="meshes"
        @dragend="onDragEnd"
        @zoomend="onZoomEnd"
        @initmap="onInit"
        >    
      </d3-geo-leaf-polygon>     
    </div>

 -->

  </div>
</template>

<script>
import D3GeoStatic from './components/D3GeoStatic'
import D3GeoDoubleLayer from './components/D3GeoDoubleLayer'
import D3GeoEvents from './components/D3GeoEvents'
import D3GeoLeaf from './components/D3GeoLeaf'
import D3GeoLeafPolygon from './components/D3GeoLeafPolygon'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    D3GeoStatic,
    D3GeoDoubleLayer,
    D3GeoEvents,
    D3GeoLeaf,
    D3GeoLeafPolygon
  },
  computed: {
    featureStatistics: function() {
      if (this.geojsonString) {
        return JSON.parse(this.geojsonString);
      } else {
        return null;
      }
    }
  },  
  data() {
    return {
      meshes: [],
      geojsonString: null,
      apiResponse: [],
      currentSubway: null,
      jsons: [],
      matrixJson: null,
      timer: 0,
      districtRankList: null,
      circleData: null,
      coordinates:
        [[139.734291,35.688634],
        [139.760496,35.690335],
        [139.770401,35.694069],
        [139.765043,35.68835],
        [139.7661246316267,35.68825974504272],
        [139.7657681127479,35.687651654673644],
        [139.745212,35.691125],
        [139.759712,35.700672],
        [139.755267,35.693319],
        [139.761334,35.674706],
        [139.750424,35.670865],
        [139.7414532200372,35.679581104938],
        [139.749899,35.701827],
        [139.74692,35.696674],
        [139.740164,35.692643],
        [139.768072,35.687348],
        [139.75074,35.671377],
        [139.743383,35.697602],
        [139.764721,35.679816],
        [139.7507934778318,35.671386654224115],
        [139.7507934778318,35.671386654224115],
        [139.7507934778318,35.671386654224115],
        [139.743383,35.697602],
        [139.7507934778318,35.671386654224115],
        [139.76294,35.677412],
        [139.76585163985027,35.68940619519768],
        [139.761877,35.675639],
        [139.7507934778318,35.671386654224115],
        [139.746458,35.671899],
        [139.74692,35.696674],
        [139.746458,35.671899],
        [139.766939,35.683965],
        [139.737945,35.688772],
        [139.754544,35.669638],
        [139.757993,35.692478],
        [139.750962,35.672238],
        [139.765683,35.676349],
        [139.73610888396263,35.68553725865768],
        [139.73610888396263,35.685537258666734],
        [139.753961,35.690292],
        [139.757993,35.692478],
        [139.752018,35.671321],
        [139.757993,35.692478],
        [139.734048,35.684031],
        [139.742659,35.680767],
        [139.754544,35.669638],
        [139.753683,35.698596],
        [139.750424,35.670865],
        [139.765854,35.689364],
        [139.745793,35.692572],
        [139.745796,35.67096],
        [139.75463308702805,35.690506392289514],
        [139.757993,35.692478],
        [139.76441428407463,35.687749511028905],
        [139.742659,35.680767],
        [139.742659,35.680767],
        [139.754544,35.669638],
        [139.742824,35.675821],
        [139.742463,35.678098],
        [139.744685,35.676487],
        [139.742463,35.678098],
        [139.745074,35.675182],
        [139.7470116382056,35.678418885519754],
        [139.742463,35.678098],
        [139.74505617405612,35.67525922701384],
        [139.74465211932687,35.6765672952068],
        [139.74505617405615,35.675254401080785],
        [139.7484141620185,35.67166693581735],
        [139.752737,35.672691],
        [139.748046,35.673099],
        [139.742657,35.67882],
        [139.748046,35.673099],
        [139.748046,35.673099],
        [139.748046,35.673099],
        [139.748046,35.673099],
        [139.750157,35.676043],
        [139.748046,35.673099],
        [139.742657,35.67882],
        [139.748046,35.673099],
        [139.753073,35.673377],
        [139.745518,35.673015],
        [139.748046,35.673099],
        [139.7452951757008,35.67302465399794],
        [139.762711,35.689542],
        [139.7406821860937,35.67312691603093],
        [139.742657,35.67882],
        [139.742657,35.67882],
        [139.7453011176821,35.67295707637637],
        [139.762711,35.689542],
        [139.748046,35.673099],
        [139.742657,35.67882],
        [139.7453011176821,35.67295707637637],
        [139.743713,35.672988],
        [139.7541,35.683792],
        [139.74798931035463,35.67179002702629],
        [139.75461119813127,35.67567441585073],
        [139.74071189600025,35.67305209778313],
        [139.75124,35.675626],
        [139.75124,35.675626],
        [139.758656,35.685403]]
    };
  },
  methods: {
    onDragEnd(bounds) {
      // console.log('onDragEnd', bounds);
    },
    onZoomEnd(bounds) {
      // console.log('this.onZoomEnd', bounds);
    },    
    onInit(bounds) {
      // console.log('this.onInit', bounds);
    },      
    /*** for 2-layer ***/
    subTaxiEventsFrom(payload) {
      // console.log('subTaxiEventsFrom');
      // console.log('payload', payload);

      if (payload == '101') {
        // console.log('this.timer', this.timer);
        this.timer = 
          setInterval(() => {
            var min = 0;
            var max = this.coordinates.length - 1;
            var from = Math.floor(Math.random() * (max - min + 1)) + min;
            var to = Math.floor(Math.random() * (max - min + 1)) + min;
            var dot;
            if (from <= to) {
              dot = this.coordinates.slice(from, to);
            }
            else {
              dot = this.coordinates.slice(to, from);
            }
            this.circleData = dot;
          }, 1500);  
      }
    },
    unsubTaxiEvents() {
      // console.log('this.timer', this.timer);
      // console.log('unsubTaxiEvents');
      clearInterval(this.timer);
      
    },
    generateData() {
      let districtRank = {};
      let rank = 1;
      let i;
      for (i = 101; i <= 123; i++){

        const min = 0;
        const max = 500;
        
        let count = Math.floor(Math.random() * (max - min + 1)) + min;
        districtRank[i.toString()] = {district:i, dropoffCount:count, rank: rank};
        rank++;
      }

      return districtRank;
    },
    /*** for 2-layer ***/

    /*** for route event ***/

    /*** for route event ***/
    clearHandler() {
      // this.geojsonString = null;
      this.meshes = [];
    },
    highlightHandler() {
      if (this.meshes.length != 4 ){
        this.meshes = [{mesh_id: "49395630"}, {mesh_id: "53393483"}, {mesh_id: "53385739"}, {mesh_id: "53385759"}];
      } else {
        this.meshes = [{mesh_id: "49395630"}, {mesh_id: "53385739"}, {mesh_id: "53385759"}];
      }
      
    }    
  },
  mounted() {
    /*** for 2-layer ***/
    setInterval(() => {
      this.districtRankList = this.generateData();
    }, 1000);
    /*** for 2-layer ***/

    /*** for route event ***/
    axios.get("data/event_data1.json")
      .then((response)  =>  {
        this.jsons.push(response.data.toptenlist);
      }, (error)  =>  {
      })

    axios.get("data/event_data2.json")
      .then((response)  =>  {
        console.log(response);
        this.jsons.push(response.data.toptenlist);
      }, (error)  =>  {
      })


    let count = 0;

    setInterval(() => {

      let idx = Math.floor(Math.random() * 2);
      this.matrixJson = this.jsons[idx];   
    }, 1500);
    /*** for route event ***/


    /*** for d3-geo-leaf ***/
    setTimeout(() => {
      axios.get("data/statistics.json")
        .then((response)  =>  {
          this.apiResponse = response.data
        }, (error)  =>  {
        
        });

    }, 200);
    /*** for d3-geo-leaf ***/

    /*** for d3-geo-leaf-mesh ***/
    // setTimeout(() => {
    //   axios.get("data/tokyo_mesh.json")
    //     .then((response)  =>  {
    //       this.apiResponse = response.data
    //     }, (error)  =>  {
        
    //     });

    // }, 200);
    /*** for d3-geo-leaf-mesh ***/
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
