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
  geojsonType: {
    type: String,
    default: 'lines'
  },
  geojsonFeatureName: {
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
      const geojsonFeatureName = this.geojsonFeatureName;

      // const geojsonObject = await d3.json(this.geojsonPath);
      // const geojsonObject = this.geojsonObject;

      let map;
      if (!this.mapAdded) {
        map = L.map('leaflet').fitBounds(L.geoJson(this.geojsonObject).getBounds());
        this.map = map;
      } else {
        map = this.map;
        map.fitBounds(L.geoJson(this.geojsonObject).getBounds());
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
        g.append("g").attr("id", this.geojsonType);
        this.layerAdded = true;
      }

      const gGeojsonLayer = g.select(`#${this.geojsonType}`);

      const transform = d3.geoTransform({
        point: function(x, y) {
          const point = map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        }
      });

      const path = d3.geoPath().projection(transform);

      // gGeojsonLayer.selectAll("path").remove();

      const featureElement = gGeojsonLayer.selectAll("path")
        .data(this.geojsonObject.features)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return "geojson";
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

.geojson { fill: none; stroke: #2342fd; stroke-width: 2px;}
.geojsonActive { fill: none; stroke: crimson; stroke-width: 3px; filter: drop-shadow(0 0 2rem orange);}
</style>
