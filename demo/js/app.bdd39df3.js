(function(t){function e(e){for(var a,i,l=e[0],s=e[1],u=e[2],d=0,p=[];d<l.length;d++)i=l[d],Object.prototype.hasOwnProperty.call(n,i)&&n[i]&&p.push(n[i][0]),n[i]=0;for(a in s)Object.prototype.hasOwnProperty.call(s,a)&&(t[a]=s[a]);c&&c(e);while(p.length)p.shift()();return o.push.apply(o,u||[]),r()}function r(){for(var t,e=0;e<o.length;e++){for(var r=o[e],a=!0,l=1;l<r.length;l++){var s=r[l];0!==n[s]&&(a=!1)}a&&(o.splice(e--,1),t=i(i.s=r[0]))}return t}var a={},n={app:0},o=[];function i(e){if(a[e])return a[e].exports;var r=a[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=a,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(r,a,function(e){return t[e]}.bind(null,a));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],s=l.push.bind(l);l.push=e,l=l.slice();for(var u=0;u<l.length;u++)e(l[u]);var c=s;o.push([0,"chunk-vendors"]),r()})({0:function(t,e,r){t.exports=r("56d7")},"003a":function(t,e,r){"use strict";var a=r("8806"),n=r.n(a);n.a},"19df":function(t,e,r){},"1b59":function(t,e,r){"use strict";var a=r("30cf"),n=r.n(a);n.a},"30cf":function(t,e,r){},"56d7":function(t,e,r){"use strict";r.r(e);r("cadf"),r("551c"),r("f751"),r("097d");var a=r("2b0e"),n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"app"}},[r("d3-geo-subway",{attrs:{id:"04","map-path":"data/tokyo_23_blocks_districts_final.json","subway-path":"data/tokyo_subway.topojson",width:"1200",height:"1200"}})],1)},o=[],i=(r("6b54"),function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div")}),l=[],s=(r("28a5"),r("c5f6"),r("5698")),u=r("3fe2"),c=function(t,e){var r,a,n=e.split(".");for(r=0,a=n.length;r<a;r++){if(!t.hasOwnProperty(n[r]))return;t=t[n[r]]}return t},d={topojsonPath:{type:String},width:{type:[String,Number],default:1e3},height:{type:[String,Number],default:1e3},colorRange:{type:String,default:"#0d47a1,#e3f2fd"},center:{type:String,default:"139.752268, 35.677043"},scale:{type:[String,Number],default:11e4},layerObjects:{type:String,default:"districts"},layerFeatureName:{type:String,default:"properties.district"},layerFeatureCode:{type:String,default:"properties.district_code"},featureNameStyle:{type:String,default:"static"}},p={name:"d3-geo-staic",props:d,mounted:function(){var t=this.layerObjects,e=this.colorRange,r=this.layerFeatureCode,a=this.layerFeatureName,n=this.featureNameStyle,o=s["k"](this.$el).append("svg").attr("width",this.width).attr("height",this.height),i=o.append("g"),l=i.append("g").attr("id",this.layerObjects),d=i.append("g").attr("id",this.layerObjects+"_label");console.log("this.center:",this.center);var p=s["d"]().center(this.center.split(",")).scale(this.scale).translate([this.width/2,this.height/2]),f=s["e"]().projection(p);s["g"](this.topojsonPath).then((function(o){console.log("layerObjects:",t);var p=u["a"](o,o.objects[t]).features,y=u["b"](o,o.objects[t],(function(t,e){return t!==e})),h=s["j"]().domain([1,p.length]).interpolate(s["f"]).range(e.split(",")),g=i.append("defs").attr("id",t+"_hdef").selectAll("radialGradient").data(p).enter().append("radialGradient").attr("gradientUnits","objectBoundingBox").attr("fx","50%").attr("fy","50%").attr("cx","50%").attr("cy","50%").attr("r","100%").attr("id",(function(t){return"hgrad"+c(t,r)}));g.append("stop").attr("offset","0%").style("stop-color","white").style("stop-opacity","1"),g.append("stop").attr("offset","100%").style("stop-color",(function(t,e){return h(e+1)})).style("stop-opacity","1");var b=i.append("defs").attr("id",t+"_def").selectAll("radialGradient").data(p).enter().append("radialGradient").attr("gradientUnits","objectBoundingBox").attr("fx","50%").attr("fy","50%").attr("cx","50%").attr("cy","50%").attr("r","35%").attr("id",(function(t){return"grad"+c(t,r)}));if(b.append("stop").attr("offset","0%").style("stop-color",(function(t,e){return h(e+1)})).style("stop-opacity",".8"),b.append("stop").attr("offset","100%").style("stop-color",(function(t,e){return h(e+1)})).style("stop-opacity","1"),"static"==n){var m=function(t){s["k"](this).style("fill",(function(t){return"url(#hgrad"+c(t,r)+")"}))},v=function(t){s["k"](this).style("fill",(function(t){return"url(#grad"+c(t,r)+")"}))};l.selectAll("path").data(p).enter().append("path").attr("d",f).attr("fill",(function(t){return"url(#grad"+c(t,r)+")"})).attr("layer-feature-code",(function(t){return c(t,r)})).attr("layer-feature-name",(function(t){return c(t,a)})).on("mouseover",m).on("mouseout",v),l.append("path").datum(y).attr("d",f).attr("class","layer1-boundary"),d.selectAll("text").data(p).enter().append("text").attr("class","label").attr("pointer-events","none").attr("transform",(function(t){return"translate("+f.centroid(t)+")"})).attr("dy",".35em").text((function(t){return c(t,a)})).attr("layer-feature-code",(function(t){return c(t,r)}))}}))}},f=p,y=(r("c403"),r("2877")),h=Object(y["a"])(f,i,l,!1,null,null,null),g=h.exports,b=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div")},m=[],v=(r("ac6a"),{id:{type:String,required:!0},topojsonPath:{type:String},width:{type:[String,Number],default:1e3},height:{type:[String,Number],default:1e3},colorRange:{type:String,default:"#e3f2fd,#2196f3,#0d47a1"},center:{type:String,default:"139.752268, 35.677043"},scale:{type:[String,Number],default:11e4},layer1Objects:{type:String,default:"districts"},layer2Objects:{type:String,default:"blocks"},layer1FeatureName:{type:String,default:"properties.district"},layer1FeatureCode:{type:String,default:"properties.district_code"},layer2FeatureName:{type:String,default:"properties.block"},layer2FeatureCode:{type:String,default:"properties.block_code"},layer1EventData:{type:Object},layer2EventData:{type:Array},layer1EventCountTag:{type:String,default:"dropoffCount"},layer1LegendTitle:{type:String,default:"Drop-off events in the last 30 minutes"}}),x={name:"d3-geo-double-layer",data:function(){return{legendWidth:0,projection:{}}},props:v,mounted:function(){var t=this,e=s["k"](this.$el).append("svg").attr("width",t.width).attr("height",t.height);e.append("rect").attr("class","background").attr("width",t.width).attr("height",t.height).on("click",j);var r=e.append("g").attr("id","base"),a=r.append("g").attr("id","layer2"),n=r.append("g").attr("id","layer1"),o=r.append("g").attr("id","layer2_label"),i=r.append("g").attr("id","layer1_label");this.projection=s["d"]().center(t.center.split(",")).scale(t.scale).translate([t.width/2,t.height/2]);var l=s["e"]().projection(this.projection),d=r.append("defs").attr("id","common_grads_def"),p=d.append("radialGradient").attr("gradientUnits","objectBoundingBox").attr("fx","50%").attr("fy","50%").attr("cx","50%").attr("cy","50%").attr("r","35%").attr("id","circleGrad1");p.append("stop").attr("offset","0%").style("stop-color","white").style("stop-opacity","1"),p.append("stop").attr("offset","100%").style("stop-color",(function(t){return"orange"})).style("stop-opacity",".6");var f=t.getCountPoints(1,t.width,10),y=t.getCountScale(1,t.width);d.append("linearGradient").attr("id","legend-traffic").attr("x1","0%").attr("y1","0%").attr("x2","100%").attr("y2","0%").selectAll("stop").data(s["i"](10)).enter().append("stop").attr("offset",(function(e,r){return y(f[r])/t.width})).attr("stop-color",(function(e,r){return t.colorRange.split(",")[0]}));r.node().getBBox();t.legendWidth=Math.min(.8*t.width,600);var h=r.append("g").attr("id","legendWrapper").attr("transform","translate("+t.width/2+","+.95*t.height+")");h.append("rect").attr("id","legendRect").attr("x",-t.legendWidth/2).attr("y",0).attr("width",t.legendWidth).attr("height",10).style("fill","url(#legend-traffic)"),h.append("text").attr("class","layer1LegendTitle").attr("x",0).attr("y",-10).style("text-anchor","middle").text(t.layer1LegendTitle);var g=t.getXAxis(t.legendWidth,0);h.append("g").attr("id","axis").attr("transform","translate(0,10)").call(g),s["g"](this.topojsonPath).then((function(e){var d=u["a"](e,e.objects[t.layer1Objects]).features,p=u["a"](e,e.objects[t.layer2Objects]).features,f=u["b"](e,e.objects[t.layer1Objects],(function(t,e){return t!==e})),y=t.colorRange.split(",")[0],h=r.append("defs").attr("id","layer1_hgrads").selectAll("radialGradient").data(d).enter().append("radialGradient").attr("gradientUnits","objectBoundingBox").attr("fx","50%").attr("fy","50%").attr("cx","50%").attr("cy","50%").attr("r","100%").attr("id",(function(e,r){return"hgrad"+c(e,t.layer1FeatureCode)}));h.append("stop").attr("offset","0%").style("stop-color","white").style("stop-opacity","1"),h.append("stop").attr("offset","100%").style("stop-color",(function(t,e){return y})).style("stop-opacity","1");var g=r.append("defs").attr("id","layer1_grads").selectAll("radialGradient").data(d).enter().append("radialGradient").attr("gradientUnits","objectBoundingBox").attr("fx","50%").attr("fy","50%").attr("cx","50%").attr("cy","50%").attr("r","35%").attr("id",(function(e,r){return"grad"+c(e,t.layer1FeatureCode)}));g.append("stop").attr("offset","0%").style("stop-color",(function(t,e){return y})).style("stop-opacity",".7"),g.append("stop").attr("offset","100%").style("stop-color",(function(t,e){return y})).style("stop-opacity","1");var b=function(e){console.log("mouseoverLayer1"),s["k"](this).style("fill",(function(e){return"url(#hgrad"+c(e,t.layer1FeatureCode)+")"}))},x=function(e){s["k"](this).style("fill",(function(e){return"url(#grad"+c(e,t.layer1FeatureCode)+")"}))};a.selectAll("path").data(p).enter().append("path").attr("d",l).attr("fill",(function(e,r){return"url(#grad"+c(e,t.layer1FeatureCode)+")"})).style("fill-opacity",0).style("display","none").attr("layer1-feature-code",(function(e){return c(e,t.layer1FeatureCode)})).attr("layer1-feature-name",(function(e){return c(e,t.layer1FeatureName)})).attr("layer2-feature-code",(function(e){return c(e,t.layer2FeatureCode)})).attr("layer2-feature-name",(function(e){return c(e,t.layer2FeatureName)})).attr("class","layer2").on("click",m).on("mouseover",w).on("mouseout",C),o.selectAll("text").data(p).enter().append("text").attr("class","label").style("fill-opacity",0).style("display","none").attr("transform",(function(t){return"translate("+l.centroid(t)+")"})).attr("dy",".35em").attr("pointer-events","none").text((function(e){return c(e,t.layer2FeatureName)})).attr("layer2-feature-code",(function(e){return c(e,t.layer2FeatureCode)})),n.selectAll("path").data(d).enter().append("path").attr("class","layer1").attr("d",l).style("fill",(function(e,r){return"url(#grad"+c(e,t.layer1FeatureCode)+")"})).attr("layer1-feature-code",(function(e){return c(e,t.layer1FeatureCode)})).attr("layer1-feature-name",(function(e){return c(e,t.layer1FeatureName)})).on("click",v).on("mouseover",b).on("mouseout",x),n.append("path").datum(f).attr("d",l).attr("class","layer1-boundary"),i.selectAll("text").data(d).enter().append("text").attr("class","label").attr("transform",(function(t){return"translate("+l.centroid(t)+")"})).attr("dy",".35em").attr("pointer-events","none").text((function(e){return c(e,t.layer1FeatureName)})).attr("layer1-feature-code",(function(e){return c(e,t.layer1FeatureCode)}))}));var b=s["k"](null),m=function(t){if(console.log("layer2Clicked"),b.node()&&this.getAttribute("layer1-feature-code")==b.node().getAttribute("layer1-feature-code"))return j()},v=function(t){if(console.log("layer1Clicked"),b.node()===this)return j();b.classed("active",!1),b=s["k"](this).classed("active",!0),x(t)},x=function(e){var n=l.bounds(e),o=n[1][0]-n[0][0],s=n[1][1]-n[0][1],u=(n[0][0]+n[1][0])/2,d=(n[0][1]+n[1][1])/2,p=.9/Math.max(o/t.width,s/t.height),f=[t.width/2-p*u,t.height/2-p*d];r.transition().duration(750).style("stroke-width",1.5/p+"px").attr("transform","translate("+f+")scale("+p+")"),i.selectAll("text").transition().style("fill-opacity",0).transition().style("display","none"),a.selectAll("path").transition().style("fill-opacity",1).style("display","block");var y=c(e,t.layer1FeatureCode);t.$emit("on-stop-events"),t.$emit("on-receive-events",y)};function j(){b.classed("active",!1),b=s["k"](null),r.transition().duration(750).style("stroke-width","1.5px").attr("transform",""),i.selectAll("text").transition().style("display","block").transition().duration(250).style("fill-opacity",1),a.selectAll("path").transition().style("fill-opacity",0).style("display","none"),t.$emit("on-stop-events")}var w=function(e){console.log("mouseoverLayer2"),o.selectAll("text").filter((function(r){return console.log("p",c(e,t.layer2FeatureCode)),console.log("d",c(r,t.layer2FeatureCode)),c(e,t.layer2FeatureCode)==c(r,t.layer2FeatureCode)})).transition().style("fill-opacity",1).style("display","block"),s["k"](this).style("fill",(function(e){return"url(#hgrad"+c(e,t.layer1FeatureCode)+")"}))},C=function(e){o.selectAll("text").filter((function(r){return c(e,t.layer2FeatureCode)==c(r,t.layer2FeatureCode)})).transition().style("fill-opacity",0).transition().style("display","none"),s["k"](this).style("fill",(function(e){return"url(#grad"+c(e,t.layer1FeatureCode)+")"}))}},watch:{layer1EventData:function(t,e){this.visualizeLayer1Events(t)},layer2EventData:function(t,e){this.visualizeLayer2Events(t)}},methods:{visualizeLayer1Events:function(t){var e=this,r=s["b"](t),a=s["h"](r,(function(t){return t.value[e.layer1EventCountTag]})),n=e.getColorScale(a,e.colorRange),o=e.getCountPoints(a,e.width,10);s["k"]("#common_grads_def").selectAll("linearGradient").selectAll("stop").attr("stop-color",(function(t,e){return n(o[e])}));var i=e.getXAxis(e.legendWidth,a);s["k"]("#axis").selectAll(".tick").remove(),s["k"]("#axis").call(i),s["k"]("#layer1").selectAll("path").filter((function(r){if("Feature"===r.type){var a=c(r,e.layer1FeatureCode),n=t[a];if(!n)return r[e.layer1EventCountTag]=1,!0;var o=n[e.layer1EventCountTag];if(!r[e.layer1EventCountTag])return r[e.layer1EventCountTag]=o,!0;if(o!=r[e.layer1EventCountTag])return r[e.layer1EventCountTag]=o,!0}return!1})),s["k"]("#layer1_grads").selectAll("radialGradient").selectAll("stop").style("stop-color",(function(t,r){return n(t[e.layer1EventCountTag])})),s["k"]("#layer1_hgrads").selectAll("radialGradient").selectAll("stop").filter((function(t){return"100%"===this.getAttribute("offset")})).style("stop-color",(function(t,r){return n(t[e.layer1EventCountTag])})),s["k"]("#layer1").selectAll("path").filter((function(t){return"Feature"===t.type})).style("fill",(function(t,r){return"url(#grad"+c(t,e.layer1FeatureCode)+")"}))},visualizeLayer2Events:function(t){console.log(t);var e=this;s["k"]("#base").selectAll("circle").data(t).enter().append("circle").style("opacity",0).attr("class","circle").style("fill",(function(t,e){return"url(#circleGrad1)"})).attr("cx",(function(t){return e.projection(t)[0]})).attr("cy",(function(t){return e.projection(t)[1]})).attr("r",2).transition().delay((function(t,e){return 100*e})).style("opacity",1).transition().delay((function(t,e){return 100*e+250+100})).style("opacity",0).remove()},getCountScale:function(t,e){return s["j"]().domain([0,t]).range([0,e])},getCountPoints:function(t,e,r){var a=this.getCountScale(t,r),n=a.domain();n[2]=n[1]-n[0];for(var o=[],i=0;i<r;i++)o.push(i*n[2]/(r-1)+n[0]);return o},getColorScale:function(t,e){return s["j"]().domain([0,t/2,t]).range(e.split(","))},getXAxis:function(t,e){var r=s["j"]().range([-t/2,t/2]).domain([0,e]);return s["a"]().ticks(5).scale(r)}}},j=x,w=(r("003a"),Object(y["a"])(j,b,m,!1,null,null,null)),C=w.exports,F=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div")},S=[],k={id:{type:String,required:!0},topojsonPath:{type:String},width:{type:[String,Number],default:1e3},height:{type:[String,Number],default:1e3},bgColor:{type:String,default:"#bbdefb"},colorRange:{type:String,default:"#227AFF,#FFF500"},topNumber:{type:[String,Number],default:10},center:{type:String,default:"139.752268, 35.677043"},scale:{type:[String,Number],default:15e4},layerObjects:{type:String,default:"blocks"},layerFeatureName:{type:String,default:"properties.block"},layerFeatureCode:{type:String,default:"properties.block_code"},layerEventData:{type:Array}},O={name:"d3-geo-events",data:function(){return{projection:{}}},props:k,mounted:function(){var t=this,e=s["k"](this.$el).append("svg").attr("width",t.width).attr("height",t.height),r=e.append("g").attr("id","base"),a=r.append("g").attr("id",t.layerObjects),n=r.append("g").attr("id",t.layerObjects+"_label");this.projection=s["d"]().center(t.center.split(",")).scale(t.scale).translate([t.width/2,t.height/2]);var o=s["e"]().projection(this.projection),i=t.getColorScale(t.topNumber,t.colorRange),l=r.append("defs").attr("id","from_def").selectAll("linearGradient").data(s["i"](1,parseInt(t.topNumber)+1)).enter().append("linearGradient").attr("gradientUnits","objectBoundingBox").attr("x1","100%").attr("y1","0%").attr("x2","0%").attr("y2","0%").attr("id",(function(t,e){return"fromGrad"+(e+1)}));l.append("stop").attr("offset","0%").style("stop-color","white").style("stop-opacity","1"),l.append("stop").attr("offset","100%").style("stop-color",(function(t,e){return i(e+1)})).style("stop-opacity","1");var d=r.append("defs").attr("id","to_def").selectAll("linearGradient").data(s["i"](1,parseInt(t.topNumber)+1)).enter().append("linearGradient").attr("gradientUnits","objectBoundingBox").attr("x1","0%").attr("y1","0%").attr("x2","100%").attr("y2","0%").attr("id",(function(t,e){return"toGrad"+(e+1)}));d.append("stop").attr("offset","0%").style("stop-color","white").style("stop-opacity","1"),d.append("stop").attr("offset","100%").style("stop-color",(function(t,e){return i(e+1)})).style("stop-opacity","1"),s["g"](this.topojsonPath).then((function(e){var r=u["a"](e,e.objects[t.layerObjects]).features,i=u["b"](e,e.objects[t.layerObjects],(function(t,e){return t!==e}));a.selectAll("path").data(r).enter().append("path").attr("d",o).attr("fill",t.bgColor).attr("layer-feature-code",(function(e){return c(e,t.layerFeatureCode)})),a.append("path").datum(i).attr("d",o).attr("class","layer1-boundary"),n.selectAll("text").data(r).enter().append("text").attr("class","label").attr("transform",(function(t){return"translate("+o.centroid(t)+")"})).attr("dy","-1em")}))},watch:{layerEventData:function(t,e){var r=this;this.hideFeatureNames().then((function(){t&&r.showFeatureNames(t)})),this.dehighlightFeatures().then((function(){t&&r.highlightFeatures(t)}))}},methods:{hideFeatureNames:function(){var t=this,e=s["k"]("#"+t.layerObjects+"_label");return new Promise((function(t,r){var a=e.selectAll("text").filter((function(t){return t.hasOwnProperty("showname")}));if(0==a.size())t();else{var n=0;a.transition().style("fill-opacity",0).transition().text((function(t){return t.hasOwnProperty("showname")&&delete t.showname,""})).attr("style",null).each((function(){++n})).on("end",(function(){--n||t()}))}}))},showFeatureNames:function(t){var e=this,r=s["k"]("#"+e.layerObjects+"_label"),a=this.extractCodes(t,"from_code"),n=this.extractCodes(t,"to_code");r.selectAll("text").filter((function(t){return a.indexOf(c(t,e.layerFeatureCode))>-1||n.indexOf(c(t,e.layerFeatureCode))>-1})).text((function(t){var r=a.indexOf(c(t,e.layerFeatureCode)),o=n.indexOf(c(t,e.layerFeatureCode));return r>-1?r+1+"_"+c(t,e.layerFeatureName):o>-1?o+1+"_"+c(t,e.layerFeatureName):void 0})).transition().style("fill-opacity",1).style("display","block").style("fill",(function(t,r){t.showname=!0;var o=a.indexOf(c(t,e.layerFeatureCode)),i=n.indexOf(c(t,e.layerFeatureCode));return o>-1?"url(#fromGrad"+(o+1)+")":i>-1?"url(#toGrad"+(i+1)+")":void 0}))},dehighlightFeatures:function(t){var e=this,r=s["k"]("#"+e.layerObjects);return new Promise((function(t,a){var n=r.selectAll("path").filter((function(t){return t.hasOwnProperty("highlight")}));if(0==n.size())t();else{var o=0;n.transition().attr("fill",(function(t){return delete t.highlight,e.bgColor})).each((function(){++o})).on("end",(function(){--o||t()}))}}))},highlightFeatures:function(t){var e=this,r=e.extractCodes(t,"from_code"),a=e.extractCodes(t,"to_code"),n=e.getColorScale(e.topNumber,e.colorRange),o=s["k"]("#"+e.layerObjects);o.selectAll("path").filter((function(t){return r.indexOf(c(t,e.layerFeatureCode))>-1||a.indexOf(c(t,e.layerFeatureCode))>-1})).transition().attr("fill",(function(t,o){t.highlight=!0;var i=r.indexOf(c(t,e.layerFeatureCode)),l=a.indexOf(c(t,e.layerFeatureCode));return i>-1?n(i+1):l>-1?n(l+1):void 0}))},extractCodes:function(t,e){var r=[];return t?(t.forEach((function(t){r.push(t[e])})),r):r},getColorScale:function(t,e){return s["j"]().domain([1,t]).interpolate(s["f"]).range(e.split(","))}}},_=O,A=(r("80a1"),Object(y["a"])(_,F,S,!1,null,null,null)),N=A.exports,E=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div")},G=[],P={mapPath:{type:String},subwayPath:{type:String},width:{type:[String,Number],default:1e3},height:{type:[String,Number],default:1e3},colorRange:{type:String,default:"#e3f2fd,#e3f2fd"},center:{type:String,default:"139.752268, 35.677043"},scale:{type:[String,Number],default:11e4},layerObjects:{type:String,default:"districts"},layerFeatureName:{type:String,default:"properties.district"},layerFeatureCode:{type:String,default:"properties.district_code"},subwayObjects:{type:String,default:"lines"},subwayFeatureName:{type:String,default:"properties.N02_003"},featureNameStyle:{type:String,default:"static"}},B={name:"d3-geo-subway",props:P,mounted:function(){var t=this.layerObjects,e=this.colorRange,r=this.layerFeatureCode,a=this.layerFeatureName,n=this.featureNameStyle,o=this.subwayObjects,i=this.subwayFeatureName,l=s["k"](this.$el).append("svg").attr("width",this.width).attr("height",this.height),d=l.append("g"),p=d.append("g").attr("id",this.layerObjects),f=d.append("g").attr("id",this.layerObjects+"_label"),y=d.append("g").attr("id",this.subwayObjects),h=d.append("g").attr("id",this.subwayObjects+"_label");console.log("this.center:",this.center);var g=s["d"]().center(this.center.split(",")).scale(this.scale).translate([this.width/2,this.height/2]),b=s["e"]().projection(g);s["g"](this.mapPath).then((function(o){console.log("layerObjects:",t);var i=u["a"](o,o.objects[t]).features,l=u["b"](o,o.objects[t],(function(t,e){return t!==e})),y=s["j"]().domain([1,i.length]).interpolate(s["f"]).range(e.split(",")),h=d.append("defs").attr("id",t+"_hdef").selectAll("radialGradient").data(i).enter().append("radialGradient").attr("gradientUnits","objectBoundingBox").attr("fx","50%").attr("fy","50%").attr("cx","50%").attr("cy","50%").attr("r","100%").attr("id",(function(t){return"hgrad"+c(t,r)}));h.append("stop").attr("offset","0%").style("stop-color","white").style("stop-opacity","1"),h.append("stop").attr("offset","100%").style("stop-color",(function(t,e){return y(e+1)})).style("stop-opacity","1");var g=d.append("defs").attr("id",t+"_def").selectAll("radialGradient").data(i).enter().append("radialGradient").attr("gradientUnits","objectBoundingBox").attr("fx","50%").attr("fy","50%").attr("cx","50%").attr("cy","50%").attr("r","35%").attr("id",(function(t){return"grad"+c(t,r)}));if(g.append("stop").attr("offset","0%").style("stop-color",(function(t,e){return y(e+1)})).style("stop-opacity",".8"),g.append("stop").attr("offset","100%").style("stop-color",(function(t,e){return y(e+1)})).style("stop-opacity","1"),"static"==n){var m=function(t){s["k"](this).style("fill",(function(t){return"url(#hgrad"+c(t,r)+")"}))},v=function(t){s["k"](this).style("fill",(function(t){return"url(#grad"+c(t,r)+")"}))};p.selectAll("path").data(i).enter().append("path").attr("d",b).attr("fill",(function(t){return"url(#grad"+c(t,r)+")"})).attr("layer-feature-code",(function(t){return c(t,r)})).attr("layer-feature-name",(function(t){return c(t,a)})).on("mouseover",m).on("mouseout",v),p.append("path").datum(l).attr("d",b).attr("class","layer1-boundary"),f.selectAll("text").data(i).enter().append("text").attr("class","label").attr("pointer-events","none").attr("transform",(function(t){return"translate("+b.centroid(t)+")"})).attr("dy",".35em").text((function(t){return c(t,a)})).attr("layer-feature-code",(function(t){return c(t,r)}))}})),s["g"](this.subwayPath).then((function(t){var e=u["a"](t,t.objects[o]).features;console.log("subwayFeatures:",e);var r=function(t,e){console.log("click",t)},a=function(t,e){s["k"](this).style("cursor","pointer").attr("class","subwayActive"),h.selectAll("text").filter((function(e){return c(t,i)==c(e,i)})).transition().style("fill-opacity",1).style("display","block")},n=function(t,e){s["k"](this).style("cursor","").attr("class","subway"),h.selectAll("text").filter((function(e){return c(t,i)==c(e,i)})).transition().style("fill-opacity",0).transition().style("display","none")};y.selectAll("path").data(e).enter().append("path").attr("class",(function(t){return"subway"})).attr("d",b).on("mouseover",a).on("mouseout",n).on("click",r),h.selectAll("text").data(e).enter().append("text").attr("class","subwayLabel").attr("pointer-events","none").attr("transform",(function(t){return"translate("+b.centroid(t)+")"})).attr("dy",".35em").text((function(t){return c(t,i)}))}));var m=function(){p.attr("transform",s["c"].transform),f.attr("transform",s["c"].transform),y.attr("transform",s["c"].transform),h.attr("transform",s["c"].transform)},v=s["l"]().scaleExtent([1,40]).translateExtent([[-100,-100],[this.width+90,this.height+100]]).on("zoom",m);l.call(v)}},T=B,D=(r("1b59"),Object(y["a"])(T,E,G,!1,null,null,null)),M=D.exports,R=r("bc3a"),L=r.n(R),$={name:"app",components:{D3GeoStatic:g,D3GeoDoubleLayer:C,D3GeoEvents:N,D3GeoSubway:M},data:function(){return{jsons:[],matrixJson:null,timer:0,districtRankList:null,circleData:null,coordinates:[[139.734291,35.688634],[139.760496,35.690335],[139.770401,35.694069],[139.765043,35.68835],[139.7661246316267,35.68825974504272],[139.7657681127479,35.687651654673644],[139.745212,35.691125],[139.759712,35.700672],[139.755267,35.693319],[139.761334,35.674706],[139.750424,35.670865],[139.7414532200372,35.679581104938],[139.749899,35.701827],[139.74692,35.696674],[139.740164,35.692643],[139.768072,35.687348],[139.75074,35.671377],[139.743383,35.697602],[139.764721,35.679816],[139.7507934778318,35.671386654224115],[139.7507934778318,35.671386654224115],[139.7507934778318,35.671386654224115],[139.743383,35.697602],[139.7507934778318,35.671386654224115],[139.76294,35.677412],[139.76585163985027,35.68940619519768],[139.761877,35.675639],[139.7507934778318,35.671386654224115],[139.746458,35.671899],[139.74692,35.696674],[139.746458,35.671899],[139.766939,35.683965],[139.737945,35.688772],[139.754544,35.669638],[139.757993,35.692478],[139.750962,35.672238],[139.765683,35.676349],[139.73610888396263,35.68553725865768],[139.73610888396263,35.685537258666734],[139.753961,35.690292],[139.757993,35.692478],[139.752018,35.671321],[139.757993,35.692478],[139.734048,35.684031],[139.742659,35.680767],[139.754544,35.669638],[139.753683,35.698596],[139.750424,35.670865],[139.765854,35.689364],[139.745793,35.692572],[139.745796,35.67096],[139.75463308702805,35.690506392289514],[139.757993,35.692478],[139.76441428407463,35.687749511028905],[139.742659,35.680767],[139.742659,35.680767],[139.754544,35.669638],[139.742824,35.675821],[139.742463,35.678098],[139.744685,35.676487],[139.742463,35.678098],[139.745074,35.675182],[139.7470116382056,35.678418885519754],[139.742463,35.678098],[139.74505617405612,35.67525922701384],[139.74465211932687,35.6765672952068],[139.74505617405615,35.675254401080785],[139.7484141620185,35.67166693581735],[139.752737,35.672691],[139.748046,35.673099],[139.742657,35.67882],[139.748046,35.673099],[139.748046,35.673099],[139.748046,35.673099],[139.748046,35.673099],[139.750157,35.676043],[139.748046,35.673099],[139.742657,35.67882],[139.748046,35.673099],[139.753073,35.673377],[139.745518,35.673015],[139.748046,35.673099],[139.7452951757008,35.67302465399794],[139.762711,35.689542],[139.7406821860937,35.67312691603093],[139.742657,35.67882],[139.742657,35.67882],[139.7453011176821,35.67295707637637],[139.762711,35.689542],[139.748046,35.673099],[139.742657,35.67882],[139.7453011176821,35.67295707637637],[139.743713,35.672988],[139.7541,35.683792],[139.74798931035463,35.67179002702629],[139.75461119813127,35.67567441585073],[139.74071189600025,35.67305209778313],[139.75124,35.675626],[139.75124,35.675626],[139.758656,35.685403]]}},methods:{subTaxiEventsFrom:function(t){var e=this;"101"==t&&(this.timer=setInterval((function(){var t,r=0,a=e.coordinates.length-1,n=Math.floor(Math.random()*(a-r+1))+r,o=Math.floor(Math.random()*(a-r+1))+r;t=n<=o?e.coordinates.slice(n,o):e.coordinates.slice(o,n),e.circleData=t}),1500))},unsubTaxiEvents:function(){clearInterval(this.timer)},generateData:function(){var t,e={},r=1;for(t=101;t<=123;t++){var a=0,n=500,o=Math.floor(Math.random()*(n-a+1))+a;e[t.toString()]={district:t,dropoffCount:o,rank:r},r++}return e}},mounted:function(){var t=this;setInterval((function(){t.districtRankList=t.generateData()}),1e3),L.a.get("data/event_data1.json").then((function(e){console.log(e.data.toptenlist),t.jsons.push(e.data.toptenlist)}),(function(t){})),L.a.get("data/event_data2.json").then((function(e){console.log(e),t.jsons.push(e.data.toptenlist)}),(function(t){}));setInterval((function(){var e=Math.floor(2*Math.random());t.matrixJson=t.jsons[e]}),2500)}},U=$,z=(r("fffb"),Object(y["a"])(U,n,o,!1,null,null,null)),W=z.exports;a["a"].config.productionTip=!1,new a["a"]({render:function(t){return t(W)}}).$mount("#app")},"80a1":function(t,e,r){"use strict";var a=r("91b6"),n=r.n(a);n.a},8806:function(t,e,r){},"91b6":function(t,e,r){},c403:function(t,e,r){"use strict";var a=r("19df"),n=r.n(a);n.a},ea89:function(t,e,r){},fffb:function(t,e,r){"use strict";var a=r("ea89"),n=r.n(a);n.a}});
//# sourceMappingURL=app.bdd39df3.js.map