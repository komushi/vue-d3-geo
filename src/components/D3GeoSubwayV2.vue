<template>
  <div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import findprop from '../utils/findprop';

const props = {
  mapPath: {
    type: String
  },
  subwayPath: {
    type: String
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
  name: 'd3-geo-staic',
  props,
  async mounted() {

    const layerObjects = this.layerObjects;
    const colorRange = this.colorRange;
    const layerFeatureCode = this.layerFeatureCode;
    const layerFeatureName = this.layerFeatureName;
    const featureNameStyle = this.featureNameStyle;
    const subwayObjects = this.subwayObjects;
    const subwayFeatureName = this.subwayFeatureName;    
    const width = this.width;
    const height = this.height;

    const svg = d3.select(this.$el)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const g = svg.append('g');
    const gLayer = g.append("g").attr("id", this.layerObjects);
    const gLabelLayer = g.append("g").attr("id", this.layerObjects + "_label");
    const gSubwayLayer = g.append("g").attr("id", this.subwayObjects);
    const gSubwayLabelLayer = g.append("g").attr("id", this.subwayObjects + "_label");

    // console.log("this.topojsonPath:", this.topojsonPath);
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////// TODO:loading map data //////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    const mapJson = await d3.json(this.mapPath);

    console.log("layerObjects:", layerObjects);

    const layerFeatueCollection = topojson.feature(mapJson, mapJson.objects[layerObjects]);
    const layerFeatues = layerFeatueCollection.features;
    const mesh = topojson.mesh(mapJson, mapJson.objects[layerObjects], function(a, b) { return a !== b; });

    const color = d3.scaleLinear().domain([1,layerFeatues.length])
                  .interpolate(d3.interpolateHcl)
                  .range(colorRange.split(","));

    const projection = d3.geoIdentity()
      .reflectY(true)
      .fitWidth(width, layerFeatueCollection);
    const path = d3.geoPath().projection(projection);

    // fill color gradient process
    const hgrads = g.append("defs").attr("id", layerObjects + "_hdef").selectAll("radialGradient")
      .data(layerFeatues)
      .enter()
      .append("radialGradient")
      .attr("gradientUnits", "objectBoundingBox")
      .attr("fx", "50%")
      .attr("fy", "50%")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "100%")
      .attr("id", function(d) { 
        // return "hgrad" + d.id;
        return "hgrad" + findprop(d, layerFeatureCode);
      });
    
    hgrads.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "white")
        .style("stop-opacity", "1");


    hgrads.append("stop")
        .attr("offset", "100%")
        .style("stop-color",  function(d, i) { 
          return color(i + 1); 
        })
        .style("stop-opacity", "1");

    const grads = g.append("defs").attr("id", layerObjects + "_def").selectAll("radialGradient")
      .data(layerFeatues)
      .enter()
      .append("radialGradient")
      .attr("gradientUnits", "objectBoundingBox")
      .attr("fx", "50%")
      .attr("fy", "50%")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "35%")
      .attr("id", function(d) { 
        // return "grad" + d.id;
        return "grad" + findprop(d, layerFeatureCode);
      });

    grads.append("stop")
        .attr("offset", "0%")
        .style("stop-color",  function(d, i) { 
          return color(i + 1); 
        })
        .style("stop-opacity", ".8");

    grads.append("stop")
        .attr("offset", "100%")
        .style("stop-color",  function(d, i) { 
          return color(i + 1); 
        })
        .style("stop-opacity", "1");

    if (featureNameStyle == 'static') {
      const mouseover = function(p) {

        d3.select(this)
          .style("fill", function(d) {
              // return "url(#hgrad" + d.id + ")";
              return "url(#hgrad" + findprop(d, layerFeatureCode) + ")";
          });

      }
      
      const mouseout = function (p) {

        d3.select(this)
          .style("fill", function(d) { 
            // return "url(#grad" + d.id + ")";
            return "url(#grad" + findprop(d, layerFeatureCode) + ")";
          });
      }

      gLayer.selectAll("path")
        .data(layerFeatues)
        .enter().append("path")
        // .attr("class", "layer1")
        .attr("d", path)
        // .attr("fill", function(d,i) { 
        //   return color(i + 1);
        // })
        .attr("fill", function(d) {
            // return "url(#grad" + d.id + ")";
            return "url(#grad" + findprop(d, layerFeatureCode) + ")";
        })
        .attr("layer-feature-code", function(d) {
          return findprop(d, layerFeatureCode);
        })
        .attr("layer-feature-name", function(d) {
          return findprop(d, layerFeatureName);
        })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

      // border
      gLayer.append("path")
        .datum(mesh)
        .attr("d", path)
        .attr("class", "layer1-boundary");

      // Layer1 labels
      gLabelLayer.selectAll("text")
        .data(layerFeatues)
        .enter().append("text")
        .attr("class", "label")
        .attr("pointer-events", "none")
        .attr("transform", function(d) { 
          return "translate(" + path.centroid(d) + ")"; 
        })
        .attr("dy", ".35em")
        .text(function(d) { 
          return findprop(d, layerFeatureName); 
        })
        .attr("layer-feature-code", function(d) { 
          return findprop(d, layerFeatureCode);
        });
    } 

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////// loading subway data ////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    const subwayJson = await d3.json(this.subwayPath);

    const subwayFeatureCollection = topojson.feature(subwayJson, subwayJson.objects[subwayObjects]);      
    const subwayFeatures = subwayFeatureCollection.features;

    console.log("subwayFeatures:", subwayFeatures);

    // const subwayProjection = d3.geoIdentity()
    //   .reflectY(true)
    //   .fitSize([width,height], subwayFeatureCollection);
    const subwayPath = d3.geoPath().projection(projection);

    const mouseover = function(p, i) {
      d3.select(this)
        .style("cursor", "pointer")
        .attr("class", "subwayActive");

      gSubwayLabelLayer.selectAll("text")
        .filter(function(d){
          // console.log("p", findprop(p, subwayFeatureName))
          // console.log("d", findprop(d, subwayFeatureName))
          return findprop(p, subwayFeatureName) == findprop(d, subwayFeatureName);
        })
        .transition()
        .style("fill-opacity", 1)
        .style("display", "block");  
    }

    const mouseout = function(p, i) {
      d3.select(this)
        .style("cursor", "")
        .attr("class", "subway");


      gSubwayLabelLayer.selectAll("text")
        .filter(function(d){
          // console.log("p", findprop(p, subwayFeatureName))
          // console.log("d", findprop(d, subwayFeatureName))
          return findprop(p, subwayFeatureName) == findprop(d, subwayFeatureName);
        })
        .transition()
        .style("fill-opacity", 0)
        .transition()
        .style("display", "none");        
    }

    gSubwayLayer.selectAll("path")
        .data(subwayFeatures)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return "subway";
        })
        .attr("d", path)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    // Subway labels
    gSubwayLabelLayer.selectAll("text")
      .data(subwayFeatures)
      .enter().append("text")
      .attr("class", "subwayLabel")
      .attr("pointer-events", "none")
      .attr("transform", function(d) { 
        return "translate(" + path.centroid(d) + ")"; 
      })
      .attr("dy", ".35em")
      .text(function(d) { 
        return findprop(d, subwayFeatureName); 
      });    

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////  zoom logic //////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    const zoomed = function() {
      gLayer.attr("transform", d3.event.transform);
      gLabelLayer.attr("transform", d3.event.transform);
      gSubwayLayer.attr("transform", d3.event.transform);
      gSubwayLabelLayer.attr("transform", d3.event.transform);
    }

    const zoom = d3.zoom()
      .scaleExtent([1, 40])
      .translateExtent([
        [-100, -100],
        [this.width + 90, this.height + 100]
      ])
      .on("zoom", zoomed);

    svg.call(zoom); 

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

.subwayLabel {
  display: none;
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

.subway { fill: none; stroke: #2342fd; stroke-width: 1px;}
.subwayActive { fill: none; stroke: crimson; stroke-width: 3px; filter: drop-shadow(0 0 2rem orange);}
</style>
