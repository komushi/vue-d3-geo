webpackJsonp([2],{1:function(t,e,r){function a(t){r(11)}var n=r(2)(r(6),r(18),a,null,null);t.exports=n.exports},11:function(t,e){},18:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div")},staticRenderFns:[]}},6:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=r(9),n=(r.n(a),r(15)),o=(r.n(n),{topojsonPath:{type:String},width:{type:Number,default:1e3},height:{type:Number,default:1e3},colorRange:{type:String,default:"#0d47a1,#e3f2fd"},center:{type:String,default:"139.752268, 35.677043"},scale:{type:Number,default:11e4},layerObjects:{type:String,default:"districts"},layerFeatureName:{type:String,default:"properties.district"},layerFeatureCode:{type:String,default:"properties.district_code"},featureNameStyle:{type:String,default:"static"}});e.default={name:"d3-geo-staic",props:o,mounted:function(){var t=this.layerObjects,e=this.colorRange,r=this.layerFeatureCode,o=this.layerFeatureName,i=this.featureNameStyle,s=this.findprop,l=a.select(this.$el).append("svg").attr("width",this.width).attr("height",this.height),c=l.append("g"),d=c.append("g").attr("id",this.layerObjects),p=c.append("g").attr("id",this.layerObjects+"_label");console.log("this.center:",this.center);var u=a.geo.mercator().center(this.center.split(",")).scale(this.scale).translate([this.width/2,this.height/2]),f=a.geo.path().projection(u);console.log("this.topojsonPath:",this.topojsonPath),a.json(this.topojsonPath,function(l,u){console.log("layerObjects:",t);var h=n.feature(u,u.objects[t]).features,y=n.mesh(u,u.objects[t],function(t,e){return t!==e}),g=a.scale.linear().domain([1,h.length]).interpolate(a.interpolateHcl).range(e.split(",")),m=c.append("defs").attr("id",t+"_hdef").selectAll("radialGradient").data(h).enter().append("radialGradient").attr("gradientUnits","objectBoundingBox").attr("fx","50%").attr("fy","50%").attr("cx","50%").attr("cy","50%").attr("r","100%").attr("id",function(t){return"hgrad"+s(t,r)});m.append("stop").attr("offset","0%").style("stop-color","white").style("stop-opacity","1"),m.append("stop").attr("offset","100%").style("stop-color",function(t,e){return g(e+1)}).style("stop-opacity","1");var b=c.append("defs").attr("id",t+"_def").selectAll("radialGradient").data(h).enter().append("radialGradient").attr("gradientUnits","objectBoundingBox").attr("fx","50%").attr("fy","50%").attr("cx","50%").attr("cy","50%").attr("r","35%").attr("id",function(t){return"grad"+s(t,r)});if(b.append("stop").attr("offset","0%").style("stop-color",function(t,e){return g(e+1)}).style("stop-opacity",".8"),b.append("stop").attr("offset","100%").style("stop-color",function(t,e){return g(e+1)}).style("stop-opacity","1"),"static"==i){var j=function(t){a.select(this).style("fill",function(t){return"url(#hgrad"+s(t,r)+")"})},v=function(t){a.select(this).style("fill",function(t){return"url(#grad"+s(t,r)+")"})};d.selectAll("path").data(h).enter().append("path").attr("d",f).attr("fill",function(t){return"url(#grad"+s(t,r)+")"}).attr("layer-feature-code",function(t){return s(t,r)}).attr("layer-feature-name",function(t){return s(t,o)}).on("mouseover",j).on("mouseout",v),d.append("path").datum(y).attr("d",f).attr("class","layer1-boundary"),p.selectAll("text").data(h).enter().append("text").attr("class","label").attr("pointer-events","none").attr("transform",function(t){return"translate("+f.centroid(t)+")"}).attr("dy",".35em").text(function(t){return s(t,o)}).attr("layer-feature-code",function(t){return s(t,r)})}})},methods:{findprop:function(t,e){var r,a,n=e.split(".");for(r=0,a=n.length;r<a;r++){if(!t.hasOwnProperty(n[r]))return;t=t[n[r]]}return t}}}},8:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=r(1),n=r.n(a);e.default=n.a}},[8]);
//# sourceMappingURL=vue-d3-geo.320acb7973266ade8133.js.map