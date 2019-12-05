<!-- <template>
  <div id="d3geoleaf">
    <div id="leaflet" :style="{ height: height + 'px', width:　'100%'}" ></div>
  </div>
</template> -->

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
  mapPath: {
    type: String
  },
  geojsonPath: {
    type: String
  },
  geojsonObject: {
    type: Object
  },
  width: {
    type: [String, Number],
    default: 900
  },
  height: {
    type: [String, Number],
    default: 1000
  },
  colorRange: {
    type: String,
    default: '#0000ff,#e623e4,#ff0000'
  },
  center: {
    type: String,
    default: '139.752268, 35.677043'
  },
  geojsonType: {
    type: String,
    default: 'lines'
  },
  countTag: {
    type: String,
    default: 'collected'
  },
  legendTitle: {
    type: String,
    default: 'Collected Count Per Feature'
  }  
};
export default {
  name: 'd3-geo-leaf',
  data() {
    return {
      map: null,
      mapAdded: false,
      svgAdded: false,
    };
  },
  props,
  watch: {
    geojsonObject: {
        handler: function(newVal, oldVal){
            this.renderMap();
        },
        deep: true

    }
  },
  mounted () {
    this.renderMap();
  },
  methods: {
    renderMap() {
      const vm = this;

      let map;

      // fit bounds based on the geojsonObject
      if (!this.mapAdded) {
        map = L.map(this.$refs['leaflet']).fitBounds(L.geoJson(this.geojsonObject).getBounds());
        this.map = map;
      } else {
        map = this.map;
        // map.fitBounds(L.geoJson(this.geojsonObject).getBounds());
      }
      
      // L.tileLayer.provider('CartoDB.PositronNoLabels').addTo(map);
      // L.tileLayer.provider('CartoDB.VoyagerNoLabels').addTo(map);
      // L.tileLayer.provider('Stamen.TonerBackground').addTo(map);
      // L.tileLayer.provider('Stamen.TonerLite').addTo(map);
      // L.tileLayer.provider('Hydda.Base').addTo(map);
      L.tileLayer.provider('CartoDB.Voyager').addTo(map);


      ///////////////////////////////////////////////////////////////////////////
      /////////////////////////// Get Scale Functions ///////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      const events = d3.entries(this.geojsonObject.features);

      const maxCount = d3.max(events, function(d) {
        return d.value.properties[vm.countTag]; 
      });

      const countPoints = this.getCountPoints(maxCount, this.width, 10);
      const countScale = this.getCountScale(maxCount, this.width);
      const colorScale = this.getColorScale(maxCount, this.colorRange);  

      ///////////////////////////////////////////////////////////////////////////
      ///////////////////// create transform and path function //////////////////
      ///////////////////////////////////////////////////////////////////////////
      const transform = d3.geoTransform({
        point: function(x, y) {
          const point = map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        }
      });

      const path = d3.geoPath().projection(transform);

      ///////////////////////////////////////////////////////////////////////////
      ///////////////////////////////// add svg /////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      if (!this.svgAdded) {
        L.svg().addTo(map); 
        this.svgAdded = true;
      }
      
      ///////////////////////////////////////////////////////////////////////////
      /////////////////////////// add geojson and label /////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      const svg = d3.select(map.getPane('overlayPane')).select("svg");
      const g = svg.select("g");

      g.selectAll(`g[id=${this.geojsonType}]`).remove();
      const gGeojsonLayer = g.append("g").attr("id", this.geojsonType);

      g.selectAll(`g[id=${this.geojsonType}_label]`).remove();
      const gLabelLayer = g.append("g").attr("id", this.geojsonType + "_label");


      const mouseover = function(p, i) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("stroke-width", "5px")

        gLabelLayer.selectAll("text")
          .filter(function(d){
            return d.properties[vm.countTag] == p.properties[vm.countTag];
          })
          .transition()
          .style("fill-opacity", 1)
          .style("display", "block")
          .attr("fill", function(d,i) {
            return colorScale(p.properties[vm.countTag]);
          });
      }

      const mouseout = function(p, i) {
        d3.select(this)
          .style("cursor", "")
          .style("stroke-width", "3px");

        gLabelLayer.selectAll("text")
          .filter(function(d){
            return d.properties[vm.countTag] == p.properties[vm.countTag];
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
        .on("mouseover", mouseover);

      // Subway labels
      gLabelLayer.selectAll("text")
        .data(this.geojsonObject.features)
        .enter()
        .append("text")
        .attr("class", "geojsonLabel")
        .attr("pointer-events", "none")
        .attr("transform", function(d) { 
          console.log(path.centroid(d));
          return "translate(" + path.centroid(d) + ")"; 
        })
        .attr("dy", ".35em")
        .text(function(d) { 
          return d.properties[vm.countTag];
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
        .data(d3.range(10))                
        .enter().append("stop") 
        .attr("offset", function(d,i) { 
          return countScale( countPoints[i] ) / vm.width;
        })   
        .attr("stop-color", function(d,i) { 
          return colorScale(countPoints[i]);  
        });      


      ///////////////////////////////////////////////////////////////////////////
      ////////////////////////// Draw the init legend ///////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      vm.legendWidth = Math.min(vm.width * 0.8, 600);

      // Color Legend container
      g.selectAll("g[id=legend_wrapper]").remove();

      const legendsvg = g.append("g")      
        .attr("id", "legend_wrapper")
        // .attr("transform", "translate(" + (vm.width / 2) + "," + (vm.height * 0.95) + ")");
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

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
      if (!this.mapAdded) {
        map.on("zoomend", () => {
          updatePath();
          console.log('zoomend', map.getBounds());
        });

        map.on("dragend", () => {
          updatePath();
          console.log('dragend', map.getBounds());
        });

        this.mapAdded = true;
      }

      //pathのd属性を更新
      const updatePath = function () {
          g.selectAll("path").attr('d', path);
      };

      updatePath();

    },
    getCountScale(maxCount, width) {
      //Calculate the variables for the sort gradient
      return d3.scaleLinear()
        .domain([0, maxCount])
        .range([0, width]);
    },
    getCountPoints(maxCount, width, size) {
      //Calculate the variables for the sort gradient
      const countScale = this.getCountScale(maxCount, size);

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
  fill: black;
  fill-opacity: 1;
  font-size: 18px;
  font-family: 'Noto Sans Japanese', 'Klee', 'Meiryo';
  font-weight: 700;
  text-anchor: middle;
}

.geojsonLabel {
  display: none;
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

</style>
