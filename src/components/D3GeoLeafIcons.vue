<template>
  <div id="leaflet" ref="leaflet" :style="{ height: '100%', width:　'100%'}"></div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import findprop from '../utils/findprop';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-providers/leaflet-providers.js';

const props = {
  tileProvider: {
    type: String,
    default: 'CartoDB.Voyager'
  },  
  geojsonObject: {
    type: Object
  },
  color: {
    type: String,
    default: 'MidnightBlue'
  },
  colorOpacity: {
    type: String,
    default: '0.2'
  },  
  mapCenter: {
    type: String,
    default: '139.77887823700362, 35.69026554219554'
  },
  mapZoom: {
    type: [String, Number],
    default: 17
  },  
  geojsonType: {
    type: String,
    default: 'Polygon'
  },
  idTag: {
    type: String,
    default: 'scannerName'
  },
  autoFitBounds: {
    type: Boolean,
    default: false
  },
  hideLabelThreshold: {
    type: Number,
    default: 100
  }  
};
export default {
  name: 'd3-geo-leaf-icons',
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

    },
    renderMap() {
      const vm = this;

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

      if (!this.geojsonObject) {
        return;
      }

      ///////////////////////////////////////////////////////////////////////////
      ///////////////////// create transform and path function //////////////////
      ///////////////////////////////////////////////////////////////////////////
      const projectPoint = function(x, y) {
        const point = vm.map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      };

      const transform = d3.geoTransform({
          point: projectPoint
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
      const g = svg.select("g").attr("class", "leaflet-zoom-hide");

      g.selectAll(`g[id=${this.geojsonType}]`).remove();
      const gGeojsonLayer = g.append("g").attr("id", this.geojsonType);

      g.selectAll(`g[id=${this.geojsonType}_label]`).remove();
      const gLabelLayer = g.append("g").attr("id", this.geojsonType + "_label");

      const mouseover = function(p, i) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("stroke-width", "15px")

        gLabelLayer.selectAll("text")
          .filter(function(d){
            return d.properties[vm.idTag] == p.properties[vm.idTag];
          })
          .transition()
          .style("fill-opacity", 1)
          .style("display", "block")
          .attr("fill", function(d,i) {
            return "#000000";
          });
      }

      const mouseout = function(p, i) {
        d3.select(this)
          .style("cursor", "")
          .style("stroke-width", "10px");

        const bbox = gGeojsonLayer.select("path").node().getBBox();
        if (bbox.width < vm.hideLabelThreshold) {
          gLabelLayer.selectAll("text")
            .filter(function(d){
              return d.properties[vm.idTag] == p.properties[vm.idTag];
            })
            .transition()
            .style("fill-opacity", 0)
            .transition()
            .style("display", "none");  
        }
      }      

      gGeojsonLayer.selectAll("path")
        .data(this.geojsonObject.features)
        .enter()
        .append("path")
        .attr("fill-opacity","1.0")
        .style("fill", vm.color)
        .style("stroke-width", "10px")
        .style("pointer-events", "auto")
        .attr("stroke", function(d,i) {
          return vm.color;
        })
        .on("mouseout", mouseout)
        .on("mouseover", mouseover);


      this.geojsonObject.features.forEach(function(d) {
        if (d.geometry.type == 'Point') {
          d.LatLng = new L.LatLng(d.geometry.coordinates[1],
            d.geometry.coordinates[0]);

        }
      });


      const labels = gLabelLayer.selectAll("text")
        .data(this.geojsonObject.features)
        .enter()
        .append("text")
        .attr("class", "polygonLabel")
        .attr("pointer-events", "none")
        .attr("dx", "2.5em")
        .attr("dy", "-2em")
        .style("fill-opacity", 1)
        .style("display", "block")
        .text(function(d) { 
          return d.properties[vm.idTag];
        });


      // const labels = gLabelLayer.selectAll("text")
      //     .data(this.geojsonObject.features)
      //     .enter()
      //     .append("text")
      //     .attr('font-family', 'Font Awesome 5 Free')
      //     .attr('font-size', '20px' )
      //     .text(function(d) { return '\uf566' }); 

      ///////////////////////////////////////////////////////////////////////////
      /////////////////////// leaflet map zoom events ///////////////////////////
      ///////////////////////////////////////////////////////////////////////////

      vm.map.on("zoomend", () => {
        updatePath();
      });

      vm.map.on("dragend", () => {
        updatePath();
      });

      // update path & label
      const updatePath = function () {

        // update path
        gGeojsonLayer.selectAll("path").attr('d', path);

        

        // update label
        labels.attr("x", function(d) {
          return vm.map.latLngToLayerPoint(d.LatLng).x;
        });

        labels.attr("y", function(d) {
          return vm.map.latLngToLayerPoint(d.LatLng).y;
        });

        const bbox = gGeojsonLayer.select("path").node().getBBox();

        if (bbox.width >= vm.hideLabelThreshold) {
          labels.style("fill-opacity", 1).style("display", "block");
        } else {
          labels.style("fill-opacity", 0).style("display", "none");
        }
        
          
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
    }
  }
};
</script>



<style>

@import url(//fonts.googleapis.com/earlyaccess/notosansjapanese.css);

@import url(//use.fontawesome.com/releases/v5.12.1/css/all.css);

svg {
  font-size: 11px;
  font-family: 'Noto Sans Japanese', 'Klee', 'Meiryo';
  font-weight: 300;
  margin: auto;
  display: block;
}


.polygonLabel {
  fill-opacity: 0;
  font-size: 15px;
  font-family: 'Noto Sans Japanese', 'Klee', 'Meiryo';
  font-weight: 500;
  text-anchor: middle;

}


body {
    font-family:"Font Awesome 5 Free";
}



</style>
