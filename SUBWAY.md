# D3GeoSubway Guide
This guide expalins how to create an example Subway Map.

![states](https://raw.githubusercontent.com/komushi/vue-d3-geo/master/images/subway.jpg)

## 1. Generate map files
### 1-1. Get and Unzip the Subway Data
http://nlftp.mlit.go.jp/ksj/gml/data/N06/N06-18/N06-18_GML.zip

### 1-2. Get Subway Lines from only the Tokyo Area as GeoJSON file
```
brew install gdal
```

```
ogr2ogr -f GeoJSON tokyo_subway.geojson RailroadSection.geojson -dialect sqlite -sql "SELECT RANK() OVER (ORDER BY N02_003, N02_004) as ID, N02_001, N02_002, N02_003, N02_004, ST_UNION(geometry) as geometry FROM RailroadSection WHERE N02_004 IN ('東京都', '東京地下鉄', '東京モノレール', '東京臨海高速鉄道', 'ゆりかもめ', '京浜急行電鉄', '東京急行電鉄', '京王電鉄', '舞浜リゾートライン') GROUP BY N02_003, N02_004"
```

### 1-3. Convert GeoJSON to TopoJSON files
```
npm install -g topojson-server
```

### 1-3-1. Generate TopoJSON file
```
geo2topo lines=tokyo_subway.geojson > tokyo_subway.topojson
```

## 2. Generate D3GeoSubway.vue component
### 2-1. Copy for D3GeoStatic.vue and rename

### 2-2. Add Subway and Zoom logic
```
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////// loading subway data ////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    d3.json(this.subwayPath).then(json => {
      
      const subwayFeatures = topojson.feature(json, json.objects[subwayObjects]).features;

      console.log("subwayFeatures:", subwayFeatures);

      const click = function(p, i) {
        console.log('click', p);

        // gSubwayLabelLayer.selectAll("text")
        //   .filter(function(d){
        //     // console.log("p", findprop(p, subwayFeatureName))
        //     // console.log("d", findprop(d, subwayFeatureName))
        //     return findprop(p, subwayFeatureName) == findprop(d, subwayFeatureName);
        //   })
        //   .transition()
        //   .style("fill-opacity", 1)
        //   .style("display", "block");        
      }

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
          .on("mouseout", mouseout)
          .on("click", click)

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
        // .attr("layer-feature-code", function(d) { 
        //   return findprop(d, layerFeatureCode);
        // });

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
```

### 2-3. Add CSS style
```
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

.subway { fill: none; stroke: #2342fd; stroke-width: 2px;}
.subwayActive { fill: none; stroke: crimson; stroke-width: 3px; filter: drop-shadow(0 0 2rem orange);}
```


## 3. Set TopoJSON(map and subway) to vue-d3-geo
Copy the following files under public/data/
* tokyo_23_blocks_districts_final.json
* tokyo_subway.topojson

### 3-1. Map of Counties
```
<d3-geo-subway
  id="04" 
  map-path="data/tokyo_23_blocks_districts_final.json"
  subway-path="data/tokyo_subway.topojson"
  width="1200"
  height="1200"
  >    
</d3-geo-subway>
```

## 4. References
[TopoJSON is an extension of GeoJSON that encodes topology!](https://github.com/topojson/topojson)

[GeoJSON is an open standard format designed for representing simple geographical features.](https://en.wikipedia.org/wiki/GeoJSON)

[GeoJSON online viewer](http://geojson.io/)

[Reference to use LineString](https://qiita.com/hiyuzawa/items/b28fa4d380d02d8bd5a1)

## 5. TODO

### 5-1. Add gradient colors to the Path
http://bl.ocks.org/pnavarrc/20950640812489f13246
http://www.d3noob.org/2013/01/applying-colour-gradient-to-graph-line.html


------------
## D3GeoSubwayV2 - use geoIdentity for projection instead of geoMercator
### Reference: Scaling d3 v4 map to fit SVG (or at all)
https://stackoverflow.com/questions/42430361/scaling-d3-v4-map-to-fit-svg-or-at-all

## D3GeoSubwayV3 - overlap happens need to use Bezier Curves Offset feature
### Reference: defs in d3
http://bl.ocks.org/anonymous/2b1d992dfb66542ec1e2

## D3GeoSubwayV4 - Use mask to create 'identical paths' but color is an issue
### Reference: D3 Translating two identical paths so that they run parallel
https://stackoverflow.com/questions/42072309/d3-translating-two-identical-paths-so-that-they-run-parallel

## Offset - Bezier Curves
https://stackoverflow.com/questions/53411999/find-parallel-or-offset-svg-path
https://pomax.github.io/bezierjs/#offset
https://observablehq.com/@mbostock/hello-bezier-js
https://stackoverflow.com/questions/37072075/paper-js-draw-multiple-parallel-paths-from-one-path