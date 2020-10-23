<template>
  <div id="leaflet" ref="leaflet" :style="{ height: '100%', width:　'100%'}"></div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson';
import findprop from '../utils/findprop';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-providers/leaflet-providers.js';

const props = {
  tileProvider: {
    type: String,
    default: 'CartoDB.Voyager'
  },  
  geojsonPath: {
    type: String
  },
  geojsonObject: {
    type: Object
  },
  legendWidth: {
    type: [String, Number],
    default: 500
  },
  colorRange: {
    type: String,
    default: '#0000ff,#e623e4,#ff0000'
  },
  mapCenter: {
    type: String,
    default: '139.77887823700362, 35.69026554219554'
  },
  mapZoom: {
    type: [String, Number],
    default: 17
  },  
  legendCenter: {
    type: String,
    default: '360, 50'
  },  
  geojsonType: {
    type: String,
    default: 'lines'
  },
  captionTag: {
    type: String,
    default: 'collected'
  },
  countTag: {
    type: String,
    default: 'collected'
  },
  idTag: {
    type: String,
    default: 'id'
  },
  legendTitle: {
    type: String,
    default: 'Collected Count Per Feature'
  },
  autoFitBounds: {
    type: Boolean,
    default: false
  }
};
export default {
  name: 'd3-geo-leaf',
  data() {
    return {
      map: null,
      svg: null,
      mapAdded: false,
      svgAdded: false,
    };
  },
  props,
  computed: {  
    legendCenterObj: function() {
      return { x: parseInt(this.legendCenter.split(",")[0]), y: parseInt(this.legendCenter.split(",")[1]) }
    }    
  },   
  watch: {
    geojsonObject: {
        handler: function(newVal, oldVal){
          if (newVal)   {
            this.renderMap();  
          } else {
            this.clearSvg();
          }
          
        },
        deep: true

    }
  },
  mounted () {
    this.renderMap();
  },
  methods: {
    clearSvg() {
      const vm = this;

      const svg = d3.select(vm.map.getPane('overlayPane')).select("svg");
      const g = svg.select("g");

      g.selectAll(`g[id=${this.geojsonType}]`).remove();

      g.selectAll(`g[id=${this.geojsonType}_label]`).remove();

      g.selectAll("defs[id=color_grads_def]").remove();

      g.selectAll("g[id=legend_wrapper]").remove();

    },
    renderMap() {
      const vm = this;

      // let map;

      // fit bounds based on the geojsonObject
      if (!this.mapAdded) {
        if (this.geojsonObject) {
          vm.map = L.map(this.$refs['leaflet']).fitBounds(L.geoJson(this.geojsonObject).getBounds());

        } else {
          vm.map = L.map(this.$refs['leaflet']);
          vm.map.setView(new L.LatLng(this.mapCenter.split(",")[1], this.mapCenter.split(",")[0]), this.mapZoom);
        }

        this.mapAdded = true;

        L.tileLayer.provider(vm.tileProvider).addTo(vm.map);

        vm.map.on("zoomend", () => {
          this.$emit('zoomend', vm.getBounds(vm.map));
        });

        vm.map.on("dragend", () => {
          this.$emit('dragend', vm.getBounds(vm.map));
        });      

        this.$emit('initmap', vm.getBounds(vm.map));        
      } else {
        if (this.autoFitBounds) {
          vm.map.fitBounds(L.geoJson(this.geojsonObject).getBounds());
        }
      }


      
      // L.tileLayer.provider('CartoDB.PositronNoLabels').addTo(map);
      // L.tileLayer.provider('CartoDB.VoyagerNoLabels').addTo(map);
      // L.tileLayer.provider('Stamen.TonerBackground').addTo(map);
      // L.tileLayer.provider('Stamen.TonerLite').addTo(map);
      // L.tileLayer.provider('Hydda.Base').addTo(map);
      
      if (!this.geojsonObject) {
        return;
      }


      ///////////////////////////////////////////////////////////////////////////
      /////////////////////////// Get Scale Functions ///////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      const events = d3.entries(this.geojsonObject.features);

      const maxCount = d3.max(events, function(d) {
        return d.value.properties[vm.countTag]; 
      });

      const colorDense = 10;
      const countPoints = this.getCountPoints(maxCount, this.legendWidth, colorDense);
      const countScale = this.getCountScale(maxCount, this.legendWidth);
      const colorScale = this.getColorScale(maxCount, this.colorRange);  

      ///////////////////////////////////////////////////////////////////////////
      ///////////////////// create transform and path function //////////////////
      ///////////////////////////////////////////////////////////////////////////
      const transform = d3.geoTransform({
        point: function(x, y) {
          const point = vm.map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        }
      });

      const path = d3.geoPath().projection(transform);

      ///////////////////////////////////////////////////////////////////////////
      ///////////////////////////////// add svg /////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      if (!this.svgAdded) {
        L.svg().addTo(vm.map); 

        this.svgAdded = true;
      }
      
      ///////////////////////////////////////////////////////////////////////////
      /////////////////////////// add geojson and label /////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      const svg = d3.select(vm.map.getPane('overlayPane')).select("svg");
      const g = svg.select("g");

      g.selectAll(`g[id=${this.geojsonType}]`).remove();
      const gGeojsonLayer = g.append("g").attr("id", this.geojsonType);

      g.selectAll(`g[id=${this.geojsonType}_label]`).remove();
      const gLabelLayer = g.append("g").attr("id", this.geojsonType + "_label");


      const mousemove = function(p, i) {
        const activeLabel = gLabelLayer.selectAll("text")
          .filter(function(d){
            return d.properties[vm.idTag] == p.properties[vm.idTag];
          })
          .attr("class", "lineLabel")
          .attr("x", d3.mouse(this)[0] + 15)
          .attr("y", d3.mouse(this)[1] + 15);
      }

      const mouseover = function(p, i) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("stroke-width", "8px")

        const activeLabel = gLabelLayer.selectAll("text")
          .filter(function(d){
            return d.properties[vm.idTag] == p.properties[vm.idTag];
          })
          .attr("class", "lineLabel")
          .style("fill-opacity", 1)
          .style("display", "block")
          .attr("fill", function(d,i) {
            return colorScale(d.properties[vm.countTag]);
          })
          .attr("x", d3.mouse(this)[0] + 15)
          .attr("y", d3.mouse(this)[1] + 15);
      }

      const mouseout = function(p, i) {
        d3.select(this)
          .style("cursor", "")
          .style("stroke-width", "3px");

        gLabelLayer.selectAll("text")
          .filter(function(d){
            return d.properties[vm.idTag] == p.properties[vm.idTag];
          })
          .transition()
          .style("fill-opacity", 0)
          .transition()
          .style("display", "none");        
      }      

      gGeojsonLayer.selectAll("path")
        .data(this.geojsonObject.features)
        .enter()
        .append("path")
        .style("fill", "none")        
        .style("stroke-width", "3px")
        .style("pointer-events", "auto")
        .attr("stroke", function(d,i) {
          return colorScale(d.properties[vm.countTag]);
        })
        .on("mouseout", mouseout)
        .on("mouseover", mouseover)
        .on("mousemove", mouseover);

      gLabelLayer.selectAll("text")
        .data(this.geojsonObject.features)
        .enter()
        .append("text")
        .attr("class", "lineLabel")
        .attr("pointer-events", "none")
        .attr("dx", "2.5em")
        .attr("dy", "1em")
        // .style("fill-opacity", 0)
        // .style("display", "none")
        .text(function(d) { 
          return d.properties[vm.captionTag];
        });

      ///////////////////////////////////////////////////////////////////////////
      ///////////////// Adding the initial gradient for the legend //////////////
      ///////////////////////////////////////////////////////////////////////////
      g.selectAll("defs[id=color_grads_def]").remove();

      const commonGrads = g.append("defs")      
        .attr("id", "color_grads_def");

      commonGrads
        .append("linearGradient")
        .attr("id", "legendTraffic")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop") 
        .data(d3.range(colorDense))                
        .enter().append("stop") 
        .attr("offset", function(d,i) { 
          return countScale( countPoints[i] ) / vm.legendWidth;
        })   
        .attr("stop-color", function(d,i) { 
          return colorScale(countPoints[i]);  
        });      


      ///////////////////////////////////////////////////////////////////////////
      ////////////////////////// Draw the init legend ///////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      // vm.legendWidth = Math.min(vm.width * 0.8, 600);

      // Color Legend container
      g.selectAll("g[id=legend_wrapper]").remove();

      const legendsvg = g.append("g")      
        .attr("id", "legend_wrapper")
        // .attr("transform", "translate(" + (vm.width / 2) + "," + (vm.height * 0.95) + ")");
        .attr("transform", "translate(" + vm.legendCenterObj.x + "," + vm.legendCenterObj.y + ")");

      //Draw the Rectangle
      legendsvg.append("rect")
        .attr("id", "legend_rect")
        .attr("x", -vm.legendWidth/2)
        .attr("y", 0)
        .attr("width", vm.legendWidth)
        .attr("height", 10)
        .style("fill", "url(#legendTraffic)");
        
      //Append title
      legendsvg.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text(vm.legendTitle);

      //Define x-axis
      const xAxis = vm.getXAxis(vm.legendWidth, maxCount);

      //Set up X axis
      const axisLayer = legendsvg.append("g")
        .attr("id", "axis")
        .attr("transform", "translate(0," + (10) + ")");

      axisLayer.call(xAxis);

      ///////////////////////////////////////////////////////////////////////////
      /////////////////////// leaflet map zoom events ///////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      vm.map.on("zoomend", () => {
        updatePath();

      });

      vm.map.on("dragend", () => {
        updatePath();
      });

      //pathのd属性を更新
      const updatePath = function () {
          // update path
          g.selectAll("path").attr('d', path);

          // update legend
          const nwPoint = vm.map.latLngToLayerPoint(new L.LatLng(vm.map.getBounds()._northEast.lat, vm.map.getBounds()._southWest.lng));
          g.selectAll("g[id=legend_wrapper]").attr("transform", "translate(" + (vm.legendCenterObj.x + nwPoint.x) + "," + (vm.legendCenterObj.y + nwPoint.y) + ")");
          
      };

      updatePath();

    },
    getBounds(map) {
      //Calculate the variables for the sort gradient
      return {
        lng_nw: map.getBounds()._southWest.lng,
        lat_nw: map.getBounds()._northEast.lat,
        lng_se: map.getBounds()._northEast.lng,
        lat_se: map.getBounds()._southWest.lat
      };
    },    
    getCountScale(maxCount, width) {
      //Calculate the variables for the sort gradient
      return d3.scaleLinear()
        .domain([0, maxCount])
        .range([0, width]);
    },
    getCountPoints(maxCount, width, size) {
      //Calculate the variables for the sort gradient
      const countScale = this.getCountScale(maxCount, width);

      //Calculate the variables for the sort gradient
      const countRange = countScale.domain();
      countRange[2] = countRange[1] - countRange[0];
      const countPoints = [];
      for(let i = 0; i < size; i++) {
        countPoints.push(i * countRange[2]/(size-1) + countRange[0]);
      }

      return countPoints;
    },
    getXAxis(legendWidth, maxCount) {
      const xScale = d3.scaleLinear()
       .range([-legendWidth/2, legendWidth/2])
       .domain([ 0, maxCount　] );

      return d3.axisBottom()
              .ticks(5)
              //.tickFormat(formatPercent)
              .scale(xScale);
    },
    getColorScale(maxCount, colorRange) {

      return d3.scaleLinear()
        .domain([0, maxCount/2, maxCount])
        .range(colorRange.split(","));
    }
  }
};
</script>



<style>

@import url(//fonts.googleapis.com/earlyaccess/notosansjapanese.css);

svg {
  font-size: 11px;
  font-family: 'Noto Sans Japanese', 'Klee', 'Meiryo';
  font-weight: 300;
  margin: auto;
  display: block;
}

.legendTitle {
  fill: red;
  fill-opacity: 1;
  font-size: 30px;
  font-family: 'Noto Sans Japanese', 'Klee', 'Meiryo';
  font-weight: 700;
  text-anchor: middle;
  text-shadow:
    2px 2px 0 #000,
    -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,
     1px 1px 0 #000;  
}

.lineLabel {
  fill-opacity: 0;
  font-size: 26px;
  font-family: 'Noto Sans Japanese', 'Klee', 'Meiryo';
  font-weight: 700;
  text-anchor: middle;
  text-shadow:
    2px 2px 0 #000,
    -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,
     1px 1px 0 #000;  
}

</style>
