(function (window, document, undefined) {

L.FeatureIdGroup = L.FeatureGroup.extend({
	
	initialize: function(options){

		L.LayerGroup.prototype.initialize.call(this);
		this._layerById = {};
		this._featureById = {};
		this._layerGroup = L.featureGroup();
		
	},

	addLayer: function (layerId, layer) {

		if(layer instanceof L.GeoJSON){
			console.debug('layer being added is geojson');
			layer.eachLayer(function(geo){
				if(geo.feature.geometry.type !== 'Point'){
					this._featureById[geo.feature.layerId] = geo;	
				}
				else{
					this._featureById[geo.feature.featureId] = geo;
				}
				
			});
		}
		else{
			console.debug('layer not geojson');	
		}

		
		//console.debug('id: ', layerId);
		//console.debug('layer: ', layer);
		console.debug('featureIds: ', this._featureById);

		L.FeatureGroup.prototype.addLayer.call(this, layer);


	},

	removeLayer: function (layer) {
		if (!this.hasLayer(layer)) {
			return this;
		}
		if (layer in this._layers) {
			layer = this._layers[layer];
		}

		layer.off(L.FeatureGroup.EVENTS, this._propagateEvent, this);

		L.LayerGroup.prototype.removeLayer.call(this, layer);

		if (this._popupContent) {
			this.invoke('unbindPopup');
		}

		return this.fire('layerremove', {layer: layer});
	},

	bindPopup: function (content, options) {
		this._popupContent = content;
		this._popupOptions = options;
		return this.invoke('bindPopup', content, options);
	},

	openPopup: function (latlng) {
		// open popup on the first layer
		for (var id in this._layers) {
			this._layers[id].openPopup(latlng);
			break;
		}
		return this;
	},

	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	bringToFront: function () {
		return this.invoke('bringToFront');
	},

	bringToBack: function () {
		return this.invoke('bringToBack');
	},

	getBounds: function () {
		var bounds = new L.LatLngBounds();

		this.eachLayer(function (layer) {
			bounds.extend(layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds());
		});

		return bounds;
	},
	_addFeatures: function(obj){

	},
	_propagateEvent: function (e) {
		e = L.extend({
			layer: e.target,
			target: this
		}, e);
		this.fire(e.type, e);
	}
});

L.featureIdGroup = function (layers) {
	return new L.FeatureIdGroup(layers);
};

}(window, document));