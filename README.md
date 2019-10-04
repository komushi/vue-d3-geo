# vue-d3-geo
A D3 Geo Vue.js Library
![screenshot](https://raw.githubusercontent.com/komushi/vue-d3-geo/master/images/screenshot.jpg)

## 1. For Users to see the demo(using live-server or host it as a static web app)
```
git clone https://github.com/komushi/vue-d3-geo
cd vue-d3-geo/demo
live-server
```

## 2. For Users to use the components

### 2-1. Install 
```
npm install --save vue-d3-geo
```

### 2-2. Add d3-geo components in your vue's template
#### Default single-layer Tokyo map
```
<template>
	<div>
		...

		<d3-geo-static
		  id="01" 
		  topojson-path="data/tokyo_23_blocks_districts_final.json"
		  >    
		</d3-geo-static>

		....
	</div>
</template>
```

#### Default double-layer Tokyo map
```
<template>
	<div>
		...

		<d3-geo-double-layer
		  id="01" 
		  topojson-path="data/tokyo_23_blocks_districts_final.json"
		  >    
		</d3-geo-double-layer>

		....
	</div>
</template>
```

### 2-3. Add d3-geo components in your vue's script
```
<script>
...

import * as d3geo from 'vue-d3-geo';
import 'vue-d3-geo/dist/vue-d3-geo.css';

export default {
	
	...

	components: {
		...

		D3GeoDoubleLayer: d3geo.D3GeoDoubleLayer,
		D3GeoEvents: d3geo.D3GeoEvents,
		D3GeoStatic: d3geo.D3GeoStatic,
	}
}
</script>
```
### 2-4. Use your own maps
* [TopoJSON Guide](./TOPOJSON.md#)
* [Single-layer map API Reference](./API_REF.md#)
* [Double-layer map API Reference](./API_REF.md#)

## 3. For Developers
Fork this repo and add your own components under src/components

### 3-1. Compiles and hot-reloads for development
```
npm run serve
```

### 3-2. Compiles and minifies for production
```
npm run build
```

### 3-3. Lints and fixes files
```
npm run lint
```

### Customization configuration references
* https://qiita.com/coppieee/items/dcf120d6b8eef68ecb34
* https://cli.vuejs.org/guide/build-targets.html
* https://github.com/awaigand/vue-cli-target-lib-example/


## 4. TODO
* Upgrade to the latest d3.js
* Add a road/rail component like below.
https://qiita.com/hiyuzawa/items/b28fa4d380d02d8bd5a1