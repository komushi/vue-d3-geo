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
  colorRange: {
    type: String,
    default: '#e3f2fd,#2196f3,#0d47a1'
  },
  center: {
    type: String,
    default: '139.752268, 35.677043'
  },
  scale: {
    type: Number,
    default: 110000
  },
  layer1Objects: {
    type: String,
    default: 'districts'
  },
  layer2Objects: {
    type: String,
    default: 'blocks'
  },
  layer1FeatureName: {
    type: String,
    default: 'properties.district'
  },
  layer1FeatureCode: {
    type: String,
    default: 'properties.district_code'
  },
  layer2FeatureName: {
    type: String,
    default: 'properties.block'
  },
  layer2FeatureCode: {
    type: String,
    default: 'properties.block_code'
  },
  layer1EventData: {
    type: Object
  },
  layer2EventData: {
    type: Array
  },
  layer1EventCountTag: {
    type: String,
    default: 'dropoffCount'
  },
  layer1LegendTitle: {
    type: String,
    default: 'Drop-off events in the last 30 minutes'
  }
};

export default {
  name: 'd3-geo-double-layer',
  data() {
    return {
      legendWidth: 0
    };
  },
  props,
  mounted() {
    let vm = this;

    const svg = d3.select(this.$el)
      .append('svg')
      .attr('width', vm.width)
      .attr('height', vm.height);

    svg.append("rect")
      .attr("class", "background")
      .attr("width", vm.width)
      .attr("height", vm.height)
      .on("click", reset);

    const g = svg.append('g').attr("id", "base");
    const gLayer2 = g.append("g").attr("id", "layer2");
    const gLayer1 = g.append("g").attr("id", "layer1");
    const gLabelLayer2 = g.append("g").attr("id", "layer2_label");
    const gLabelLayer1 = g.append("g").attr("id", "layer1_label");

    const projection = d3.geo.mercator()
      .center(vm.center.split(","))
      .scale(vm.scale)
      .translate([vm.width / 2, vm.height / 2]);
console.log(projection);

//     const projection = function(point) {
//       return d3.geo.mercator()
//         .center(vm.center.split(","))
//         .scale(vm.scale)
//         .translate([vm.width / 2, vm.height / 2]);
//     }
// console.log(projection);

    const path = d3.geo.path().projection(projection);
    

    ///////////////////////////////////////////////////////////////////////////
    ///////////////// adding common static gradients //////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    const commonGrads = g.append("defs").attr("id", "common_grads_def");

    const circleGrads = commonGrads
      .append("radialGradient")
      .attr("gradientUnits", "objectBoundingBox")
      .attr("fx", "50%")
      .attr("fy", "50%")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "35%")
      .attr("id", "circleGrad1");
      
    circleGrads.append("stop")
      .attr("offset", "0%")
      .style("stop-color",  "white")
      .style("stop-opacity", "1");
    
    circleGrads.append("stop")
      .attr("offset", "100%")
      .style("stop-color",  function(d) { 
        return "orange";
      })
      .style("stop-opacity", ".6");

    ///////////////////////////////////////////////////////////////////////////
    //////////////// Adding the initial gradient for the legend ///////////////
    ///////////////////////////////////////////////////////////////////////////
    const countPoints = vm.getCountPoints(1, vm.width, 10);
    const countScale = vm.getCountScale(1, vm.width);

    //Create the linearGradient
    commonGrads
      .append("linearGradient")
      .attr("id", "legend-traffic")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%")
      .selectAll("stop") 
      .data(d3.range(10))                
      .enter().append("stop") 
      .attr("offset", function(d,i) { 
        return countScale( countPoints[i] ) / vm.width;
      })   
      .attr("stop-color", function(d,i) { 
        return vm.colorRange.split(",")[0]; 
      });



    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////// Draw the init legend ///////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    const gBox = g.node().getBBox();

    vm.legendWidth = Math.min(vm.width * 0.8, 600);
    //Color Legend container
    const legendsvg = g.append("g")
      .attr("id", "legendWrapper")
      .attr("transform", "translate(" + (vm.width / 2) + "," + (vm.height * 0.95) + ")");

    //Draw the Rectangle
    legendsvg.append("rect")
      .attr("id", "legendRect")
      .attr("x", -vm.legendWidth/2)
      .attr("y", 0)
      .attr("width", vm.legendWidth)
      .attr("height", 10)
      .style("fill", "url(#legend-traffic)");
      
    //Append title
    legendsvg.append("text")
      .attr("class", "layer1LegendTitle")
      .attr("x", 0)
      .attr("y", -10)
      .style("text-anchor", "middle")
      .text(vm.layer1LegendTitle);

    //Define x-axis
    const xAxis = vm.getXAxis(vm.legendWidth, 0);

    //Set up X axis
    legendsvg.append("g")
      .attr("id", "axis")
      .attr("transform", "translate(0," + (10) + ")")
      .call(xAxis);

    // console.log("this.topojsonPath:", this.topojsonPath);

    d3.json(vm.topojsonPath, function (error, json) {

      const layer1Featues = topojson.feature(json, json.objects[vm.layer1Objects]).features;
      const layer2Featues = topojson.feature(json, json.objects[vm.layer2Objects]).features;
      const meshLayer1 = topojson.mesh(json, json.objects[vm.layer1Objects], function(a, b) { return a !== b; });

      const initColor = vm.colorRange.split(",")[0];

      // fill color gradient process
      const hgrads = g.append("defs").attr("id", "layer1_hgrads").selectAll("radialGradient")
        .data(layer1Featues)
        .enter()
        .append("radialGradient")
        .attr("gradientUnits", "objectBoundingBox")
        .attr("fx", "50%")
        .attr("fy", "50%")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "100%")
        .attr("id", function(d, i) { 
          
          return "hgrad" + findprop(d, vm.layer1FeatureCode);
          // return "hgrad" + (i + 1);
        });
      
      hgrads.append("stop")
          .attr("offset", "0%")
          .style("stop-color", "white")
          .style("stop-opacity", "1");


      hgrads.append("stop")
          .attr("offset", "100%")
          .style("stop-color",  function(d, i) { 
            return initColor; 
          })
          .style("stop-opacity", "1");

      const grads = g.append("defs").attr("id", "layer1_grads").selectAll("radialGradient")
        .data(layer1Featues)
        .enter()
        .append("radialGradient")
        .attr("gradientUnits", "objectBoundingBox")
        .attr("fx", "50%")
        .attr("fy", "50%")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "35%")
        .attr("id", function(d, i) { 
          return "grad" + findprop(d, vm.layer1FeatureCode);
          // return "grad" + (i + 1);
        });

      grads.append("stop")
          .attr("offset", "0%")
          .style("stop-color",  function(d, i) { 
            return initColor; 
          })
          .style("stop-opacity", ".7");

      grads.append("stop")
          .attr("offset", "100%")
          .style("stop-color",  function(d, i) { 
            return initColor; 
          })
          .style("stop-opacity", "1");

      const mouseoverLayer1 = function(p) {
        d3.select(this)
          .style("fill", function(d) {
              return "url(#hgrad" + findprop(d, vm.layer1FeatureCode) + ")";
          });
      }
      
      const mouseoutLayer1 = function (p) {
        d3.select(this)
          .style("fill", function(d) { 
            return "url(#grad" + findprop(d, vm.layer1FeatureCode) + ")";
          });
      }

      // layer2 polygons and boundary
      gLayer2.selectAll("path")
        .data(layer2Featues)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", function(d, i) {
            return "url(#grad" + findprop(d, vm.layer1FeatureCode) + ")";
            // return "#bbdefb";
        })
        .style("fill-opacity", 0)
        .style("display", "none")
        .attr("layer1-feature-code", function(d) {
          return findprop(d, vm.layer1FeatureCode);
        })
        .attr("layer1-feature-name", function(d) {
          return findprop(d, vm.layer1FeatureName);
        })
        .attr("layer2-feature-code", function(d) { 
          return findprop(d, vm.layer2FeatureCode);
        })
        .attr("layer2-feature-name", function(d) { 
          return findprop(d, vm.layer2FeatureName);
        })
        .attr("class", "layer2")
        .on("click", layer2Clicked)
        .on("mouseover", vm.mouseoverLayer2)
        .on("mouseout", vm.mouseoutLayer2);

      // Layer2 labels
      gLabelLayer2.selectAll("text")
        .data(layer2Featues)
        .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", 0)
        .style("display", "none")
        .attr("transform", function(d) { 
          return "translate(" + path.centroid(d) + ")"; 
        })
        .attr("dy", ".35em")
        .attr("pointer-events", "none")
        .text(function(d) { 
          return findprop(d, vm.layer2FeatureName); 
        })
        .attr("layer2-feature-code", function(d) { 
          return findprop(d, vm.layer2FeatureCode);
        });

      // Layer1 polygons

      gLayer1.selectAll("path")
        .data(layer1Featues)
        .enter().append("path")
        .attr("class", "layer1")
        .attr("d", path)
        .style("fill", function(d, i) {
          return "url(#grad" + findprop(d, vm.layer1FeatureCode) + ")";
        })
        .attr("layer1-feature-code", function(d) {
          return findprop(d, vm.layer1FeatureCode);
        })
        .attr("layer1-feature-name", function(d) {
          return findprop(d, vm.layer1FeatureName);
        })
        .on("click", layer1Clicked)
        .on("mouseover", mouseoverLayer1)
        .on("mouseout", mouseoutLayer1);

      // Layer1 border
      gLayer1.append("path")
        .datum(meshLayer1)
        .attr("d", path)
        .attr("class", "layer1-boundary");

      // Layer1 labels
      gLabelLayer1.selectAll("text")
        .data(layer1Featues)
        .enter().append("text")
        .attr("class", "label")
        .attr("transform", function(d) { 
          return "translate(" + path.centroid(d) + ")"; 
        })
        .attr("dy", ".35em")
        .attr("pointer-events", "none")
        .text(function(d) { 
          return findprop(d, vm.layer1FeatureName); 
        })
        .attr("layer1-feature-code", function(d) { 
          return findprop(d, vm.layer1FeatureCode);
        });

    });

    /***** click to zoom *****/
    var active = d3.select(null);

    const layer2Clicked = function(d) {
      if (active.node()) {
        if (this.getAttribute("layer1-feature-code") == active.node().getAttribute("layer1-feature-code")) {
          return reset();
        }
      }
    }

    const layer1Clicked = function(d) {
      if (active.node() === this) {
        return reset();
      }

      active.classed("active", false);
      active = d3.select(this).classed("active", true);

      zoom(d);
    };


    const zoom = function(d) {
      const bounds = path.bounds(d),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = .9 / Math.max(dx / vm.width, dy / vm.height),
          translate = [vm.width / 2 - scale * x, vm.height / 2 - scale * y];

      g.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

      // hide layer1 labels
      gLabelLayer1.selectAll('text')
        .transition()
        .style("fill-opacity", 0)
        .transition()
        .style("display", "none");


      gLayer2.selectAll("path")
        .transition()
        .style("fill-opacity", 1)
        .style("display", "block");


      // callback to notify the specified feature is ready to receive location events
      const featureCode = findprop(d, vm.layer1FeatureCode);

      vm.$emit('on-receive-events', featureCode);
      vm.$emit('on-stop-events');
    }

    function reset() {
      active.classed("active", false);
      active = d3.select(null);

      g.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");

      // show layer1 labels
      gLabelLayer1.selectAll('text')
        .transition()
        .style("display", "block")
        .transition()
        .duration(250)
        .style("fill-opacity", 1);

      gLayer2.selectAll("path")
        .transition()
        .style("fill-opacity", 0)
        .style("display", "none");

      // scope.onStopEvents();
      vm.$emit('on-stop-events');
    };
    /***** click to zoom *****/

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////// Mouse over Layer2 Process /////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    const mouseoverLayer2 = function(p) {
      gLabelLayer2.selectAll("text")
        .filter(function(d){
          return findprop(p, vm.layer2FeatureCode) == findprop(d, vm.layer2FeatureCode);
        })
        .transition()
        .style("fill-opacity", 1)
        .style("display", "block");

      d3.select(this)
        .style("fill", function(d) {
            return "url(#hgrad" + findprop(d, vm.layer1FeatureCode) + ")";
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////// Mouse out Layer2 Process /////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    const mouseoutLayer2 = function (p) {
      gLabelLayer2.selectAll("text")
        .filter(function(d){
          return findprop(p, vm.layer2FeatureCode) == findprop(d, vm.layer2FeatureCode);
        })
        .transition()
        .style("fill-opacity", 0)
        .transition()
        .style("display", "none");

      d3.select(this)
        .style("fill", function(d) {
            return "url(#grad" + findprop(d, vm.layer1FeatureCode) + ")";
        });
    }

  },
  watch: {
    layer1EventData: function(newData, oldData) {
      this.visualizeLayer1Events(newData);
    },
    layer2EventData: function(newData, oldData) {
      this.visualizeLayer2Events(newData);
    }
  },
  methods: {
    ///////////////////////////////////////////////////////////////////////////
    ///////// Set the style of the legned and map objects on Layer1 ///////////
    ///////////////////////////////////////////////////////////////////////////
    visualizeLayer1Events(eventList) {
      let vm = this;

      var events = d3.entries(eventList);

      var maxCount = d3.max(events, function(d) {
        return d.value[vm.layer1EventCountTag]; 
      });

      ///////////////////////////////////////////////////////////////////////////
      //////////////// Update the gradient for the legend ///////////////////////
      ///////////////////////////////////////////////////////////////////////////
      var colorScale = vm.getColorScale(maxCount, vm.colorRange);

      var countPoints = vm.getCountPoints(maxCount, vm.width, 10);

      //Update the linearGradient
      d3.select("#common_grads_def")
        .selectAll("linearGradient")
        .selectAll("stop")
        .attr("stop-color",  function(d, i) { 
          return colorScale(countPoints[i]); 
        });

      ///////////////////////////////////////////////////////////////////////////
      ////////////////////////// Update the legend //////////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      var xAxis = vm.getXAxis(vm.legendWidth, maxCount);

      d3.select("#axis")
        .selectAll(".tick")
        .remove();

      d3.select("#axis")
        .call(xAxis);


      ///////////////////////////////////////////////////////////////////////////
      //////////////// Set the dynamic gradient for layer1 //////////////////////
      ///////////////////////////////////////////////////////////////////////////
      // const gLayer1 = d3.selectAll("#layer1");

      // edit event count  
      d3.select("#layer1").selectAll("path")
        .filter(function(d){
          if (d.type === "Feature") {
            var featureCode = findprop(d, vm.layer1FeatureCode);
            var element = eventList[featureCode];
            
            if (!element) {
              d[vm.layer1EventCountTag] = 1;
              return true;
            } 
            else {
              var sortValue = element[vm.layer1EventCountTag];
              if (d[vm.layer1EventCountTag]) {
                if (sortValue != d[vm.layer1EventCountTag]) {
                  d[vm.layer1EventCountTag] = sortValue;
                  return true;
                }
              } 
              else {
                d[vm.layer1EventCountTag] = sortValue;
                return true;
              }                    
            }
          }
          return false;
        });

      // edit event count
      d3.select("#layer1_grads")
        .selectAll("radialGradient")
        .selectAll("stop")
        .style("stop-color",  function(d, i) { 
          return colorScale(d[vm.layer1EventCountTag]); 
        });

      d3.select("#layer1_hgrads")
        .selectAll("radialGradient")
        .selectAll("stop")
        .filter(function(d){
            return this.getAttribute("offset") === "100%"
        })
        .style("stop-color",  function(d, i) { 
          return colorScale(d[vm.layer1EventCountTag]); 
        });

      d3.select("#layer1").selectAll("path")
        .filter(function(d){
          return d.type === "Feature"
        })
        .style("fill", function(d, i) {
          return "url(#grad" + findprop(d, vm.layer1FeatureCode) + ")";
        });
    },
    ///////////////////////////////////////////////////////////////////////////
    ///////// Set the style of the legned and map objects on Layer2 ///////////
    ///////////////////////////////////////////////////////////////////////////
    visualizeLayer2Events(data) {
      d3.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .style('opacity', 0)
        .attr("class", "circle")
        .style("fill", function(d, i) {
          return "url(#circleGrad1)";
        })
        .attr('cx', function(d) { 
          return projection(d)[0];
        })
        .attr('cy', function(d) { 
          return projection(d)[1];
        })
        .attr('r', 2)
      .transition()
        .delay(function(d,i) { return i * 100; })
        .style('opacity', 1)
      .transition()
        .delay(function(d,i) { return i * 100 + 250 + 100; })
        .style('opacity', 0)
        .remove();
    },
    ///////////////////////////////////////////////////////////////////////////
    /////////////////////// legend common functions ///////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    getCountScale(maxCount, width) {
      //Calculate the variables for the sort gradient
      return d3.scale.linear()
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
      for(var i = 0; i < size; i++) {
        countPoints.push(i * countRange[2]/(size-1) + countRange[0]);
      }

      return countPoints;
    },
    getColorScale(maxCount, colorRange) {

      return d3.scale.linear()
        .domain([0, maxCount/2, maxCount])
        .range(colorRange.split(","));
    },
    getXAxis(legendWidth, maxCount) {
      const xScale = d3.scale.linear()
       .range([-legendWidth/2, legendWidth/2])
       .domain([ 0, maxCount　] );

      return d3.svg.axis().orient("bottom")
              .ticks(5)
              //.tickFormat(formatPercent)
              .scale(xScale);
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
