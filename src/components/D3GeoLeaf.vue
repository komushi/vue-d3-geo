<template>
  <div id="d3geoleaf">
    <div id="leaflet" :style="{ height: height + 'px', width:　'100%'}" ></div>
  </div>
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
  subwayPath: {
    type: String
  },
  subwayData: {
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
    default: '#0d47a1,#e3f2fd'
  },
  center: {
    type: String,
    default: '139.752268, 35.677043'
  },
  scale: {
    type: [String, Number],
    default: 110000
  },
  layerObjects: {
    type: String,
    default: 'districts'
  },
  layerFeatureName: {
    type: String,
    default: 'properties.district'
  },
  layerFeatureCode: {
    type: String,
    default: 'properties.district_code'
  },
  subwayObjects: {
    type: String,
    default: 'lines'
  },
  subwayFeatureName: {
    type: String,
    default: 'properties.N02_003'
  },
  featureNameStyle: {
    type: String,
    default: 'static'
  }
};
export default {
  name: 'd3-geo-leaf',
  data() {
    return {
      map: null,
      mapAdded: false,
      svgAdded: false,
      layerAdded: false,
    };
  },
  props,
  watch: {
    subwayData: {
        handler: function(newVal, oldVal){
            this.renderMap();
        },
        deep: true

    }
  },
  mounted () {
    this.renderMap();
  },
/*  
  async mounted() {

    const subwayFeatureName = this.subwayFeatureName;

    const subwayJson = await d3.json(this.subwayPath);

    const map = L.map('leaflet').fitBounds(L.geoJson(subwayJson).getBounds());
    // L.tileLayer.provider('CartoDB.PositronNoLabels').addTo(map);
    L.tileLayer.provider('CartoDB.VoyagerNoLabels').addTo(map);
    // L.tileLayer.provider('Stamen.TonerBackground').addTo(map);
    // L.tileLayer.provider('Stamen.TonerLite').addTo(map);
    // L.tileLayer.provider('Hydda.Base').addTo(map);
    // map.getPane('mapPane').style.pointerEvents = 'none';
    

    L.svg().addTo(map);
    const svg = d3.select(map.getPane('overlayPane')).select("svg");
    const g = svg.select("g");
    const gSubwayLayer = g.append("g").attr("id", this.subwayObjects);
    const gSubwayLabelLayer = g.append("g").attr("id", this.subwayObjects + "_label");

    const transform = d3.geoTransform({
      point: function(x, y) {
        const point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }
    });

    const path = d3.geoPath().projection(transform);

    // const mouseover = function(p, i) {
    //   console.log("this is", p);

    //   d3.select(this)
    //     .style("cursor", "pointer")
    //     .attr("class", "subwayActive");

    //   gSubwayLabelLayer.selectAll("text")
    //     .filter(function(d){
    //       // console.log("p", findprop(p, subwayFeatureName))
    //       // console.log("d", findprop(d, subwayFeatureName))
    //       return findprop(p, subwayFeatureName) == findprop(d, subwayFeatureName);
    //     })
    //     .transition()
    //     .style("fill-opacity", 1)
    //     .style("display", "block");  
    // }

    // const mouseout = function(p, i) {
    //   d3.select(this)
    //     .style("cursor", "")
    //     .attr("class", "subway");


    //   gSubwayLabelLayer.selectAll("text")
    //     .filter(function(d){
    //       // console.log("p", findprop(p, subwayFeatureName))
    //       // console.log("d", findprop(d, subwayFeatureName))
    //       return findprop(p, subwayFeatureName) == findprop(d, subwayFeatureName);
    //     })
    //     .transition()
    //     .style("fill-opacity", 0)
    //     .transition()
    //     .style("display", "none");        
    // }

    const featureElement = gSubwayLayer.selectAll("path")
      .data(subwayJson.features)
      .enter()
      .append("path")
      .attr("class", function(d) {
          return "subway";
      })
      .attr("d", path)
      .attr("pointer-events","visible")
      .on("mouseover", function(p, i) {
        console.log("that is", p);

      });


    map.on("zoomend", () => {
      featureElement.attr("d", path);
      console.log('zoomend', map.getBounds());
    });

    map.on("dragend", () => {
      featureElement.attr("d", path);
      console.log('dragend', map.getBounds());
    });

    // Subway labels
    // gSubwayLabelLayer.selectAll("text")
    //   .data(subwayJson.features)
    //   .enter().append("text")
    //   .attr("class", "subwayLabel")
    //   .attr("transform", function(d) { 
    //     return "translate(" + path.centroid(d) + ")"; 
    //   })
    //   .attr("dy", ".35em")
    //   .text(function(d) { 
    //     return findprop(d, subwayFeatureName); 
    //   });     


    // const data = [{
    //     "node": "interesting",
    //     "x": 641,
    //     "y": 295
    // }];

    // const feature = gSubwayLayer
    //   .selectAll("circle")
    //   .data(data).enter().append("svg:circle").style("fill", "steelblue").attr("r", 20).attr("transform", function(d) {
    //     return "translate(" + d.x + "," + d.y + ")";
    // })
    // .attr("pointer-events","visible")
    // .on("mouseover", function(p, i) {
    //   console.log("this is", p);

    //   d3.select(this)
    //     .style("cursor", "pointer");
    // });

  },
*/  
  methods: {
    renderMap() {
      const subwayFeatureName = this.subwayFeatureName;

      // const subwayJson = await d3.json(this.subwayPath);
      const subwayJson = this.subwayData;

      let map;
      if (!this.mapAdded) {
        map = L.map('leaflet').fitBounds(L.geoJson(subwayJson).getBounds());
        this.map = map;
      } else {
        map = this.map;
        map.fitBounds(L.geoJson(subwayJson).getBounds());
      }


      
      // L.tileLayer.provider('CartoDB.PositronNoLabels').addTo(map);
      // L.tileLayer.provider('CartoDB.VoyagerNoLabels').addTo(map);
      // L.tileLayer.provider('Stamen.TonerBackground').addTo(map);
      // L.tileLayer.provider('Stamen.TonerLite').addTo(map);
      // L.tileLayer.provider('Hydda.Base').addTo(map);
      L.tileLayer.provider('CartoDB.Voyager').addTo(map);
      
      if (!this.svgAdded) {
        L.svg().addTo(map); 
        this.svgAdded = true;
      }
      
      const svg = d3.select(map.getPane('overlayPane')).select("svg");
      const g = svg.select("g");

      if (!this.layerAdded) {
        g.append("g").attr("id", this.subwayObjects);
        this.layerAdded = true;
      }

      const gSubwayLayer = g.select(`#${this.subwayObjects}`);

      const transform = d3.geoTransform({
        point: function(x, y) {
          const point = map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        }
      });

      const path = d3.geoPath().projection(transform);

      // gSubwayLayer.selectAll("path").remove();

      const featureElement = gSubwayLayer.selectAll("path")
        .data(subwayJson.features)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return "subway";
        })
        .attr("d", path);

      // map.on("zoomend", () => {
      //   featureElement.attr("d", path);
      //   console.log('zoomend', map.getBounds());
      // });

      // map.on("dragend", () => {
      //   featureElement.attr("d", path);
      //   console.log('dragend', map.getBounds());
      // });
      if (!this.mapAdded) {
        // map.on("moveend", () => {
        //   featureElement.attr("d", path);
        //   console.log('zoomend', map.getBounds());
        // });

        map.on("zoomend", () => {
          featureElement.attr("d", path);
          console.log('zoomend', map.getBounds());
        });

        map.on("dragend", () => {
          featureElement.attr("d", path);
          console.log('dragend', map.getBounds());
        });
        this.mapAdded = true;
      }



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

.background {
  fill: none;
  pointer-events: all;
}

.circle {
}

.layer1 {
  cursor: pointer;
}


.layer1:hover {
  fill: orange;
}

.layer1.active {
  display:none;
}

.layer1-boundary {
  fill: none;
  stroke: white;
  stroke-dasharray: 2,2;
  stroke-linejoin: round;
  stroke-width: 1;
}

.layer1LegendTitle {
  fill: black;
  fill-opacity: 1;
  font-size: 18px;
  font-family: 'Noto Sans Japanese', 'Klee', 'Meiryo';
  font-weight: 700;
  text-anchor: middle;
}

.layer2 {
  stroke: white;
  stroke-width: 0.2;
}

.label {
  fill: white;
  fill-opacity: 1;
  font-size: 18px;
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

.subway { fill: none; stroke: #2342fd; stroke-width: 2px;}
.subwayActive { fill: none; stroke: crimson; stroke-width: 3px; filter: drop-shadow(0 0 2rem orange);}
</style>
