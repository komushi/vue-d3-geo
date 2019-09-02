# TopoJSON, GeoJSON and Shapefile
This guide shows you how to generate/use TopoJSON files(maps) for vue-d3-geo.

![states](https://raw.githubusercontent.com/komushi/vue-d3-geo/master/images/states.jpg)

## 1. Generate map files
### 1-1. Convert Shapefiles to GeoJSON files
```
brew install gdal
```

```
ogr2ogr -f GeoJSON states.geojson cb_2018_us_state_20m.shp
ogr2ogr -f GeoJSON counties.geojson cb_2018_us_county_20m.shp
```

### 1-2. Convert GeoJSON to TopoJSON files
```
npm install -g topojson-server
```

### 1-2-1. Generate single-layer TopoJSON files
```
geo2topo states=states.geojson > states.topojson
geo2topo counties=counties.geojson > counties.topojson
```

#### States TopoJSON
```
{
	"type": "Topology",
	"objects": {
		"counties": {
			"type": "GeometryCollection",
			"geometries": [
			{
				"type": "Polygon",
				"arcs": [
					[
						10,
						11,
						12,
						13,
						14,
						15
					]
				],
				"properties": {
					"STATEFP": "19",
					"STATENS": "01779785",
					"AFFGEOID": "0400000US19",
					"GEOID": "19",
					"STUSPS": "IA",
					"NAME": "Iowa",
					"LSAD": "00",
					"ALAND": 144661267977,
					"AWATER": 1084180812
				}
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

#### Counties TopoJSON
```
{
	"type": "Topology",
	"objects": {
	    "counties": {
			"type": "GeometryCollection",
			"geometries": [
			{
				"type": "Polygon",
				"arcs": [
					[
						0,
						1,
						2,
						3,
						4
					]
				],
				"properties": {
					"STATEFP": "37",
					"COUNTYFP": "017",
					"COUNTYNS": "01026336",
					"AFFGEOID": "0500000US37017",
					"GEOID": "37017",
					"NAME": "Bladen",
					"LSAD": "06",
					"ALAND": 2265887723,
					"AWATER": 33010866
				}
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

### 1-2-2. Generate double-layer TopoJSON files
```
geo2topo states=states.geojson counties=counties.geojson > states_counties.topojson
```

#### Double-layer Counties & States TopoJSON
```
{
	"type": "Topology",
		"objects": {
		    "counties": {
		    	...
			},
		    "states": {
		    	...
			},
		},
    "arcs":[
    	...
    ],
    "bbox": [
    	...
    ]
}
```

## 2. Set TopoJSON(map) to vue-d3-geo
### 2-1. Map of Counties
```
<d3-geo-static 
    id="01"
    topojson-path="data/counties.topojson"
    layerObjects="counties"
    layerFeatureName="properties.NAME"
    layerFeatureCode="properties.COUNTYNS"
    scale="1400"
    width="1600"
    height="800"
    center="-99.7506251, 38.7840204"
    >
 </d3-geo-static>
```

### 2-2. Map of States
```
<d3-geo-static 
    id="01"
    topojson-path="data/states.topojson"
    layerObjects="states"
    layerFeatureName="properties.NAME"
    layerFeatureCode="properties.STATEFP"
    scale="1400"
    width="1600"
    height="800"
    center="-99.7506251, 38.7840204"
    >
 </d3-geo-static>
```

### 2-3. Map of States & Counties
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

## 3. References
[TopoJSON is an extension of GeoJSON that encodes topology!](https://github.com/topojson/topojson)

[GeoJSON is an open standard format designed for representing simple geographical features.](https://en.wikipedia.org/wiki/GeoJSON)

[Shapefile is a popular geospatial vector data format for geographic information system (GIS) software.](https://en.wikipedia.org/wiki/Shapefile)

[United States Census Bureau](https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html)