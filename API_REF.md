# API Reference

# 1. D3GeoStatic
## 1-1. Example of using D3GeoStatic for Single-layer map
```
     <d3-geo-static 
      id="01"
      topojson-path="data/europe.topojson"
      layer-objects="europe"
      layer-feature-name="properties.NAME"
      layer-feature-code="id"
      scale="800"
      width="1200"
      height="1200"
      center="15.1373363, 55.5598312"
      >
    </d3-geo-static>
```

## 1-2. Snippet of the Europe TopoJSON

```
{
	"type": "Topology",
	"objects": {
		"europe": {
			"type": "GeometryCollection",
			"geometries": [
	        {
				"type": "Polygon",
				"properties": {
					"NAME": "Bulgaria"
				},
				"id": "BG",
				"arcs": [
					[
						32,
						33,
						34,
						35,
						36,
						37
						]
				]
	        },
		...
    },
    "arcs":[
    	...
    ],
    "bbox": [
    	...
    ]
}
```

## 1-3. Parameters of D3GeoStatic
* id: The unique ID for this map.
* topojson-path: The path of the TopoJSON for this map.
* layer-objects: The object name of the layer to be displayed on this map in the TopoJSON.
* layer-feature-name: The polygon name to be displayed on this map.
* layer-feature-code: The unique polygon code.
* scale: The scale of the map.
* width: The width of the map.
* height: The height of the map.
* center: The center of the map. The center of the map is Tokyo's coordinates by default. Need to change the center with your own topojson.
* color-range: The color range for the map.

# 2. D3GeoDoubleLayer
## 2-1. Example of using D3GeoDoubleLayer for Double-layer map
```
<d3-geo-double-layer 
	id="01" 
	topojson-path="data/states_counties.topojson"
	layer1-objects="states"
	layer2-objects="counties"
	layer1-feature-name="properties.NAME"
	layer1-feature-code="properties.STATEFP"
	layer2-feature-name="properties.NAME"
	layer2-feature-code="properties.COUNTYNS"
	color-range="#23029d,#23029d,#23029d"
	scale="1400"
	width="1600"
	height="800"
	center="-99.7506251, 38.7840204"
	>    
</d3-geo-double-layer>
```

## 2-2. Snippet of the United States Counties & States TopoJSON
```
{
  "type": "Topology",
  "objects": {
    "states": {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Polygon",
          "arcs": [
            [
              136,
              137,
              138,
              139,
              140,
              -26,
              -25,
              -24,
              -23,
              -22,
              -21,
              -20,
              -19,
              -18,
              141
            ]
          ],
          "properties": {
            "STATEFP": "10",
            "STATENS": "01779781",
            "AFFGEOID": "0400000US10",
            "GEOID": "10",
            "STUSPS": "DE",
            "NAME": "Delaware",
            "LSAD": "00",
            "ALAND": 5045925646,
            "AWATER": 1399985648
          }
        },
        ...

    "counties": {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Polygon",
          "arcs": [
            [
              -9484,
              140,
              -26,
              -25,
              -24,
              -23
            ]
          ],
          "properties": {
            "STATEFP": "10",
            "COUNTYFP": "005",
            "COUNTYNS": "00217269",
            "AFFGEOID": "0500000US10005",
            "GEOID": "10005",
            "NAME": "Sussex",
            "LSAD": "06",
            "ALAND": 2424543661,
            "AWATER": 674175861
          }
        },
```

## 1-3. Parameters of D3GeoStatic
* id: The unique ID for this map.
* topojson-path: The path of the TopoJSON for this map.
* layer1-objects: The object name of the parent layer to be displayed on this map in the TopoJSON.
* layer2-objects: The object name of the child layer to be displayed on this map in the TopoJSON.
* layer1-feature-name: The polygon name to be displayed on this map.
* layer1-feature-code: The unique polygon code - this property must exist in both layer1 and layer2. It represents the parent group of the polygons for the child layer.
* layer2-feature-name: The polygon name to be displayed on this map.
* layer2-feature-code: The unique polygon code.
* scale: The scale of the map.
* width: The width of the map.
* height: The height of the map.
* center: The center of the map. The center of the map is Tokyo's coordinates by default. Need to change the center with your own topojson.
* color-range: The color range for the map.
