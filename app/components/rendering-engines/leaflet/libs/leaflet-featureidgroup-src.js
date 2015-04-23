(function (window, document, undefined) {

L.FeatureIdGroup = L.FeatureGroup.extend({
	
	initialize: function(options){

		
		this._layersById = {};
		this._featuresById = {};
		this._layerGroup = L.featureGroup();
		L.LayerGroup.prototype.initialize.call(this);
		
	},

	addLayer: function (layerId, layer) {

		this._layersById[layerId] = layer;
		L.FeatureGroup.prototype.addLayer.call(this, layer);


	},
	addFeature: function(layerId, feature){
		//make sure there is a layerId? if not fail?
		

		if(feature instanceof L.GeoJSON){
			console.debug('adding a geoJSON');
			feature.eachLayer(function(geo){
				console.debug("geo: ", geo);
				console.debug('this: ', this);
				console.debug('featuresById ', this._featuresById);
				if(geo.feature.geometry.type !== 'Point'){
					//its a shape. Must use layerId as the featureId due to the _aoi being added.
					this._featuresById["1234_aoi"] = geo;

				}else {
					//its a point, just add the point to the list of features.
					this._featuresById[geo.feature.featureId] = geo
				}
			});
		}


		console.debug('featureIds: ', this._featuresById);
		L.FeatureGroup.prototype.addLayer.call(this, feature);//add the feature like all other leaflet groups.
	},
	containsLayerId: function(layerId){
		return this._layersById[layerId] ? true : false;
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