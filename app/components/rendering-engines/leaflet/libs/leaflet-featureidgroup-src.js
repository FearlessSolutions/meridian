(function (window, document, undefined) {

L.FeatureIdGroup = L.FeatureGroup.extend({
	
	initialize: function(options){

		
		this._layersById = {};
		this._featuresById = {};
		this._layerGroup = L.featureGroup();
		L.LayerGroup.prototype.initialize.call(this);
		
	},
	addLayer: function (layerId, layer) {
		
		//This adds the initial layers used as the encapsulating layer. 
		//In our cases, cluster and heatmap from their respective libraries
		//an additional, simple and normal layer group is added to keep the single points.
		this._layersById[layerId] = layer;
		L.FeatureGroup.prototype.addLayer.call(this, layer);

		return this;
	},
	addDataToLayer: function(layerId, dataLayer){
		//cant reference variable inside the for-loop.
		var featureGroup = this._featuresById;
		//get the encapsulating layer and use its native addLayer to
		//include the provided layer.
		this._layersById[layerId].addLayer(dataLayer);

		if(dataLayer instanceof L.GeoJSON){
			dataLayer.eachLayer(function(geo){
				featureGroup[geo.feature.featureId] = geo;
			});
		}

		return this;
	},
	hasLayerId: function(layerId){
		return this._layersById[layerId] ? true : false;
	},
	getLayerById: function(layerId){
		return this._layersById[layerId];
	},

	removeLayerById: function (layerId) {
		// if (!this.hasLayerId(layerId)) {
		// 	return this;
		// }
		// console.debug('before delete: ', this._layersById);
		// var layer =  this._layersById[layerId];
		// delete this._layersById[layerId];
		// console.debug('after delete: ', this._layersById);
		// L.LayerGroup.prototype.removeLayer.call(this, layer);
	},
	getBounds: function (layerId) {
		var bounds = new L.LatLngBounds();
		//this apparently doesnt contain shapes
		if(this.hasLayerId(layerId)){
			this._layersById[layerId].eachLayer(function(innerLayer){
				bounds.extend(innerLayer.getLatLng());
			});
		}
		//shapes are stored here
		if(this._featuresById[layerId]){
			bounds.extend(this._featuresById[layerId].getBounds());
		}
		
		return bounds;
	},
	getFeatures: function(layerId){
		var features = [];
		if(this.hasLayerId(layerId)){
			this._layersById[layerId].eachLayer(function(innerLayer){
				features.push(innerLayer);
			});
		}
		//smae issue as getBounds?
		if(this._featuresById[layerId]){
			features.push(this._featuresById[layerId]);
		}
		return features;
	}
});

L.featureIdGroup = function (layers) {
	return new L.FeatureIdGroup(layers);
};

}(window, document));