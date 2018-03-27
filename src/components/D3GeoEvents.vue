<template>
  <div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson';
import findprop from '../utils/findprop';

const props = {
  id: {
    type: String,
    required: true
  },
  topojsonPath: {
    type: String
  },
  width: {
    type: Number,
    default: 1000
  },
  height: {
    type: Number,
    default: 1000
  },
  bgColor: {
    type: String,
    default: '#bbdefb'
  },
  colorRange: {
    type: String,
    default: '#227AFF,#FFF500'
  },
  topNumber: {
    type: Number,
    default: 10
  },
  center: {
    type: String,
    default: '139.752268, 35.677043'
  },
  scale: {
    type: Number,
    default: 150000
  },
  layerObjects: {
    type: String,
    default: 'blocks'
  },
  layerFeatureName: {
    type: String,
    default: 'properties.block'
  },
  layerFeatureCode: {
    type: String,
    default: 'properties.block_code'
  },
  layerEventData: {
    type: Array
  }
};

export default {
  name: 'd3-geo-events',
  data() {
    return {
      // legendWidth: 0,
      projection: {}
    };
  },
  props,
  mounted() {
    let vm = this;

    const svg = d3.select(this.$el)
      .append('svg')
      .attr('width', vm.width)
      .attr('height', vm.height);

    const g = svg.append('g').attr("id", "base");
    const gLayer = g.append("g").attr("id", vm.layerObjects);
    const gLabelLayer = g.append("g").attr("id", vm.layerObjects + "_label");

    this.projection = d3.geo.mercator()
      .center(vm.center.split(","))
      .scale(vm.scale)
      .translate([vm.width / 2, vm.height / 2]);

    const path = d3.geo.path().projection(this.projection);
    
    const colorScale = vm.getColorScale(vm.topNumber, vm.colorRange);

    ///////////////////////////////////////////////////////////////////////////
    ////////////////// adding from/to gradients ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    const fromGrads = g.append("defs").attr("id", "from_def")
      .selectAll("linearGradient")
      .data(d3.range(1, parseInt(vm.topNumber) + 1))
      .enter()
      .append("linearGradient")
      .attr("gradientUnits", "objectBoundingBox")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%")
      .attr("id", function(d, i) { 
        return "fromGrad" + (i + 1);
      });

    fromGrads.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "white")
        .style("stop-opacity", "1");

    fromGrads.append("stop")
        .attr("offset", "100%")
        .style("stop-color",  function(d, i) { 
          return colorScale(i + 1); 
        })
        .style("stop-opacity", "1");


    // fill color gradient process
    var toGrads = g.append("defs").attr("id", "to_def")
      .selectAll("linearGradient")
      .data(d3.range(1, parseInt(vm.topNumber) + 1))
      .enter()
      .append("linearGradient")
      .attr("gradientUnits", "objectBoundingBox")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .attr("id", function(d, i) { 
        return "toGrad" + (i + 1);
      });
    
    toGrads.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "white")
        .style("stop-opacity", "1");


    toGrads.append("stop")
        .attr("offset", "100%")
        .style("stop-color",  function(d, i) { 
          return colorScale(i + 1); 
        })
        .style("stop-opacity", "1");

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////// TODO:loading map data //////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    d3.json(vm.topojsonPath, function (error, json) {

      const layerFeatues = topojson.feature(json, json.objects[vm.layerObjects]).features;
      const mesh = topojson.mesh(json, json.objects[vm.layerObjects], function(a, b) { return a !== b; });

      // polygons
      gLayer.selectAll("path")
        .data(layerFeatues)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", vm.bgColor)
        .attr("layer-feature-code", function(d) {
          return findprop(d, vm.layerFeatureCode);
        });

      // border
      gLayer.append("path")
        .datum(mesh)
        .attr("d", path)
        .attr("class", "layer1-boundary");

      // Layer1 labels
      gLabelLayer.selectAll("text")
        .data(layerFeatues)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("transform", function(d) { 
          return "translate(" + path.centroid(d) + ")"; 
        })
        .attr("dy", "-1em");


    });
  },
  watch: {
    layerEventData: function(newData, oldData) {
      this.hideFeatureNames().then(() => {
          if (newData) {
            this.showFeatureNames(newData);  
          }
        });

      this.dehighlightFeatures().then(() => {
          if (newData) {
            this.highlightFeatures(newData);  
          }
        });
    }
  },
  methods: {
    ///////////////////////////////////////////////////////////////////////////
    ///////// Set the style of the legned and map objects on Layer1 ///////////
    ///////////////////////////////////////////////////////////////////////////

    hideFeatureNames() {
      let vm = this;

      const gLabelLayer = d3.select("#" + vm.layerObjects + "_label");

      return new Promise((resolve, reject) => {
        const highlightData = gLabelLayer.selectAll("text")
          .filter(function(d){
            return d.hasOwnProperty("showname");
          });

        if (highlightData.size() == 0) {
          resolve();
        } else {
          highlightData
            .transition()
            .style("fill-opacity", 0)
            .transition()
            .text(function(d){
              if (d.hasOwnProperty("showname")) {
                delete d.showname;
              }
              return "";
            })
            .attr("style", null)
            .call(this.endall, function() {
              resolve();
            });
        }
      });
    },
    showFeatureNames(newValue) {
      let vm = this;

      const gLabelLayer = d3.select("#" + vm.layerObjects + "_label");

      const fromFeatureCodes = this.extractCodes(newValue, "from_code");
      const toFeatureCodes = this.extractCodes(newValue, "to_code");

      gLabelLayer.selectAll("text")
        .filter(function(d){
          return (fromFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode)) > -1)
            || (toFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode)) > -1);
        })
        .text(function(d){
          const fromIndex = fromFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode));
          const toIndex = toFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode));
          if (fromIndex > -1) {
            return (fromIndex + 1) + "_" + findprop(d, vm.layerFeatureName);
          }
          else if (toIndex > -1) {
            return (toIndex + 1) + "_" + findprop(d, vm.layerFeatureName);
          }
        })
        .transition()
        .style("fill-opacity", 1)
        .style("display", "block")
        .style("fill", function(d,i) {
          d.showname = true;

          const fromIndex = fromFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode));
          const toIndex = toFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode));
          if (fromIndex > -1) {
            // return color(fromIndex + 1);
            return "url(#fromGrad" + (fromIndex + 1) + ")";
          }
          else if (toIndex > -1) {
            return "url(#toGrad" + (toIndex + 1) + ")";
          }
        });
    },
    dehighlightFeatures(oldFeatureCodes) {

      let vm = this;

      const gLayer = d3.select("#" + vm.layerObjects);

      return new Promise((resolve, reject) => {
        const highlightData = gLayer.selectAll("path")
          .filter(function(d){
            return d.hasOwnProperty("highlight");
          });

        if (highlightData.size() == 0) {
          resolve();
        } else {
          highlightData
            .transition()
            .attr("fill", function(d){
              delete d.highlight;
              return vm.bgColor;
            })
            .call(this.endall, function() {
              resolve();
            });                
        }
      });
    },
    highlightFeatures(newValue) {

      // var color = d3.scale.linear().domain([1, newValue.length])
      //               .interpolate(d3.interpolateHcl)
      //               .range(scope.colorRange.split(","));

      let vm = this;

      const fromFeatureCodes = vm.extractCodes(newValue, "from_code");
      const toFeatureCodes = vm.extractCodes(newValue, "to_code");

      const colorScale = vm.getColorScale(vm.topNumber, vm.colorRange);

      const gLayer = d3.select("#" + vm.layerObjects);

      gLayer.selectAll("path")
        .filter(function(d){
          return (fromFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode)) > -1)
            || (toFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode)) > -1);
        })
        .transition()
        .attr("fill", function(d,i) {
          d.highlight = true;

          const fromIndex = fromFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode));
          const toIndex = toFeatureCodes.indexOf(findprop(d, vm.layerFeatureCode));
          if (fromIndex > -1) {
            return colorScale(fromIndex + 1);
            // return "url(#fromGrad" + (fromIndex + 1) + ")";
          }
          else if (toIndex > -1) {
            return colorScale(toIndex + 1);
            // return "url(#toGrad" + (toIndex + 1) + ")";
          }
        });
    },
    endall(transition, callback) { 
      let n = 0; 
      transition 
        .each(function() { ++n; }) 
        .each("end", () => { 
          if (!--n) callback.apply(this, arguments); 
        }); 
    },
    extractCodes(routes, key) {
      let featureCodes = [];
      if (routes) {
        
        routes.forEach(function(entry) {
            featureCodes.push(entry[key]);
        });

        return featureCodes;
      }
      else {
        return featureCodes;
      }
    },
    getColorScale(topNumber, colorRange) { 
      return d3.scale.linear().domain([1, topNumber])
        .interpolate(d3.interpolateHcl)
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
</style>
